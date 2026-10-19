/* WhatsApp-style guided chat for the contact section.
   Collects name → matter → phone → message, then opens WhatsApp (or email) pre-filled.
   Nothing is sent anywhere until the visitor presses send in WhatsApp. */
/* global SITE, SOLUTIONS, SOLUTIONS_BN, I18N */
(() => {
  "use strict";

  const TYPING_MS = 900;
  const MAX_INPUT_HEIGHT_PX = 120;
  const MAX_CHARS = 1500;
  const WARN_CHARS_LEFT = 200;
  const PHONE_RE = /^(?:\+?88)?01[3-9]\d{8}$/;
  const PLACEHOLDER_KEY = { name: "phName", topic: "phTopic", phone: "phPhone", message: "phMsg", done: "phDone" };

  const body = document.getElementById("waBody");
  const quick = document.getElementById("waQuick");
  const form = document.getElementById("waForm");
  const input = document.getElementById("waText");
  const status = document.getElementById("waStatus");
  const hint = document.getElementById("waHint");
  const chat = document.getElementById("waChat");
  if (!body || !form) return;

  const t = (k, v) => I18N.t(k, v);
  const topics = () => [...SOLUTIONS.map((s) => (I18N.isBn() ? SOLUTIONS_BN[s.id].title : s.title)), t("other")];
  /* Accept Bangla digits in phone numbers. */
  const toLatinDigits = (s) => s.replace(/[০-৯]/g, (d) => String("০১২৩৪৫৬৭৮৯".indexOf(d)));

  let state = null;
  let preset = { topic: "", prefix: "" };
  let queue = Promise.resolve();
  let session = 0;
  let typing = false;

  const now = () => new Date().toLocaleTimeString(I18N.isBn() ? "bn-BD" : [], { hour: "numeric", minute: "2-digit" });
  const wait = (ms) => new Promise((r) => setTimeout(r, ms));
  const scrollDown = () => { body.scrollTop = body.scrollHeight; };

  function setHint(text, isError = false) {
    hint.textContent = text;
    hint.classList.toggle("error", isError);
    input.setAttribute("aria-invalid", String(isError));
  }

  function bubble(classes, text, extra) {
    const el = document.createElement("div");
    el.className = `wa-msg ${classes}`;
    const p = document.createElement("p");
    p.textContent = text;
    el.append(p);
    if (extra) el.append(extra);
    const meta = document.createElement("span");
    meta.className = "wa-meta";
    meta.textContent = now();
    if (classes === "out") {
      const ticks = document.createElement("span");
      ticks.className = "wa-ticks";
      ticks.setAttribute("aria-hidden", "true");
      ticks.textContent = "✓✓";
      meta.append(ticks);
    }
    el.append(meta);
    body.append(el);
    scrollDown();
  }

  /* Bot messages are queued so they appear one after another with a typing indicator.
     A restart bumps `session`, so messages queued by an older conversation are dropped. */
  function bot(text, extra, { error = false } = {}) {
    const mine = session;
    queue = queue.then(async () => {
      if (mine !== session) return;
      typing = true;
      status.textContent = t("typing");
      const dots = document.createElement("div");
      dots.className = "wa-msg in wa-typing";
      dots.setAttribute("aria-hidden", "true");
      dots.innerHTML = "<i></i><i></i><i></i>";
      body.append(dots);
      scrollDown();
      await wait(TYPING_MS);
      dots.remove();
      typing = false;
      status.textContent = t("online");
      if (mine !== session) return;
      bubble(error ? "in wa-error" : "in", text, extra);
    });
    return queue;
  }

  function setQuickReplies(options) {
    quick.innerHTML = "";
    quick.hidden = !options.length;
    options.forEach((label) => {
      const b = document.createElement("button");
      b.type = "button";
      b.textContent = label;
      b.addEventListener("click", () => handle(label));
      quick.append(b);
    });
  }

  function refreshInputCopy() {
    if (state) input.placeholder = t(PLACEHOLDER_KEY[state.step]);
    if (!typing) status.textContent = t("online");
  }

  async function ask(step) {
    state.step = step;
    input.inputMode = step === "phone" ? "tel" : "text";
    refreshInputCopy();
    setQuickReplies([]);

    if (step === "name") {
      await bot(t("hello"));
      await bot(t("askName"));
    } else if (step === "topic") {
      if (preset.topic) {
        state.topic = preset.topic;
        await bot(t("presetTopic", { name: state.name, topic: state.topic }));
        return ask("phone");
      }
      await bot(t("askTopic", { name: state.name }));
      setQuickReplies(topics());
    } else if (step === "phone") {
      await bot(t("askPhone"));
    } else if (step === "message") {
      await bot(t("askMsg"));
      if (preset.prefix && !input.value) input.value = preset.prefix;
    } else if (step === "done") {
      await bot(t("ready"), sendActions());
    }
  }

  function composeMessage() {
    return `${t("msgIntro")}\n\n${t("msgName")}: ${state.name}\n${t("msgPhone")}: ${state.phone}\n${t("msgMatter")}: ${state.topic}\n\n${state.message}`;
  }

  function sendActions() {
    const wrap = document.createElement("div");
    wrap.className = "wa-actions";
    const wa = document.createElement("a");
    wa.className = "wa-cta";
    wa.target = "_blank";
    wa.rel = "noopener";
    const mail = document.createElement("a");
    mail.className = "wa-cta-alt";
    const label = () => {
      wa.innerHTML = `<svg class="i" aria-hidden="true"><use href="#i-wa" /></svg> <span>${t("sendWa")}</span>`;
      mail.textContent = t("sendMail");
    };
    // Rebuild links on interaction so details typed after the summary are included.
    const refresh = () => {
      const text = composeMessage();
      wa.href = `https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent(text)}`;
      mail.href = `mailto:${SITE.email}?subject=${encodeURIComponent(t("msgSubject", { topic: state.topic }))}&body=${encodeURIComponent(text)}`;
    };
    [wa, mail].forEach((a) => { a.addEventListener("pointerdown", refresh); a.addEventListener("focus", refresh); });
    wa.addEventListener("click", () => {
      // Loading → success feedback while WhatsApp opens in a new tab or the app.
      wa.classList.add("is-loading");
      wa.querySelector("span").textContent = t("opening");
      setTimeout(() => {
        wa.classList.remove("is-loading");
        wa.classList.add("is-done");
        label();
        if (window.Toast) window.Toast.show(t("opened"), "success");
      }, 1200);
    });
    I18N.onChange(label);
    label();
    refresh();
    wrap.append(wa, mail);
    return wrap;
  }

  function reject(key) {
    setHint(t(key), true);
    bot(t(key), null, { error: true });
  }

  function handle(raw) {
    const text = raw.trim();
    if (!state) return;
    if (!text) { setHint(t("errEmpty"), true); input.focus(); return; }
    setHint("");
    bubble("out", text);
    input.value = "";
    autoGrow();
    setQuickReplies([]);

    switch (state.step) {
      case "name":
        if (text.length < 2) return reject("errName");
        state.name = text.slice(0, 80);
        return ask("topic");
      case "topic":
        state.topic = text.slice(0, 120);
        return ask("phone");
      case "phone": {
        const digits = toLatinDigits(text).replace(/[\s-]/g, "");
        if (!PHONE_RE.test(digits)) return reject("errPhone");
        state.phone = digits;
        return ask("message");
      }
      case "message":
        if (text.length < 10) return reject("errMsg");
        state.message = text.slice(0, MAX_CHARS);
        return ask("done");
      default:
        state.message = `${state.message}\n${text}`.slice(0, MAX_CHARS);
        return bot(t("added"));
    }
  }

  function start() {
    session += 1;
    queue = Promise.resolve();
    typing = false;
    state = { step: "name", name: "", topic: "", phone: "", message: "" };
    body.querySelectorAll(".wa-msg").forEach((m) => m.remove());
    setHint("");
    ask("name");
  }

  function autoGrow() {
    input.style.height = "auto";
    input.style.height = `${Math.min(input.scrollHeight, MAX_INPUT_HEIGHT_PX)}px`;
  }

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    handle(input.value);
  });
  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handle(input.value);
    }
  });
  input.addEventListener("input", () => {
    autoGrow();
    const left = MAX_CHARS - input.value.length;
    if (left <= WARN_CHARS_LEFT) setHint(t("charsLeft", { n: I18N.num(left) }), left === 0);
    else setHint("");
  });
  document.getElementById("waRestart").addEventListener("click", () => {
    preset = { topic: "", prefix: "" };
    start();
    if (window.Toast) window.Toast.show(t("restarted"), "success");
  });
  I18N.onChange(() => {
    refreshInputCopy();
    if (state && state.step === "topic" && !quick.hidden) setQuickReplies(topics());
  });

  /* Start when the chat scrolls into view, so the visitor sees the typing animation. */
  const io = new IntersectionObserver((entries) => {
    if (!entries.some((en) => en.isIntersecting)) return;
    if (!state) start();
    io.disconnect();
  }, { threshold: 0.35 });
  io.observe(chat);

  /* Buttons elsewhere ("Discuss this with the advocate", "Ask about my case") pre-select the matter. */
  window.WAChat = {
    prefill(topic, prefix) {
      preset = { topic: topic || "", prefix: prefix || "" };
      if (state) start();
    },
  };
})();
