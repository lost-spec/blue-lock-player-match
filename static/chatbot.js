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
      position: "Forward / Offensive Midfielder",
      team: "Japan U-20",
      tagline: "Demon King of Blue Lock",
      style:
        "Reads the whole pitch before the ball reaches him, then finishes first time from a sliver of space. Spatial Awareness and Metavision are his documented weapon.",
      traits: ["Spatial awareness", "Metavision", "Direct shot", "Adaptability"],
      blurb:
        "The protagonist, who entered Blue Lock as the 299th-ranked nobody after giving up a clear shot in the prefectural final. Rin beats him, so he studies Rin; the World Five humiliate him, so he studies them. Blue Lock asks him one question over and over: do you want to score, or do you want an excuse?",
    },
    {
      id: "rin",
      name: "Rin Itoshi",
      label: "Rin",
      position: "Forward",
      team: "Japan U-20",
      tagline: "The Beast",
      style:
        "Kick Accuracy, Spatial Awareness, Off the Ball Movements and Dribbling. His football reads as joyless: perfect scanning and a long-range shot that bends physics, all in service of destroying everything.",
      traits: ["Kick accuracy", "Spatial awareness", "Off the ball", "Perfectionist"],
      blurb:
        "Blue Lock's #1 ranked striker and Sae's younger brother. He learned the game worshipping Sae, who returned from Spain and told him their plan was garbage; Rin has been trying to erase him ever since. Isagi is the first opponent who improves fast enough that he cannot dismiss.",
    },
    {
      id: "bachira",
      name: "Meguru Bachira",
      label: "Bachira",
      position: "Forward / Left Wing",
      team: "FC Barcha / Japan U-20",
      tagline: "Monster",
      style:
        "Dribbles the ball through three defenders like they are cones, and sets fire on the ego of everyone around him. Monster Dribbling is his one documented weapon.",
      traits: ["Close control", "Instinct", "Monster dribbling", "Joyful"],
      blurb:
        "Grew up with a monster, so the monster became his only teammate. Taken onto Rin's side after beating Isagi, he stopped hearing it; the rematch forced the truth out and he awakened his own ego in the final 4v4 of the second selection.",
    },
    {
      id: "barou",
      name: "Shoei Barou",
      label: "Barou",
      position: "Forward",
      team: "Ubers / Japan U-20",
      tagline: "King",
      style:
        "Bull-dozes through defenders rather than going around them, because going around would be a concession. Sharing is for subjects and passing is for cowards.",
      traits: ["Solitary King", "Raw power", "Clinical finishing", "Villain"],
      blurb:
        "Top Six #4, established as raw untouchable individual goal-scoring power. When Isagi took the lead of the field off him he realised he could not out-protagonist Isagi, so he stopped trying to be the hero of the match and became its villain instead.",
    },
    {
      id: "kaiser",
      name: "Michael Kaiser",
      label: "Kaiser",
      position: "Forward",
      team: "Bastard München / Germany U-20",
      tagline: "Blue Rose",
      style:
        "Already has Metavision and a Predator Eye. Works off the ball, timing runs so the ball arrives where he is going to be rather than where he is standing.",
      traits: ["Predator eye", "Metavision", "Off the ball", "Neo Egoist"],
      blurb:
        "The German prodigy attached to Bastard München, positioned as the destination rather than the challenger: everything Blue Lock's egoists fought each other for, he already has. The source is explicit that the anime has only begun to show what he is actually like, so treat his character as still in development.",
    },
    {
      id: "aiku",
      name: "Oliver Aiku",
      label: "Aiku",
      position: "Center Back",
      team: "Ubers / Japan U-20",
      tagline: "U-20 Japan captain",
      style:
        "Reads the attack before it happens and shuts it down with positioning, timing and a complete absence of panic. Physique, Spatial Awareness, Reflex and Metavision.",
      traits: ["Anticipation", "Physique", "Reflex", "Metavision"],
      blurb:
        "A defender in a country obsessed with producing a striker, and the best in Japan's youth system. His philosophy is that self-knowledge beats self-belief. He publicly rated Blue Lock a farce before the U-20 match, then spent the match proving the assessment was professional.",
    },
    {
      id: "aryu",
      name: "Jyubei Aryu",
      label: "Aryu",
      position: "Center Back / Forward",
      team: "Japan U-20",
      tagline: "God of Glam",
      style:
        "Jumping Power, Long Reach, Headers and Spacing. Attacks the ball in the air and uses his 195 cm reach as the primary asset.",
      traits: ["Jumping power", "Long reach", "Headers", "Spacing"],
      blurb:
        "The source publishes no scouting report for Aryu, so little is documented about him. What it does record: he debuted in episode 12 as the #2 ranked player, described as obsessed with 'glamour' and as Rin's reluctant Top 3 teammate. He is listed at both centre back and forward.",
    },
    {
      id: "ness",
      name: "Alexis Ness",
      label: "Ness",
      position: "Offensive Midfielder",
      team: "Bastard München",
      tagline: "The Magician",
      style:
        "Flexible Ankles, Dribbling, Passing and Flow State. His game exists in orbit around Kaiser's run, putting the ball on the exact blade of grass that run demands.",
      traits: ["Flexible ankles", "Passing", "Flow state", "Devotion"],
      blurb:
        "Michael Kaiser's shadow at Bastard München, the delivery system for the Neo Egoist League's advertised monster. The source frames him as the question asked again after Reo and Nagi: what happens to a player who builds his game on somebody else.",
    },
    {
      id: "karasu",
      name: "Tabito Karasu",
      label: "Karasu",
      position: "Defensive Midfielder / Midfielder",
      team: "Paris X Gen / Japan U-20",
      tagline: "Assassin",
      style:
        "Bait a player into the choice they were always going to make, take the ball, and narrate their failure to them while jogging away. Analytical Ability, Ball Control, Feints, Metavision.",
      traits: ["Analytical ability", "Ball control", "Feints", "Metavision"],
      blurb:
        "Top Six #3 and a tactical generalist paired with Otoya, forming the most functional duo in the third-selection tryouts. He does the unglamorous work that lets the monsters up front eat, and would describe himself the same way before adding that the monsters would starve without him.",
    },
    {
      id: "sae",
      name: "Sae Itoshi",
      label: "Sae",
      position: "Central Midfielder / Offensive Midfielder",
      team: "Japan U-20",
      tagline: "The Prodigy",
      style:
        "Perfect Kick Technique, Dribbling, Reflex and Metavision. A midfielder is only as good as the striker finishing his passes, so he judges the striker before serving him.",
      traits: ["Perfect passing", "Vision", "Reflex", "Metavision"],
      blurb:
        "Rin's older brother, and U-20 Japan's captain. He left Japan at twelve as its greatest prodigy and came back from Spain with a verdict: Japan cannot produce a striker worth passing to. Blue Lock's win is what contradicts him.",
    },
    {
      id: "hugo",
      name: "Hugo",
      label: "Hugo",
      position: "Center Midfielder",
      team: "France U-20",
      tagline: "France U-20 centre midfielder",
      style:
        "Game Reading, Passing and Metavision, which are the only three abilities the source lists for him.",
      traits: ["Game reading", "Passing", "Metavision"],
      blurb:
        "The source publishes no scouting report, no personal data and no titles for Hugo, so there is very little documented about him. He is listed only as the mononym Yugo, affiliated with France New Generation World XI and France U-20, debuting in manga chapter 326.",
    },
    {
      id: "reo",
      name: "Reo Mikage",
      label: "Reo",
      position: "Center Midfielder / Center Back / Forward",
      team: "Japan U-20",
      tagline: "Copycat",
      style:
        "Copies people, with perfect mimicry of any skill he has seen, one at a time. Dexterity, Copycat, Metavision and Flow State, across seven listed positions.",
      traits: ["Copycat", "Dexterity", "Metavision", "Adaptability"],
      blurb:
        "Wanted the one thing his family could not buy him: a World Cup. He built his plan around Nagi, the genius he discovered on a rooftop, and Blue Lock was supposed to be their story. Nagi leaving him for Isagi was the first loss he ever took; what got him up was spite, and then something better than spite.",
    },
    {
      id: "yukimiya",
      name: "Kenyu Yukimiya",
      label: "Yukimiya",
      position: "Forward / Left Wing",
      team: "Japan U-20",
      tagline: "One On One Emperor",
      style:
        "Dribbling, Speed, Gyro Shot and Sword Screw. Isolates his defender and wins the duel, wins the ball back like a defender, then finishes like a poacher.",
      traits: ["One on one", "Dribbling", "Speed", "Gyro shot"],
      blurb:
        "Top Six #5, and a working fashion model who plays football like he is being photographed doing it. He treats Blue Lock as a proving ground in the most literal sense: a place to demonstrate that the pretty boy tag undersells him. Comfortable with both feet and better in the air than anyone his size.",
    },
    {
      id: "otoya",
      name: "Eita Otoya",
      label: "Otoya",
      position: "Right Wing / Forward",
      team: "Japan U-20",
      tagline: "Ninja",
      style:
        "Speed and Off-the-Ball Movements. Plays football the way a knife works: no wasted motion, no warning, and he hurts you every time he touches the ball.",
      traits: ["Speed", "Off the ball", "Instinct", "Finishing"],
      blurb:
        "Top Six #4, paired with Karasu, who supplies the reads while Otoya supplies the blade. The source is explicit that not every ego in Blue Lock needs a tragic engine: he runs on instinct and runs fine, and is the squad's least complicated person.",
    },
    {
      id: "niko",
      name: "Ikki Niko",
      label: "Niko",
      position: "Forward / Center Back / Defensive Midfielder",
      team: "Japan U-20",
      tagline: "The Watchtower",
      style:
        "Playmaker reading and a final strategy called One Time Kill Counter. Whole-field vision, and the first complete reader Isagi outduelled.",
      traits: ["Playmaker reading", "Vision", "Survival", "One Time Kill Counter"],
      blurb:
        "Came to Blue Lock from Wasurenagusa High determined to survive on the skills he already had rather than chase a weapon of his own. Losing to Isagi in the first selection made him decide to stop being afraid and to change in order to get better.",
    },
    {
      id: "di lorenzo",
      name: "Don Lorenzo",
      label: "Lorenzo",
      position: "Center Back / Center Midfielder",
      team: "Ubers / Italy U-20",
      tagline: "The Ace Eater",
      style:
        "Dribbling, Man-Marking and Physique, which is the notable part of a centre back's profile: he is listed for both dribbling and man-marking.",
      traits: ["Man-marking", "Dribbling", "Physique", "Zombie"],
      blurb:
        "The source publishes no scouting report, no match history and no Blue Lock ranking for Don Lorenzo. What it does document: centre back and centre midfielder for Ubers and Italy U-20, aged 19 and 190 cm, nicknamed the Ace Eater and the Zombie, debuting in manga chapter 209.",
    },
    {
      id: "charles",
      name: "Charles Chevalier",
      label: "Charles",
      position: "Midfielder",
      team: "Paris X Gen / France U-20",
      tagline: "PXG's Heart",
      style:
        "Off the Ball Movements, Passing, Metavision and Flow State. An exceptional passer whose game is built around supporting the main striker.",
      traits: ["Passing", "Off the ball", "Metavision", "Flow state"],
      blurb:
        "The source publishes no scouting report and no match history for Charles, and gives him no Blue Lock ranking. What it does document: a midfielder for Paris X Gen and France U-20, aged 15, titled PXG's Heart, Imp and Contrarian, with a Metavision-based passing game.",
    },
    {
      id: "chigiri",
      name: "Hyoma Chigiri",
      label: "Chigiri",
      position: "Left Wing / Forward",
      team: "Manshine City / Japan U-20",
      tagline: "Red Panther",
      style:
        "Speed, and speed is the entire plan. He unsealed it in the Team W match while three goals down and tore through the defence in the first full sprint of his career.",
      traits: ["Speed", "Flair", "Timing", "Courage"],
      blurb:
        "A youth prodigy whose whole game was speed until his knee gave out and the doctors told him one wrong sprint could end football for good. He came to Blue Lock half-hoping to be cut, playing at walking pace and flinching from duels. Kuon's betrayal in the Team W match made holding back feel like losing everything anyway, so he runs.",
    },
    {
      id: "shidou",
      name: "Ryusei Shido",
      label: "Shido",
      position: "Forward / Right Wing",
      team: "Japan U-20",
      tagline: "Demon",
      style:
        "Physique, Spatial Awareness, Acceleration and Reflex. Sent on when Blue Lock needs chaos, he scores acrobatically from angles that should not produce shots.",
      traits: ["Ruthlessness", "Acceleration", "Reflex", "Chaos"],
      blurb:
        "Top Six #2, shelved by Ego not for lacking talent but for having too much of it in an unusable shape. He celebrates like the stadium owes him money, and enjoys Rin's hatred and Sae's approval equally. The source frames him as the squad's argument that ego does not have to be earned through suffering.",
    },
    {
      id: "kunigami",
      name: "Rensuke Kunigami",
      label: "Kunigami",
      position: "Forward / Defensive Midfielder",
      team: "Japan U-20",
      tagline: "Burlygami",
      style:
        "Physique and Left Shot. Carries Team Z with his left foot and his physique, then comes back from the Wild Card running on a single rule: win, whatever it costs.",
      traits: ["Physique", "Left shot", "Determination", "Hero"],
      blurb:
        "Blue Lock's most old-fashioned player, a power striker with a hero complex who talked about fair play in a facility explicitly designed to burn that idea out. The second selection eliminates him and he disappears from the story; he returns through the Wild Card with buzzed hair and dead eyes. Losing taught him that being good and being chosen are different things.",
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
