/* Page-level behaviour: header, mobile menu, toasts, copy buttons, reveal/counters,
   image + video loading states, and the language toggle. */
/* global I18N */
(() => {
  "use strict";

  const COUNT_DURATION_MS = 1400;
  const TOAST_MS = 3200;
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];

  /* ---------- Toasts (success / error feedback) ---------- */
  const Toast = {
    show(message, type = "success") {
      const region = $("#toasts");
      if (!region) return;
      const el = document.createElement("div");
      el.className = `toast toast-${type}`;
      el.innerHTML = `<span class="ico" data-ico="${type === "error" ? "alert" : "check"}" aria-hidden="true"></span>`;
      el.append(document.createTextNode(message));
      region.append(el);
      setTimeout(() => { el.classList.add("out"); setTimeout(() => el.remove(), 300); }, TOAST_MS);
    },
  };
  window.Toast = Toast;

  /* ---------- Header: progress bar, shrink, back-to-top, section highlight ---------- */
  function initHeader() {
    const nav = $("#nav");
    const bar = $("#progressBar");
    const toTop = $("#toTop");
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - innerHeight;
      bar.style.width = `${max > 0 ? (scrollY / max) * 100 : 0}%`;
      nav.classList.toggle("scrolled", scrollY > 40);
      toTop.classList.toggle("show", scrollY > innerHeight);
      if (scrollY < innerHeight / 2) setActive("#top");
    };
    addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    toTop.addEventListener("click", () => { scrollTo({ top: 0 }); $("#main").focus({ preventScroll: true }); });

    const spy = new IntersectionObserver((entries) => {
      entries.forEach((e) => { if (e.isIntersecting) setActive(`#${e.target.id}`); });
    }, { rootMargin: "-45% 0px -50% 0px" });
    ["#about", "#solve", "#laws", "#qna", "#quiz", "#contact"].forEach((id) => { const s = $(id); if (s) spy.observe(s); });
  }
  function setActive(hash) {
    const target = hash === "#contact" ? "#waChat" : hash;
    $$('.nav-links a, .tabbar a').forEach((a) => {
      const on = a.getAttribute("href") === target;
      a.classList.toggle("active", on);
      if (on) a.setAttribute("aria-current", "true"); else a.removeAttribute("aria-current");
    });
  }

  /* ---------- Mobile menu (focus stays inside while open, Esc closes) ---------- */
  function initMenu() {
    const btn = $("#menuToggle");
    const menu = $("#mobileMenu");
    const focusables = () => $$("a, button", menu).concat(btn);

    const setOpen = (open) => {
      menu.hidden = !open;
      document.body.classList.toggle("menu-open", open);
      btn.setAttribute("aria-expanded", String(open));
      btn.setAttribute("aria-label", I18N.t(open ? "menuClose" : "menuOpen"));
      if (open) $("a", menu).focus();
    };
    btn.addEventListener("click", () => setOpen(menu.hidden));
    menu.addEventListener("click", (e) => { if (e.target.closest("a")) setOpen(false); });
    document.addEventListener("keydown", (e) => {
      if (menu.hidden) return;
      if (e.key === "Escape") { setOpen(false); btn.focus(); return; }
      if (e.key !== "Tab") return;
      const items = focusables();
      const first = items[0];
      const last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    });
    addEventListener("resize", () => { if (innerWidth > 860 && !menu.hidden) setOpen(false); });
  }

  /* ---------- Language toggle ---------- */
  function initLanguage() {
    $$("[data-lang-toggle]").forEach((b) => b.addEventListener("click", () => I18N.toggle()));
  }

  /* ---------- Copy buttons ---------- */
  async function copyText(text) {
    if (navigator.clipboard && window.isSecureContext) {
      try { await navigator.clipboard.writeText(text); return; } catch { /* fall back to execCommand below */ }
    }
    const ta = Object.assign(document.createElement("textarea"), { value: text });
    ta.setAttribute("readonly", "");
    ta.style.position = "fixed"; ta.style.opacity = "0";
    document.body.append(ta); ta.select();
    const ok = document.execCommand("copy");
    ta.remove();
    if (!ok) throw new Error("copy failed");
  }
  function initCopy() {
    document.addEventListener("click", async (e) => {
      const b = e.target.closest("[data-copy]");
      if (!b) return;
      try {
        await copyText(b.dataset.copy);
        b.classList.add("done");
        setTimeout(() => b.classList.remove("done"), 1500);
        Toast.show(I18N.t("copied"), "success");
      } catch {
        Toast.show(I18N.t("copyFail"), "error");
      }
    });
  }

  /* ---------- Reveal on scroll + counters ---------- */
  function animateCount(el) {
    const target = Number(el.dataset.count);
    const start = performance.now();
    const tick = (now) => {
      const p = Math.min((now - start) / COUNT_DURATION_MS, 1);
      el.textContent = I18N.num(Math.round(target * (1 - Math.pow(1 - p, 3))));
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }
  function initReveal() {
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("in");
        if (!reduce) $$("[data-count]", entry.target).forEach(animateCount);
        io.unobserve(entry.target);
      });
    }, { threshold: 0.1 });
    $$(".reveal, .cred-bar").forEach((el) => io.observe(el));
    window.observeReveal = (root) => $$(".reveal:not(.in)", root).forEach((el) => io.observe(el));
    I18N.onChange(() => $$("[data-count]").forEach((el) => { el.textContent = I18N.num(el.dataset.count); }));
  }

  /* ---------- Image loading states ---------- */
  function initImages() {
    $$(".img-loading img").forEach((img) => {
      const wrap = img.closest(".img-loading");
      const done = () => wrap.classList.remove("img-loading");
      const fail = () => { wrap.classList.remove("img-loading"); wrap.classList.add("img-error"); img.remove(); };
      if (img.complete) { if (img.naturalWidth) done(); else fail(); return; }
      img.addEventListener("load", done, { once: true });
      img.addEventListener("error", fail, { once: true });
    });
  }

  /* ---------- Supreme Court video: loads when scrolled to, spinner while buffering, photo on error ---------- */
  function initCourtVideo() {
    const wrap = $("#courtVideoWrap");
    const video = $("#courtVideo");
    const toggle = $("#videoToggle");
    const errorMsg = $("#videoError");
    const stopLoading = () => wrap.classList.remove("is-loading");
    const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const saveData = navigator.connection && navigator.connection.saveData;
    if (reduceMotion || saveData || !video.canPlayType('video/webm; codecs="vp9"')) { stopLoading(); return; }

    const showError = () => { stopLoading(); toggle.hidden = true; errorMsg.hidden = false; video.removeAttribute("src"); video.load(); };
    const setLabel = () => {
      const paused = toggle.getAttribute("aria-pressed") === "true";
      toggle.setAttribute("aria-label", I18N.t(paused ? "videoPlay" : "videoPause"));
    };
    video.addEventListener("playing", () => { stopLoading(); toggle.hidden = false; }, { once: true });
    video.addEventListener("error", showError);
    toggle.addEventListener("click", () => {
      const pause = !video.paused;
      if (pause) video.pause(); else video.play().catch(() => {});
      toggle.setAttribute("aria-pressed", String(pause));
      setLabel();
    });
    I18N.onChange(setLabel);

    new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !video.src) {
        video.src = video.dataset.src;
        video.addEventListener("error", showError, { once: true });
      }
      if (toggle.getAttribute("aria-pressed") === "true" || !video.src) return;
      if (entry.isIntersecting) video.play().catch(() => { if (video.readyState === 0) showError(); });
      else video.pause();
    }, { threshold: 0.25 }).observe(video);
  }

  document.addEventListener("DOMContentLoaded", () => {
    initHeader();
    initMenu();
    initLanguage();
    initCopy();
    initImages();
    initCourtVideo();
    initReveal();
  });
})();
