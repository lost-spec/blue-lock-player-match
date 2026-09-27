(() => {
  "use strict";

  const POSITION_LABELS = {
    attack: "Attack",
    midfield: "Midfield",
    def: "Defender",
  };

  let session = null;
  const liveCharts = [];

  const escapeHtml = (value) => {
    const entities = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" };
    return String(value).replace(/[&<>"']/g, (character) => entities[character]);
  };

  const toTitleCase = (value) => value.replace(/\b\w/g, (character) => character.toUpperCase());

  const formatScore = (value) => (Number.isInteger(value) ? String(value) : value.toFixed(1));

  const formatPercentage = (value) => value.toFixed(1);

  const imageUrl = (imageBase, filename) => `${imageBase}${encodeURIComponent(filename)}`;

  const round = (value) => Math.round(value * 100) / 100;

  const signed = (value) => `${value > 0 ? "+" : value < 0 ? "" : ""}${formatScore(value)}`;

  function weightClass(weight) {
    if (weight >= 3) {
      return "is-w3";
    }
    if (weight >= 1.5) {
      return "is-w15";
    }
    return "is-w1";
  }

  function scoreAnswers(players, questions, answers) {
    const scores = new Array(players.length).fill(0);
    const cells = players.map(() => new Array(questions.length).fill(0));

    answers.forEach((answer) => {
      const questionIndex = questions.findIndex((question) => question.key === answer.key);
      if (questionIndex === -1) {
        return;
      }
      const question = questions[questionIndex];
      players.forEach((player, playerIndex) => {
        if (player[question.playerField] === answer.value) {
          scores[playerIndex] += question.weight;
          cells[playerIndex][questionIndex] = question.weight;
        }
      });
    });

    return { scores, cells };
  }

  function rankPlayers(players, questions, totalScore, answers) {
    const { scores, cells } = scoreAnswers(players, questions, answers);
    const sorted = players
      .map((player, index) => ({
        ...player,
        score: scores[index],
        cells: cells[index],
        originalIndex: index,
      }))
      .sort((first, second) => second.score - first.score || first.originalIndex - second.originalIndex);

    let lastScore = null;
    let matchRank = 0;

    return sorted.map((player, position) => {
      if (player.score !== lastScore) {
        matchRank = position + 1;
        lastScore = player.score;
      }
      return {
        ...player,
        rank: position + 1,
        matchRank,
        percentage: (player.score / totalScore) * 100,
      };
    });
  }

  function disagreementRows(player, questions, answers) {
    return questions
      .map((question, index) => ({
        question,
        index,
        weight: question.weight,
        matches: player[question.playerField] === answers[index].value,
      }))
      .filter((row) => !row.matches);
  }

  function shapeSeries(player, questions) {
    const peak = Math.max(...player.cells, 0);
    return questions.map((question, index) => (peak ? round((player.cells[index] / peak) * 100) : 0));
  }

  function rarityRows(players, questions, answers) {
    return questions.map((question, index) => {
      const chosen = answers[index].value;
      const count = players.filter((player) => player[question.playerField] === chosen).length;
      const counts = {};
      question.validAnswers.forEach((value) => {
        counts[value] = players.filter((player) => player[question.playerField] === value).length;
      });
      return {
        question,
        index,
        chosen,
        count,
        percentage: (count / players.length) * 100,
        share: counts[chosen] || 0,
        rarest: Math.min(...question.validAnswers.map((value) => counts[value] || 0)),
        counts,
      };
    });
  }

  function spreadBuckets(ranked, totalScore) {
    const buckets = new Map();
    ranked.forEach((player) => {
      const bucket = Math.min(Math.floor(player.score), totalScore);
      buckets.set(bucket, (buckets.get(bucket) || 0) + 1);
    });

    const labels = [];
    const values = [];
    for (let bucket = 0; bucket <= totalScore; bucket += 1) {
      labels.push(bucket === totalScore ? String(bucket) : `${bucket}-${bucket + 1}`);
      values.push(buckets.get(bucket) || 0);
    }
    return { labels, values };
  }

  function counterfactuals(players, questions, totalScore, answers) {
    const baseline = rankPlayers(players, questions, totalScore, answers);
    const leader = baseline[0];

    return questions.map((question, index) => {
      const alternatives = question.options
        .filter((option) => option.value !== answers[index].value)
        .map((option) => {
          const draft = answers.map((answer, position) =>
            position === index ? { key: question.key, value: option.value } : { ...answer },
          );
          const ranked = rankPlayers(players, questions, totalScore, draft);
          const next = ranked[0];
          const dethroned = next.name !== leader.name;
          return {
            option,
            ranked,
            next,
            dethroned,
            delta: round(next.score - leader.score),
            gained: next.score > leader.score,
          };
        });

      return { question, index, alternatives, chosen: answers[index].value, leader };
    });
  }

  function kpiMarkup(ranked, questions, answers, totalScore) {
    const leader = ranked[0];
    const runnerUp = ranked[1];
    const gap = runnerUp ? round(leader.score - runnerUp.score) : 0;
    const twins = ranked.filter((player) => player.score === totalScore).length;
    const yourPosition = answers[0] ? answers[0].value : "";
    const positionAligned = leader.position === yourPosition;

    const gapNote =
      gap >= 3 ? "Decisive result" : gap >= 1.5 ? "Clear leader" : gap > 0 ? "Neck and neck" : "Perfect tie";

    const tiles = [
      {
        label: "Current best match",
        value: escapeHtml(toTitleCase(leader.name)),
        note: `${formatScore(leader.score)} pts / ${formatPercentage(leader.percentage)}%`,
        tone: "cyan",
      },
      {
        label: "Margin over number two",
        value: `${formatScore(gap)} pts`,
        note: gapNote,
        tone: "blue",
      },
      {
        label: "Players with your exact 8 answers",
        value: String(twins),
        note: twins > 1 ? "You share a full profile" : "Your profile is unique",
        tone: "violet",
      },
      {
        label: "Position fit",
        value: POSITION_LABELS[leader.position] || leader.position,
        note: positionAligned
          ? `Matches your ${POSITION_LABELS[yourPosition] || yourPosition} answer`
          : `You chose ${POSITION_LABELS[yourPosition] || yourPosition}`,
        tone: positionAligned ? "cyan" : "amber",
      },
    ];

    return `
      <div class="stats-kpi-grid">
        ${tiles
          .map(
            (tile) => `
          <div class="stats-kpi tone-${tile.tone}">
            <span class="stats-kpi-label">${tile.label}</span>
            <span class="stats-kpi-value">${tile.value}</span>
            <span class="stats-kpi-note">${escapeHtml(tile.note)}</span>
          </div>
        `,
          )
          .join("")}
      </div>
    `;
  }

  function editorMarkup(questions, answers, dirty) {
    const rows = questions
      .map((question, index) => {
        const options = question.options
          .map((option) => {
            const active = option.value === answers[index].value;
            return `
              <button type="button" class="stats-opt ${active ? "is-active" : ""}" data-stat-action="set" data-question-index="${index}" data-answer-value="${escapeHtml(option.value)}" aria-pressed="${active}">
                <span class="stats-opt-letter" aria-hidden="true">${escapeHtml(option.letter)}</span>
                <span class="stats-opt-label">${escapeHtml(option.label)}</span>
              </button>
            `;
          })
          .join("");

        return `
          <div class="stats-editor-row">
            <div class="stats-editor-q">
              <span class="stats-editor-index">Q${index + 1}</span>
              <span class="stats-editor-title">${escapeHtml(question.title)}</span>
              <span class="stats-editor-weight" title="This question is worth ${formatScore(question.weight)} points">${formatScore(question.weight)} pts</span>
            </div>
            <div class="stats-opts" role="group" aria-label="Answers for ${escapeHtml(question.title)}">${options}</div>
          </div>
        `;
      })
      .join("");

    return `
      <section class="surface-card stats-section p-4 p-md-5" aria-labelledby="stats-editor-title">
        <header class="stats-section-head">
          <div>
            <span class="eyebrow">Live model</span>
            <h2 class="stats-section-title" id="stats-editor-title">Change an answer, watch everything move</h2>
            <p class="stats-section-lead">Every graph on this page recalculates instantly. Nothing is saved until you press save.</p>
          </div>
          <span class="chart-badge ${dirty ? "is-dirty" : ""}">${dirty ? "Unsaved changes" : "Matching saved quiz"}</span>
        </header>
        <div class="stats-editor">${rows}</div>
        <div class="stats-editor-actions">
          <button type="button" class="btn btn-primary" data-stat-action="save" ${dirty ? "" : "disabled"}>Save as my answers</button>
          <button type="button" class="btn btn-ghost" data-stat-action="reset" ${dirty ? "" : "disabled"}>Reset to saved</button>
          <a class="btn btn-ghost" href="#/results">Back to results</a>
        </div>
      </section>
    `;
  }

  function sortPlayers(ranked, questions, sortKey) {
    const copy = [...ranked];
    if (sortKey === "name") {
      return copy.sort((first, second) => first.name.localeCompare(second.name));
    }
    if (sortKey.startsWith("q:")) {
      const index = Number(sortKey.slice(2));
      return copy.sort(
        (first, second) =>
          second.cells[index] - first.cells[index] ||
          second.score - first.score ||
          first.originalIndex - second.originalIndex,
      );
    }
    return copy.sort((first, second) => first.rank - second.rank);
  }

  function matrixMarkup(players, questions, ranked, totalScore, imageBase, sortKey) {
    const header = questions
      .map(
        (question, index) => `
        <th class="matrix-q ${weightClass(question.weight)}" scope="col" title="${escapeHtml(question.title)} - worth ${formatScore(question.weight)} points">
          <span class="matrix-q-index">Q${index + 1}</span>
          <span class="matrix-q-weight">${formatScore(question.weight)}</span>
        </th>
      `,
      )
      .join("");

    const body = sortPlayers(ranked, questions, sortKey)
      .map((player) => {
        const cells = questions
          .map((question, index) => {
            const hit = player.cells[index] > 0;
            return `
              <td class="matrix-cell ${hit ? weightClass(question.weight) : "is-miss"}">
                <span class="matrix-cell-value">${hit ? formatScore(player.cells[index]) : "-"}</span>
                <span class="visually-hidden">${escapeHtml(toTitleCase(player.name))} ${hit ? "matches" : "does not match"} ${escapeHtml(question.title)}</span>
              </td>
            `;
          })
          .join("");

        return `
          <tr class="${player.rank <= 3 ? "is-top" : ""}">
            <th class="matrix-player" scope="row">
              <span class="matrix-rank">${player.matchRank}</span>
              <img class="matrix-thumb" src="${imageUrl(imageBase, player.image)}" alt="" width="40" height="40" loading="lazy" decoding="async">
              <span class="matrix-name">${escapeHtml(toTitleCase(player.name))}</span>
              <span class="matrix-pos">${POSITION_LABELS[player.position] || player.position}</span>
            </th>
            ${cells}
            <td class="matrix-total">
              <span class="matrix-total-score">${formatScore(player.score)}</span>
              <span class="matrix-total-pct">${formatPercentage(player.percentage)}%</span>
            </td>
          </tr>
        `;
      })
      .join("");

    const sortOptions = [
      `<option value="score" ${sortKey === "score" ? "selected" : ""}>Overall score</option>`,
      `<option value="name" ${sortKey === "name" ? "selected" : ""}>Player name (A-Z)</option>`,
      ...questions.map(
        (question, index) =>
          `<option value="q:${index}" ${sortKey === `q:${index}` ? "selected" : ""}>Q${index + 1} - ${escapeHtml(question.title)}</option>`,
      ),
    ].join("");

    return `
      <section class="surface-card stats-section p-4 p-md-5" aria-labelledby="stats-matrix-title">
        <header class="stats-section-head">
          <div>
            <span class="eyebrow">Full breakdown</span>
            <h2 class="stats-section-title" id="stats-matrix-title">Every player, every question</h2>
            <p class="stats-section-lead">A filled cell means that player picked the same answer as you, and shows how many points that question is worth. Out of ${formatScore(totalScore)} possible points.</p>
          </div>
          <label class="stats-sort">
            <span>Sort by</span>
            <select data-stat-action="sort">${sortOptions}</select>
          </label>
        </header>
        <div class="matrix-wrap">
          <table class="matrix-table">
            <caption class="visually-hidden">Match points for all ${players.length} players across the eight questions, sorted by ${escapeHtml(sortKey)}</caption>
            <thead>
              <tr>
                <th class="matrix-player-head" scope="col">Player</th>
                ${header}
                <th class="matrix-total-head" scope="col">Total</th>
              </tr>
            </thead>
            <tbody>${body}</tbody>
          </table>
        </div>
        <ul class="matrix-legend">
          <li><span class="legend-swatch is-w3"></span>3 pts question</li>
          <li><span class="legend-swatch is-w15"></span>1.5 pts question</li>
          <li><span class="legend-swatch is-w1"></span>1 pt question</li>
          <li><span class="legend-swatch is-miss"></span>No match</li>
        </ul>
      </section>
    `;
  }

  function counterfactualMarkup(questions, totalScore, answers) {
    const data = counterfactuals(session.players, questions, totalScore, answers);

    const cards = data
      .map((entry) => {
        const rows = entry.alternatives
          .map((alternative) => {
            const changeClass = alternative.dethroned
              ? alternative.gained
                ? "is-up"
                : "is-down"
              : alternative.delta === 0
                ? "is-flat"
                : alternative.delta > 0
                  ? "is-up"
                  : "is-down";

            const chip = alternative.dethroned
              ? `Crown moves to ${escapeHtml(toTitleCase(alternative.next.name))}`
              : `${escapeHtml(toTitleCase(entry.leader.name))} ${signed(alternative.delta)} pts`;

            const baselineWidth = Math.min(100, (entry.leader.score / totalScore) * 100);
            const nextWidth = Math.min(100, (alternative.next.score / totalScore) * 100);

            return `
              <li class="cf-row">
                <div class="cf-row-head">
                  <span class="cf-opt-letter" aria-hidden="true">${escapeHtml(alternative.option.letter)}</span>
                  <span class="cf-opt-label">${escapeHtml(alternative.option.label)}</span>
                  <span class="cf-chip ${changeClass}">${chip}</span>
                </div>
                <div class="cf-bars">
                  <div class="cf-bar-line">
                    <span class="cf-bar-name">Now</span>
                    <span class="cf-track"><span class="cf-bar is-baseline" style="width:${baselineWidth}%"></span></span>
                    <span class="cf-bar-score">${formatScore(entry.leader.score)}</span>
                  </div>
                  <div class="cf-bar-line">
                    <span class="cf-bar-name">If changed</span>
                    <span class="cf-track"><span class="cf-bar is-next ${changeClass}" style="width:${nextWidth}%"></span></span>
                    <span class="cf-bar-score">${formatScore(alternative.next.score)}</span>
                  </div>
                </div>
                <p class="cf-runner">Then number two would be ${escapeHtml(toTitleCase(alternative.ranked[1] ? alternative.ranked[1].name : "-"))} on ${formatScore(alternative.ranked[1] ? alternative.ranked[1].score : 0)} pts</p>
              </li>
            `;
          })
          .join("");

        return `
          <article class="cf-card">
            <header class="cf-head">
              <span class="cf-index">Q${entry.index + 1}</span>
              <div>
                <h3 class="cf-title">${escapeHtml(entry.question.title)}</h3>
                <p class="cf-chosen">You answered: ${escapeHtml(entry.question.options.find((option) => option.value === entry.chosen)?.label || entry.chosen)}</p>
              </div>
            </header>
            <ul class="cf-rows">${rows}</ul>
          </article>
        `;
      })
      .join("");

    return `
      <section class="surface-card stats-section p-4 p-md-5" aria-labelledby="stats-cf-title">
        <header class="stats-section-head">
          <div>
            <span class="eyebrow">Counterfactual</span>
            <h2 class="stats-section-title" id="stats-cf-title">What if you changed one answer?</h2>
            <p class="stats-section-lead">Each card swaps a single answer and re-runs the whole quiz, so you can see which questions actually decide your player.</p>
          </div>
        </header>
        <div class="cf-grid">${cards}</div>
      </section>
    `;
  }

  function rarityMarkup(questions, answers, players) {
    const rows = rarityRows(players, questions, answers);
    const list = rows
      .map(
        (row) => `
        <li class="rarity-row">
          <span class="rarity-q">Q${row.index + 1}</span>
          <span class="rarity-label">${escapeHtml(row.question.options.find((option) => option.value === row.chosen)?.label || row.chosen)}</span>
          <span class="rarity-track"><span class="rarity-bar" style="width:${row.percentage}%"></span></span>
          <span class="rarity-count">${row.count}/${players.length}</span>
          <span class="rarity-tag">${row.count <= 4 ? "Rare pick" : row.count >= 10 ? "Common pick" : "Balanced"}</span>
        </li>
      `,
      )
      .join("");

    const rarest = rows.reduce((lowest, row) => (row.rarest < lowest.rarest ? row : lowest), rows[0]);

    return `
      <section class="surface-card stats-section p-4 p-md-5" aria-labelledby="stats-rarity-title">
        <header class="stats-section-head">
          <div>
            <span class="eyebrow">Field comparison</span>
            <h2 class="stats-section-title" id="stats-rarity-title">How common are your answers?</h2>
            <p class="stats-section-lead">How many of the ${players.length} players chose what you chose. Rare picks are what separate your match from the crowd.</p>
          </div>
        </header>
        <div class="chart-wrapper stats-chart-tall">
          <canvas id="rarityChart" role="img" aria-label="Bar chart of how many players share each of your answers">How common your answers are.</canvas>
        </div>
        <ul class="rarity-list">${list}</ul>
        <p class="rarity-footnote">Your rarest answer is <b>Q${rarest.index + 1}</b>, shared by only ${rarest.rarest} of ${players.length} players.</p>
      </section>
    `;
  }

  function spreadMarkup(ranked, totalScore) {
    const spread = spreadBuckets(ranked, totalScore);
    const leaders = ranked.filter((player) => player.score === ranked[0].score).length;
    const tail = ranked.filter((player) => player.score <= ranked[0].score / 2).length;

    return `
      <section class="surface-card stats-section p-4 p-md-5" aria-labelledby="stats-spread-title">
        <header class="stats-section-head">
          <div>
            <span class="eyebrow">Spread</span>
            <h2 class="stats-section-title" id="stats-spread-title">How the whole field scored</h2>
            <p class="stats-section-lead">Every player bucketed by final score. A tight cluster near your leader means the quiz picked a clear winner.</p>
          </div>
        </header>
        <div class="chart-wrapper">
          <canvas id="spreadChart" role="img" aria-label="Histogram of all player scores">Distribution of all player scores.</canvas>
        </div>
        <div class="stats-mini-grid">
          <div class="stats-mini"><span class="stats-mini-value">${leaders}</span><span class="stats-mini-label">Players at the top score</span></div>
          <div class="stats-mini"><span class="stats-mini-value">${tail}</span><span class="stats-mini-label">Players at half the top score or less</span></div>
        </div>
      </section>
    `;
  }

  function shapeMarkup(ranked, questions) {
    const podium = ranked.slice(0, 3);

    return `
      <section class="surface-card stats-section p-4 p-md-5" aria-labelledby="stats-shape-title">
        <header class="stats-section-head">
          <div>
            <span class="eyebrow">Profile shape</span>
            <h2 class="stats-section-title" id="stats-shape-title">Where your top three get their points</h2>
            <p class="stats-section-lead">Each spoke is one question, scaled against that player's strongest question, so you can compare shapes rather than totals.</p>
          </div>
        </header>
        <div class="chart-wrapper stats-chart-radar">
          <canvas id="shapeChart" role="img" aria-label="Radar chart comparing the question profile shape of your top three players">Profile shape of your top three matches.</canvas>
        </div>
        <ul class="shape-legend">
          ${podium
            .map(
              (player, index) => `
            <li class="shape-legend-row is-p${index + 1}">
              <span class="shape-swatch"></span>
              <span class="shape-name">${escapeHtml(toTitleCase(player.name))}</span>
              <span class="shape-note">Strongest on Q${player.cells.indexOf(Math.max(...player.cells)) + 1}, weakest on Q${player.cells.indexOf(Math.min(...player.cells)) + 1}</span>
            </li>
          `,
            )
            .join("")}
        </ul>
      </section>
    `;
  }

  function rivalMarkup(ranked, questions, answers, imageBase, totalScore) {
    const leader = ranked[0];
    const rival = ranked[1];
    const rows = disagreementRows(leader, questions, answers);
    const rivalRows = rival ? disagreementRows(rival, questions, answers) : [];
    const lost = round(rows.reduce((total, row) => total + row.weight, 0));

    return `
      <section class="surface-card stats-section p-4 p-md-5" aria-labelledby="stats-rival-title">
        <header class="stats-section-head">
          <div>
            <span class="eyebrow">Gap analysis</span>
            <h2 class="stats-section-title" id="stats-rival-title">Where your match earns and loses points</h2>
            <p class="stats-section-lead">The exact questions separating your number one from the field.</p>
          </div>
        </header>
        <div class="rival-heads">
          ${[leader, rival]
            .filter(Boolean)
            .map(
              (player, index) => `
            <div class="rival-head ${index === 0 ? "is-leader" : ""}">
              <img class="rival-thumb" src="${imageUrl(imageBase, player.image)}" alt="" width="64" height="64" loading="lazy" decoding="async">
              <div>
                <span class="rival-tag">${index === 0 ? "Number one" : "Closest rival"}</span>
                <span class="rival-name">${escapeHtml(toTitleCase(player.name))}</span>
                <span class="rival-score">${formatScore(player.score)} pts / ${formatPercentage(player.percentage)}%</span>
              </div>
            </div>
          `,
            )
            .join("")}
        </div>
        <div class="rival-columns">
          <div class="rival-col">
            <h3 class="rival-col-title">${escapeHtml(toTitleCase(leader.name))} misses on ${rows.length} question${rows.length === 1 ? "" : "s"}</h3>
            ${
              rows.length === 0
                ? `<p class="rival-perfect">Perfect profile. This player matches all eight of your answers.</p>`
                : `<ul class="rival-list">${rows
                    .map(
                      (row) => `
                  <li class="rival-row">
                    <span class="rival-q">Q${row.index + 1}</span>
                    <span class="rival-question">${escapeHtml(row.question.title)}</span>
                    <span class="rival-gap">-${formatScore(row.weight)} pts</span>
                    <span class="rival-theirs">They answered ${escapeHtml(row.question.options.find((option) => option.value === leader[row.question.playerField])?.label || "-")}</span>
                  </li>
                `,
                    )
                    .join("")}</ul>`
            }
            <p class="rival-total">That is <b>${formatScore(lost)} pts</b> left on the table, which is ${formatPercentage((lost / totalScore) * 100)}% of the total score.</p>
          </div>
          <div class="rival-col">
            <h3 class="rival-col-title">${escapeHtml(toTitleCase(rival ? rival.name : "-"))} is held back by ${rivalRows.length} answer${rivalRows.length === 1 ? "" : "s"}</h3>
            ${
              rivalRows.length === 0
                ? `<p class="rival-perfect">Identical profile to you across all eight questions.</p>`
                : `<ul class="rival-list">${rivalRows
                    .map(
                      (row) => `
                  <li class="rival-row">
                    <span class="rival-q">Q${row.index + 1}</span>
                    <span class="rival-question">${escapeHtml(row.question.title)}</span>
                    <span class="rival-gap">-${formatScore(row.weight)} pts</span>
                    <span class="rival-theirs">They answered ${escapeHtml(row.question.options.find((option) => option.value === rival[row.question.playerField])?.label || "-")}</span>
                  </li>
                `,
                    )
                    .join("")}</ul>`
            }
            <p class="rival-total">Flip <b>${rivalRows.length}</b> of these answers to hand them the top spot.</p>
          </div>
        </div>
      </section>
    `;
  }

  function destroyCharts() {
    while (liveCharts.length) {
      const instance = liveCharts.pop();
      if (instance && typeof instance.destroy === "function") {
        instance.destroy();
      }
    }
  }

  function baseChartOptions(reduceMotion) {
    return {
      responsive: true,
      maintainAspectRatio: false,
      animation: reduceMotion
        ? false
        : {
            duration: 700,
            easing: "easeOutQuart",
            delay: (context) => (context.type === "data" ? 120 + context.dataIndex * 40 : 0),
          },
    };
  }

  function axisTheme() {
    return {
      ticks: { color: "#8fa3bd", font: { family: "Barlow Condensed, Arial Narrow, sans-serif", size: 14 } },
      grid: { color: "rgba(148, 176, 219, 0.1)" },
      border: { display: false },
    };
  }

  function tooltipTheme() {
    return {
      backgroundColor: "rgba(2, 6, 23, 0.94)",
      titleColor: "#f8fafc",
      bodyColor: "#bae6fd",
      padding: 12,
      cornerRadius: 2,
      borderColor: "rgba(103, 232, 249, 0.28)",
      borderWidth: 1,
    };
  }

  function mountRarityChart(questions, answers, players) {
    const canvas = document.getElementById("rarityChart");
    if (!canvas || !window.Chart) {
      return;
    }
    const rows = rarityRows(players, questions, answers);
    liveCharts.push(
      new window.Chart(canvas, {
        type: "bar",
        data: {
          labels: rows.map((row) => `Q${row.index + 1}`),
          datasets: [
            {
              label: "Players sharing your answer",
              data: rows.map((row) => row.count),
              backgroundColor: rows.map((row) =>
                row.count <= 4 ? "rgba(244, 114, 182, 0.85)" : row.count >= 10 ? "rgba(148, 176, 219, 0.5)" : "rgba(103, 232, 249, 0.85)",
              ),
              borderColor: "#e0f2fe",
              borderWidth: 1,
              borderRadius: 6,
              borderSkipped: false,
              maxBarThickness: 46,
            },
          ],
        },
        options: {
          ...baseChartOptions(session.reduceMotion),
          scales: { x: axisTheme(), y: { ...axisTheme(), beginAtZero: true, suggestedMax: players.length } },
          plugins: {
            legend: { display: false },
            tooltip: {
              ...tooltipTheme(),
              callbacks: {
                label: (context) => {
                  const row = rows[context.dataIndex];
                  const label = row.question.options.find((option) => option.value === row.chosen)?.label || row.chosen;
                  return ` ${row.count} of ${players.length} players: ${label}`;
                },
              },
            },
          },
        },
      }),
    );
  }

  function mountSpreadChart(ranked, totalScore) {
    const canvas = document.getElementById("spreadChart");
    if (!canvas || !window.Chart) {
      return;
    }
    const spread = spreadBuckets(ranked, totalScore);
    const top = Math.max(...ranked.map((player) => player.score));
    liveCharts.push(
      new window.Chart(canvas, {
        type: "bar",
        data: {
          labels: spread.labels,
          datasets: [
            {
              label: "Players",
              data: spread.values,
              backgroundColor: spread.labels.map((label) => {
                const lower = Number.parseFloat(label);
                return lower >= top - 1 ? "rgba(103, 232, 249, 0.9)" : "rgba(59, 130, 246, 0.55)";
              }),
              borderColor: "#e0f2fe",
              borderWidth: 1,
              borderRadius: 4,
              borderSkipped: false,
            },
          ],
        },
        options: {
          ...baseChartOptions(session.reduceMotion),
          scales: {
            x: { ...axisTheme(), ticks: { ...axisTheme().ticks, maxRotation: 0, autoSkip: true, maxTicksLimit: 12 } },
            y: { ...axisTheme(), beginAtZero: true, ticks: { ...axisTheme().ticks, stepSize: 1, precision: 0 } },
          },
          plugins: {
            legend: { display: false },
            tooltip: {
              ...tooltipTheme(),
              callbacks: {
                title: (items) => `${items[0].label} points`,
                label: (context) => ` ${context.parsed.y} player${context.parsed.y === 1 ? "" : "s"}`,
              },
            },
          },
        },
      }),
    );
  }

  function mountShapeChart(ranked, questions) {
    const canvas = document.getElementById("shapeChart");
    if (!canvas || !window.Chart) {
      return;
    }
    const podium = ranked.slice(0, 3);
    const colors = [
      [103, 232, 249],
      [59, 130, 246],
      [129, 140, 248],
    ];

    liveCharts.push(
      new window.Chart(canvas, {
        type: "radar",
        data: {
          labels: questions.map((question, index) => `Q${index + 1}`),
          datasets: podium.map((player, index) => ({
            label: toTitleCase(player.name),
            data: shapeSeries(player, questions),
            borderColor: `rgba(${colors[index].join(", ")}, 0.9)`,
            backgroundColor: `rgba(${colors[index].join(", ")}, 0.14)`,
            pointBackgroundColor: `rgba(${colors[index].join(", ")}, 1)`,
            pointBorderColor: "#040810",
            pointRadius: 3,
            borderWidth: 2,
          })),
        },
        options: {
          ...baseChartOptions(session.reduceMotion),
          scales: {
            r: {
              beginAtZero: true,
              max: 100,
              angleLines: { color: "rgba(148, 176, 219, 0.16)" },
              grid: { color: "rgba(148, 176, 219, 0.14)" },
              pointLabels: { color: "#c6d3e4", font: { family: "Barlow Condensed, Arial Narrow, sans-serif", size: 15, weight: "600" } },
              ticks: { display: false, stepSize: 25 },
            },
          },
          plugins: {
            legend: { display: false },
            tooltip: {
              ...tooltipTheme(),
              callbacks: {
                label: (context) => ` ${context.dataset.label}: ${context.parsed.r} of their peak`,
              },
            },
          },
        },
      }),
    );
  }

  function mountCharts(ranked, questions) {
    if (!window.Chart) {
      document.querySelectorAll(".chart-wrapper").forEach((wrapper) => {
        const note = document.createElement("p");
        note.textContent = "Charts need an internet connection to load. Every table above still works offline.";
        wrapper.appendChild(note);
      });
      return;
    }
    mountRarityChart(questions, session.answers, session.players);
    mountSpreadChart(ranked, session.totalScore);
    mountShapeChart(ranked, questions);
  }

  function render() {
    if (!session) {
      return;
    }

    const { container, players, questions, totalScore, answers, imageBase } = session;
    const ranked = rankPlayers(players, questions, totalScore, answers);
    const dirty = answers.some((answer, index) => answer.value !== session.saved[index].value);

    const scrollY = window.scrollY || window.pageYOffset || 0;
    const anchor = document.activeElement;
    const focusToken =
      anchor && anchor.dataset && anchor.dataset.statAction === "set"
        ? { index: anchor.dataset.questionIndex, value: anchor.dataset.answerValue }
        : null;

    destroyCharts();

    container.innerHTML = `
      <div class="container page-container py-4 py-md-5">
        <div class="stats-view">
          <header class="stats-head">
            <div>
              <span class="eyebrow">Match analytics</span>
              <h1 class="question-title stats-title" tabindex="-1">Your match, in detail</h1>
              <p class="stats-lead">Every player scored against your eight answers. Change an answer and the whole page recalculates so you can see what each question is really worth.</p>
            </div>
            <div class="stats-head-actions">
              <a class="btn btn-ghost" href="#/results">Back to results</a>
              <button type="button" class="btn btn-ghost" data-action="retake">Retake quiz</button>
            </div>
          </header>
          ${kpiMarkup(ranked, questions, answers, totalScore)}
          ${editorMarkup(questions, answers, dirty)}
          ${matrixMarkup(players, questions, ranked, totalScore, imageBase, session.sortKey)}
          ${counterfactualMarkup(questions, totalScore, answers)}
          <div class="stats-2col">
            ${rarityMarkup(questions, answers, players)}
            ${spreadMarkup(ranked, totalScore)}
          </div>
          <div class="stats-2col">
            ${shapeMarkup(ranked, questions)}
            ${rivalMarkup(ranked, questions, answers, imageBase, totalScore)}
          </div>
          <section class="surface-card stats-section stats-export p-4 p-md-5">
            <div>
              <span class="eyebrow">Raw data</span>
              <h2 class="stats-section-title">Your answer fingerprint</h2>
              <p class="stats-section-lead">The exact eight answers every graph above is calculated from.</p>
            </div>
            <ol class="fingerprint">
              ${questions
                .map((question, index) => {
                  const option = question.options.find((item) => item.value === answers[index].value);
                  return `
                    <li class="fingerprint-row">
                      <span class="fingerprint-q">Q${index + 1}</span>
                      <span class="fingerprint-title">${escapeHtml(question.title)}</span>
                      <span class="fingerprint-answer">${escapeHtml(option ? option.label : answers[index].value)}</span>
                      <span class="fingerprint-weight">${formatScore(question.weight)} pts</span>
                    </li>
                  `;
                })
                .join("")}
            </ol>
          </section>
        </div>
      </div>
    `;

    mountCharts(ranked, questions);

    if (focusToken) {
      const target = container.querySelector(
        `[data-stat-action="set"][data-question-index="${focusToken.index}"][data-answer-value="${CSS.escape(focusToken.value)}"]`,
      );
      if (target) {
        target.focus({ preventScroll: true });
      }
    }

    if (scrollY) {
      window.scrollTo({ top: scrollY, behavior: "auto" });
    }
  }

  function onClick(event) {
    if (!session || !(event.target instanceof Element)) {
      return;
    }
    const trigger = event.target.closest("[data-stat-action]");
    if (!trigger || !session.container.contains(trigger)) {
      return;
    }
    const action = trigger.dataset.statAction;

    if (action === "set") {
      const index = Number(trigger.dataset.questionIndex);
      const value = trigger.dataset.answerValue;
      const question = session.questions[index];
      if (!question || !question.validAnswers.includes(value)) {
        return;
      }
      if (session.answers[index].value !== value) {
        session.answers[index] = { key: question.key, value };
        render();
      }
      return;
    }

    if (action === "save") {
      if (typeof session.onSave === "function") {
        session.onSave(session.answers.map((answer) => ({ ...answer })));
      }
      session.saved = session.answers.map((answer) => ({ ...answer }));
      render();
      return;
    }

    if (action === "reset") {
      session.answers = session.saved.map((answer) => ({ ...answer }));
      render();
    }
  }

  function onChange(event) {
    if (!session || !(event.target instanceof Element)) {
      return;
    }
    if (event.target.dataset && event.target.dataset.statAction === "sort") {
      session.sortKey = event.target.value;
      render();
    }
  }

  function start(config) {
    if (session) {
      session.container.removeEventListener("click", onClick);
      session.container.removeEventListener("change", onChange);
    }
    destroyCharts();

    session = {
      container: config.container,
      players: config.players,
      questions: config.questions,
      totalScore: config.totalScore,
      imageBase: config.imageBase,
      reduceMotion: Boolean(config.reduceMotion),
      onSave: config.onSave,
      answers: config.answers.map((answer) => ({ ...answer })),
      saved: config.answers.map((answer) => ({ ...answer })),
      sortKey: "score",
    };

    session.container.addEventListener("click", onClick);
    session.container.addEventListener("change", onChange);
    render();
  }

  function stop() {
    if (session) {
      session.container.removeEventListener("click", onClick);
      session.container.removeEventListener("change", onChange);
    }
    destroyCharts();
    session = null;
  }

  window.PlayerMatchStats = { start, stop };
})();
