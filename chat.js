/* WhatsApp-style guided chat for the contact section.
   Collects name → matter → phone → message, then opens WhatsApp (or email) pre-filled.
   Nothing is sent anywhere until the visitor presses send in WhatsApp. */
/* global SITE, SOLUTIONS */
(() => {
  "use strict";

  const TYPING_MS = 900;
  const MAX_INPUT_HEIGHT_PX = 120;
  const PHONE_RE = /^(?:\+?88)?01[3-9]\d{8}$/;
  const TOPICS = [...SOLUTIONS.map((s) => s.title), "Other / not sure"];

  const body = document.getElementById("waBody");
  const quick = document.getElementById("waQuick");
  const form = document.getElementById("waForm");
  const input = document.getElementById("waText");
  const status = document.getElementById("waStatus");
  const chat = document.getElementById("waChat");
  if (!body || !form) return;

  let state = null;
  let preset = { topic: "", prefix: "" };
  let queue = Promise.resolve();
  let session = 0;

  const now = () => new Date().toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
  const wait = (ms) => new Promise((r) => setTimeout(r, ms));
  const scrollDown = () => { body.scrollTop = body.scrollHeight; };

  function bubble(who, text, extra) {
    const el = document.createElement("div");
    el.className = `wa-msg ${who}`;
    const p = document.createElement("p");
    p.textContent = text;
    el.append(p);
    if (extra) el.append(extra);
    const meta = document.createElement("span");
    meta.className = "wa-meta";
    meta.textContent = now();
    if (who === "out") {
      const ticks = document.createElement("span");
      ticks.className = "wa-ticks";
      ticks.setAttribute("aria-label", "Read");
      ticks.textContent = "✓✓";
      meta.append(ticks);
    }
    el.append(meta);
    body.append(el);
    scrollDown();
  }

  /* Bot messages are queued so they appear one after another with a typing indicator.
     A restart bumps `session`, so messages queued by an older conversation are dropped. */
  function bot(text, extra) {
    const mine = session;
    queue = queue.then(async () => {
      if (mine !== session) return;
      status.textContent = "typing…";
      const typing = document.createElement("div");
      typing.className = "wa-msg in wa-typing";
      typing.setAttribute("aria-label", "typing");
      typing.innerHTML = "<i></i><i></i><i></i>";
      body.append(typing);
      scrollDown();
      await wait(TYPING_MS);
      typing.remove();
      status.textContent = "online";
      if (mine === session) bubble("in", text, extra);
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

  const PLACEHOLDERS = {
    name: "Type your name",
    topic: "Choose above or type",
    phone: "01XXXXXXXXX",
    message: "Describe what happened",
    done: "Add more details",
  };

  async function ask(step) {
    state.step = step;
    input.inputMode = step === "phone" ? "tel" : "text";
    input.placeholder = PLACEHOLDERS[step];
    setQuickReplies([]);

    if (step === "name") {
      await bot("Assalamu Alaikum 👋 Welcome to The Lawyers' Chamber.");
      await bot("May I know your name?");
    } else if (step === "topic") {
      if (preset.topic) {
        state.topic = preset.topic;
        await bot(`Thank you, ${state.name}. I see your question is about “${state.topic}”.`);
        return ask("phone");
      }
      await bot(`Thank you, ${state.name}. What is your matter about?`);
      setQuickReplies(TOPICS);
    } else if (step === "phone") {
      await bot("Which mobile number should the chamber call you back on?");
    } else if (step === "message") {
      await bot("Briefly, what happened? Include dates and any case number if you have one.");
      if (preset.prefix && !input.value) input.value = preset.prefix;
    } else if (step === "done") {
      await bot("Thank you. Your message is ready ✅ Tap below to send it on WhatsApp — the advocate's team will reply.", sendActions());
    }
  }

  function composeMessage() {
    return `Assalamu Alaikum, Advocate Rowshan Ali.\n\nName: ${state.name}\nPhone: ${state.phone}\nMatter: ${state.topic}\n\n${state.message}`;
  }

  function sendActions() {
    const wrap = document.createElement("div");
    wrap.className = "wa-actions";
    const wa = document.createElement("a");
    wa.className = "wa-cta";
    wa.target = "_blank";
    wa.rel = "noopener";
    wa.innerHTML = '<svg class="i" aria-hidden="true"><use href="#i-wa" /></svg> Send on WhatsApp';
    const mail = document.createElement("a");
    mail.className = "wa-cta-alt";
    mail.textContent = "Send by email instead";
    // Rebuild links on interaction so details typed after the summary are included.
    const refresh = () => {
      const text = composeMessage();
      wa.href = `https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent(text)}`;
      mail.href = `mailto:${SITE.email}?subject=${encodeURIComponent(`Consultation request: ${state.topic}`)}&body=${encodeURIComponent(text)}`;
    };
    [wa, mail].forEach((a) => { a.addEventListener("pointerdown", refresh); a.addEventListener("focus", refresh); });
    refresh();
    wrap.append(wa, mail);
    return wrap;
  }

  function handle(raw) {
    const text = raw.trim();
    if (!text || !state) return;
    bubble("out", text);
    input.value = "";
    autoGrow();
    setQuickReplies([]);

    switch (state.step) {
      case "name":
        if (text.length < 2) return bot("Please type your full name.");
        state.name = text.slice(0, 80);
        return ask("topic");
      case "topic":
        state.topic = text.slice(0, 120);
        return ask("phone");
      case "phone": {
        const digits = text.replace(/[\s-]/g, "");
        if (!PHONE_RE.test(digits)) return bot("That doesn't look like a Bangladeshi mobile number. Please type it like 01712345678.");
        state.phone = digits;
        return ask("message");
      }
      case "message":
        if (text.length < 10) return bot("Could you add a little more detail? A sentence or two is enough.");
        state.message = text.slice(0, 1500);
        return ask("done");
      default:
        state.message = `${state.message}\n${text}`.slice(0, 1500);
        return bot("Added to your message 👍 Tap “Send on WhatsApp” above when you're ready.");
    }
  }

  function start() {
    session += 1;
    queue = Promise.resolve();
    state = { step: "name", name: "", topic: "", phone: "", message: "" };
    body.querySelectorAll(".wa-msg").forEach((m) => m.remove());
    status.textContent = "online";
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
  input.addEventListener("input", autoGrow);
  document.getElementById("waRestart").addEventListener("click", () => { preset = { topic: "", prefix: "" }; start(); });

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
