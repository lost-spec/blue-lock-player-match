/*
 * Player dossier page.
 *
 * Renders the researched profiles in dossier-data.js. Follows the same module
 * contract as stats.js: window.PlayerMatchDossier = { start, stop }.
 *
 * The page deliberately distinguishes three kinds of content:
 *   - SOURCED      transcribed from the player's bluelock.guide page
 *   - DERIVED      playLike, synthesised from documented weapons/position
 *   - NOT PUBLISHED no source text exists, so nothing is shown but a pointer
 *                   to Scout's live research
 */
(function () {
  "use strict";

  let session = null;

  const DATA = window.PLAYER_MATCH_DOSSIER_DATA;

  function escapeHtml(value) {
    return String(value == null ? "" : value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function toList(value) {
    if (!value) return [];
    return Array.isArray(value) ? value : [value];
  }

  function field(label, value) {
    if (value == null || value === "") return "";
    return `
        <div class="dossier-field">
          <dt class="dossier-field-label">${escapeHtml(label)}</dt>
          <dd class="dossier-field-value">${escapeHtml(value)}</dd>
        </div>`;
  }

  function provenanceBlock() {
    const meta = DATA.meta;
    return `
      <section class="dossier-provenance" aria-labelledby="dossier-prov-heading">
        <h2 id="dossier-prov-heading" class="dossier-prov-heading">
          Where this page comes from
        </h2>
        <p class="dossier-prov-lead">
          Every biography, philosophy, mindset and title below was retrieved from
          each player's own profile page and is linked at the foot of that player.
          Nothing here was written from memory. Where a source publishes no
          narrative, this page says so instead of filling the gap.
        </p>
        <dl class="dossier-prov-grid">
          <div class="dossier-field">
            <dt class="dossier-field-label">Primary source</dt>
            <dd class="dossier-field-value">
              <a class="dossier-source-link" href="${escapeHtml(meta.sourceIndex)}"
                 target="_blank" rel="noopener noreferrer">${escapeHtml(meta.primarySource)}</a>
            </dd>
          </div>
          <div class="dossier-field">
            <dt class="dossier-field-label">Retrieved</dt>
            <dd class="dossier-field-value">${escapeHtml(meta.researchedOn)}</dd>
          </div>
          <div class="dossier-field">
            <dt class="dossier-field-label">Players</dt>
            <dd class="dossier-field-value">${DATA.players.length}</dd>
          </div>
          <div class="dossier-field">
            <dt class="dossier-field-label">Method</dt>
            <dd class="dossier-field-value dossier-prov-method">${escapeHtml(meta.method)}</dd>
          </div>
        </dl>
        <details class="dossier-prov-caveats">
          <summary class="dossier-prov-summary">
            ${meta.caveats.length} known limitations of this source
          </summary>
          <ul class="dossier-prov-list">
            ${meta.caveats.map((c) => `<li>${escapeHtml(c)}</li>`).join("")}
          </ul>
        </details>
        <p class="dossier-prov-legend">
          <span class="dossier-tag tag-sourced">Sourced</span>
          transcribed from the linked profile.
          <span class="dossier-tag tag-derived">Derived</span>
          practical guidance built from documented abilities, not canon text.
        </p>
      </section>`;
  }

  function card(player, imageBase) {
    const titles = toList(player.titles);
    const lead = titles[0] || (player.rank ? `Blue Lock ${player.rank}` : player.position[0]);
    const thin = !player.philosophy;
    return `
      <li class="dossier-card${thin ? " is-thin" : ""}">
        <button type="button" class="dossier-card-btn" data-dossier-open="${escapeHtml(player.id)}"
                aria-expanded="false" aria-controls="dossier-detail">
          <span class="dossier-card-media">
            <img class="dossier-card-img" src="${escapeHtml(imageBase)}${escapeHtml(player.id)}.jpg"
                 alt="${escapeHtml(player.name)}" loading="lazy" decoding="async">
            ${player.rank ? `<span class="dossier-card-rank">${escapeHtml(player.rank)}</span>` : ""}
          </span>
          <span class="dossier-card-body">
            <span class="dossier-card-name">${escapeHtml(player.name)}</span>
            <span class="dossier-card-title">${escapeHtml(lead)}</span>
            <span class="dossier-card-meta">${escapeHtml(player.position.join(" / "))}</span>
            ${thin ? '<span class="dossier-card-flag">No published profile</span>' : ""}
          </span>
        </button>
      </li>`;
  }

  function detail(player) {
    const titles = toList(player.titles);
    const weapons = toList(player.weapon);
    const thin = !player.philosophy;

    const section = (label, body, note) => `
      <section class="dossier-section">
        <h3 class="dossier-section-title">${escapeHtml(label)}</h3>
        ${note ? `<p class="dossier-section-note">${escapeHtml(note)}</p>` : ""}
        ${body}
      </section>`;

    const prose = (text) =>
      text ? `<p class="dossier-prose">${escapeHtml(text)}</p>` : "";

    const moments = toList(player.moments);
    const relatives = toList(player.relatives);
    const playLike = toList(player.playLike);

    const missingNotice = thin
      ? `<div class="dossier-missing">
           <p class="dossier-missing-title">No published narrative for this player</p>
           <p class="dossier-missing-body">
             The source has no scouting report for ${escapeHtml(player.name)}, so there is
             no biography, philosophy or mindset to quote. Rather than invent one, this
             page lists only what is documented. Ask Scout a question about him and it
             will research the sources live.
           </p>
         </div>`
      : "";

    return `
      <article class="dossier-detail-inner" data-dossier-detail="${escapeHtml(player.id)}">
        <header class="dossier-detail-head">
          <img class="dossier-detail-img" src="${escapeHtml(player.imageBase || "")}${escapeHtml(player.id)}.jpg"
               alt="${escapeHtml(player.name)}" decoding="async">
          <div class="dossier-detail-heading">
            <p class="dossier-detail-eyebrow">${escapeHtml(player.club || "Blue Lock")}</p>
            <h2 class="dossier-detail-name">${escapeHtml(player.name)}</h2>
            <p class="dossier-detail-pos">${escapeHtml(player.position.join(" / "))}</p>
            ${player.rank ? `<p class="dossier-detail-rank">Blue Lock rank ${escapeHtml(player.rank)}</p>` : ""}
            ${
              titles.length
                ? `<ul class="dossier-titles" aria-label="Known as">
                     ${titles.map((t) => `<li class="dossier-title-chip">${escapeHtml(t)}</li>`).join("")}
                   </ul>`
                : '<p class="dossier-no-titles">No titles are listed for this player on the source.</p>'
            }
          </div>
        </header>

        ${missingNotice}

        <section class="dossier-section">
          <h3 class="dossier-section-title">Personal record</h3>
          <dl class="dossier-fields">
            ${field("Age", player.age)}
            ${field("Height", player.height)}
            ${field("Birthday", player.birthday)}
            ${field("Blood type", player.bloodType)}
            ${field("Relatives", relatives.length ? relatives.join(", ") : null)}
            ${field("Current club", player.club)}
          </dl>
        </section>

        ${
          weapons.length
            ? section(
                "Weapon",
                `<ul class="dossier-weapons">${weapons
                  .map((w) => `<li class="dossier-weapon">${escapeHtml(w)}</li>`)
                  .join("")}</ul>`,
                "The abilities the source lists as this player's core strengths."
              )
            : ""
        }

        ${
          player.philosophy
            ? section("Philosophy", prose(player.philosophy))
            : ""
        }
        ${player.biography ? section("Background", prose(player.biography)) : ""}
        ${player.mindset ? section("Mindset", prose(player.mindset)) : ""}

        ${
          moments.length
            ? section(
                "Defining moments",
                `<ul class="dossier-moments">${moments
                  .map((m) => `<li class="dossier-moment">${escapeHtml(m)}</li>`)
                  .join("")}</ul>`,
                "As recorded in the source's match and event history."
              )
            : ""
        }

        ${
          playLike.length
            ? section(
                "How to play like them",
                `<ul class="dossier-playlike">${playLike
                  .map((p) => `<li class="dossier-playlike-item">${escapeHtml(p)}</li>`)
                  .join("")}</ul>`,
                "Derived from the documented weapon and position above. This is practical guidance, not something the character says in the show."
              )
            : ""
        }

        <footer class="dossier-detail-foot">
          ${
            player.researchNote
              ? `<p class="dossier-research-note"><strong>Research note.</strong> ${escapeHtml(player.researchNote)}</p>`
              : ""
          }
          <p class="dossier-source">
            Source:
            <a class="dossier-source-link" href="${escapeHtml(player.source)}"
               target="_blank" rel="noopener noreferrer">${escapeHtml(player.source)}</a>
          </p>
        </footer>
      </article>`;
  }

  function start(config) {
    const { container, imageBase, reduceMotion } = config;
    if (!container || !DATA || !DATA.players) return;

    const players = DATA.players.map((p) => ({ ...p, imageBase }));

    const controls = `
      <div class="dossier-controls">
        <div class="dossier-search-wrap">
          <label class="dossier-search-label" for="dossier-search">Search players or titles</label>
          <input class="dossier-search" id="dossier-search" type="search"
                 placeholder="e.g. ninja, logic demon, speed" autocomplete="off">
        </div>
        <div class="dossier-filters" role="group" aria-label="Filter by role">
          <button type="button" class="dossier-filter is-active" data-dossier-filter="all">All</button>
          <button type="button" class="dossier-filter" data-dossier-filter="attack">Attack</button>
          <button type="button" class="dossier-filter" data-dossier-filter="midfield">Midfield</button>
          <button type="button" class="dossier-filter" data-dossier-filter="defence">Defence</button>
        </div>
      </div>`;

    container.innerHTML = `
      <div class="dossier-view">
        <header class="dossier-head">
          <p class="dossier-eyebrow">Research dossier</p>
          <h1 class="dossier-title">Philosophy, titles and how to play like them</h1>
          <p class="dossier-lead">
            ${players.length} players, profiled from published sources. Titles, philosophy,
            background and mindset are transcribed from each player's own reference page.
            Open a player for their record, their defining moments and practical guidance
            built from their documented abilities.
          </p>
        </header>

        ${provenanceBlock()}
        ${controls}

        <p class="dossier-result-count" role="status" aria-live="polite"></p>
        <ul class="dossier-grid" data-dossier-grid></ul>

        <section class="dossier-detail" id="dossier-detail" hidden aria-live="polite"></section>
      </div>`;

    const grid = container.querySelector("[data-dossier-grid]");
    const detailEl = container.querySelector("#dossier-detail");
    const search = container.querySelector("#dossier-search");
    const countEl = container.querySelector(".dossier-result-count");

    let activeId = null;
    let roleFilter = "all";
    let term = "";

    function roleOf(player) {
      const p = player.position.join(" ").toLowerCase();
      const defence = /(defender|center back|centre back|center-back|sideback|side back|full back|right back|left back|goalkeeper|keeper)/.test(p);
      const midfield = /(midfield|defensive mid|offensive mid|attacking mid|central mid|centre mid|quarterback)/.test(p);
      if (defence) return "defence";
      if (midfield) return "midfield";
      return "attack";
    }

    function matches(player) {
      if (roleFilter !== "all" && roleOf(player) !== roleFilter) return false;
      if (!term) return true;
      const haystack = [
        player.name,
        ...toList(player.titles),
        ...toList(player.weapon),
        player.position.join(" "),
        player.club || "",
      ]
        .join(" ")
        .toLowerCase();
      return haystack.includes(term);
    }

    function renderGrid() {
      const shown = players.filter(matches);
      grid.innerHTML = shown.map((p) => card(p, imageBase)).join("");
      countEl.textContent =
        shown.length === players.length
          ? `Showing all ${shown.length} players`
          : `Showing ${shown.length} of ${players.length} players`;

      if (activeId && !shown.some((p) => p.id === activeId)) closeDetail();
    }

    function openDetail(id) {
      const player = players.find((p) => p.id === id);
      if (!player) return;
      activeId = id;
      detailEl.innerHTML = detail(player);
      detailEl.hidden = false;
      grid.querySelectorAll("[data-dossier-open]").forEach((btn) => {
        const on = btn.dataset.dossierOpen === id;
        btn.setAttribute("aria-expanded", on ? "true" : "false");
        btn.closest(".dossier-card").classList.toggle("is-open", on);
      });
      if (!reduceMotion) {
        detailEl.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }

    function closeDetail() {
      activeId = null;
      detailEl.hidden = true;
      detailEl.innerHTML = "";
      grid.querySelectorAll("[data-dossier-open]").forEach((btn) => {
        btn.setAttribute("aria-expanded", "false");
        btn.closest(".dossier-card").classList.remove("is-open");
      });
    }

    function onClick(event) {
      const openBtn = event.target.closest("[data-dossier-open]");
      if (openBtn) {
        const id = openBtn.dataset.dossierOpen;
        if (activeId === id) closeDetail();
        else openDetail(id);
        return;
      }

      const filterBtn = event.target.closest("[data-dossier-filter]");
      if (filterBtn) {
        roleFilter = filterBtn.dataset.dossierFilter;
        container.querySelectorAll("[data-dossier-filter]").forEach((b) => {
          b.classList.toggle("is-active", b === filterBtn);
        });
        renderGrid();
        return;
      }

      if (event.target.closest("[data-dossier-close]")) closeDetail();
    }

    function onInput(event) {
      if (event.target.id !== "dossier-search") return;
      term = event.target.value.trim().toLowerCase();
      renderGrid();
    }

    function onKeydown(event) {
      if (event.key === "Escape" && activeId) {
        closeDetail();
        return;
      }
      if (event.key !== "Enter" && event.key !== " ") return;
      const btn = event.target.closest("[data-dossier-open]");
      if (!btn) return;
      event.preventDefault();
      const id = btn.dataset.dossierOpen;
      if (activeId === id) closeDetail();
      else openDetail(id);
    }

    container.addEventListener("click", onClick);
    container.addEventListener("input", onInput);
    container.addEventListener("keydown", onKeydown);

    renderGrid();

    session = {
      container,
      onClick,
      onInput,
      onKeydown,
      closeDetail,
    };
  }

  function stop() {
    if (!session) return;
    const { container, onClick, onInput, onKeydown, closeDetail } = session;
    container.removeEventListener("click", onClick);
    container.removeEventListener("input", onInput);
    container.removeEventListener("keydown", onKeydown);
    container.innerHTML = "";
    closeDetail();
    session = null;
  }

  window.PlayerMatchDossier = { start, stop };
})();
