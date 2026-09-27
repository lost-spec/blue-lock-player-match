# Deployment

The quiz is a static site. The chatbot needs one small serverless function so
the OpenRouter API key is never sent to the browser.

## Layout

```
index.html          static site
static/             site.js, style.css, chatbot.js
api/chat.js         serverless proxy (holds the API key)
```

## Vercel (zero config)

1. Push this folder to a GitHub repo and import it on Vercel. Vercel detects
   `api/` automatically, so there is no build command and no framework preset
   to change.

2. Add the environment variable:

   - `OPENROUTER_API_KEY` — required, e.g. `sk-or-v1-...`
   - `OPENROUTER_MODEL` — optional, defaults to
     `dots-studio/dots-3-note-preview:free`

   Set them under **Project → Settings → Environment Variables**. Enable them
   for Production, Preview, and/or Development as needed.

3. Deploy. Environment variables are read at runtime, but a redeploy is the
   simplest way to be sure the new deploy picks them up.

## Local testing

Opening `index.html` from the file system will not work, because there is no
server to run `api/chat.js`. Use:

```bash
npm i -g vercel
vercel dev
```

`vercel dev` loads `.env.local`, so put your key there:

```
OPENROUTER_API_KEY=sk-or-v1-...
```

`.env*` is already listed in `.gitignore`, so it will not be committed.

If you are not running a server, set `useProxy: false` in the `OPENROUTER`
block at the top of `static/chatbot.js`. The chatbot then stays in its
built-in offline mode, which still answers questions about the 20 players and
general Blue Lock topics from the local database.

## Other hosts

Any platform that can run a Node function from `api/` works with little or no
change. On Cloudflare Workers or Netlify Functions the file needs its handler
export adjusted to that platform's signature, and `process.env` replaced with
that platform's bindings.

## Security notes

- The API key lives only in the serverless function's environment. It is never
  present in any file the browser downloads.
- The browser sends only the conversation. It cannot choose the model, so a
  visitor cannot use your key to run an expensive model.
- `api/chat.js` validates message shape and length, and applies a basic
  per-instance rate limit. That rate limit resets on cold start, so treat it as
  a speed bump rather than real abuse protection.
- Upstream error bodies are logged server-side but never returned to the
  client, so provider details are not leaked.
- Rotate any key that has been committed, shared in a screenshot, or pasted
  into a public file.
