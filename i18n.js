/* English ⇄ Bangla switching.
   - Static text: elements with data-i18n="key" (English is read from the page itself).
   - Attributes: data-i18n-attr="placeholder:key;aria-label:key2".
   - Script text: I18N.t("key", { name: "…" }).
   The choice is remembered per visitor in localStorage (optional; the site works without it). */
(() => {
  "use strict";

  const STORAGE_KEY = "ra-lang";

  /* Strings used only from JavaScript (English and Bangla). */
  const JS = {
    en: {
      all: "All", keySections: "Key sections →", discuss: "Discuss this with the advocate", generalOnly: "General guidance only — every case is different.",
      docsTitle: "Documents checklist — tick what you have", askLaw: "Ask about this law", officialText: "Official laws & rules ↗",
      askCase: "Ask about my case →", lawCount: "{n} laws", lawCountOne: "1 law", faqCount: "{n} questions", faqCountOne: "1 question",
      quizQ: "Question {i} of {n}", quizScore: "Score {s}", correct: "Correct.", notQuite: "Not quite.", next: "Next question →", seeResult: "See my result",
      quizGreat: "Excellent — you know your rights.", quizGood: "Good start. A few rights are worth a second look.", quizLearn: "Worth learning — these rules protect you every day.",
      quizMore: "Explore the laws above or ask the advocate about your situation.", tryAgain: "Try again", exploreLaws: "Explore the laws",
      quoteN: "Quote {n}", copied: "Copied to clipboard ✓", copyFail: "Couldn't copy — please select and copy it manually.",
      langOn: "English is on", videoPause: "Pause video", videoPlay: "Play video", menuOpen: "Open menu", menuClose: "Close menu",
      langLabel: "বাংলায় দেখুন — switch to Bangla", title: "Advocate Rowshan Ali | Supreme Court of Bangladesh",
      online: "online", typing: "typing…",
      hello: "Assalamu Alaikum 👋 Welcome to The Lawyers' Chamber.", askName: "May I know your name?",
      askTopic: "Thank you, {name}. What is your matter about?", presetTopic: "Thank you, {name}. I see your question is about “{topic}”.",
      askPhone: "Which mobile number should the chamber call you back on?", askMsg: "Briefly, what happened? Include dates and any case number if you have one.",
      ready: "Thank you. Your message is ready ✅ Tap below to send it on WhatsApp — the advocate's team will reply.",
      errName: "Please type your full name (at least 2 letters).", errPhone: "That doesn't look like a Bangladeshi mobile number. Please type it like 01712345678.",
      errMsg: "Could you add a little more detail? A sentence or two is enough.", errEmpty: "Please type a reply first.",
      added: "Added to your message 👍 Tap “Send on WhatsApp” above when you're ready.", sendWa: "Send on WhatsApp", sendMail: "Send by email instead",
      opening: "Opening WhatsApp…", opened: "WhatsApp opened — press send there to reach the chamber.", other: "Other / not sure",
      phName: "Type your name", phTopic: "Choose above or type", phPhone: "01XXXXXXXXX", phMsg: "Describe what happened", phDone: "Add more details",
      charsLeft: "{n} characters left", restarted: "Chat restarted.",
      msgIntro: "Assalamu Alaikum, Advocate Rowshan Ali.", msgName: "Name", msgPhone: "Phone", msgMatter: "Matter", msgSubject: "Consultation request: {topic}",
    },
    bn: {
      all: "সব", keySections: "মূল ধারাসমূহ →", discuss: "এ বিষয়ে আইনজীবীর সাথে কথা বলুন", generalOnly: "এটি সাধারণ নির্দেশনা — প্রতিটি মামলা আলাদা।",
      docsTitle: "কাগজপত্রের তালিকা — যা আছে তাতে টিক দিন", askLaw: "এই আইন নিয়ে জিজ্ঞাসা করুন", officialText: "সরকারি আইন ও বিধি ↗",
      askCase: "আমার বিষয়ে জিজ্ঞাসা করুন →", lawCount: "{n}টি আইন", lawCountOne: "১টি আইন", faqCount: "{n}টি প্রশ্ন", faqCountOne: "১টি প্রশ্ন",
      quizQ: "প্রশ্ন {i} / {n}", quizScore: "স্কোর {s}", correct: "সঠিক।", notQuite: "ঠিক হয়নি।", next: "পরের প্রশ্ন →", seeResult: "ফলাফল দেখুন",
      quizGreat: "চমৎকার — আপনি আপনার অধিকার জানেন।", quizGood: "ভালো শুরু। কয়েকটি অধিকার আরেকবার দেখে নিন।", quizLearn: "জেনে রাখা জরুরি — এই নিয়মগুলো প্রতিদিন আপনাকে সুরক্ষা দেয়।",
      quizMore: "উপরের আইনগুলো দেখুন অথবা আপনার বিষয়ে আইনজীবীকে জিজ্ঞাসা করুন।", tryAgain: "আবার চেষ্টা করুন", exploreLaws: "আইনগুলো দেখুন",
      quoteN: "উক্তি {n}", copied: "কপি হয়েছে ✓", copyFail: "কপি করা যায়নি — অনুগ্রহ করে নিজে সিলেক্ট করে কপি করুন।",
      langOn: "বাংলা চালু হয়েছে", videoPause: "ভিডিও থামান", videoPlay: "ভিডিও চালান", menuOpen: "মেনু খুলুন", menuClose: "মেনু বন্ধ করুন",
      langLabel: "View in English — ইংরেজিতে দেখুন", title: "অ্যাডভোকেট রওশন আলী | বাংলাদেশ সুপ্রীম কোর্ট",
      online: "অনলাইন", typing: "লিখছেন…",
      hello: "আসসালামু আলাইকুম 👋 দ্য লয়ার্স চেম্বারে আপনাকে স্বাগতম।", askName: "আপনার নামটি জানতে পারি?",
      askTopic: "ধন্যবাদ, {name}। আপনার বিষয়টি কী নিয়ে?", presetTopic: "ধন্যবাদ, {name}। বুঝতে পারছি আপনার প্রশ্ন “{topic}” নিয়ে।",
      askPhone: "চেম্বার কোন মোবাইল নম্বরে আপনাকে কল করবে?", askMsg: "সংক্ষেপে কী ঘটেছে লিখুন। তারিখ ও মামলা নম্বর থাকলে উল্লেখ করুন।",
      ready: "ধন্যবাদ। আপনার বার্তা প্রস্তুত ✅ নিচে চাপ দিয়ে হোয়াটসঅ্যাপে পাঠান — আইনজীবীর টিম উত্তর দেবেন।",
      errName: "অনুগ্রহ করে আপনার পুরো নাম লিখুন (অন্তত ২ অক্ষর)।", errPhone: "এটি বাংলাদেশি মোবাইল নম্বর মনে হচ্ছে না। এভাবে লিখুন: 01712345678",
      errMsg: "আরেকটু বিস্তারিত লিখবেন? এক-দুই বাক্যই যথেষ্ট।", errEmpty: "আগে একটি উত্তর লিখুন।",
      added: "আপনার বার্তায় যোগ হয়েছে 👍 প্রস্তুত হলে উপরের “হোয়াটসঅ্যাপে পাঠান” চাপুন।", sendWa: "হোয়াটসঅ্যাপে পাঠান", sendMail: "ইমেইলে পাঠান",
      opening: "হোয়াটসঅ্যাপ খুলছে…", opened: "হোয়াটসঅ্যাপ খুলেছে — চেম্বারে পৌঁছাতে সেখানে সেন্ড চাপুন।", other: "অন্যান্য / নিশ্চিত নই",
      phName: "আপনার নাম লিখুন", phTopic: "উপরে বেছে নিন বা লিখুন", phPhone: "01XXXXXXXXX", phMsg: "কী ঘটেছে লিখুন", phDone: "আরও তথ্য যোগ করুন",
      charsLeft: "আর {n} অক্ষর লেখা যাবে", restarted: "চ্যাট নতুন করে শুরু হয়েছে।",
      msgIntro: "আসসালামু আলাইকুম, অ্যাডভোকেট রওশন আলী।", msgName: "নাম", msgPhone: "ফোন", msgMatter: "বিষয়", msgSubject: "পরামর্শের অনুরোধ: {topic}",
    },
  };

  /* Bangla for every data-i18n / data-i18n-attr key in index.html (English comes from the page). */
  const BN = {
    skip: "মূল বিষয়বস্তুতে যান",
    "brand.name": "রওশন আলী", "brand.sub": "অ্যাডভোকেট · সুপ্রীম কোর্ট",
    "nav.about": "পরিচিতি", "nav.solve": "সমাধান খুঁজুন", "nav.laws": "আইন", "nav.qna": "প্রশ্নোত্তর", "nav.quiz": "কুইজ", "nav.chat": "চ্যাট করুন",
    "nav.court": "সুপ্রীম কোর্ট", "nav.official": "সরকারি সূত্র", "nav.media": "দেখুন ও শিখুন", "nav.practice": "অনুশীলনের ক্ষেত্র", "nav.contact": "যোগাযোগ",
    "cta.call": "কল করুন 01717-023985",
    "hero.eyebrow": "দ্য লয়ার্স চেম্বার · ঢাকা", "hero.title": "অ্যাডভোকেট<br /><em>রওশন আলী</em>",
    "hero.sub": "অ্যাডভোকেট, বাংলাদেশ সুপ্রীম কোর্ট · এলএল.বি., এলএল.এম.<br />প্রধান, দ্য লয়ার্স চেম্বার · প্যানেল আইনজীবী, এনসিসি ব্যাংক পিএলসি",
    "hero.cta1": "আমার সমস্যার সমাধান খুঁজুন", "hero.cta2": "হোয়াটসঅ্যাপে চ্যাট করুন",
    "img.portrait": "আদালতের পোশাকে অ্যাডভোকেট রওশন আলী", "img.emblem": "বাংলাদেশ সুপ্রীম কোর্টের প্রতীক",
    "img.night": "রাতে আলোকসজ্জিত বাংলাদেশ সুপ্রীম কোর্ট", "img.day": "দিনের আলোয় বাংলাদেশ সুপ্রীম কোর্ট ভবন",
    "badge.1": "সুপ্রীম কোর্ট", "badge.2": "বাংলাদেশ",
    "cred.label": "এক নজরে", "cred.1": "ফেসবুক ফলোয়ার", "hero.followers": "ফেসবুক ফলোয়ার", "cred.2": "অনুশীলনের ক্ষেত্র", "cred.3": "ঢাকায় চেম্বার", "cred.4": "আইনে স্নাতকোত্তর · সুপ্রীম কোর্টের আইনজীবী",
    "quotes.label": "ন্যায়বিচার নিয়ে উক্তি", "quotes.choose": "উক্তি বেছে নিন",
    "about.eyebrow": "আইনজীবী পরিচিতি", "about.title": "আইন সহজ ভাষায়। <em>লড়াই দৃঢ়তায়।</em>",
    "about.creed": "“আমরা প্রচলিত গণ্ডির বাইরে ভাবি এবং আইনি সমাধান দিই।”", "about.creedBy": "— রওশন আলী, চেম্বার প্রধান",
    "about.p1": "রওশন আলী দ্য লয়ার্স চেম্বার প্রতিষ্ঠা করেছেন — আইনজীবী, ব্যারিস্টার, কর পরামর্শক, ট্রেডমার্ক অ্যাটর্নি ও নোটারি পাবলিক নিয়ে একটি বহুমুখী আইন প্রতিষ্ঠান। ম্যাজিস্ট্রেট ও সহকারী জজ আদালত থেকে সুপ্রীম কোর্ট পর্যন্ত, এবং প্রশাসনিক, শ্রম, কাস্টমস, ভ্যাট ও কর ট্রাইব্যুনালে প্রতিষ্ঠানটি মামলা পরিচালনা করে।",
    "about.p2": "হাজারো মানুষ ফেসবুক ও ইউটিউবে তাঁর আলোচনা দেখেন, যেখানে তিনি আদালতের রায় ও দৈনন্দিন আইন বাংলায় বুঝিয়ে বলেন। তিনি হাইকোর্ট এনরোলমেন্ট পরীক্ষার প্রার্থীদেরও প্রস্তুত করেন।",
    "tl.1a": "শিক্ষা", "tl.1b": "এলএল.বি. ও এলএল.এম.", "tl.1c": "আইনে স্নাতক ও স্নাতকোত্তর।",
    "tl.2a": "তালিকাভুক্তি", "tl.2b": "বাংলাদেশ সুপ্রীম কোর্ট", "tl.2c": "হাইকোর্ট বিভাগ ও নিম্ন আদালতে আইন পেশায় নিয়োজিত।",
    "tl.3a": "নেতৃত্ব", "tl.3b": "প্রধান, দ্য লয়ার্স চেম্বার", "tl.3c": "মগবাজার, সুপ্রীম কোর্ট বার ও কোর্ট হাউস স্ট্রিট।",
    "tl.4a": "ব্যাংকিং", "tl.4b": "প্যানেল আইনজীবী, এনসিসি ব্যাংক পিএলসি", "tl.4c": "ঋণ আদায়, অর্থঋণ ও ব্যাংকিং মামলা।",
    "court.eyebrow": "সর্বোচ্চ আদালতে", "court.title": "<em>বাংলাদেশ সুপ্রীম কোর্টে</em> আইন পেশা",
    "court.p": "সুপ্রীম কোর্ট বার অ্যাসোসিয়েশন ভবনের কোর্ট চেম্বার থেকে তিনি হাইকোর্ট বিভাগে রিট, জামিন, দেওয়ানি ও ফৌজদারি রিভিশন, আপিল এবং কোম্পানি বিষয়ক মামলায় অংশ নেন।",
    "court.t1": "রিট পিটিশন · অনুচ্ছেদ ১০২", "court.t2": "আগাম জামিন", "court.t3": "দেওয়ানি রিভিশন", "court.t4": "ফৌজদারি আপিল", "court.t5": "কোম্পানি বিষয়ক",
    "court.videoError": "ভিডিও লোড হয়নি — তার বদলে ছবি দেখানো হচ্ছে।", "court.caption": "আলোকসজ্জিত সুপ্রীম কোর্ট · ঢাকা",
    "solve.eyebrow": "সমাধান খুঁজুন", "solve.title": "আপনার সমস্যা কী? <em>এখান থেকে শুরু করুন।</em>",
    "solve.intro": "আপনার অবস্থার সাথে মেলে এমনটি বেছে নিন। প্রযোজ্য আইন, করণীয় প্রথম পদক্ষেপ এবং আইনজীবীর কাছে যাওয়ার আগে কোন কাগজপত্র গুছিয়ে রাখবেন — সব দেখতে পাবেন।",
    "solve.types": "সমস্যার ধরন",
    "laws.eyebrow": "বাংলাদেশের আইন জানুন", "laws.title": "যে আইনগুলো <em>দৈনন্দিন জীবন</em> গড়ে",
    "laws.intro": "গুরুত্বপূর্ণ আইন খুঁজুন বা ফিল্টার করুন। সহজ ভাষায় মূল ধারাগুলো দেখতে কার্ডে চাপ দিন।",
    "laws.searchLabel": "আইন খুঁজুন", "laws.placeholder": "খুঁজুন: চেক, জমি, তালাক, জামিন…", "laws.empty": "এই খোঁজের সাথে কোনো আইন মেলেনি।",
    filter: "বিভাগ অনুযায়ী ফিল্টার", clear: "খোঁজ মুছুন", askAdvocate: "আইনজীবীকে জিজ্ঞাসা করুন",
    "rights.label": "আপনার মৌলিক অধিকার",
    "rights.1a": "অনুচ্ছেদ ২৭", "rights.1b": "আইনের দৃষ্টিতে সবাই সমান",
    "rights.2a": "অনুচ্ছেদ ৩৩", "rights.2b": "গ্রেপ্তারের কারণ জানা, আইনজীবী এবং ২৪ ঘণ্টার মধ্যে ম্যাজিস্ট্রেটের সামনে হাজির",
    "rights.3a": "অনুচ্ছেদ ৩৫", "rights.3b": "নিজের বিরুদ্ধে সাক্ষ্য দিতে বাধ্য করা যাবে না",
    "rights.4a": "অনুচ্ছেদ ৩৯", "rights.4b": "চিন্তা, বিবেক ও বাকস্বাধীনতা",
    "official.eyebrow": "সরকারি সূত্র", "official.title": "<em>মূল সূত্র</em> থেকে যাচাই করুন",
    "official.intro": "সরকারি আইন, ই-সেবা, আইনগত সহায়তা এবং আইনজীবী যাচাইয়ের জন্য সরকারি ও বার কাউন্সিলের ওয়েবসাইট।",
    "qna.eyebrow": "প্রশ্ন ও উত্তর", "qna.title": "মানুষ <em>সবচেয়ে বেশি</em> যা জানতে চান",
    "qna.searchLabel": "প্রশ্ন খুঁজুন", "qna.placeholder": "আপনার প্রশ্ন লিখুন…", "qna.empty": "মিলে যায় এমন প্রশ্ন এখনো নেই।",
    "qna.askThis": "এটি হোয়াটসঅ্যাপে জিজ্ঞাসা করুন", "qna.askTitle": "উত্তর খুঁজে পাননি?", "qna.askText": "আপনার প্রশ্ন সরাসরি হোয়াটসঅ্যাপে চেম্বারে পাঠান।",
    "qna.askBtn": "হোয়াটসঅ্যাপে জিজ্ঞাসা করুন", "qna.prefix": "আমার একটি আইনি প্রশ্ন আছে: ",
    "media.eyebrow": "দেখুন ও শিখুন", "media.title": "আইন, <em>বাংলায়</em> বোঝানো",
    "media.intro": "সাধারণ মানুষের জন্য হাইকোর্টের নতুন আদেশ, অধিকার ও আইনি প্রক্রিয়া বোঝাতে তিনি নিয়মিত লাইভে আসেন।",
    "media.fb": "১৪ হাজার+ ফলোয়ার · লাইভ আইনি আলোচনা", "media.follow": "ফলো করুন ↗", "media.yt": "দ্য লয়ার্স চেম্বার চ্যানেল", "media.watch": "দেখুন ↗",
    "media.hc": "হাইকোর্ট পরীক্ষার ব্যাচ", "media.hcText": "হাইকোর্ট বিভাগে এনরোলমেন্টের প্রস্তুতি নেওয়া আইনজীবীদের জন্য কোচিং", "media.enquire": "জানতে চান →",
    "media.hcTopic": "হাইকোর্ট এনরোলমেন্ট পরীক্ষার কোচিং",
    "quiz.eyebrow": "ইন্টারঅ্যাক্টিভ", "quiz.title": "আপনার <em>অধিকার</em> কতটা জানেন?", "quiz.intro": "ছয়টি ছোট প্রশ্ন। প্রতিটি উত্তরের সাথে আইনটিও জানবেন।",
    "practice.eyebrow": "অনুশীলনের ক্ষেত্র", "practice.title": "ম্যাজিস্ট্রেট আদালত থেকে <em>সুপ্রীম কোর্ট পর্যন্ত</em>",
    "clients.label": "প্রাতিষ্ঠানিক ক্লায়েন্ট", "clients.title": "যাঁরা আস্থা রাখেন",
    "contact.eyebrow": "আইনজীবীর সাথে যোগাযোগ", "contact.title": "কী ঘটেছে বলুন। <em>আমরা সমাধানের কথা বলব।</em>",
    "contact.intro": "চ্যাটে কয়েকটি ছোট প্রশ্নের উত্তর দিন। এরপর আপনার বার্তা হোয়াটসঅ্যাপে খুলবে, চেম্বারে পাঠানোর জন্য প্রস্তুত অবস্থায়। এই ওয়েবসাইটে কিছুই সংরক্ষণ করা হয় না।",
    "contact.call": "কল করুন", "contact.email": "ইমেইল", "copy.phone": "ফোন নম্বর কপি করুন", "copy.email": "ইমেইল ঠিকানা কপি করুন",
    "ch.1": "চেম্বার ০১ · মগবাজার", "ch.1a": "ফ্ল্যাট এ-৪ (৪র্থ তলা), ১২৯ বড় মগবাজার, রমনা সেঞ্চুরি অ্যাভিনিউ, ঢাকা-১২১৭",
    "ch.2": "কোর্ট চেম্বার ০২ · সুপ্রীম কোর্ট", "ch.2a": "হল রুম নং ০২, ১ম তলা, সুপ্রীম কোর্ট বার অ্যাসোসিয়েশন ভবন, রমনা, ঢাকা",
    "ch.3": "কোর্ট চেম্বার ০৩ · কোতোয়ালি", "ch.3a": "রুম নং ৩০১, ৩৩ কোর্ট হাউস স্ট্রিট, কোতোয়ালি, ঢাকা-১১০০", maps: "ম্যাপে দেখুন ↗",
    "chat.name": "অ্যাড. রওশন আলী", "chat.callLabel": "চেম্বারে কল করুন", "chat.restart": "চ্যাট আবার শুরু করুন", "chat.label": "চেম্বারের সাথে চ্যাট",
    "chat.today": "আজ", "chat.notice": "🔒 এই চ্যাট আপনার ব্রাউজারেই চলে। হোয়াটসঅ্যাপে সেন্ড চাপলেই কেবল আপনার বার্তা চেম্বারে যাবে।",
    "chat.reply": "আপনার উত্তর", "chat.send": "পাঠান", "chat.open": "আইনজীবীর সাথে চ্যাট করুন",
    "help.label": "জরুরি হেল্পলাইন", "help.1": "পুলিশ · ফায়ার · অ্যাম্বুলেন্স", "help.2": "বিনামূল্যে সরকারি আইনগত সহায়তা", "help.3": "নারী ও শিশু নির্যাতন প্রতিরোধ", "help.4": "ভোক্তা অধিকার অভিযোগ",
    "footer.name": "অ্যাডভোকেট রওশন আলী", "footer.role": "বাংলাদেশ সুপ্রীম কোর্ট · প্রধান, দ্য লয়ার্স চেম্বার",
    "footer.explore": "ঘুরে দেখুন", "footer.contact": "যোগাযোগ", "footer.official": "সরকারি",
    "footer.sc": "সুপ্রীম কোর্ট ↗", "footer.ljd": "আইন ও বিচার বিভাগ ↗", "footer.bar": "বার কাউন্সিল ↗", "footer.aid": "আইনগত সহায়তা · ১৬৪৩০ ↗",
    "footer.disclaimer": "এই ওয়েবসাইটের তথ্য বাংলাদেশের আইন সম্পর্কে সাধারণ আইনি তথ্য, আপনার নির্দিষ্ট মামলার আইনি পরামর্শ নয়, এবং কোনো প্রকার মক্কেল সংগ্রহের উদ্দেশ্যে নয়। আইন পরিবর্তিত হয়। পদক্ষেপ নেওয়ার আগে আইনজীবীর সাথে কথা বলুন। এটি একটি ব্যক্তিগত ওয়েবসাইট, বাংলাদেশ সুপ্রীম কোর্টের দাপ্তরিক ওয়েবসাইট নয়।",
    "footer.demo": "ডেমো ওয়েবসাইট — শুধু প্রিভিউয়ের জন্য। প্রকাশের আগে বিষয়বস্তু আইনজীবী পর্যালোচনা করবেন।",
    "footer.copy": "অ্যাডভোকেট রওশন আলী · দ্য লয়ার্স চেম্বার, ঢাকা। সর্বস্বত্ব সংরক্ষিত।",
    "tab.label": "দ্রুত নেভিগেশন", "tab.home": "হোম", "tab.solve": "সমাধান", "tab.laws": "আইন", "tab.qna": "প্রশ্নোত্তর", "tab.chat": "চ্যাট",
    toTop: "উপরে যান", close: "বন্ধ করুন",
  };

  const listeners = [];
  const enText = new Map();   // element -> original English innerHTML
  const enAttr = new Map();   // element -> { attr: original English value }
  let current = "en";

  const store = {
    get() { try { return localStorage.getItem(STORAGE_KEY); } catch { return null; } },
    set(v) { try { localStorage.setItem(STORAGE_KEY, v); } catch { /* storage blocked: choice lasts this visit only */ } },
  };

  function t(key, vars) {
    let s = (JS[current] && JS[current][key]) ?? JS.en[key] ?? key;
    if (vars) Object.keys(vars).forEach((k) => { s = s.split(`{${k}}`).join(String(vars[k])); });
    return s;
  }

  const parseAttrSpec = (spec) =>
    spec.split(";").map((p) => p.split(":")).filter((p) => p.length === 2).map(([a, k]) => [a.trim(), k.trim()]);

  function applyStatic() {
    document.querySelectorAll("[data-i18n]").forEach((el) => {
      if (!enText.has(el)) enText.set(el, el.innerHTML);
      const bn = BN[el.dataset.i18n];
      el.innerHTML = current === "bn" && bn ? bn : enText.get(el);
    });
    document.querySelectorAll("[data-i18n-attr]").forEach((el) => {
      if (!enAttr.has(el)) enAttr.set(el, {});
      const saved = enAttr.get(el);
      parseAttrSpec(el.dataset.i18nAttr).forEach(([attr, key]) => {
        if (!(attr in saved)) saved[attr] = el.getAttribute(attr) || "";
        const bn = BN[key];
        el.setAttribute(attr, current === "bn" && bn ? bn : saved[attr]);
      });
    });
    document.querySelectorAll(".lang-toggle").forEach((b) => b.setAttribute("aria-label", t("langLabel")));
  }

  function setLang(lang, { announce = false } = {}) {
    current = lang === "bn" ? "bn" : "en";
    document.documentElement.lang = current;
    document.title = t("title");
    applyStatic();
    store.set(current);
    listeners.forEach((fn) => fn(current));
    if (announce && window.Toast) window.Toast.show(t("langOn"), "success");
  }

  window.I18N = {
    t,
    lang: () => current,
    isBn: () => current === "bn",
    set: setLang,
    toggle: () => setLang(current === "bn" ? "en" : "bn", { announce: true }),
    onChange: (fn) => listeners.push(fn),
    /* Bangla digits when Bangla is on. */
    num: (n) => (current === "bn" ? String(n).replace(/\d/g, (d) => "০১২৩৪৫৬৭৮৯"[d]) : String(n)),
    initial: () => (store.get() === "bn" ? "bn" : "en"),
  };
})();
