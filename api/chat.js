/**
 * Serverless proxy for OpenRouter.
 *
 * WHY THIS FILE EXISTS
 * --------------------
 * The chatbot used to call OpenRouter straight from the browser, which meant
 * the API key had to be hard-coded in static/chatbot.js. Anything shipped to
 * a browser is public: anyone could open View Source and read the key, then
 * spend your credits or rack up charges on your account.
 *
 * This function moves the key to the server side, where it is read from an
 * environment variable and never sent to the client. The browser now talks
 * only to /api/chat, and this function talks to OpenRouter.
 *
 * SETUP (Vercel)
 * --------------
 * 1. Push this folder to a GitHub repo and import it on Vercel.
 *    Vercel detects `api/` automatically. No build command is needed.
 * 2. In Vercel -> Project -> Settings -> Environment Variables, add:
 *      OPENROUTER_API_KEY = sk-or-v1-...
 *      OPENROUTER_MODEL   = dots-studio/dots-3-note-preview:free   (optional)
 *    Mark them for Production, Preview, and Development as needed.
 * 3. Redeploy. Environment variables only apply to a fresh deployment, so an
 *    old deploy will keep failing until you redeploy.
 *
 * LOCAL TESTING
 * -------------
 * `vercel dev` runs the function locally and loads your .env.local, or set
 * the variables in your shell before starting it. Opening index.html straight
 * from the file system will NOT work, because there is no server to run this.
 *
 * SECURITY NOTES
 * --------------
 * - The key is only ever read from process.env and sent to OpenRouter.
 * - The client cannot choose the model, so a visitor cannot use your key to
 *   run an expensive model. The model is fixed by OPENROUTER_MODEL.
 * - A simple in-memory rate limit blunts casual abuse. It resets whenever the
 *   function cold-starts, so treat it as a speed bump, not real protection.
 * - Messages are length-capped before being forwarded.
 */

const OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions";

// Fixed server-side. The client sends only the conversation.
// Read lazily inside the handler so the value is picked up at request time.
const DEFAULT_MODEL = "dots-studio/dots-3-note-preview:free";
const model = () => process.env.OPENROUTER_MODEL || DEFAULT_MODEL;

const MAX_MESSAGES = 24;
// The system prompt carries the whole 20-player roster and runs to roughly
// 6k characters, so this cap has to sit well above that or every real
// request is rejected as "oversized".
const MAX_CHARS_PER_MESSAGE = 12000;
const MAX_TOTAL_CHARS = 40000;

// Reasoning models (the free Dots model in particular) can spend 900+ tokens
// thinking before writing anything. Too low a cap makes them finish with
// finish_reason "length" and return no content at all, which showed up as
// roughly half of all replies coming back empty. Keep generous headroom.
const MAX_TOKENS = 4000;

// Per-instance rate limit. See the note above: this is best-effort only.
const WINDOW_MS = 60 * 1000;
const MAX_REQUESTS_PER_WINDOW = 20;
const hits = new Map();

function clientIp(req) {
  const forwarded = req.headers["x-forwarded-for"];
  if (typeof forwarded === "string" && forwarded.length) {
    return forwarded.split(",")[0].trim();
  }
  return req.socket?.remoteAddress || "unknown";
}

function rateLimited(ip) {
  const now = Date.now();
  const entry = hits.get(ip);

  if (!entry || now > entry.resetAt) {
    hits.set(ip, { count: 1, resetAt: now + WINDOW_MS });
    return false;
  }

  entry.count += 1;
  return entry.count > MAX_REQUESTS_PER_WINDOW;
}

// Keep the map from growing forever on a long-lived instance.
function sweep(now) {
  for (const [ip, entry] of hits) {
    if (now > entry.resetAt) hits.delete(ip);
  }
}

function fail(res, status, message) {
  return res.status(status).json({ error: message });
}

/** Accept only well-formed, length-capped chat messages. */
function cleanMessages(input) {
  if (!Array.isArray(input) || input.length === 0) return null;
  if (input.length > MAX_MESSAGES) return null;

  const allowed = new Set(["system", "user", "assistant"]);
  const out = [];
  let total = 0;

  for (const message of input) {
    if (!message || typeof message !== "object") return null;

    const { role, content } = message;
    if (typeof role !== "string" || !allowed.has(role)) return null;
    if (typeof content !== "string") return null;

    const trimmed = content.trim();
    if (!trimmed) return null;
    if (trimmed.length > MAX_CHARS_PER_MESSAGE) return null;

    total += trimmed.length;
    if (total > MAX_TOTAL_CHARS) return null;

    out.push({ role, content: trimmed });
  }

  // The conversation must actually contain a user turn.
  if (!out.some((m) => m.role === "user")) return null;

  return out;
}

export default async function handler(req, res) {
  // Only same-origin POSTs are useful here; the site and the function are
  // served from the same host, so there is no CORS header to hand out.
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return fail(res, 405, "Method not allowed.");
  }

  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) {
    return fail(
      res,
      500,
      "Server is missing OPENROUTER_API_KEY. Add it in your host's environment variables and redeploy.",
    );
  }

  const ip = clientIp(req);
  sweep(Date.now());
  if (rateLimited(ip)) {
    return fail(res, 429, "Too many requests. Wait a minute and try again.");
  }

  // Vercel parses JSON bodies for us, but guard against a missing parse.
  const body = typeof req.body === "string" ? safeParse(req.body) : req.body;
  if (!body) return fail(res, 400, "Invalid request body.");

  const messages = cleanMessages(body.messages);
  if (!messages) {
    return fail(res, 400, "Invalid or oversized message list.");
  }

  const controller = new AbortController();
  // Reasoning models are slow. Measured 4-21s per reply, so allow a wide
  // margin rather than cutting answers off mid-thought.
  const timeout = setTimeout(() => controller.abort(), 55000);

  try {
    const upstream = await fetch(OPENROUTER_URL, {
      method: "POST",
      signal: controller.signal,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
        "HTTP-Referer": process.env.APP_URL || "https://blue-lock-player-match.vercel.app",
        "X-Title": "Blue Lock Player Match",
      },
      body: JSON.stringify({
        model: model(),
        messages,
        temperature: 0.7,
        max_tokens: MAX_TOKENS,
      }),
    });

    const text = await upstream.text();

    if (!upstream.ok) {
      // Never pass the provider body through: it can echo request details.
      // Log it server-side so the real reason is visible in Vercel logs.
      console.error("OpenRouter error", upstream.status, text.slice(0, 300));

      if (upstream.status === 429) {
        const daily = /free-models-per-day|per-day|daily/i.test(text);
        return fail(
          res,
          429,
          daily
            ? "The free AI model's daily limit has been reached. Try again tomorrow, or add credits to your OpenRouter account."
            : "Too many requests to the AI provider. Please wait a moment and try again.",
        );
      }
      if (upstream.status === 401 || upstream.status === 403) {
        return fail(res, 502, "The server's AI key was rejected. Check the OPENROUTER_API_KEY environment variable.");
      }
      return fail(res, 502, "The AI provider could not handle the request.");
    }

    let payload;
    try {
      payload = JSON.parse(text);
    } catch {
      return fail(res, 502, "The AI provider returned an unreadable response.");
    }

    return res.status(200).json(payload);
  } catch (error) {
    if (error.name === "AbortError") {
      return fail(res, 504, "The AI provider took too long to respond.");
    }
    console.error("Proxy failure", error);
    return fail(res, 502, "Could not reach the AI provider.");
  } finally {
    clearTimeout(timeout);
  }
}

function safeParse(value) {
  try {
    return JSON.parse(value);
  } catch {
    return null;
  }
}
