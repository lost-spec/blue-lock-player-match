(() => {
  const STORAGE_KEY = "blue-lock-player-match-state";
  const STATE_VERSION = 2;
  const IMAGE_BASE = "./player%20images/";

  const PLAYERS = [
    {
      name: "isagi",
      image: "isagi.jpg",
      secondary_image: "isagi 2.jpg",
      position: "attack",
      reason_to_play: "3",
      how_would_you_win: "2",
      what_excites_you: "1",
      suitability: "2",
      what_do_you_rely_on: "2",
      chaos_or_not: "2",
      selfishness_or_not: "2",
      fight_back: "1",
    },
    {
      name: "rin",
      image: "rin.jpg",
      secondary_image: "rin 2.jpg",
      position: "attack",
      reason_to_play: "3",
      how_would_you_win: "2",
      what_excites_you: "2",
      suitability: "2",
      what_do_you_rely_on: "3",
      chaos_or_not: "1",
      selfishness_or_not: "2",
      fight_back: "1",
    },
    {
      name: "bachira",
      image: "bachira.jpg",
      secondary_image: "bachira 2.jpg",
      position: "attack",
      reason_to_play: "2",
      how_would_you_win: "2",
      what_excites_you: "3",
      suitability: "2",
      what_do_you_rely_on: "3",
      chaos_or_not: "1",
      selfishness_or_not: "2",
      fight_back: "2",
    },
    {
      name: "barou",
      image: "barou.jpg",
      secondary_image: "barou 2.jpg",
      position: "attack",
      reason_to_play: "3",
      how_would_you_win: "2",
      what_excites_you: "2",
      suitability: "2",
      what_do_you_rely_on: "1",
      chaos_or_not: "1",
      selfishness_or_not: "2",
      fight_back: "1",
    },
    {
      name: "kaiser",
      image: "kaiser.jpg",
      secondary_image: "kaiser 2.jpg",
      position: "attack",
      reason_to_play: "3",
      how_would_you_win: "1",
      what_excites_you: "2",
      suitability: "2",
      what_do_you_rely_on: "1",
      chaos_or_not: "1",
      selfishness_or_not: "2",
      fight_back: "1",
    },
    {
      name: "aiku",
      image: "aiku.jpg",
      secondary_image: "aiku 2.jpg",
      position: "def",
      reason_to_play: "1",
      how_would_you_win: "2",
      what_excites_you: "2",
      suitability: "1",
      what_do_you_rely_on: "3",
      chaos_or_not: "2",
      selfishness_or_not: "1",
      fight_back: "1",
    },
    {
      name: "aryu",
      image: "aryu.jpg",
      secondary_image: "aryu 2.jpg",
      position: "def",
      reason_to_play: "2",
      how_would_you_win: "1",
      what_excites_you: "3",
      suitability: "2",
      what_do_you_rely_on: "1",
      chaos_or_not: "2",
      selfishness_or_not: "1",
      fight_back: "1",
    },
    {
      name: "ness",
      image: "ness.jpg",
      secondary_image: "ness 2.jpg",
      position: "midfield",
      reason_to_play: "3",
      how_would_you_win: "1",
      what_excites_you: "3",
      suitability: "1",
      what_do_you_rely_on: "3",
      chaos_or_not: "2",
      selfishness_or_not: "2",
      fight_back: "2",
    },
    {
      name: "karasu",
      image: "karasu.jpg",
      secondary_image: "karasu 2.jpg",
      position: "midfield",
      reason_to_play: "1",
      how_would_you_win: "1",
      what_excites_you: "1",
      suitability: "1",
      what_do_you_rely_on: "2",
      chaos_or_not: "2",
      selfishness_or_not: "1",
      fight_back: "1",
    },
    {
      name: "sae",
      image: "sae.jpg",
      secondary_image: "sae 2.jpg",
      position: "midfield",
      reason_to_play: "1",
      how_would_you_win: "1",
      what_excites_you: "1",
      suitability: "1",
      what_do_you_rely_on: "3",
      chaos_or_not: "2",
      selfishness_or_not: "2",
      fight_back: "2",
    },
    {
      name: "hugo",
      image: "hugo.jpg",
      secondary_image: "hugo 2.jpg",
      position: "midfield",
      reason_to_play: "1",
      how_would_you_win: "1",
      what_excites_you: "1",
      suitability: "1",
      what_do_you_rely_on: "2",
      chaos_or_not: "2",
      selfishness_or_not: "2",
      fight_back: "2",
    },
    {
      name: "reo",
      image: "reo.jpg",
      secondary_image: "reo 2.jpg",
      position: "midfield",
      reason_to_play: "3",
      how_would_you_win: "2",
      what_excites_you: "1",
      suitability: "2",
      what_do_you_rely_on: "3",
      chaos_or_not: "2",
      selfishness_or_not: "1",
      fight_back: "1",
    },
    {
      name: "yukimiya",
      image: "yukimiya.jpg",
      secondary_image: "yukimiya 2.jpg",
      position: "attack",
      reason_to_play: "3",
      how_would_you_win: "2",
      what_excites_you: "3",
      suitability: "2",
      what_do_you_rely_on: "3",
      chaos_or_not: "2",
      selfishness_or_not: "2",
      fight_back: "1",
    },
    {
      name: "otoya",
      image: "otoya.jpg",
      secondary_image: "otoya 2.jpg",
      position: "attack",
      reason_to_play: "2",
      how_would_you_win: "1",
      what_excites_you: "2",
      suitability: "2",
      what_do_you_rely_on: "2",
      chaos_or_not: "1",
      selfishness_or_not: "2",
      fight_back: "2",
    },
    {
      name: "niko",
      image: "niko.jpg",
      secondary_image: "niko 2.jpg",
      position: "def",
      reason_to_play: "3",
      how_would_you_win: "2",
      what_excites_you: "1",
      suitability: "2",
      what_do_you_rely_on: "2",
      chaos_or_not: "2",
      selfishness_or_not: "2",
      fight_back: "2",
    },
    {
      name: "di lorenzo",
      image: "di lorenzo.jpg",
      secondary_image: "di lorenzo 2.jpg",
      position: "def",
      reason_to_play: "2",
      how_would_you_win: "2",
      what_excites_you: "2",
      suitability: "1",
      what_do_you_rely_on: "2",
      chaos_or_not: "2",
      selfishness_or_not: "2",
      fight_back: "2",
    },
    {
      name: "charles",
      image: "charles.jpg",
      secondary_image: "charles 2.jpg",
      position: "midfield",
      reason_to_play: "2",
      how_would_you_win: "2",
      what_excites_you: "3",
      suitability: "2",
      what_do_you_rely_on: "3",
      chaos_or_not: "1",
      selfishness_or_not: "2",
      fight_back: "2",
    },
    {
      name: "chigiri",
      image: "chigiri.jpg",
      secondary_image: "chigiri 2.jpg",
      position: "attack",
      reason_to_play: "3",
      how_would_you_win: "2",
      what_excites_you: "3",
      suitability: "1",
      what_do_you_rely_on: "1",
      chaos_or_not: "1",
      selfishness_or_not: "2",
      fight_back: "1",
    },
    {
      name: "shidou",
      image: "shidou.jpg",
      secondary_image: "shidou 2.jpg",
      position: "attack",
      reason_to_play: "2",
      how_would_you_win: "1",
      what_excites_you: "2",
      suitability: "1",
      what_do_you_rely_on: "1",
      chaos_or_not: "1",
      selfishness_or_not: "2",
      fight_back: "1",
    },
    {
      name: "kunigami",
      image: "kunigami.jpg",
      secondary_image: "kunigami 2.jpg",
      position: "attack",
      reason_to_play: "3",
      how_would_you_win: "2",
      what_excites_you: "2",
      suitability: "1",
      what_do_you_rely_on: "1",
      chaos_or_not: "2",
      selfishness_or_not: "1",
      fight_back: "1",
    },
  ];

  const QUESTIONS = [
    {
      key: "position",
      slug: "position",
      eyebrow: "Choose one",
      title: "Where do you play?",
      description: "Pick the role you naturally want to take on the pitch.",
      playerField: "position",
      weight: 3,
      validAnswers: ["attack", "midfield", "def"],
      options: [
        { value: "attack", letter: "A", label: "Attack" },
        { value: "midfield", letter: "M", label: "Midfield" },
        { value: "def", letter: "D", label: "Defender" },
      ],
    },
    {
      key: "how_would_you_win",
      slug: "how-would-you-win",
      eyebrow: "Choose one",
      title: "What would be the best win for you?",
      description: "Think about the kind of match you would remember forever.",
      playerField: "how_would_you_win",
      weight: 1.5,
      validAnswers: ["1", "2"],
      options: [
        {
          value: "1",
          letter: "1",
          label: "A comfortable win where my team dominates from start to end",
        },
        {
          value: "2",
          letter: "2",
          label: "A hard match that comes down to the last moment",
        },
      ],
    },
    {
      key: "what_excites_you",
      slug: "what-excites-you",
      eyebrow: "Choose one",
      title: "What excites you most in a match?",
      description: "Follow the moment that makes you want to play football again.",
      playerField: "what_excites_you",
      weight: 1.5,
      validAnswers: ["1", "2", "3"],
      options: [
        { value: "1", letter: "1", label: "Controlling the game" },
        { value: "2", letter: "2", label: "Destroying my opponents" },
        { value: "3", letter: "3", label: "Playing the most beautiful football" },
      ],
    },
    {
      key: "reason_to_play",
      slug: "reason-to-play",
      eyebrow: "Choose one",
      title: "Why do you play football?",
      description: "Choose the reason that feels most like you.",
      playerField: "reason_to_play",
      weight: 3,
      validAnswers: ["1", "2", "3"],
      options: [
        { value: "1", letter: "1", label: "To win" },
        { value: "2", letter: "2", label: "To have fun" },
        { value: "3", letter: "3", label: "To be the best" },
      ],
    },
    {
      key: "suitability",
      slug: "suitability",
      eyebrow: "Choose one",
      title: "Would you rather excel or adapt?",
      description: "Which approach helps you perform your best?",
      playerField: "suitability",
      weight: 1,
      validAnswers: ["1", "2"],
      options: [
        {
          value: "1",
          letter: "1",
          label: "Play in an environment that suits me or where I am the best",
        },
        {
          value: "2",
          letter: "2",
          label: "Adapt to different positions and environments",
        },
      ],
    },
    {
      key: "what_do_you_rely_on",
      slug: "what-do-you-rely-on",
      eyebrow: "Choose one",
      title: "What do you rely on while playing?",
      description: "Choose the quality you trust most in a decisive moment.",
      playerField: "what_do_you_rely_on",
      weight: 3,
      validAnswers: ["1", "2", "3"],
      options: [
        { value: "1", letter: "1", label: "My physicality" },
        { value: "2", letter: "2", label: "My football IQ" },
        { value: "3", letter: "3", label: "My skill" },
      ],
    },
    {
      key: "fight_back",
      slug: "fight-back-or-not",
      eyebrow: "Choose one",
      title: "The manager decides to sub you out. Do you fight back?",
      description: "React honestly. There is no wrong answer here.",
      playerField: "fight_back",
      weight: 1,
      validAnswers: ["1", "2"],
      options: [
        { value: "1", letter: "1", label: "Yes, I fight back and demand to stay on" },
        { value: "2", letter: "2", label: "No, I accept it and keep my head down" },
      ],
    },
    {
      key: "selfishness_or_not",
      slug: "selfishness-or-not",
      eyebrow: "Final question",
      title: "Is selfishness a weakness in football?",
      description: "Give the answer that best reflects your philosophy.",
      playerField: "chaos_or_not",
      weight: 1,
      validAnswers: ["1", "2"],
      options: [
        { value: "1", letter: "1", label: "Yes, it is a weakness" },
        { value: "2", letter: "2", label: "No, it is not a weakness" },
      ],
    },
  ];

  const QUESTION_BY_SLUG = new Map(QUESTIONS.map((question) => [question.slug, question]));
  const TOTAL_SCORE = 16;
  const app = document.getElementById("app");
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  let state = loadState();
  let chart = null;
  let pendingAnswer = null;

  function createState() {
    return { version: STATE_VERSION, answers: [] };
  }

  function isRecord(value) {
    return value !== null && typeof value === "object" && !Array.isArray(value);
  }

  function loadState() {
    try {
      const storedState = window.localStorage.getItem(STORAGE_KEY);
      if (!storedState) {
        return createState();
      }

      const parsedState = JSON.parse(storedState);
      if (
        !isRecord(parsedState) ||
        parsedState.version !== STATE_VERSION ||
        !Array.isArray(parsedState.answers) ||
        parsedState.answers.length > QUESTIONS.length
      ) {
        return createState();
      }

      const answers = [];
      for (let index = 0; index < parsedState.answers.length; index += 1) {
        const answer = parsedState.answers[index];
        const question = QUESTIONS[index];
        if (
          !isRecord(answer) ||
          answer.key !== question.key ||
          !question.validAnswers.includes(answer.value)
        ) {
          return createState();
        }
        answers.push({ key: answer.key, value: answer.value });
      }

      return { version: STATE_VERSION, answers };
    } catch {
      return createState();
    }
  }

  function saveState() {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      return;
    }
  }

  function clearState() {
    state = createState();
    saveState();
  }

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

  function toTitleCase(value) {
    return value.replace(/\b\w/g, (character) => character.toUpperCase());
  }

  function formatScore(value) {
    return Number.isInteger(value) ? String(value) : value.toFixed(1);
  }

  function formatPercentage(value) {
    return value.toFixed(1);
  }

  function imageUrl(filename) {
    return `${IMAGE_BASE}${encodeURIComponent(filename)}`;
  }

  function currentRoute() {
    const questionIndex = state.answers.length;
    if (questionIndex >= QUESTIONS.length) {
      return "results";
    }
    return `questions/${QUESTIONS[questionIndex].slug}`;
  }

  function routeFromLocation() {
    const route = window.location.hash.replace(/^#\/?/, "").replace(/\/$/, "");
    return route || "home";
  }

  function navigate(route, replace = false) {
    const target = `#/${route}`;
    if (replace) {
      window.history.replaceState(null, "", target);
      render();
      return;
    }

    if (window.location.hash === target) {
      render();
      return;
    }
    window.location.hash = target;
  }

  function renderHome() {
    document.title = "Find Your Blue Lock Player";
    const hasProgress = state.answers.length > 0;
    const isComplete = state.answers.length === QUESTIONS.length;
    const resumeRoute = hasProgress ? currentRoute() : "";
    const resumeLabel = isComplete ? "View your results" : "Resume your saved quiz";

    app.innerHTML = `
      <div class="landing-shell">
        <div class="landing-grid" aria-hidden="true"></div>
        <div class="landing-orbit landing-orbit-one" aria-hidden="true"></div>
        <div class="landing-orbit landing-orbit-two" aria-hidden="true"></div>
        <div class="landing-beam" aria-hidden="true"></div>
        <div class="container page-container landing-container">
          <section class="landing-hero" aria-labelledby="landing-title">
            <div class="landing-hero-copy">
              <div class="landing-brand-lockup">
                <div class="landing-logo" aria-hidden="true">
                  <svg class="brand-logo-svg" viewBox="0 0 64 64" aria-hidden="true" focusable="false">
                    <path d="M32 3 56 14.5v18.8C56 46.6 45.8 56.4 32 61 18.2 56.4 8 46.6 8 33.3V14.5L32 3Z" fill="#061225" stroke="#67e8f9" stroke-width="2" stroke-linejoin="round"/>
                    <path d="M32 8.5 51 17.7v15.6c0 10.2-8 18.1-19 23-11-4.9-19-12.8-19-23V17.7L32 8.5Z" fill="#123f86" opacity=".78"/>
                    <path d="M12 40 52 22" fill="none" stroke="#67e8f9" stroke-width="1" opacity=".28"/>
                    <path d="M21 19h13.2c5.4 0 8.8 2.9 8.8 7.2 0 2.6-1.4 4.6-3.8 5.7 3.2 1 5 3.3 5 6.3 0 5.1-3.9 8.1-9.9 8.1H21V19Zm7 5.7v4.5h5c1.8 0 2.8-.8 2.8-2.3s-1-2.2-2.8-2.2H28Zm0 10v4.6h5.7c1.9 0 3-.8 3-2.3 0-1.5-1.1-2.3-3-2.3H28Z" fill="#fff"/>
                    <path d="m45.5 18.8 6.8 0-13 27.4h-6.7l12.9-27.4Z" fill="#67e8f9"/>
                    <path d="M18 55.5h28" fill="none" stroke="#67e8f9" stroke-width="2" stroke-linecap="square" opacity=".7"/>
                  </svg>
                </div>
                <div class="landing-brand-meta">
                  <span class="landing-brand-name">Player Match</span>
                  <span class="landing-brand-index">Scouting report / 01</span>
                </div>
              </div>
              <span class="eyebrow">Football personality quiz</span>
              <h1 id="landing-title" class="landing-title">FIND YOUR <span>BLUE LOCK</span> PLAYER</h1>
              <p class="landing-description">Eight questions. One mindset. Find the player who competes like you.</p>
              <div class="landing-cta-row">
                <button class="btn btn-primary btn-lg landing-cta" type="button" data-action="start">
                  Start Quiz <span class="ms-2" aria-hidden="true">&rarr;</span>
                </button>
                ${
                  hasProgress
                    ? `<a class="landing-resume" href="#/${resumeRoute}">${resumeLabel} <span aria-hidden="true">&nearr;</span></a>`
                    : ""
                }
              </div>
              <div class="landing-question-indicator">
                <span class="landing-question-number">08</span>
                <span>8 questions <b>/</b> about 2 min</span>
              </div>
            </div>
            <div class="landing-hero-aside" aria-hidden="true">
              <div class="landing-aside-label">Player<br />Match</div>
              <div class="landing-aside-number">01</div>
              <div class="landing-aside-line"></div>
              <div class="landing-aside-copy">Read the game<br />between the lines.</div>
            </div>
          </section>

          <section class="landing-features" aria-label="Quiz features">
            <article class="landing-feature">
              <span class="landing-feature-index">01</span>
              <div>
                <h2>8 Questions</h2>
                <p>Quick reads on how you compete.</p>
              </div>
            </article>
            <article class="landing-feature">
              <span class="landing-feature-index">02</span>
              <div>
                <h2>Your Playstyle</h2>
                <p>Your answers reveal your edge.</p>
              </div>
            </article>
            <article class="landing-feature">
              <span class="landing-feature-index">03</span>
              <div>
                <h2>Your Player</h2>
                <p>Find your top three match.</p>
              </div>
            </article>
          </section>
        </div>
      </div>
    `;
  }

  function renderQuestion(question, questionIndex) {
    document.title = `${question.title} | Player Match`;
    const progress = Math.round(((questionIndex + 1) / QUESTIONS.length) * 100);
    const options = question.options
      .map(
        (option) => `
          <button class="answer-card" type="button" data-action="answer" data-question-key="${escapeHtml(question.key)}" data-answer-value="${escapeHtml(option.value)}" aria-label="${escapeHtml(option.label)}">
            <span class="answer-letter" aria-hidden="true">${escapeHtml(option.letter)}</span>
            <span class="answer-label fw-semibold">${escapeHtml(option.label)}</span>
            <span class="answer-arrow" aria-hidden="true">&rarr;</span>
          </button>
        `,
      )
      .join("");

    const steps = QUESTIONS.map((_, index) => {
      const stepState = index < questionIndex ? "is-done" : index === questionIndex ? "is-current" : "";
      return `<li class="question-step ${stepState}" aria-hidden="true"><span class="question-step-dot"></span></li>`;
    }).join("");

    const html = `
      <div class="container page-container py-4 py-md-5">
        <div class="question-view" data-question-key="${escapeHtml(question.key)}">
          <section class="surface-card question-panel p-4 p-md-5">
            <header class="question-header">
              <div class="question-meta">
                <span class="question-count">
                  <span class="question-count-label">Question</span>
                  <span class="question-count-value">${questionIndex + 1}</span>
                  <span class="question-count-total">of ${QUESTIONS.length}</span>
                </span>
                <span class="question-percent">${progress}% complete</span>
              </div>
              <div class="question-progress" role="progressbar" aria-label="Quiz progress" aria-valuenow="${progress}" aria-valuemin="0" aria-valuemax="100">
                <div class="question-progress-bar" style="--progress-target: ${progress}%"></div>
              </div>
              <ol class="question-steps" aria-hidden="true">${steps}</ol>
            </header>

            <div class="question-body">
              <span class="eyebrow">${escapeHtml(question.eyebrow)}</span>
              <h1 class="question-title" tabindex="-1">${escapeHtml(question.title)}</h1>
              <p class="question-description">${escapeHtml(question.description)}</p>
            </div>

            <div class="answer-grid">${options}</div>
          </section>
        </div>
      </div>
    `;

    const focusTitle = () => {
      window.requestAnimationFrame(() => {
        app.querySelector(".question-title")?.focus();
      });
    };

    const currentView = app.querySelector(".question-view");
    if (!currentView || reduceMotion || currentView.dataset.questionKey === question.key) {
      app.innerHTML = html;
      focusTitle();
      return;
    }

    let swapped = false;
    let timerId = null;
    const finishSwap = () => {
      if (swapped) {
        return;
      }
      swapped = true;
      if (timerId !== null) {
        window.clearTimeout(timerId);
      }
      app.innerHTML = html;
      focusTitle();
    };

    currentView.classList.add("is-leaving");
    currentView.addEventListener("animationend", finishSwap, { once: true });
    timerId = window.setTimeout(finishSwap, 200);
  }

  function calculateScores() {
    const scores = PLAYERS.map(() => 0);
    state.answers.forEach((answer) => {
      const question = QUESTIONS.find((item) => item.key === answer.key);
      if (!question) {
        return;
      }
      PLAYERS.forEach((player, index) => {
        if (player[question.playerField] === answer.value) {
          scores[index] += question.weight;
        }
      });
    });
    return scores;
  }

  function rankedAllPlayers() {
    const scores = calculateScores();
    const sorted = scores
      .map((score, index) => ({
        ...PLAYERS[index],
        score,
        percentage: (score / TOTAL_SCORE) * 100,
        originalIndex: index,
      }))
      .sort((first, second) => second.score - first.score || first.originalIndex - second.originalIndex);

    let lastScore = null;
    let matchRank = 0;
    return sorted.map((player, index) => {
      if (player.score !== lastScore) {
        matchRank = index + 1;
        lastScore = player.score;
      }
      return { ...player, rank: index + 1, matchRank };
    });
  }

  function rankedPlayers() {
    return rankedAllPlayers()
      .slice(0, 3)
      .map((player, index) => ({ ...player, rank: index + 1 }));
  }

  function renderResults() {
    document.title = "Your Player Matches | Player Match";
    const results = rankedPlayers();
    const squad = rankedAllPlayers();
    const rankWords = ["", "one", "two", "three"];
    const resultCards = results
      .map(
        (player) => {
          const rankWord = rankWords[player.rank] || String(player.rank);
          return `
          <article class="result-card rank-${rankWord} ${player.rank === 1 ? "result-card-featured" : ""}" style="--reveal-delay: ${player.rank === 1 ? 0 : player.rank === 2 ? 220 : 360}ms">
            <div class="result-media" tabindex="0" aria-label="${escapeHtml(toTitleCase(player.name))} image. Hover or focus to view the alternate image.">
              <img
                class="player-image player-image-primary"
                src="${imageUrl(player.image)}"
                alt="${escapeHtml(toTitleCase(player.name))} player portrait"
                width="600"
                height="750"
                loading="${player.rank === 1 ? "eager" : "lazy"}"
                decoding="async"
              >
              <img
                class="player-image player-image-secondary"
                src="${imageUrl(player.secondary_image)}"
                alt=""
                width="600"
                height="750"
                loading="lazy"
                decoding="async"
                aria-hidden="true"
              >
              <span class="rank-badge">${player.rank}</span>
              <span class="alternate-image-hint" aria-hidden="true">Alt view</span>
              <span class="match-label">${player.rank === 1 ? "Best match" : "Top match"}</span>
              <span class="result-sheen" aria-hidden="true"></span>
            </div>
            <div class="result-body">
              <div class="result-head">
                <span class="result-rank-label">Rank #${player.rank}</span>
                <h2 class="result-name">${escapeHtml(toTitleCase(player.name))}</h2>
                <span class="text-secondary small result-points">${formatScore(player.score)} points</span>
              </div>
              <div class="result-stats">
                <div class="percentage-ring">${formatPercentage(player.percentage)}%</div>
                <div class="result-meter">
                  <span class="result-meter-label">Match strength</span>
                  <div class="progress quiz-progress match-progress" role="progressbar" aria-label="${escapeHtml(toTitleCase(player.name))} match" aria-valuenow="${player.percentage}" aria-valuemin="0" aria-valuemax="100">
                    <div class="progress-bar" style="width: ${player.percentage}%"></div>
                  </div>
                </div>
              </div>
            </div>
          </article>
        `;
        },
      )
      .join("");

    const squadRows = squad
      .map(
        (player) => `
          <li class="squad-row ${player.rank <= 3 ? "squad-row-top" : ""}" style="--reveal-delay: ${Math.min(player.rank, 10) * 45}ms">
            <span class="squad-rank">${player.matchRank}</span>
            <span class="squad-media" tabindex="0" aria-label="${escapeHtml(toTitleCase(player.name))} image. Hover or focus to view the alternate image.">
              <img
                class="player-image player-image-primary"
                src="${imageUrl(player.image)}"
                alt="${escapeHtml(toTitleCase(player.name))} player portrait"
                width="600"
                height="750"
                loading="lazy"
                decoding="async"
              >
              <img
                class="player-image player-image-secondary"
                src="${imageUrl(player.secondary_image)}"
                alt=""
                width="600"
                height="750"
                loading="lazy"
                decoding="async"
                aria-hidden="true"
              >
            </span>
            <span class="squad-identity">
              <span class="squad-name">${escapeHtml(toTitleCase(player.name))}</span>
              <span class="squad-meter" role="progressbar" aria-label="${escapeHtml(toTitleCase(player.name))} match" aria-valuenow="${player.percentage}" aria-valuemin="0" aria-valuemax="100">
                <span class="squad-meter-fill" style="width: ${player.percentage}%"></span>
              </span>
            </span>
            <span class="squad-score">
              <span class="squad-points">${formatScore(player.score)}</span>
              <span class="squad-percentage">${formatPercentage(player.percentage)}%</span>
            </span>
          </li>
        `,
      )
      .join("");

    app.innerHTML = `
      <div class="container page-container py-4 py-md-5">
        <div class="results-view">
          <section class="surface-card results-shell p-4 p-md-5">
            <header class="results-header">
              <span class="eyebrow">Quiz complete</span>
              <h1 class="question-title results-title" tabindex="-1">Your top three players</h1>
              <p class="results-lead">The styles that match your answers the most.</p>
              <div class="results-progress" role="progressbar" aria-label="Quiz progress" aria-valuenow="100" aria-valuemin="0" aria-valuemax="100">
                <div class="results-progress-bar" style="--progress-target: 100%"></div>
              </div>
            </header>

            <div class="result-grid">${resultCards}</div>
          </section>

          <section class="surface-card squad-shell p-4 p-md-5" aria-labelledby="squad-title">
            <header class="squad-header">
              <div>
                <span class="eyebrow">Full squad</span>
                <h2 class="squad-title" id="squad-title">All ${squad.length} players ranked</h2>
                <p class="squad-lead">Every player scored against your eight answers. Hover a portrait to flip it.</p>
              </div>
              <span class="chart-badge">Percent match</span>
            </header>

            <ol class="squad-list" aria-label="All players ranked by match percentage">${squadRows}</ol>

            <div class="chart-panel" aria-labelledby="match-chart-title">
              <div class="chart-heading">
                <div>
                  <span class="eyebrow">Match comparison</span>
                  <h3 id="match-chart-title">How the whole squad scores</h3>
                </div>
              </div>
              <div class="chart-wrapper chart-wrapper-full">
                <canvas id="matchChart" role="img" aria-label="Bar chart comparing the match percentages of all ${squad.length} players">
                  Your browser does not support the match comparison chart.
                </canvas>
              </div>
            </div>
          </section>

          <div class="surface-card retake-panel p-4 p-md-5">
            <p class="retake-copy">Ready to see a different player profile?</p>
            <button class="btn btn-primary btn-lg retake-cta" type="button" data-action="retake">
              <span>Take Quiz Again</span>
              <span class="retake-cta-arrow" aria-hidden="true">&rarr;</span>
            </button>
          </div>
        </div>
      </div>
    `;

    window.__scoutLastResult = squad.slice(0, 3).map((player) => ({
      name: toTitleCase(player.name),
      points: formatScore(player.score),
      percentage: formatPercentage(player.percentage),
    }));

    window.requestAnimationFrame(() => {
      app.querySelector(".question-title")?.focus();
      renderChart(squad);
    });
  }

  function squadBarColor(rank, boost = 1) {
    const palette = [
      [34, 211, 238],
      [59, 130, 246],
      [129, 140, 248],
    ];
    const base = palette[Math.min(rank, 3) - 1];
    const alpha = (rank <= 3 ? 0.9 : Math.max(0.24, 0.62 - (rank - 3) * 0.03)) * boost;
    return `rgba(${base[0]}, ${base[1]}, ${base[2]}, ${alpha.toFixed(2)})`;
  }

  function renderChart(squad) {
    if (chart) {
      chart.destroy();
      chart = null;
    }

    const canvas = document.getElementById("matchChart");
    if (!canvas) {
      return;
    }

    if (!window.Chart) {
      const fallback = document.createElement("p");
      fallback.className = "text-secondary mb-0";
      fallback.textContent = "The match comparison chart could not be loaded.";
      canvas.replaceWith(fallback);
      return;
    }

    chart = new window.Chart(canvas, {
      type: "bar",
      data: {
        labels: squad.map((player) => toTitleCase(player.name)),
        datasets: [
          {
            label: "Match percentage",
            data: squad.map((player) => player.percentage),
            backgroundColor: squad.map((player) => squadBarColor(player.rank)),
            hoverBackgroundColor: squad.map((player) => squadBarColor(player.rank, 1.9)),
            borderColor: "#e0f2fe",
            borderWidth: 1,
            borderRadius: 8,
            borderSkipped: false,
            maxBarThickness: 22,
          },
        ],
      },
      options: {
        indexAxis: "y",
        responsive: true,
        maintainAspectRatio: false,
        animation: reduceMotion
          ? false
          : {
              duration: 900,
              easing: "easeOutQuart",
              delay: (context) => (context.type === "data" ? 220 + context.dataIndex * 45 : 0),
            },
        scales: {
          x: {
            beginAtZero: true,
            max: 100,
            ticks: {
              color: "#8fa3bd",
              callback: (value) => `${value}%`,
            },
            grid: {
              color: "rgba(148, 176, 219, 0.12)",
            },
            border: {
              display: false,
            },
          },
          y: {
            ticks: {
              color: (context) => (context.index < 3 ? "#f8fafc" : "#c6d3e4"),
              font: (context) => ({
                family: "Barlow Condensed, Arial Narrow, sans-serif",
                size: 15,
                weight: context.index < 3 ? "700" : "600",
              }),
            },
            grid: {
              color: "rgba(148, 176, 219, 0.08)",
            },
            border: {
              display: false,
            },
          },
        },
        plugins: {
          legend: {
            display: false,
          },
          tooltip: {
            backgroundColor: "rgba(2, 6, 23, 0.92)",
            titleColor: "#f8fafc",
            bodyColor: "#bae6fd",
            padding: 12,
            cornerRadius: 2,
            callbacks: {
              label: (context) => {
                const player = squad[context.dataIndex];
                const share = player.percentage.toFixed(1);
                const points = formatScore(player.score);
                return ` ${share}% match / ${points} points`;
              },
            },
          },
        },
      },
    });
  }

  function chooseAnswer(questionKey, answerValue) {
    if (pendingAnswer) {
      return;
    }

    const questionIndex = QUESTIONS.findIndex((question) => question.key === questionKey);
    const question = QUESTIONS[questionIndex];
    if (!question || questionIndex !== state.answers.length || !question.validAnswers.includes(answerValue)) {
      return;
    }

    const selectedCard = Array.from(app.querySelectorAll(".answer-card")).find(
      (card) => card.dataset.questionKey === questionKey && card.dataset.answerValue === answerValue,
    );
    if (!selectedCard) {
      return;
    }

    pendingAnswer = { questionKey, answerValue };
    app.setAttribute("aria-busy", "true");
    app.querySelectorAll(".answer-card").forEach((card) => {
      card.disabled = card !== selectedCard;
      card.classList.toggle("is-muted", card !== selectedCard);
    });
    selectedCard.classList.add("is-selected");
    selectedCard.dataset.selected = "true";

    const submitAnswer = () => {
      const pending = pendingAnswer;
      pendingAnswer = null;
      if (
        !pending ||
        pending.questionKey !== questionKey ||
        pending.answerValue !== answerValue ||
        routeFromLocation() !== `questions/${question.slug}` ||
        state.answers.length !== questionIndex
      ) {
        app.removeAttribute("aria-busy");
        return;
      }

      state.answers.push({ key: questionKey, value: answerValue });
      saveState();
      app.removeAttribute("aria-busy");
      navigate(state.answers.length === QUESTIONS.length ? "results" : currentRoute());
    };

    if (reduceMotion) {
      submitAnswer();
    } else {
      window.setTimeout(submitAnswer, 240);
    }
  }

  function render() {
    if (!app) {
      return;
    }

    const route = routeFromLocation();
    if (route === "home") {
      renderHome();
      return;
    }

    if (route === "results") {
      if (state.answers.length === QUESTIONS.length) {
        renderResults();
      } else {
        navigate(currentRoute(), true);
      }
      return;
    }

    const questionSlug = route.startsWith("questions/") ? route.slice("questions/".length) : "";
    const question = QUESTION_BY_SLUG.get(questionSlug);
    if (!question) {
      navigate("home", true);
      return;
    }

    const questionIndex = QUESTIONS.indexOf(question);
    if (questionIndex !== state.answers.length) {
      navigate(state.answers.length === QUESTIONS.length ? "results" : currentRoute(), true);
      return;
    }

    renderQuestion(question, questionIndex);
  }

  function handleAction(event) {
    if (!(event.target instanceof Element)) {
      return;
    }

    const actionElement = event.target.closest("[data-action]");
    if (!actionElement || !app.contains(actionElement)) {
      return;
    }

    const action = actionElement.dataset.action;
    if (action === "start") {
      clearState();
      navigate("questions/position");
      return;
    }

    if (action === "retake") {
      clearState();
      navigate("home");
      return;
    }

    if (action === "answer") {
      chooseAnswer(actionElement.dataset.questionKey, actionElement.dataset.answerValue);
    }
  }

  app.addEventListener("click", handleAction);
  window.addEventListener("hashchange", render);
  window.addEventListener("storage", (event) => {
    if (event.key === STORAGE_KEY) {
      state = loadState();
      render();
    }
  });

  if (!window.location.hash) {
    window.history.replaceState(null, "", "#/");
  }
  render();
})();
