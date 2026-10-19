/* global SITE, QUOTES, SOLUTIONS, LAWS, FAQS, QUIZ, PRACTICE, CLIENTS, OFFICIAL, OFFICIAL_LAWS_INDEX */
(() => {
  "use strict";

  const QUOTE_INTERVAL_MS = 7000;
  const COUNT_DURATION_MS = 1400;
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];

  const escapeHtml = (str) =>
    String(str).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const escapeRegExp = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const highlight = (text, query) => {
    const safe = escapeHtml(text);
    if (!query) return safe;
    return safe.replace(new RegExp(`(${escapeRegExp(escapeHtml(query))})`, "gi"), "<mark>$1</mark>");
  };

  /* ---------- Contact links ---------- */
  const LINKS = {
    tel: `tel:${SITE.phone}`,
    whatsapp: `https://wa.me/${SITE.whatsapp}`,
    mail: `mailto:${SITE.email}`,
    facebook: SITE.facebook,
    youtube: SITE.youtube,
    website: SITE.website,
  };
  function initLinks() {
    $$("[data-link]").forEach((a) => { a.href = LINKS[a.dataset.link] || "#"; });
    $$("[data-text]").forEach((el) => { el.textContent = SITE[el.dataset.text] || ""; });
    $("#year").textContent = new Date().getFullYear();
  }

  /* ---------- Nav, progress, back-to-top ---------- */
  function initNav() {
    const nav = $("#nav");
    const bar = $("#progressBar");
    const toTop = $("#toTop");

    const onScroll = () => {
      const max = document.documentElement.scrollHeight - innerHeight;
      bar.style.width = `${max > 0 ? (scrollY / max) * 100 : 0}%`;
      nav.classList.toggle("scrolled", scrollY > 40);
      toTop.classList.toggle("show", scrollY > innerHeight);
    };
    addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    toTop.addEventListener("click", () => scrollTo({ top: 0 }));

    // Highlight the current section in the desktop nav and the mobile tab bar.
    const spyLinks = $$('.nav-links a[href^="#"]:not(.btn), .tabbar a[href^="#"]');
    const spy = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        spyLinks.forEach((a) => a.classList.toggle("active", a.getAttribute("href") === `#${entry.target.id}`));
      });
    }, { rootMargin: "-45% 0px -50% 0px" });
    new Set(spyLinks.map((a) => a.getAttribute("href"))).forEach((href) => {
      const s = $(href);
      if (s) spy.observe(s);
    });
  }

  /* ---------- Supreme Court video (shown in its own frame, loaded only when scrolled to) ---------- */
  function initCourtVideo() {
    const video = $("#courtVideo");
    const toggle = $("#videoToggle");
    const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const saveData = navigator.connection && navigator.connection.saveData;
    if (reduceMotion || saveData || !video.canPlayType('video/webm; codecs="vp9"')) {
      toggle.hidden = true; // the poster photo stays in the frame
      return;
    }
    const setPaused = (paused) => {
      if (paused) video.pause(); else video.play().catch(() => {});
      toggle.setAttribute("aria-pressed", String(paused));
      toggle.setAttribute("aria-label", paused ? "Play video" : "Pause video");
    };
    toggle.addEventListener("click", () => setPaused(!video.paused));
    // Load on first view; pause while off screen to save data and battery.
    new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !video.src) video.src = video.dataset.src;
      if (toggle.getAttribute("aria-pressed") === "true") return;
      if (entry.isIntersecting) video.play().catch(() => { toggle.hidden = true; }); else video.pause();
    }, { threshold: 0.25 }).observe(video);
  }

  /* ---------- Reveal + counters ---------- */
  function animateCount(el) {
    const target = Number(el.dataset.count);
    const start = performance.now();
    const tick = (now) => {
      const p = Math.min((now - start) / COUNT_DURATION_MS, 1);
      el.textContent = Math.round(target * (1 - Math.pow(1 - p, 3)));
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }
  function initReveal() {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("in");
        $$("[data-count]", entry.target).forEach(animateCount);
        io.unobserve(entry.target);
      });
    }, { threshold: 0.12 });
    $$(".reveal").forEach((el) => io.observe(el));
  }

  /* ---------- Quotes ---------- */
  function initQuotes() {
    const stage = $("#quoteStage");
    const dots = $("#quoteDots");
    let index = 0;
    let timer;

    dots.innerHTML = QUOTES.map((_, i) => `<button role="tab" aria-label="Quote ${i + 1}" data-i="${i}"></button>`).join("");
    const show = (i) => {
      index = (i + QUOTES.length) % QUOTES.length;
      const q = QUOTES[index];
      stage.innerHTML = `<figure class="quote">
        <blockquote>${escapeHtml(q.text)}</blockquote>
        <cite>— ${escapeHtml(q.by)}</cite>
        ${q.bn ? `<span class="bn" lang="bn">${escapeHtml(q.bn)}</span>` : ""}
      </figure>`;
      $$("button", dots).forEach((b, bi) => b.setAttribute("aria-selected", String(bi === index)));
    };
    const restart = () => { clearInterval(timer); timer = setInterval(() => show(index + 1), QUOTE_INTERVAL_MS); };
    dots.addEventListener("click", (e) => {
      const b = e.target.closest("button");
      if (!b) return;
      show(Number(b.dataset.i));
      restart();
    });
    show(0);
    restart();
  }

  /* ---------- Find a solution ---------- */
  function renderSolution(sol) {
    return `<div class="panel-inner">
      <p class="eyebrow" lang="bn">${escapeHtml(sol.bn)}</p>
      <h3>${escapeHtml(sol.title)}</h3>
      <span class="law-tag">${escapeHtml(sol.law)}</span>
      <ol class="steps">${sol.steps.map((s) => `<li><span>${escapeHtml(s)}</span></li>`).join("")}</ol>
      <p class="docs-title">Documents checklist — tick what you have</p>
      <div class="docs">${sol.docs.map((d) => `<label><input type="checkbox" /> ${escapeHtml(d)}</label>`).join("")}</div>
      <div class="panel-foot">
        <small>General guidance only — every case is different.</small>
        <a href="#waChat" class="btn btn-gold" data-topic="${escapeHtml(sol.title)}">Discuss this with the advocate</a>
      </div>
    </div>`;
  }
  function initSolutions() {
    const picker = $("#solvePicker");
    const panel = $("#solvePanel");
    picker.innerHTML = SOLUTIONS.map((s) => `<button class="solve-btn" role="tab" data-id="${s.id}" aria-selected="false">
      <span class="ic" aria-hidden="true">${s.icon}</span>
      <span><strong>${escapeHtml(s.title)}</strong><small lang="bn">${escapeHtml(s.bn)}</small></span>
    </button>`).join("");

    const select = (id) => {
      const sol = SOLUTIONS.find((s) => s.id === id);
      if (!sol) return;
      $$(".solve-btn", picker).forEach((b) => b.setAttribute("aria-selected", String(b.dataset.id === id)));
      panel.innerHTML = renderSolution(sol);
    };
    picker.addEventListener("click", (e) => {
      const b = e.target.closest(".solve-btn");
      if (!b) return;
      select(b.dataset.id);
      if (innerWidth <= 980 && innerWidth > 600) panel.scrollIntoView({ behavior: "smooth", block: "start" });
    });
    select(SOLUTIONS[0].id);
  }

  /* ---------- Shared filter helpers ---------- */
  function renderChips(container, cats, onChange) {
    let active = "All";
    container.innerHTML = ["All", ...cats].map((c) => `<button class="chip" aria-pressed="${c === "All"}" data-cat="${escapeHtml(c)}">${escapeHtml(c)}</button>`).join("");
    container.addEventListener("click", (e) => {
      const b = e.target.closest(".chip");
      if (!b) return;
      active = b.dataset.cat;
      $$(".chip", container).forEach((c) => c.setAttribute("aria-pressed", String(c === b)));
      onChange(active);
    });
    return () => active;
  }
  const uniqueCats = (items) => [...new Set(items.map((i) => i.cat))];
  const matches = (fields, query) => !query || fields.join(" ").toLowerCase().includes(query.toLowerCase());

  /* ---------- Laws ---------- */
  function initLaws() {
    const grid = $("#lawGrid");
    const empty = $("#lawEmpty");
    const search = $("#lawSearch");
    let getCat;

    const render = () => {
      const q = search.value.trim();
      const cat = getCat();
      const list = LAWS
        .map((law, i) => ({ law, i }))
        .filter(({ law }) => (cat === "All" || law.cat === cat) && matches([law.name, law.bn, law.summary, ...law.points], q));
      grid.innerHTML = list.map(({ law, i }) => `<button class="law-card" data-i="${i}">
        <span class="meta"><span>${escapeHtml(law.cat)}</span><span>${law.year}</span></span>
        <h3>${highlight(law.name, q)}</h3>
        <span class="bn" lang="bn">${escapeHtml(law.bn)}</span>
        <p>${highlight(law.summary, q)}</p>
        <span class="more">Key sections →</span>
      </button>`).join("");
      empty.hidden = list.length > 0;
    };
    getCat = renderChips($("#lawChips"), uniqueCats(LAWS), render);
    search.addEventListener("input", render);
    grid.addEventListener("click", (e) => {
      const card = e.target.closest(".law-card");
      if (card) openLaw(LAWS[Number(card.dataset.i)], card);
    });
    render();
  }

  let lastFocus = null;
  function openLaw(law, trigger) {
    const modal = $("#lawModal");
    lastFocus = trigger;
    $("#lawModalBody").innerHTML = `
      <p class="eyebrow">${escapeHtml(law.cat)} · ${law.year}</p>
      <h3 id="lawModalTitle">${escapeHtml(law.name)}</h3>
      <p class="bn" lang="bn">${escapeHtml(law.bn)}</p>
      <p>${escapeHtml(law.summary)}</p>
      <ul>${law.points.map((p) => `<li>${escapeHtml(p)}</li>`).join("")}</ul>
      <div class="modal-actions">
        <a href="#waChat" class="btn btn-gold" data-topic="${escapeHtml(law.name)}">Ask about this law</a>
        <a href="${OFFICIAL_LAWS_INDEX}" class="btn btn-outline" target="_blank" rel="noopener">Read the official text ↗</a>
      </div>`;
    modal.hidden = false;
    document.body.style.overflow = "hidden";
    $("#lawModalClose").focus();
  }
  function closeLaw() {
    $("#lawModal").hidden = true;
    document.body.style.overflow = "";
    if (lastFocus) lastFocus.focus();
  }
  function initModal() {
    const modal = $("#lawModal");
    $("#lawModalClose").addEventListener("click", closeLaw);
    modal.addEventListener("click", (e) => {
      if (e.target === modal || e.target.closest("[data-topic]")) closeLaw();
    });
    addEventListener("keydown", (e) => { if (e.key === "Escape" && !modal.hidden) closeLaw(); });
  }

  /* ---------- FAQ ---------- */
  function initFaq() {
    const list = $("#faqList");
    const search = $("#faqSearch");
    let getCat;
    const render = () => {
      const q = search.value.trim();
      const cat = getCat();
      const items = FAQS.filter((f) => (cat === "All" || f.cat === cat) && matches([f.q, f.a], q));
      list.innerHTML = items.length
        ? items.map((f) => `<details class="faq">
            <summary><span class="tag">${escapeHtml(f.cat)}</span><br />${highlight(f.q, q)}</summary>
            <div class="answer"><p>${highlight(f.a, q)}</p><a href="#waChat" data-prefill="About: ${escapeHtml(f.q)} — ">Ask about my case →</a></div>
          </details>`).join("")
        : `<p class="empty">No matching question. <a href="#waChat">Ask the advocate directly</a>.</p>`;
      if (q && items.length) list.firstElementChild.open = true;
    };
    getCat = renderChips($("#faqChips"), uniqueCats(FAQS), render);
    search.addEventListener("input", render);
    render();
  }

  /* ---------- Quiz ---------- */
  function initQuiz() {
    const card = $("#quizCard");
    let step = 0;
    let score = 0;

    const renderQuestion = () => {
      const item = QUIZ[step];
      card.innerHTML = `
        <div class="quiz-top"><span>Question ${step + 1} of ${QUIZ.length}</span><span>Score ${score}</span></div>
        <div class="quiz-bar"><span style="width:${(step / QUIZ.length) * 100}%"></span></div>
        <h3>${escapeHtml(item.q)}</h3>
        <div class="options">${item.options.map((o, i) => `<button class="option" data-i="${i}">${escapeHtml(o)}</button>`).join("")}</div>
        <div id="quizFeedback"></div>`;
    };
    const renderResult = () => {
      const verdict = score >= 5 ? "Excellent — you know your rights." : score >= 3 ? "Good start. A few rights are worth a second look." : "Worth learning — these rules protect you every day.";
      card.innerHTML = `<div class="quiz-result">
        <div class="score">${score}/${QUIZ.length}</div>
        <h3>${verdict}</h3>
        <p>Explore the laws above or ask the advocate about your situation.</p>
        <div class="hero-cta" style="justify-content:center">
          <button class="btn btn-gold" id="quizRestart">Try again</button>
          <a href="#laws" class="btn btn-ghost">Explore the laws</a>
        </div>
      </div>`;
    };
    card.addEventListener("click", (e) => {
      if (e.target.id === "quizRestart") { step = 0; score = 0; renderQuestion(); return; }
      if (e.target.id === "quizNext") {
        step += 1;
        if (step < QUIZ.length) renderQuestion(); else renderResult();
        return;
      }
      const opt = e.target.closest(".option");
      if (!opt || opt.disabled) return;
      const item = QUIZ[step];
      const chosen = Number(opt.dataset.i);
      if (chosen === item.answer) score += 1;
      $$(".option", card).forEach((b, i) => {
        b.disabled = true;
        if (i === item.answer) b.classList.add("correct");
        else if (i === chosen) b.classList.add("wrong");
      });
      $(".quiz-top span:last-child", card).textContent = `Score ${score}`;
      $("#quizFeedback").innerHTML = `<div class="why"><strong>${chosen === item.answer ? "Correct." : "Not quite."}</strong> ${escapeHtml(item.why)}</div>
        <button class="btn btn-gold" id="quizNext">${step + 1 < QUIZ.length ? "Next question →" : "See my result"}</button>`;
    });
    renderQuestion();
  }

  /* ---------- Practice, clients, official sources ---------- */
  function initLists() {
    $("#officialGrid").innerHTML = OFFICIAL.map((o) => `<a class="official-card reveal" href="${o.url}" target="_blank" rel="noopener">
      <span class="official-tag">${escapeHtml(o.tag)}</span>
      <strong>${escapeHtml(o.name)}</strong>
      <span class="bn" lang="bn">${escapeHtml(o.bn)}</span>
      <small>${escapeHtml(o.desc)}</small>
      <span class="official-url">${escapeHtml(new URL(o.url).hostname.replace(/^www\./, ""))} ↗</span>
    </a>`).join("");
    $("#practiceGrid").innerHTML = PRACTICE.map((p) => `<li class="reveal">${escapeHtml(p)}</li>`).join("");
    const names = CLIENTS.map((c) => `<span>${escapeHtml(c)}</span>`).join("");
    $("#clientTrack").innerHTML = names + names.replace(/<span>/g, '<span aria-hidden="true">');
  }

  /* ---------- Contact: hand topic / question to the WhatsApp chat (chat.js) ---------- */
  function initContact() {
    document.addEventListener("click", (e) => {
      const trigger = e.target.closest("[data-topic], [data-prefill]");
      if (trigger && window.WAChat) window.WAChat.prefill(trigger.dataset.topic, trigger.dataset.prefill);
    });
  }

  document.addEventListener("DOMContentLoaded", () => {
    initLinks();
    initNav();
    initCourtVideo();
    initQuotes();
    initSolutions();
    initLaws();
    initModal();
    initFaq();
    initQuiz();
    initLists();
    initContact();
    initReveal();
  });
})();
