/* Content sections: quotes, problem finder, laws, official sources, Q&A, quiz, practice, clients.
   Everything re-renders when the language changes (see i18n.js). */
/* global QUOTES, SOLUTIONS, LAWS, FAQS, QUIZ, PRACTICE, CLIENTS, OFFICIAL, OFFICIAL_LAWS_INDEX, CAT_ICON,
          CAT_BN, QUOTES_BN, SOLUTIONS_BN, LAWS_BN, FAQS_BN, QUIZ_BN, PRACTICE_BN, OFFICIAL_BN, I18N */
(() => {
  "use strict";

  const QUOTE_INTERVAL_MS = 7000;
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];
  const t = (k, v) => I18N.t(k, v);
  const bn = () => I18N.isBn();
  const n = (x) => I18N.num(x);

  const escapeHtml = (str) =>
    String(str).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const escapeRegExp = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const highlight = (text, query) => {
    const safe = escapeHtml(text);
    if (!query) return safe;
    return safe.replace(new RegExp(`(${escapeRegExp(escapeHtml(query))})`, "gi"), "<mark>$1</mark>");
  };
  const ico = (name) => `<span class="ico" data-ico="${name}" aria-hidden="true"></span>`;
  const catLabel = (c) => (bn() ? CAT_BN[c] || c : c);

  /* ---------- Localised views of the data ---------- */
  const quoteAt = (i) => (bn() ? { ...QUOTES_BN[i], bnLine: "" } : { ...QUOTES[i], bnLine: QUOTES[i].bn || "" });
  const solution = (s) => (bn() ? { ...s, ...SOLUTIONS_BN[s.id], sub: s.title } : { ...s, sub: s.bn });
  const lawAt = (i) => {
    const l = LAWS[i];
    return bn() ? { ...l, ...LAWS_BN[i], name: l.bn, sub: l.name } : { ...l, sub: l.bn };
  };
  const faqAt = (i) => (bn() ? { ...FAQS[i], ...FAQS_BN[i] } : FAQS[i]);
  const quizAt = (i) => (bn() ? { ...QUIZ[i], ...QUIZ_BN[i] } : QUIZ[i]);

  /* ---------- Quotes ---------- */
  function initQuotes() {
    const stage = $("#quoteStage");
    const dots = $("#quoteDots");
    let index = 0;
    let timer;
    const renderDots = () => {
      dots.innerHTML = QUOTES.map((_, i) => `<button type="button" aria-label="${escapeHtml(t("quoteN", { n: n(i + 1) }))}" aria-pressed="${i === index}" data-i="${i}"></button>`).join("");
    };
    const show = (i) => {
      index = (i + QUOTES.length) % QUOTES.length;
      const q = quoteAt(index);
      stage.innerHTML = `<figure class="quote">
        <blockquote>${escapeHtml(q.text)}</blockquote>
        <cite>— ${escapeHtml(q.by)}</cite>
        ${q.bnLine ? `<span class="bn" lang="bn">${escapeHtml(q.bnLine)}</span>` : ""}
      </figure>`;
      $$("button", dots).forEach((b, bi) => b.setAttribute("aria-pressed", String(bi === index)));
    };
    const restart = () => { clearInterval(timer); timer = setInterval(() => show(index + 1), QUOTE_INTERVAL_MS); };
    dots.addEventListener("click", (e) => {
      const b = e.target.closest("button");
      if (!b) return;
      show(Number(b.dataset.i));
      restart();
    });
    // Hold the rotation while a keyboard user is on the dots.
    dots.addEventListener("focusin", () => clearInterval(timer));
    dots.addEventListener("focusout", restart);
    I18N.onChange(() => { renderDots(); show(index); });
    renderDots();
    show(0);
    restart();
  }

  /* ---------- Find a solution ---------- */
  let currentSolution = SOLUTIONS[0].id;
  function renderSolution() {
    const s = solution(SOLUTIONS.find((x) => x.id === currentSolution));
    $("#solvePanel").innerHTML = `<div class="panel-inner">
      <p class="eyebrow eyebrow-plain">${escapeHtml(s.sub)}</p>
      <h3>${ico(s.icon)} ${escapeHtml(s.title)}</h3>
      <p class="law-tag">${ico("book")}<span>${escapeHtml(s.law)}</span></p>
      <ol class="steps">${s.steps.map((x) => `<li><span>${escapeHtml(x)}</span></li>`).join("")}</ol>
      <p class="docs-title">${ico("file")} ${escapeHtml(t("docsTitle"))}</p>
      <div class="docs">${s.docs.map((d) => `<label><input type="checkbox" /> ${escapeHtml(d)}</label>`).join("")}</div>
      <div class="panel-foot">
        <small>${ico("info")} ${escapeHtml(t("generalOnly"))}</small>
        <a href="#waChat" class="btn btn-gold" data-topic="${escapeHtml(s.title)}">${ico("chat")} ${escapeHtml(t("discuss"))}</a>
      </div>
    </div>`;
  }
  function renderPicker() {
    $("#solvePicker").innerHTML = SOLUTIONS.map((raw) => {
      const s = solution(raw);
      return `<button type="button" class="solve-btn" data-id="${s.id}" aria-pressed="${s.id === currentSolution}" aria-controls="solvePanel">
        <span class="ic">${ico(s.icon)}</span>
        <span><strong>${escapeHtml(s.title)}</strong><small>${escapeHtml(s.sub)}</small></span>
      </button>`;
    }).join("");
  }
  function initSolutions() {
    const picker = $("#solvePicker");
    picker.addEventListener("click", (e) => {
      const b = e.target.closest(".solve-btn");
      if (!b) return;
      currentSolution = b.dataset.id;
      $$(".solve-btn", picker).forEach((x) => x.setAttribute("aria-pressed", String(x === b)));
      renderSolution();
      if (innerWidth <= 980 && innerWidth > 600) $("#solvePanel").scrollIntoView({ behavior: "smooth", block: "start" });
    });
    I18N.onChange(() => { renderPicker(); renderSolution(); });
    renderPicker();
    renderSolution();
  }

  /* ---------- Shared filter chips ---------- */
  function makeChips(container, cats, onChange) {
    let active = "All";
    const render = () => {
      container.innerHTML = ["All", ...cats].map((c) => `<button type="button" class="chip" aria-pressed="${c === active}" data-cat="${escapeHtml(c)}">${c === "All" ? escapeHtml(t("all")) : `${ico(CAT_ICON[c] || "list")} ${escapeHtml(catLabel(c))}`}</button>`).join("");
    };
    container.addEventListener("click", (e) => {
      const b = e.target.closest(".chip");
      if (!b) return;
      active = b.dataset.cat;
      $$(".chip", container).forEach((c) => c.setAttribute("aria-pressed", String(c === b)));
      onChange();
    });
    I18N.onChange(render);
    render();
    return { get: () => active, reset: () => { active = "All"; render(); } };
  }
  const uniqueCats = (items) => [...new Set(items.map((i) => i.cat))];
  const matches = (fields, q) => !q || fields.join(" ").toLowerCase().includes(q.toLowerCase());

  /* ---------- Laws ---------- */
  function initLaws() {
    const grid = $("#lawGrid");
    const empty = $("#lawEmpty");
    const count = $("#lawCount");
    const search = $("#lawSearch");
    let chips;
    const render = () => {
      const q = search.value.trim();
      const list = LAWS.map((_, i) => i).filter((i) => {
        const l = LAWS[i];
        return (chips.get() === "All" || l.cat === chips.get()) &&
          matches([l.name, l.bn, l.summary, ...l.points, LAWS_BN[i].summary, ...LAWS_BN[i].points], q);
      });
      grid.innerHTML = list.map((i) => {
        const l = lawAt(i);
        return `<button type="button" class="law-card" data-i="${i}" aria-haspopup="dialog">
          <span class="meta"><span>${ico(CAT_ICON[l.cat])} ${escapeHtml(catLabel(l.cat))}</span><span>${n(l.year)}</span></span>
          <h3>${highlight(l.name, q)}</h3>
          <span class="bn">${escapeHtml(l.sub)}</span>
          <p>${highlight(l.summary, q)}</p>
          <span class="more">${escapeHtml(t("keySections"))}</span>
        </button>`;
      }).join("");
      empty.hidden = list.length > 0;
      count.textContent = q || chips.get() !== "All" ? (list.length === 1 ? t("lawCountOne") : t("lawCount", { n: n(list.length) })) : "";
    };
    chips = makeChips($("#lawChips"), uniqueCats(LAWS), render);
    search.addEventListener("input", render);
    $("#lawClear").addEventListener("click", () => { search.value = ""; chips.reset(); render(); search.focus(); });
    grid.addEventListener("click", (e) => {
      const card = e.target.closest(".law-card");
      if (card) openLaw(Number(card.dataset.i), card);
    });
    I18N.onChange(render);
    render();
  }

  /* ---------- Law details dialog (focus trapped, Esc closes, focus returns) ---------- */
  let lastFocus = null;
  let openLawIndex = null;
  function renderLaw(i) {
    const l = lawAt(i);
    $("#lawModalBody").innerHTML = `
      <p class="eyebrow eyebrow-plain">${ico(CAT_ICON[l.cat])} ${escapeHtml(catLabel(l.cat))} · ${n(l.year)}</p>
      <h3 id="lawModalTitle">${escapeHtml(l.name)}</h3>
      <p class="bn">${escapeHtml(l.sub)}</p>
      <p>${escapeHtml(l.summary)}</p>
      <ul class="point-list">${l.points.map((p) => `<li>${ico("check")}<span>${escapeHtml(p)}</span></li>`).join("")}</ul>
      <div class="modal-actions">
        <a href="#waChat" class="btn btn-gold" data-topic="${escapeHtml(l.name)}">${ico("chat")} ${escapeHtml(t("askLaw"))}</a>
        <a href="${OFFICIAL_LAWS_INDEX}" class="btn btn-outline" target="_blank" rel="noopener">${ico("book")} ${escapeHtml(t("officialText"))}</a>
      </div>`;
  }
  function openLaw(i, trigger) {
    lastFocus = trigger;
    openLawIndex = i;
    renderLaw(i);
    $("#lawModal").hidden = false;
    document.body.classList.add("modal-open");
    $("#lawModalClose").focus();
  }
  function closeLaw() {
    $("#lawModal").hidden = true;
    openLawIndex = null;
    document.body.classList.remove("modal-open");
    if (lastFocus) lastFocus.focus({ preventScroll: true });
  }
  function initModal() {
    const modal = $("#lawModal");
    $("#lawModalClose").addEventListener("click", closeLaw);
    modal.addEventListener("click", (e) => { if (e.target === modal || e.target.closest("[data-topic]")) closeLaw(); });
    document.addEventListener("keydown", (e) => {
      if (modal.hidden) return;
      if (e.key === "Escape") { closeLaw(); return; }
      if (e.key !== "Tab") return;
      const items = $$("a, button", modal);
      const first = items[0];
      const last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    });
    I18N.onChange(() => { if (openLawIndex !== null) renderLaw(openLawIndex); });
  }

  /* ---------- Official sources ---------- */
  function renderOfficial() {
    $("#officialGrid").innerHTML = OFFICIAL.map((o, i) => {
      const loc = bn() ? { ...o, ...OFFICIAL_BN[i], title: o.bn, sub: o.name } : { ...o, title: o.name, sub: o.bn };
      return `<a class="official-card" href="${o.url}" target="_blank" rel="noopener">
        <span class="official-top"><span class="official-ic">${ico(o.icon)}</span><span class="official-tag">${escapeHtml(loc.tag)}</span></span>
        <strong>${escapeHtml(loc.title)}</strong>
        <span class="bn">${escapeHtml(loc.sub)}</span>
        <small>${escapeHtml(loc.desc)}</small>
        <span class="official-url">${ico("external")} ${escapeHtml(new URL(o.url).hostname.replace(/^www\./, ""))}</span>
      </a>`;
    }).join("");
  }

  /* ---------- Q&A ---------- */
  function initFaq() {
    const list = $("#faqList");
    const empty = $("#faqEmpty");
    const count = $("#faqCount");
    const search = $("#faqSearch");
    let chips;
    const render = () => {
      const q = search.value.trim();
      const items = FAQS.map((_, i) => i).filter((i) =>
        (chips.get() === "All" || FAQS[i].cat === chips.get()) && matches([FAQS[i].q, FAQS[i].a, FAQS_BN[i].q, FAQS_BN[i].a], q));
      list.innerHTML = items.map((i) => {
        const f = faqAt(i);
        return `<details class="faq">
          <summary><span class="tag">${ico(CAT_ICON[f.cat])} ${escapeHtml(catLabel(f.cat))}</span><span class="faq-q">${highlight(f.q, q)}</span></summary>
          <div class="answer"><p>${highlight(f.a, q)}</p><a href="#waChat" data-prefill="${escapeHtml(f.q)} — ">${ico("chat")} ${escapeHtml(t("askCase"))}</a></div>
        </details>`;
      }).join("");
      if (q && items.length) list.firstElementChild.open = true;
      empty.hidden = items.length > 0;
      count.textContent = q || chips.get() !== "All" ? (items.length === 1 ? t("faqCountOne") : t("faqCount", { n: n(items.length) })) : "";
    };
    chips = makeChips($("#faqChips"), uniqueCats(FAQS), render);
    search.addEventListener("input", render);
    $("#faqClear").addEventListener("click", () => { search.value = ""; chips.reset(); render(); search.focus(); });
    I18N.onChange(render);
    render();
  }

  /* ---------- Quiz ---------- */
  function initQuiz() {
    const card = $("#quizCard");
    let step = 0;
    let score = 0;
    let answered = null; // option chosen for the current question, or null
    let finished = false;

    const markAnswer = (chosen, counts) => {
      const item = quizAt(step);
      if (counts && chosen === item.answer) score += 1;
      $$(".option", card).forEach((b, i) => {
        b.disabled = true;
        if (i === item.answer) b.classList.add("correct");
        else if (i === chosen) b.classList.add("wrong");
      });
      $("#quizScore").textContent = t("quizScore", { s: n(score) });
      const ok = chosen === item.answer;
      $("#quizFeedback").innerHTML = `<div class="why ${ok ? "ok" : "bad"}">${ico(ok ? "check" : "alert")}<p><strong>${escapeHtml(t(ok ? "correct" : "notQuite"))}</strong> ${escapeHtml(item.why)}</p></div>
        <button type="button" class="btn btn-gold" id="quizNext">${escapeHtml(t(step + 1 < QUIZ.length ? "next" : "seeResult"))}</button>`;
    };
    const renderQuestion = () => {
      const item = quizAt(step);
      card.innerHTML = `
        <div class="quiz-top"><span>${ico("sparkle")} ${escapeHtml(t("quizQ", { i: n(step + 1), n: n(QUIZ.length) }))}</span><span id="quizScore">${escapeHtml(t("quizScore", { s: n(score) }))}</span></div>
        <div class="quiz-bar" role="progressbar" aria-valuemin="0" aria-valuemax="${QUIZ.length}" aria-valuenow="${step}"><span style="width:${(step / QUIZ.length) * 100}%"></span></div>
        <h3>${escapeHtml(item.q)}</h3>
        <div class="options">${item.options.map((o, i) => `<button type="button" class="option" data-i="${i}">${escapeHtml(o)}</button>`).join("")}</div>
        <div id="quizFeedback" aria-live="polite"></div>`;
      if (answered !== null) markAnswer(answered, false);
    };
    const renderResult = () => {
      const verdict = score >= 5 ? t("quizGreat") : score >= 3 ? t("quizGood") : t("quizLearn");
      card.innerHTML = `<div class="quiz-result">
        <span class="result-ic">${ico(score >= 5 ? "award" : "sparkle")}</span>
        <div class="score">${n(score)}/${n(QUIZ.length)}</div>
        <h3>${escapeHtml(verdict)}</h3>
        <p>${escapeHtml(t("quizMore"))}</p>
        <div class="hero-cta center">
          <button type="button" class="btn btn-gold" id="quizRestart">${ico("clock")} ${escapeHtml(t("tryAgain"))}</button>
          <a href="#laws" class="btn btn-ghost">${ico("book")} ${escapeHtml(t("exploreLaws"))}</a>
        </div>
      </div>`;
    };
    card.addEventListener("click", (e) => {
      if (e.target.closest("#quizRestart")) {
        step = 0; score = 0; answered = null; finished = false;
        renderQuestion(); $(".option", card).focus();
        return;
      }
      if (e.target.closest("#quizNext")) {
        step += 1; answered = null;
        if (step < QUIZ.length) { renderQuestion(); $(".option", card).focus(); return; }
        finished = true;
        renderResult();
        $("#quizRestart").focus();
        if (window.Toast) window.Toast.show(`${t("quizScore", { s: n(score) })}/${n(QUIZ.length)} — ${score >= 5 ? t("quizGreat") : t("quizMore")}`, "success");
        return;
      }
      const opt = e.target.closest(".option");
      if (!opt || opt.disabled) return;
      answered = Number(opt.dataset.i);
      markAnswer(answered, true);
      $("#quizNext").focus();
    });
    I18N.onChange(() => (finished ? renderResult() : renderQuestion()));
    renderQuestion();
  }

  /* ---------- Practice, clients ---------- */
  function renderPractice() {
    $("#practiceGrid").innerHTML = PRACTICE.map((p, i) => `<li>${ico(p.icon)}<span>${escapeHtml(bn() ? PRACTICE_BN[i] : p.name)}</span></li>`).join("");
  }
  function initClients() {
    const names = CLIENTS.map((c) => `<span>${escapeHtml(c)}</span>`).join("");
    $("#clientTrack").innerHTML = names + names.replace(/<span>/g, '<span aria-hidden="true">');
  }

  /* ---------- Hand a topic / question over to the WhatsApp chat (chat.js) ---------- */
  function initContactHandoff() {
    document.addEventListener("click", (e) => {
      const trigger = e.target.closest("[data-topic], [data-prefill], [data-prefill-from]");
      if (!trigger || !window.WAChat) return;
      if (trigger.dataset.prefillFrom) {
        const q = (($(`#${trigger.dataset.prefillFrom}`) || {}).value || "").trim();
        window.WAChat.prefill("", q ? `${q} — ` : "");
        return;
      }
      window.WAChat.prefill(trigger.dataset.topic, trigger.dataset.prefill);
    });
  }

  document.addEventListener("DOMContentLoaded", () => {
    I18N.set(I18N.initial());
    const year = $("#year");
    if (year) year.textContent = new Date().getFullYear();
    initQuotes();
    initSolutions();
    initLaws();
    initModal();
    renderOfficial();
    initFaq();
    initQuiz();
    renderPractice();
    initClients();
    initContactHandoff();
    I18N.onChange(() => { renderOfficial(); renderPractice(); });
  });
})();
