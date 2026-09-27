(() => {
  "use strict";

  /* ==================================================================
   *  OPENROUTER SETTINGS
   * ==================================================================
   *  The API key is NOT in this file. It lives in the serverless
   *  function at api/chat.js, which reads it from an environment
   *  variable called OPENROUTER_API_KEY. That means the key is never
   *  shipped to the browser and cannot be read by visitors.
   *
   *  This code only decides WHERE to send the chat. The proxy adds the
   *  key, calls OpenRouter, and hands the reply back.
   *
   *  HOW TO GO LIVE
   *  --------------
   *  1. Deploy to Vercel (or any host that runs /api functions).
   *  2. Add an environment variable:
   *       OPENROUTER_API_KEY = sk-or-v1-...
   *     Optionally set OPENROUTER_MODEL to override the default model.
   *  3. Redeploy so the new variable takes effect.
   *
   *  Until the proxy is deployed, `endpoint` returns a 404 and the
   *  chatbot quietly falls back to its built-in offline answer engine.
   *  Set `useProxy` to false to force offline mode while testing locally.
   * ================================================================== */
  const OPENROUTER = {
    // Same-origin path to the serverless function. Do not put an absolute
    // OpenRouter URL here, or you would have to expose the key again.
    endpoint: "/api/chat",
    // The model is chosen on the server (OPENROUTER_MODEL). This value is
    // only used as a fallback and is never sent from the browser.
    model: "dots-studio/dots-3-note-preview:free",
    // Deliberately empty. The key belongs in the serverless function.
    apiKey: "",
    useProxy: true,
  };

  const APP = {
    name: "Scout",
    subtitle: "Blue Lock squad assistant",
    maxHistory: 12,
  };

  /* ------------------------------------------------------------------
   *  CHARACTER DATABASE
   *  This is the source of truth for the 20 players in the quiz.
   *  It is sent to the AI as context AND used by the offline answer
   *  engine, so you can edit the text here to correct or expand
   *  anything without touching the chat logic.
   * ---------------------------------------------------------------- */
  const CHARACTERS = [
    {
      id: "isagi",
      name: "Yoichi Isagi",
      label: "Isagi",
      position: "Striker",
      team: "Blue Lock",
      tagline: "The hero of blue lock",
      style:
        "Does not chase the ball, he reads the entire field first. Uses off-ball movement to turn ordinary passes into scoring chances and finishes with a clean direct shot.",
      traits: ["Spatial awareness", "Direct shot", "Ruthlessly adaptable"],
      blurb:
        "The series protagonist, plucked into Blue Lock despite his team missing the national tournament. He starts near the bottom of the 300 candidates but stands out for his exceptional field vision and tactical reading of the game, built around his 'chemical reaction' philosophy of making teammates' strengths work together. Over the story he becomes colder and more calculating, eventually starting for Bastard München.",
    },
    {
      id: "rin",
      name: "Rin Itoshi",
      label: "Rin",
      position: "Striker",
      team: "Japan U-20",
      tagline: "Egoist",
      style:
        "Refuses to share the ball. Wants every attack to run through him, and is obsessed with producing the perfect solo goal rather than a functional team result.",
      traits: ["Solo striker", "Obsessive", "Perfectionist"],
      blurb:
        "Nicknamed Egoist, Sae's younger brother and a startlingly composed technical prodigy in his own right. His entire arc is driven by the need to surpass Sae, and his precision passing and shooting make him one of the strongest players in the cast; he ends up at PxG.",
    },
    {
      id: "bachira",
      name: "Meguru Bachira",
      label: "Bachira",
      position: "Winger / Forward",
      team: "blue lock",
      tagline: "dancer of blue lock",
      style:
        "Dribbles with the ball glued to his feet, carries it past anyone, and seems to play on instinct rather than instruction. Cheerful and hard to pin down.",
      traits: ["Close control", "Instinct", "Joyful"],
      blurb:
        "Plays with pure joy and unpredictability, driven by a search for his inner 'monster' — a metaphor for unlocking his own unique, uncontrollable style. His close bond with Isagi is central to both their growth.",
    },
    {
      id: "barou",
      name: "Rinwell Barou",
      label: "Barou",
      position: "Striker",
      team: "Blue lock",
      tagline: "The King",
      style:
        "Pure power and a predatory instinct for the box. Treats every defender as an obstacle and every match as a throne room he already owns.",
      traits: ["Power", "Clinical finishing", "Massive ego"],
      blurb:
        "Nicknamed King, an intensely egotistical striker who believes teammates exist purely to serve his scoring. Physically dominant and relentless, he later leads Ubers.",
    },
    {
      id: "kaiser",
      name: "Kaiser",
      label: "Kaiser",
      position: "Striker",
      team: "Blue Lock",
      tagline: "God's choosen emperor",
      style:
        "Enormous physical presence combined with a genuine desire to be the world's best striker. Scores through sheer force, then looks for the next challenge.",
      traits: ["Raw power", "Ambition", "Neo Egoist"],
      blurb:
        "A Japanese-German returnee and one of the setting's biggest stars: flashy, technically brilliant, and openly arrogant, treating himself as above nearly everyone around him. He captains Bastard München and becomes one of Isagi's defining rivals.",
    },
    {
      id: "aiku",
      name: "Gaku Aiku",
      label: "Aiku",
      position: "Defender",
      team: "Blue lock",
      tagline: "Snake",
      style:
        "Reads the attack before it happens and shuts it down. one of the most smartest defender.",
      traits: ["Anticipation", "Recovery", "Leadership"],
      blurb:
        "a deceptive player who leans on misdirection and manipulation of opponents while also being one of the best defenders and the caption of blue lock",
    },
    {
      id: "aryu",
      name: "Aryu",
      label: "Aryu",
      position: "Defender",
      team: "Japan U-20",
      tagline: "beauty of the beast",
      style:
        "Plays at a controlled tempo and keeps the whole defensive line talking. Composed under pressure and rarely caught out of position.",
      traits: ["Composure", "Tactical", "Steadiness"],
      blurb:
        "Vain and self-obsessed, proud of his looks as much as his football. Unusually tall for the cast, which gives him surprising jumping and reach, and he's shown keeping pace with even Chigiri's speed.",
    },
    {
      id: "ness",
      name: "Wataru Ness",
      label: "Ness",
      position: "Midfielder",
      team: "bastard munich",
      tagline: "The magician",
      style:
        "loyal to kaiser spread magic on the pitch,among the best passers in blue lock.",
      traits: ["Team-first", "Work rate", "Loyalty"],
      blurb:
        "A blistering-pace midfielder on Bastard München, fiercely loyal to Kaiser as his on-field enabler, though the loyalty comes with real resentment toward how Kaiser treats him..",
    },
    {
      id: "karasu",
      name: "Karasu",
      label: "Karasu",
      position: "Midfielder",
      team: "Japan U-20",
      tagline: "assaisen",
      style:
        "Shapes the game from midfield by exploiting the space between defenders. Deliberate, calculating, and always thinking two steps ahead of the ball.",
      traits: ["Tactical brain", "Positional play", "Calculating"],
      blurb:
        "Nicknamed assaisen he's less a pure finisher and more a cunning tactician who reads opponents and manipulates the flow of a match from midfield, later commanding play for PxG.",
    },
    {
      id: "sae",
      name: "Sae Itoshi",
      label: "Sae",
      position: "Midfielder",
      team: "japan u20",
      tagline: "The fallen genius",
      style:
        "A creative midfielder with a genuinely extraordinary vision of the pitch, held back by the loss of the joy he used to have for the game.",
      traits: ["Vision", "Creativity", "Tragic backstory"],
      blurb:
        "Rin's older brother and one of the most naturally gifted players in Blue Lock. Brilliant on the ball, but carrying damage that makes him a tragic figure.",
    },
    {
      id: "hugo",
      name: "Hugo",
      label: "Hugo",
      position: "Midfielder",
      team: "france u20",
      tagline: "luck based genius",
      style:
        "A calculating midfielder with high iq and vision of the field that can do almost anything.",
      traits: ["Confidence", "Dribbling", "Optimism"],
      blurb:
        "A French U-20 player introduced as part of France's New Generation World XI alongside Loki and Charles. Studious and detached, he's shown coolly analyzing rivals like Isagi from the sidelines, all analysis and observation rather than showmanship.",
    },
    {
      id: "reo",
      name: "Reo",
      label: "Reo",
      position: "Midfielder",
      team: "Jblue lock",
      tagline: "The chameleon",
      style:
        "One of the most naturally gifted player in blue lock with the ability to copy almost anyone.",
      traits: ["Determination", "Adaptability", "Ambition"],
      blurb:
        "Comes from a wealthy family and plays with an elegant, all-around skill set rather than pure selfishness — he can create chances, defend, and finish when needed. He's fixated on his partnership with Nagi and later plays for manshine city",
    },
    {
      id: "yukimiya",
      name: "Yukimiya Yukikazu",
      label: "Yukimiya",
      position: "Forward / Winger",
      team: "Blue lock",
      tagline: "street dribbler",
      style:
        "Not naturally gifted, but the hardest worker in the programme. Improves faster than anyone and turns raw effort into real output.",
      traits: ["Work rate", "Growth", "Determinati"],
      blurb:
        "Nicknamed the 1-on-1 emperor, a graceful dribbler whose game is about beating defenders in isolated duels. He later shifts to a wide attacking-mid role for Bastard München.",
    },
    {
      id: "otoya",
      name: "Eito Otoya",
      label: "Otoya",
      position: "Winger / Forward",
      team: "Japan U-20",
      tagline: "The team-first creator",
      style:
        "Looks for the pass that releases a teammate rather than the one that looks best himself. Makes everyone around him better.",
      traits: ["Creativity", "Selflessness", "Vision"],
      blurb:
        "Otoya is the classic number ten in temperament. He is happy taking the second pass, because a goal is a goal whoever scored it.",
    },
    {
      id: "niko",
      name: "Niko",
      label: "Niko",
      position: "Defender",
      team: "Japan U-20",
      tagline: "The creative wildcard",
      style:
        "Unpredictable, playful and technically flashy. Takes on players for fun and produces the kind of moments nobody can coach.",
      traits: ["Flair", "Impulsiveness", "Dribbling"],
      blurb:
        "Niko plays football like it is a prank. Unorthodox, energetic, and capable of turning a dull passage into something memorable.",
    },
    {
      id: "di lorenzo",
      name: "Di Lorenzo Bruno",
      label: "Di Lorenzo",
      position: "Defender",
      team: "Japan U-20",
      tagline: "The veteran leader",
      style:
        "Experienced, disciplined and tactically sharp. Organises the defence and sets the tone for the players around him.",
      traits: ["Experience", "Discipline", "Leadership"],
      blurb:
        "Di Lorenzo brings an older head to a young squad. He is the player teammates look at when the match gets uncomfortable.",
    },
    {
      id: "charles",
      name: "Charles Martinez",
      label: "Charles",
      position: "Midfielder",
      team: "Japan U-20",
      tagline: "The steady hand",
      style:
        "Keeps possession moving and the tempo stable. Reads the game and makes small, correct decisions that stop the team from unraveling.",
      traits: ["Positional sense", "Composure", "Reliability"],
      blurb:
        "Charles is the stabiliser. When the match becomes chaotic, his calm decision-making is what keeps Japan structured.",
    },
    {
      id: "chigiri",
      name: "Hyoma Chigiri",
      label: "Chigiri",
      position: "Winger / Forward",
      team: "Japan U-20",
      tagline: "The speedster",
      style:
        "One of the fastest players in the programme. Attacks the space behind the defence, stays lazy in possession, and explodes into life in the final third.",
      traits: ["Speed", "Laziness", "Flair"],
      blurb:
        "Chigiri is unstoppable once he is running. His talent is obvious, but getting him to care for the whole 90 minutes is the real project.",
    },
    {
      id: "shidou",
      name: "Ryusei Shidou",
      label: "Shidou",
      position: "Striker",
      team: "Japan U-20",
      tagline: "The ruthless finisher",
      style:
        "Cold, clinical and unapologetic. Finds the ugliest possible goals and converts them without a flicker of doubt or celebration.",
      traits: ["Ruthlessness", "Ego", "Finishing"],
      blurb:
        "Shidou is the character most people love to hate. He treats football as pure ego, and his numbers justify the attitude.",
    },
    {
      id: "kunigami",
      name: "Seishiro Kunigami",
      label: "Kunigami",
      position: "Forward / Winger",
      team: "Japan U-20",
      tagline: "The original striker",
      style:
        "Works harder than anyone on the pitch and asks for no credit. A direct, honest forward whose work rate sets the standard for the squad.",
      traits: ["Hustle", "Directness", "Team spirit"],
      blurb:
        "Kunigami is what Blue Lock looked for in a striker before it decided to build a monster instead. He is the squad's moral centre.",
    },
  ];

  /* ------------------------------------------------------------------
   *  STATE
   * ---------------------------------------------------------------- */
  const history = [];
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  // In proxy mode the browser has no key, so readiness depends on the
  // proxy being pointed at and switched on, not on a key being present here.
  let isConfigured = OPENROUTER.useProxy
    ? Boolean(OPENROUTER.endpoint)
    : Boolean(OPENROUTER.model && OPENROUTER.apiKey && OPENROUTER.endpoint);
  let isBusy = false;
  let widget = null;

  const SUGGESTIONS = [
    "Who is Shidou?",
    "What is Blue Lock?",
    "Who is the best striker?",
    "Tell me all 20 players",
  ];

  /* General Blue Lock / football knowledge used by the offline engine so
   * the widget is still useful before an API key is added. Each entry has
   * a `test` regex and a short `answer`. Order matters: the first match
   * wins, so put the more specific topics first. */
  const LORE = [
    {
      test: /\bwhat is blue lock\b|\bblue lock (is|about)\b|\babout (this|the) (anime|manga|show)\b/,
      answer: [
        "**Blue Lock** is a Japanese manga and anime by Muneyuki Kaneshiro, illustrated by Yusuke Murata.",
        "It follows Japan after the national team loses the 2018 World Cup. To rebuild, Japan's football federation launches a radical project: **Blue Lock**, a secret training facility built to create one ultimate striker by turning the rest of the players into raw ego.",
        "The story is about winning, obsession, and what you are willing to sacrifice for the goal. It is part mystery, part sports psychology thriller, and it never stops being competitive.",
      ].join("\n\n"),
    },
    {
      test: /\begoist|egoism|\bego\b/,
      answer: [
        "An **egoist**, in Blue Lock, is a player who rejects teamwork as a limitation and insists on winning for himself above all.",
        "The manga argues that Japan's football lost because players were told to sacrifice their own desire for the team's good. Blue Lock flips that: keep the ego, sharpen it, and let it become the weapon.",
        "Not every egoist is a hero. Most are the obstacle someone else has to break through.",
      ].join("\n\n"),
    },
    {
      test: /\bflow|flow state/,
      answer: [
        "**Flow state** is the psychological state Blue Lock players chase, where skill, instinct, and awareness collapse into a single state of total immersion.",
        "In the story it is described as a state of heightened awareness where the player is fully present and cannot be touched easily, even by a much stronger opponent.",
        "Reaching it is a matter of obsession, ego, and refining your own weapon until it becomes instinctive.",
      ].join("\n\n"),
    },
    {
      test: /\bweapon\b|\begoist weapon\b/,
      answer: [
        "A player's **weapon** is their goal, their style, their hunger, and their nature weaponized into a form of genius.",
        "It is what makes a striker dangerous on the pitch. The more the player understands who they are, the sharper the weapon becomes.",
      ].join("\n\n"),
    },
    {
      test: /\bnagi|blue lock.*(nagi)|(nagi).*blue lock/i,
      answer: [
        "**Seishiro Nagi** is the ace striker of Manshine City's Blue Lock, famous for his lazy genius and incredible natural talent.",
        "He rarely trains. He treats football like a game, which makes his natural sense of goal feel almost effortless. His story explores what happens when a prodigy is pushed to actually want to win.",
      ].join("\n\n"),
    },
    {
      test: /\brin\b.*\bsono\b|\bsono\b/,
      answer: [
        "**Rin Itoshi** is the star striker and captain of Manshine City's original Blue Lock eleven.",
        "He is cold, calculating, and openly egoistic. He wants to be the world's best striker, and he treats everyone around him as either a rival or a tool. His ambition and his refusal to bend make him one of the most compelling strikers in the series.",
      ].join("\n\n"),
    },
    {
      test: /\bisagi\b.*\bdevour|devour.*\bisagi\b|\bthe devourer\b/,
      answer: [
        "Isagi's original weapon was to **devour** the ego and talent of the players he beat and absorb it into himself.",
        "Over the course of the series his weapon evolves. He keeps the parts of the players he needs, discards what is not, and sharpens his own goal. He does not win by overpowering people, but by using them.",
      ].join("\n\n"),
    },
    {
      test: /\bwhat.*\bdifference\b.*\bblue lock\b|\bdifference between\b.*\bbefore and after\b/i,
      answer: [
        "Before Blue Lock, Japan played as a team and asked players to put the collective above their own desire. It produced safe, cooperative football and no world-class striker.",
        "Blue Lock isolates the most egoistic player and forces him to evolve alone. The philosophy shifts from **how do we play together** to **what can I become on my own**, and that is what produces a striker capable of beating anyone.",
      ].join("\n\n"),
    },
    {
      test: /\bstrength\b|\bstrongest\b|\bbest striker\b|\bwho is the best\b/,
      answer: [
        "There is no single strongest striker, because the whole point of Blue Lock is that strength keeps evolving.",
        "Among the top-tier strikers, **Isagi Yoichi** is the central protagonist, reading and devouring the field to grow stronger with every match. **Rin Itoshi** and **Kaiser** are the two elite rival egoists who push him forward, while **Barou** is the raw physical apex.",
        "Ask me about any one of them for a full breakdown, or let me put you on the field in the player match quiz.",
      ].join("\n\n"),
    },
    {
      test: /\bwhat.*\bego\b|\bego\b.*\bmean\b/,
      answer: [
        "In Blue Lock, the **ego** is a player's raw, selfish desire to win, stripped of excuses and given a form on the pitch.",
        "The manga treats the ego as the engine of genius, not a flaw to be corrected. The question is not whether the ego is good or bad, but whether you have refined it into a weapon.",
      ].join("\n\n"),
    },
    {
      test: /(\banime\b.*\brecommend|\brecommend.*\banime\b|what.*\banime.*\bwatch\b)/,
      answer: [
        "If you liked the competitive intensity of Blue Lock, try:",
        "**Haikyuu!!** (underdogs, elite training) · **Kuroko's Basketball** (genius vs genius) · **Ace of Diamond** (raw talent, ambition) · **Sakamichi no Apollon** (music, teamwork, ego) · **Ubers** (a darker, more tactical cousin of the same idea).",
      ].join("\n\n"),
    },
    {
      test: /\bhello\b|\bhi\b|\bhey\b|\bgood (morning|evening|afternoon)\b|how are you/,
      answer: [
        "Hey. I'm **Scout**, here to break down the strikers in this Blue Lock squad.",
        "Ask me about any of the 20 players, the ideas behind the series, or football in general. What do you want to know?",
      ].join("\n\n"),
    },
  ];

  /* ------------------------------------------------------------------
   *  DOM
   * ---------------------------------------------------------------- */
  function escapeHtml(value) {
    const entities = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;",
    };
    return String(value).replace(/[&<>"']/g, (character) => entities[character]);
  }

  function formatText(value) {
    return escapeHtml(value)
      .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
      .replace(/\n/g, "<br>");
  }

  function buildWidget() {
    const root = document.createElement("div");
    root.className = "scout";
    root.innerHTML = `
      <button class="scout-toggle" type="button" aria-expanded="false" aria-controls="scout-panel">
        <span class="scout-toggle-icon" aria-hidden="true">
          <svg viewBox="0 0 24 24" focusable="false">
            <path d="M12 3 20 6.6v6.1c0 4.7-3.4 8-8 9.3-4.6-1.3-8-4.6-8-9.3V6.6L12 3Z" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/>
            <path d="M9 11.4h6M9 14.6h4" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/>
          </svg>
        </span>
        <span class="scout-toggle-label">Ask about the squad</span>
      </button>

      <section class="scout-panel" id="scout-panel" aria-label="${escapeHtml(APP.name)} chat assistant" hidden>
        <header class="scout-header">
          <div class="scout-identity">
            <span class="scout-avatar" aria-hidden="true">BL</span>
            <span class="scout-identity-text">
              <span class="scout-name">${escapeHtml(APP.name)}</span>
              <span class="scout-subtitle">${escapeHtml(APP.subtitle)}</span>
            </span>
          </div>
          <div class="scout-header-actions">
            <span class="scout-status" data-mode="offline">Offline mode</span>
            <button class="scout-close" type="button" aria-label="Close chat">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
        </header>

        <div class="scout-log" data-log role="log" aria-live="polite" aria-relevant="additions"></div>

        <div class="scout-suggestions" data-suggestions></div>

        <form class="scout-form">
          <label class="visually-hidden" for="scout-input">Ask about a Blue Lock player</label>
          <input
            class="scout-input"
            id="scout-input"
            name="message"
            type="text"
            autocomplete="off"
            placeholder="Ask about any of the 20 players"
            maxlength="400"
          >
          <button class="scout-send" type="submit" aria-label="Send message">
            <span aria-hidden="true">&rarr;</span>
          </button>
        </form>
      </section>
    `;
    document.body.appendChild(root);
    return root;
  }

  function renderSuggestions() {
    const host = widget.querySelector("[data-suggestions]");
    if (!host) {
      return;
    }
    host.innerHTML = SUGGESTIONS.map(
      (label) => `<button class="scout-chip" type="button">${escapeHtml(label)}</button>`,
    ).join("");
  }

  function appendMessage(role, html) {
    const log = widget.querySelector("[data-log]");
    if (!log) {
      return null;
    }
    const row = document.createElement("div");
    row.className = `scout-message is-${role}`;
    row.innerHTML = `
      <span class="scout-message-role">${role === "user" ? "You" : escapeHtml(APP.name)}</span>
      <div class="scout-bubble">${html}</div>
    `;
    log.appendChild(row);
    log.scrollTop = log.scrollHeight;
    return row;
  }

  function showTyping() {
    const row = appendMessage("bot", '<span class="scout-typing" aria-hidden="true"><i></i><i></i><i></i></span>');
    const log = widget.querySelector("[data-log]");
    if (log) {
      log.scrollTop = log.scrollHeight;
    }
    return row;
  }

  function removeTyping(row) {
    if (row && row.parentNode) {
      row.parentNode.removeChild(row);
    }
  }

  function setStatus(mode) {
    const badge = widget.querySelector(".scout-status");
    if (!badge) {
      return;
    }
    badge.dataset.mode = mode;
    badge.textContent = mode === "live" ? "AI connected" : "Offline mode";
  }

  /* ------------------------------------------------------------------
   *  OFFLINE ANSWER ENGINE
   *  Used until a model + API key are pasted into OPENROUTER above.
   * ---------------------------------------------------------------- */
  function characterBlock(character) {
    return [
      `**${character.name}** — ${character.position}, ${character.team}`,
      `*${character.tagline}*`,
      character.style,
      `Traits: ${character.traits.join(" · ")}`,
      character.blurb,
    ].join("\n\n");
  }

  function localAnswer(message) {
    const text = message.toLowerCase();

    /* Personal result, written by renderResults() in site.js */
    const lastResult = window.__scoutLastResult;
    if (lastResult && lastResult.length) {
      if (/\bmy (result|match|top 3|top three|player|score|percent)\b|\bwho am i\b|\bwhat am i\b|\bmy (ego|weapon)\b/.test(text)) {
        const [first, second, third] = lastResult;
        return [
          "**Your Blue Lock player match:**",
          `1. **${first.name}** — ${first.points} pts (${first.percentage})`,
          second ? `2. **${second.name}** — ${second.points} pts (${second.percentage})` : "",
          third ? `3. **${third.name}** — ${third.points} pts (${third.percentage})` : "",
          `Ask me about **${first.name}** to see the full breakdown of why you matched with them.`,
        ]
          .filter(Boolean)
          .join("\n");
      }
    }

    const wantsEveryone = /\b(all|everyone|every|list|squad|roster|20)\b/.test(text);
    const wantsMidfield = /midfield|mid fielder|midfielders?/.test(text);
    const wantsDefense = /defen[cs]e|defenders?|back line|goalkeepers?/.test(text);
    const wantsAttack = /striker|forward|attack|best player/.test(text);

    if (wantsEveryone) {
      const lines = CHARACTERS.map(
        (character) => `${character.label} — ${character.position} (${character.team}). ${character.tagline}.`,
      );
      return [
        "Here are all 20 Blue Lock players in this quiz:",
        lines.map((line, index) => `${index + 1}. ${line}`).join("\n"),
        "Ask me about any one of them by name for a full breakdown.",
      ].join("\n");
    }

    /* Head-to-head: "isagi vs rin", "rin versus kaiser".
     * This runs BEFORE the single-name lookup, otherwise the first name
     * in the message would win and the comparison would never happen. */
    if (/\bvs\b|\bversus\b/.test(text)) {
      const picked = CHARACTERS.filter(
        (character) =>
          text.includes(character.label.toLowerCase()) ||
          text.includes(character.name.toLowerCase()) ||
          text.includes(character.id),
      );
      if (picked.length >= 2) {
        const [a, b] = picked;
        return [
          `**${a.name}** vs **${b.name}**`,
          `**${a.name}** — ${a.position}, ${a.team}. ${a.tagline}. Traits: ${a.traits.join(" · ")}.`,
          `**${b.name}** — ${b.position}, ${b.team}. ${b.tagline}. Traits: ${b.traits.join(" · ")}.`,
          "Both are defined by refusing to share the spotlight, just in opposite ways. Take the player match and see who fits you.",
        ].join("\n\n");
      }
    }

    /* Only run the id check for a short, letter-only fragment, otherwise
     * an empty or numeric message would match every id via includes(""). */
    const idProbe = text.replace(/[^a-z]/g, "");
    const match = CHARACTERS.find(
      (character) =>
        text.includes(character.label.toLowerCase()) ||
        text.includes(character.name.toLowerCase()) ||
        (idProbe.length >= 3 && character.id.includes(idProbe)),
    );
    if (match) {
      return characterBlock(match);
    }

    const group = (predicate) => CHARACTERS.filter(predicate);
    if (wantsMidfield) {
      const list = group((character) => character.position.includes("Midfielder"));
      return [
        "The midfielders in the squad:",
        list.map((character) => `**${character.name}** — ${character.tagline}. ${character.traits.join(" · ")}.`).join("\n"),
        "Want a full breakdown of one of them?",
      ].join("\n");
    }
    if (wantsDefense) {
      const list = group((character) => character.position.includes("Defender") || character.position.includes("Goalkeeper"));
      return [
        "The defenders in the squad:",
        list.map((character) => `**${character.name}** — ${character.tagline}. ${character.traits.join(" · ")}.`).join("\n"),
        "Want a full breakdown of one of them?",
      ].join("\n");
    }
    if (wantsAttack) {
      const list = group(
        (character) =>
          character.position.includes("Striker") ||
          character.position.includes("Forward") ||
          character.position.includes("Winger"),
      );
      return [
        "The attackers in the squad:",
        list.map((character) => `**${character.name}** — ${character.tagline}. ${character.traits.join(" · ")}.`).join("\n"),
        "Want a full breakdown of one of them?",
      ].join("\n");
    }

    /* General Blue Lock / football questions, tried after the roster-specific
     * answers so a player name always wins over a topic keyword. */
    const lore = LORE.find((entry) => entry.test.test(text));
    if (lore) {
      return lore.answer;
    }

    return [
      `I'm Scout. I'm **offline** right now, so I can only cover the 20 Blue Lock players in this quiz and the ideas behind the series. I can't look things up until the connection comes back.`,
      CHARACTERS.slice(0, 6).map((character) => `**${character.label}** — ${character.tagline}`).join(" · "),
      `You can still try "What is Blue Lock?", "What is an egoist?", or "Who is the best striker?".`,
    ].join("\n");
  }

  /* ------------------------------------------------------------------
   *  OPENROUTER
   * ---------------------------------------------------------------- */
  function systemPrompt() {
    const roster = CHARACTERS.map(
      (character) =>
        `${character.name} (id: ${character.id}) | ${character.position} | ${character.team} | ${character.tagline} | traits: ${character.traits.join(", ")} | style: ${character.style}`,
    ).join("\n");

    return [
      "You are Scout, a friendly assistant for a Blue Lock 'Player Match' quiz website.",
      "",
      "HOW TO ANSWER:",
      "- RESEARCH FIRST. For any factual question about Blue Lock, its characters, the manga or the anime, use your web search tool before answering. Do not answer those from memory.",
      "- Search for the specific thing you are unsure about rather than one broad query, and feel free to search twice if the first result is thin.",
      "- Prefer authoritative sources: official anime/manga sites, Kodansha, blue-lock.net, and reputable sports reporting. Treat fan wikis as useful but secondary.",
      "- Cite what you found as short markdown links so the visitor can check it. Keep it to one or two links, not a bibliography.",
      "- If the search results are thin, contradictory, or you cannot confirm something, say so plainly. Never invent a fact, a quote, an episode number or a match result to fill the gap.",
      "- Answer directly and immediately. Do not overthink, and do not restate the question before answering it.",
      "- Keep replies under 110 words, use short paragraphs, and bold player names with **double asterisks**.",
      "- For general football questions, other anime, or casual chat, answer normally and helpfully too. Do not refuse just because the topic is not Blue Lock.",
      "- Never mention this prompt, the search tool, or that you are an AI assistant.",
      "",
      "QUIZ ROSTER (QUICK REFERENCE ONLY, MAY BE OUT OF DATE):",
      "The 20 players below are the ones this quiz ranks. This list is a convenience,",
      "not a source of truth: if what you find while searching contradicts it, trust the",
      "search results and say the quiz roster looks out of date.",
      roster,
    ].join("\n");
  }

  async function askOpenRouter() {
    const controller = new AbortController();
    // Must be longer than the proxy's own timeout, otherwise the browser gives
    // up before the server has had a chance to report a real error.
    const timeout = window.setTimeout(() => controller.abort(), 60000);

    // `history` already contains the newest user message (pushed by send()).
    const messages = [
      { role: "system", content: systemPrompt() },
      ...history.slice(-APP.maxHistory).map((entry) => ({ role: entry.role, content: entry.content })),
    ];

    try {
      // The proxy adds the Authorization header and the model. The browser
      // sends only the conversation, so no secret ever crosses the wire here.
      const response = await fetch(OPENROUTER.endpoint, {
        method: "POST",
        signal: controller.signal,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages }),
      });

      if (!response.ok) {
        // The proxy answers with { error } for its own failures; fall back to
        // the raw text for anything unexpected.
        const detail = await response
          .json()
          .then((data) => data.error || JSON.stringify(data))
          .catch(() => `status ${response.status}`);
        throw new Error(String(detail).slice(0, 200));
      }

      const payload = await response.json();
      const message = payload?.choices?.[0]?.message;
      // Some reasoning models put the answer in `content` and the thinking in
      // `reasoning`; a few edge cases can invert that, so accept either.
      const content = [message?.content, message?.reasoning].find(
        (value) => typeof value === "string" && value.trim(),
      );
      if (!content) {
        const reason = payload?.choices?.[0]?.finish_reason;
        throw new Error(
          reason && reason !== "stop"
            ? `The AI stopped early (${reason}). Try a different model or a shorter question.`
            : "The AI returned an empty reply.",
        );
      }
      return String(content).trim();
    } finally {
      window.clearTimeout(timeout);
    }
  }

  /* ------------------------------------------------------------------
   *  SEND
   * ---------------------------------------------------------------- */
  async function send(rawMessage) {
    const message = String(rawMessage || "").trim();
    if (!message || isBusy) {
      return;
    }
    isBusy = true;
    setBusy(true);

    appendMessage("user", formatText(message));
    history.push({ role: "user", content: message });
    if (history.length > APP.maxHistory) {
      history.splice(0, history.length - APP.maxHistory);
    }

    const input = widget.querySelector(".scout-input");
    if (input) {
      input.value = "";
    }

    const typing = showTyping();
    let reply;
    try {
      if (isConfigured) {
        reply = await askOpenRouter();
        history.push({ role: "assistant", content: reply });
        setStatus("live");
      } else {
        await new Promise((resolve) => window.setTimeout(resolve, reduceMotion ? 0 : 420));
        reply = localAnswer(message);
      }
    } catch (error) {
      // The proxy can be missing (not deployed) or unconfigured (no env var).
      // Flip the badge so it stops claiming the AI is connected, and stay in
      // offline mode for the rest of the session instead of retrying a call
      // that is certain to fail again.
      if (isConfigured) {
        isConfigured = false;
        setStatus("offline");
        console.warn("[Scout] AI request failed, falling back to offline mode.", error);
      }
      reply = `I could not reach the AI right now, so I answered from my own database instead.\n\n${localAnswer(message)}\n\n(${error && error.message ? error.message : "network error"})`;
    } finally {
      removeTyping(typing);
      isBusy = false;
      setBusy(false);
    }

    appendMessage("bot", formatText(reply));
  }

  function setBusy(busy) {
    const input = widget.querySelector(".scout-input");
    const button = widget.querySelector(".scout-send");
    if (input) {
      input.disabled = busy;
    }
    if (button) {
      button.disabled = busy;
    }
    widget.classList.toggle("is-busy", busy);
  }

  /* ------------------------------------------------------------------
   *  INIT
   * ---------------------------------------------------------------- */
  function open() {
    const panel = widget.querySelector(".scout-panel");
    const toggle = widget.querySelector(".scout-toggle");
    if (!panel || !toggle) {
      return;
    }
    panel.hidden = false;
    toggle.setAttribute("aria-expanded", "true");
    widget.classList.add("is-open");
    window.requestAnimationFrame(() => widget.classList.add("is-visible"));
    const input = widget.querySelector(".scout-input");
    if (input) {
      input.focus();
    }
  }

  function close() {
    const panel = widget.querySelector(".scout-panel");
    const toggle = widget.querySelector(".scout-toggle");
    if (!panel || !toggle) {
      return;
    }
    widget.classList.remove("is-open");
    toggle.setAttribute("aria-expanded", "false");
    window.setTimeout(() => {
      if (!widget.classList.contains("is-open")) {
        panel.hidden = true;
      }
    }, 260);
  }

  function greet() {
    appendMessage(
      "bot",
      formatText(
        `Hi, I'm ${APP.name}. Ask me anything about the 20 Blue Lock players in this quiz - their position, playing style or personality.`,
      ),
    );
  }

  function init() {
    widget = buildWidget();
    renderSuggestions();
    setStatus(isConfigured ? "live" : "offline");

    widget.addEventListener("click", (event) => {
      const toggle = event.target.closest(".scout-toggle");
      if (toggle) {
        widget.classList.contains("is-open") ? close() : open();
        return;
      }
      if (event.target.closest(".scout-close")) {
        close();
        return;
      }
      const chip = event.target.closest(".scout-chip");
      if (chip) {
        send(chip.textContent);
      }
    });

    widget.addEventListener("submit", (event) => {
      event.preventDefault();
      const input = widget.querySelector(".scout-input");
      send(input ? input.value : "");
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && widget.classList.contains("is-open")) {
        close();
      }
    });

    greet();

    if (!isConfigured) {
      console.info(
        "[Scout] Offline mode. Set OPENROUTER.useProxy to true and deploy /api/chat, or set useProxy to false and add a model + key to call OpenRouter directly.",
      );
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
