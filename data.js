/* Content for the site. Edit here — no HTML changes needed.
   Legal summaries are general information, reviewed Oct 2026; confirm current law before relying on them. */

const SITE = {
  whatsapp: "8801717023985",
  email: "lawyerschamber2016@gmail.com",
};

const QUOTES = [
  { text: "All citizens are equal before law and are entitled to equal protection of law.", by: "Constitution of Bangladesh, Article 27", bn: "আইনের দৃষ্টিতে সকল নাগরিক সমান" },
  { text: "Justice should not only be done, but should manifestly and undoubtedly be seen to be done.", by: "Lord Hewart, 1924" },
  { text: "Injustice anywhere is a threat to justice everywhere.", by: "Martin Luther King Jr." },
  { text: "Be you ever so high, the law is above you.", by: "Thomas Fuller" },
  { text: "It is better that ten guilty persons escape than that one innocent suffer.", by: "William Blackstone" },
  { text: "Wherever law ends, tyranny begins.", by: "John Locke" },
  { text: "Justice delayed is justice denied.", by: "Legal maxim" },
];

const SOLUTIONS = [
  {
    id: "land", icon: "home", title: "Land or property dispute", bn: "জমি-জমা",
    law: "Transfer of Property Act 1882 · Registration Act 1908 · State Acquisition & Tenancy Act 1950 · Specific Relief Act 1877 · Land Crimes Prevention and Remedy Act 2023",
    steps: [
      "Collect every document: deeds (dolil), khatian / record-of-rights (CS, SA, RS, BS), mutation (namjari) papers and land-tax receipts.",
      "Get a certified copy of the deed and khatian from the registry / AC Land office to check the title chain.",
      "If you have been dispossessed, act quickly — a suit to recover possession under s.9 Specific Relief Act must be filed within 6 months.",
      "If a breach of peace is likely, a proceeding under s.145 CrPC can be filed before the Executive Magistrate.",
      "Do not sign or register anything under pressure; never pay for land without a registered deed.",
    ],
    docs: ["Title deeds & via-deeds", "Khatian (all surveys)", "Namjari / DCR", "Land-tax (khajna) receipts", "Mouza map"],
  },
  {
    id: "family", icon: "users", title: "Marriage, divorce or custody", bn: "পারিবারিক",
    law: "Muslim Family Laws Ordinance 1961 · Dissolution of Muslim Marriages Act 1939 · Family Courts Act 2023 · Guardians and Wards Act 1890",
    steps: [
      "Keep your nikahnama (marriage registration) — it records denmohor (dower) and any delegated right of divorce.",
      "Talaq must be notified in writing to the Union Parishad / City Corporation chairman; it takes effect after 90 days.",
      "Claims for dower, maintenance, custody and guardianship are filed in the Family Court.",
      "A wife can seek dissolution on statutory grounds (e.g. non-maintenance for 2 years, cruelty).",
      "Custody is decided on the child's welfare — keep records of who cares for the child day to day.",
    ],
    docs: ["Nikahnama / Kabinnama", "NID of both parties", "Children's birth certificates", "Proof of income / expenses", "Any messages or evidence of abuse"],
  },
  {
    id: "cheque", icon: "banknote", title: "Cheque bounced / money unpaid", bn: "চেক ডিজঅনার",
    law: "Negotiable Instruments Act 1881, s.138 · Artha Rin Adalat Ain 2003 (bank loans)",
    steps: [
      "Present the cheque within 6 months of its date (or within its validity).",
      "After the bank returns it, send a written legal notice to the drawer within 30 days.",
      "The drawer has 30 days after receiving notice to pay.",
      "If unpaid, file a complaint before the court within the next one month — missing this deadline can defeat the case.",
      "Punishment can be up to 1 year imprisonment and/or a fine up to three times the cheque amount.",
    ],
    docs: ["Original cheque", "Bank dishonour slip", "Copy of legal notice & postal receipt", "Agreement / proof of debt"],
  },
  {
    id: "criminal", icon: "shield", title: "Arrest, FIR or criminal case", bn: "ফৌজদারি",
    law: "Constitution Art. 33 & 35 · Code of Criminal Procedure 1898 · Penal Code 1860",
    steps: [
      "An arrested person must be told the grounds of arrest and may consult a lawyer of their choice (Art. 33).",
      "They must be produced before a magistrate within 24 hours, excluding travel time.",
      "If police refuse an FIR, a complaint can be filed directly before the Magistrate (s.200 CrPC).",
      "If you fear arrest in a false case, ask an advocate about anticipatory bail before the High Court Division / Sessions Court.",
      "Do not sign any statement without understanding it — you cannot be compelled to be a witness against yourself (Art. 35).",
    ],
    docs: ["FIR / GD copy or case number", "Charge-sheet (if any)", "NID", "Any evidence: photos, messages, witnesses"],
  },
  {
    id: "cyber", icon: "lock", title: "Online harassment or fraud", bn: "সাইবার অপরাধ",
    law: "Cyber-security law in force (Cyber Security Act 2023 was replaced by an Ordinance in 2025) · Pornography Control Act 2012 · Penal Code 1860",
    steps: [
      "Do not delete anything. Take screenshots showing the profile link, date and time.",
      "Report the account/content to the platform and keep the report reference.",
      "File a GD at the nearest police station; for women, the Police Cyber Support for Women (PCSW) can help.",
      "For mobile-money fraud, call your provider's hotline immediately to freeze the transaction.",
      "An advocate can file a case before the Cyber Tribunal and seek removal of content.",
    ],
    docs: ["Screenshots with URLs", "Transaction IDs", "GD copy", "Phone numbers / profile links involved"],
  },
  {
    id: "job", icon: "briefcase", title: "Job, salary or dismissal", bn: "শ্রম ও চাকরি",
    law: "Bangladesh Labour Act 2006 · Labour Rules 2015",
    steps: [
      "Every worker is entitled to a written appointment letter and an ID card.",
      "Unpaid wages, overtime, gratuity and service benefits can be claimed.",
      "Against dismissal or termination, raise a written grievance with the employer under s.33 — strict 30-day time limits apply.",
      "If unresolved, file a case before the Labour Court.",
      "Keep pay slips and attendance records; bank statements showing salary also help.",
    ],
    docs: ["Appointment letter", "ID card", "Pay slips / bank statements", "Termination letter", "Copy of grievance letter"],
  },
  {
    id: "business", icon: "building", title: "Business, company or contract", bn: "ব্যবসা ও কোম্পানি",
    law: "Companies Act 1994 · Contract Act 1872 · Arbitration Act 2001 · Trade Marks Act 2009",
    steps: [
      "Put every deal in a written, signed agreement with clear payment and dispute terms.",
      "Register your company (RJSC), trade licence, TIN/BIN before trading.",
      "Protect brand names and logos with a trademark application (DPDT).",
      "Check whether your contract has an arbitration clause — it changes where disputes go.",
      "For recovery from a borrower, banks proceed before the Artha Rin Adalat.",
    ],
    docs: ["Contracts / MoUs", "Trade licence", "Incorporation documents", "Invoices & correspondence"],
  },
  {
    id: "rights", icon: "landmark", title: "Government action or fundamental rights", bn: "রিট ও মৌলিক অধিকার",
    law: "Constitution Part III (Art. 26–47A) · Article 102 (writ jurisdiction) · Right to Information Act 2009",
    steps: [
      "If a public authority acts unlawfully or violates a fundamental right, a writ petition can be filed in the High Court Division under Article 102.",
      "Before a writ, a written demand for justice to the authority usually strengthens the case.",
      "Under the RTI Act, a public office must answer an information request within 20 working days.",
      "Public interest litigation can be brought on issues affecting the public at large.",
    ],
    docs: ["The order / notice being challenged", "Correspondence with the authority", "Proof of your interest in the matter"],
  },
];

const LAWS = [
  { cat: "Constitution", name: "Constitution of the People's Republic of Bangladesh", year: 1972, bn: "সংবিধান",
    summary: "The supreme law. Part III guarantees fundamental rights; any law inconsistent with them is void to that extent.",
    points: ["Art. 27 — equality before law", "Art. 31 — right to protection of law", "Art. 32 — life and personal liberty", "Art. 33 — safeguards on arrest (reasons, lawyer, magistrate within 24 hours)", "Art. 35 — no double jeopardy, no self-incrimination, speedy public trial", "Art. 39 — freedom of thought, conscience and speech", "Art. 102 — High Court Division can issue writs to enforce rights"] },
  { cat: "Criminal", name: "Penal Code", year: 1860, bn: "দণ্ডবিধি",
    summary: "Defines most crimes and their punishments.",
    points: ["s.302 — murder", "s.379 — theft", "s.406 — criminal breach of trust", "s.420 — cheating", "s.499/500 — defamation", "s.506 — criminal intimidation"] },
  { cat: "Criminal", name: "Code of Criminal Procedure", year: 1898, bn: "ফৌজদারি কার্যবিধি",
    summary: "How criminal cases move: FIR, arrest, bail, investigation and trial.",
    points: ["s.54 — arrest without warrant (limited by Supreme Court guidelines)", "s.154 — recording an FIR", "s.167 — remand", "s.200 — complaint directly to a Magistrate", "s.145 — land disputes threatening peace", "ss.496–498 — bail"] },
  { cat: "Criminal", name: "Women and Children Repression Prevention Act", year: 2000, bn: "নারী ও শিশু নির্যাতন দমন আইন",
    summary: "Special tribunals and heavy punishments for rape, acid attacks, trafficking and dowry-related violence.",
    points: ["Cases tried by special tribunals", "Covers rape, sexual oppression, trafficking, dowry violence", "Victim support and helpline 109"] },
  { cat: "Criminal", name: "Cyber-security law", year: 2025, bn: "সাইবার নিরাপত্তা",
    summary: "Offences such as hacking, online fraud and identity misuse. The Cyber Security Act 2023 was repealed and replaced by an Ordinance in 2025 — check the version currently in force.",
    points: ["Hacking & illegal access", "Online fraud and identity theft", "Cases heard by the Cyber Tribunal"] },
  { cat: "Civil", name: "Code of Civil Procedure", year: 1908, bn: "দেওয়ানি কার্যবিধি",
    summary: "The procedure for civil suits — property, contracts, money and declarations.",
    points: ["s.9 — civil courts hear all civil suits unless barred", "Order 39 rr.1–2 — temporary injunction", "s.96 — appeal from original decree", "s.115 — revision"] },
  { cat: "Civil", name: "Specific Relief Act", year: 1877, bn: "সুনির্দিষ্ট প্রতিকার আইন",
    summary: "Remedies such as recovering possession, declarations of title and injunctions.",
    points: ["s.9 — recover possession within 6 months of dispossession", "s.42 — declaration of title", "s.54 — perpetual injunction"] },
  { cat: "Civil", name: "Limitation Act", year: 1908, bn: "তামাদি আইন",
    summary: "Sets deadlines for filing suits and appeals. A strong case can be lost by filing late.",
    points: ["Different time limits for each kind of suit", "s.5 — delay in appeals can be condoned for sufficient cause"] },
  { cat: "Land", name: "Transfer of Property Act", year: 1882, bn: "সম্পত্তি হস্তান্তর আইন",
    summary: "Governs sale, mortgage, lease and gift of property.",
    points: ["s.54 — sale of immovable property only by registered instrument", "Rules on mortgages and leases"] },
  { cat: "Land", name: "Registration Act", year: 1908, bn: "রেজিস্ট্রেশন আইন",
    summary: "Which documents must be registered and how.",
    points: ["s.17 — compulsory registration of deeds affecting immovable property", "Unregistered compulsory deeds do not pass title"] },
  { cat: "Land", name: "State Acquisition and Tenancy Act", year: 1950, bn: "রাষ্ট্রীয় অধিগ্রহণ ও প্রজাস্বত্ব আইন",
    summary: "Record-of-rights (khatian), mutation and pre-emption.",
    points: ["s.96 — pre-emption by co-sharers", "s.143 — mutation of records", "Land Survey Tribunal for errors in record-of-rights"] },
  { cat: "Land", name: "Land Crimes Prevention and Remedy Act", year: 2023, bn: "ভূমি অপরাধ প্রতিরোধ ও প্রতিকার আইন",
    summary: "Makes land forgery, unlawful occupation and fraudulent sale criminal offences.",
    points: ["Forged documents and fraudulent sale", "Unlawful occupation of land", "Faster remedies for victims"] },
  { cat: "Family", name: "Muslim Family Laws Ordinance", year: 1961, bn: "মুসলিম পারিবারিক আইন অধ্যাদেশ",
    summary: "Rules on talaq, polygamy, maintenance and inheritance by orphaned grandchildren.",
    points: ["s.4 — orphaned grandchildren inherit", "s.6 — second marriage needs Arbitration Council permission", "s.7 — talaq notice to chairman, effective after 90 days", "s.9 — maintenance"] },
  { cat: "Family", name: "Family Courts Act", year: 2023, bn: "পারিবারিক আদালত আইন",
    summary: "Replaced the 1985 Ordinance. Family Courts hear dissolution, dower, maintenance, conjugal rights, guardianship and custody.",
    points: ["Single forum for family disputes", "Encourages reconciliation before trial"] },
  { cat: "Family", name: "Child Marriage Restraint Act", year: 2017, bn: "বাল্যবিবাহ নিরোধ আইন",
    summary: "Minimum age of marriage: 18 for women, 21 for men. Arranging a child marriage is an offence.",
    points: ["Parents, guardians and officiants can be punished"] },
  { cat: "Family", name: "Dowry Prohibition Act", year: 2018, bn: "যৌতুক নিরোধ আইন",
    summary: "Demanding, giving or taking dowry is a punishable offence.",
    points: ["False dowry cases are also punishable"] },
  { cat: "Family", name: "Domestic Violence (Prevention and Protection) Act", year: 2010, bn: "পারিবারিক সহিংসতা আইন",
    summary: "Protection orders, residence orders and compensation for victims of domestic violence.",
    points: ["Physical, psychological, sexual and economic abuse covered"] },
  { cat: "Business", name: "Negotiable Instruments Act", year: 1881, bn: "হস্তান্তরযোগ্য দলিল আইন",
    summary: "Cheques, promissory notes and bills — including the cheque-dishonour offence.",
    points: ["s.138 — dishonour of cheque", "Notice within 30 days; 30 days to pay; complaint within 1 month", "Appeal requires depositing 50% of the cheque amount"] },
  { cat: "Business", name: "Companies Act", year: 1994, bn: "কোম্পানি আইন",
    summary: "Formation, management and winding-up of companies registered with RJSC.",
    points: ["Directors' duties", "Shareholder remedies", "Winding up"] },
  { cat: "Business", name: "Artha Rin Adalat Ain (Money Loan Courts Act)", year: 2003, bn: "অর্থঋণ আদালত আইন",
    summary: "Special courts for recovery of loans by banks and financial institutions.",
    points: ["Mandatory mediation stage", "Auction of mortgaged property"] },
  { cat: "Business", name: "Arbitration Act", year: 2001, bn: "সালিশ আইন",
    summary: "Private resolution of commercial disputes outside court.",
    points: ["Enforcement of domestic and foreign awards"] },
  { cat: "Business", name: "Bangladesh Labour Act", year: 2006, bn: "বাংলাদেশ শ্রম আইন",
    summary: "Employment terms, wages, working hours, leave, termination and trade unions.",
    points: ["s.5 — appointment letter & ID card", "s.33 — grievance procedure", "Labour Courts and Labour Appellate Tribunal"] },
  { cat: "Business", name: "Income Tax Act", year: 2023, bn: "আয়কর আইন",
    summary: "Replaced the Income Tax Ordinance 1984. Return filing, assessment and appeals to the Taxes Appellate Tribunal.",
    points: ["Annual return", "Appeals and tribunal"] },
  { cat: "Citizen", name: "Consumer Rights Protection Act", year: 2009, bn: "ভোক্তা অধিকার সংরক্ষণ আইন",
    summary: "Complain against adulteration, overcharging and false advertising to the Directorate of National Consumer Rights Protection.",
    points: ["Complain within 30 days of the cause", "Complainant can receive a share of the fine", "Hotline 16121"] },
  { cat: "Citizen", name: "Right to Information Act", year: 2009, bn: "তথ্য অধিকার আইন",
    summary: "Any citizen can request information from public authorities.",
    points: ["Reply within 20 working days", "Appeal, then complaint to the Information Commission"] },
  { cat: "Citizen", name: "Legal Aid Services Act", year: 2000, bn: "আইনগত সহায়তা প্রদান আইন",
    summary: "Free legal help for people who cannot afford a lawyer, through the National Legal Aid Services Organisation.",
    points: ["District Legal Aid Offices in every district", "Government hotline 16430 (toll-free)"] },
];

const FAQS = [
  { cat: "Criminal", q: "Police arrested a family member. What should we do first?", a: "Ask which police station and case number. Under Article 33 they must be told why they are arrested, may consult a lawyer, and must be produced before a magistrate within 24 hours. Contact an advocate immediately so a bail application can be prepared for the first hearing." },
  { cat: "Criminal", q: "The police won't record my case. Do I have another option?", a: "Yes. You can file a complaint petition directly before the Magistrate's Court under s.200 CrPC. The magistrate may examine you and take cognizance or send it for inquiry." },
  { cat: "Criminal", q: "What is anticipatory bail?", a: "If you reasonably fear arrest in a case, you can apply for bail before arrest. In Bangladesh it is usually sought from the High Court Division or Sessions Court and is granted on the facts of each case." },
  { cat: "Criminal", q: "What is the difference between a GD and an FIR?", a: "A General Diary (GD) records information — a lost item, a threat. A First Information Report (FIR) starts a criminal case for a cognizable offence. A GD can later support a case." },
  { cat: "Land", q: "How do I check that land is genuine before buying?", a: "Trace the title back through the deeds, match the seller's name in the latest khatian (BS/RS), check mutation and land-tax records, search for pending cases or mortgages, and visit the land. An advocate's title search is the safest step before paying anything." },
  { cat: "Land", q: "Someone has forcibly occupied my land. What can I do?", a: "If you were dispossessed without due process, a suit under s.9 Specific Relief Act must be filed within 6 months. You may also use s.145 CrPC and the Land Crimes Prevention and Remedy Act 2023. Speed matters." },
  { cat: "Land", q: "What is namjari (mutation) and why does it matter?", a: "Mutation updates the government record so that the new owner's name appears in the khatian. Without it you may face problems paying land tax, selling or proving possession. Apply at the AC Land office or online via the land portal." },
  { cat: "Family", q: "How does a Muslim divorce (talaq) become effective?", a: "Under s.7 of the Muslim Family Laws Ordinance 1961, written notice must be sent to the chairman of the Union Parishad / City Corporation and to the wife. It takes effect 90 days after the chairman receives notice, during which reconciliation is attempted." },
  { cat: "Family", q: "Can a wife file for divorce?", a: "Yes — if the right was delegated in the nikahnama (talaq-e-tafweez) she can exercise it, or she can apply to the Family Court for dissolution on grounds under the Dissolution of Muslim Marriages Act 1939." },
  { cat: "Family", q: "Who gets custody of the children?", a: "The court decides according to the welfare of the child. Personal law presumptions apply, but the child's best interest is the deciding factor, and the father generally remains legal guardian of property." },
  { cat: "Family", q: "Is denmohor (dower) payable after divorce?", a: "Yes. Unpaid dower is a debt owed to the wife and can be claimed in the Family Court along with maintenance during the iddat period." },
  { cat: "Money", q: "My cheque bounced. Is it too late to file a case?", a: "The timeline is strict: legal notice within 30 days of dishonour, 30 days for the drawer to pay, then complaint within one month. If you missed a step, speak to an advocate — sometimes the cheque can be re-presented within its validity." },
  { cat: "Money", q: "I gave a loan without any document. Can I recover it?", a: "Possibly, through a civil money suit, if you can prove the loan with bank transfers, witnesses, messages or acknowledgements. Always record loans in writing in future." },
  { cat: "Cyber", q: "Someone is spreading my photos online. What should I do?", a: "Keep evidence (screenshots with links and time), report to the platform, file a GD and contact an advocate. Women can also contact Police Cyber Support for Women. A case may be filed under the cyber-security law and the Pornography Control Act 2012." },
  { cat: "General", q: "I can't afford a lawyer. Is there free legal help?", a: "Yes. The government's National Legal Aid Services Organisation provides free legal aid. Call the toll-free hotline 16430 or visit the District Legal Aid Office at your district judge court." },
  { cat: "General", q: "What documents should I bring to my first consultation?", a: "Bring your NID, every paper related to the problem (deeds, notices, agreements, case copies), a written timeline of events, and names of witnesses. The more organised the facts, the more precise the advice." },
  { cat: "General", q: "How long does a case take in Bangladesh?", a: "It depends on the court and complexity — some matters settle in weeks through notice or mediation, while contested civil suits can take years. An advocate can advise on faster routes such as mediation, arbitration or ADR." },
];

const QUIZ = [
  { q: "An arrested person must be produced before a magistrate within…", options: ["12 hours", "24 hours", "48 hours", "7 days"], answer: 1, why: "Article 33(2) of the Constitution — 24 hours, excluding travel time." },
  { q: "What is the minimum legal age of marriage for women in Bangladesh?", options: ["16", "17", "18", "21"], answer: 2, why: "Child Marriage Restraint Act 2017: 18 for women, 21 for men." },
  { q: "After a cheque bounces, the legal notice must be sent within…", options: ["7 days", "15 days", "30 days", "6 months"], answer: 2, why: "s.138 Negotiable Instruments Act 1881 — within 30 days of the bank's information." },
  { q: "What is the toll-free government legal aid hotline?", options: ["999", "109", "16430", "333"], answer: 2, why: "16430 — National Legal Aid Services Organisation." },
  { q: "A sale of land is legally complete only when…", options: ["Money is paid", "Possession is given", "A deed is registered", "Witnesses sign a stamp paper"], answer: 2, why: "s.54 Transfer of Property Act and s.17 Registration Act require a registered deed." },
  { q: "Talaq becomes effective how many days after notice to the chairman?", options: ["30", "60", "90", "120"], answer: 2, why: "s.7 Muslim Family Laws Ordinance 1961 — 90 days." },
];

const PRACTICE = [
  { name: "Criminal Law", icon: "shield" }, { name: "Civil Litigation", icon: "scale" }, { name: "Constitutional & Writ", icon: "landmark" },
  { name: "Family & Personal Law", icon: "users" }, { name: "Land & Conveyancing", icon: "home" }, { name: "Banking & Money Loan", icon: "banknote" },
  { name: "Corporate & Company", icon: "building" }, { name: "Labour & Industrial", icon: "briefcase" }, { name: "Revenue, VAT & Tax", icon: "percent" },
  { name: "Intellectual Property", icon: "bulb" }, { name: "Admiralty & Maritime", icon: "anchor" }, { name: "Arbitration & ADR", icon: "handshake" },
  { name: "Environmental Law", icon: "leaf" }, { name: "Insurance", icon: "umbrella" }, { name: "Foreign Investment", icon: "trending" },
  { name: "Notary Public", icon: "stamp" }, { name: "Public Interest Litigation", icon: "megaphone" }, { name: "International Trade", icon: "globe" },
];

const CLIENTS = [
  "NCC Bank PLC", "Gulam Foundation, London", "Crossworld Limited, Dubai", "PIDIM Group", "Bangladesh Laptop Association",
  "Genius Medical Devices", "Confident Properties", "Jute World", "Citizen Computers", "Bengal Pictures Production", "Bangla Trac Limited", "Dipjoy Creations",
];

/* Official government / Bar Council sources (linked from the "Official sources" section and law details). */
const OFFICIAL_LAWS_INDEX = "https://lawjusticediv.gov.bd/pages/static-pages/6941401fc4774958d7b54ab2";

const OFFICIAL = [
  { name: "Law and Justice Division", bn: "আইন ও বিচার বিভাগ", desc: "Ministry of Law — notices, circulars, laws & rules, judicial reform.", url: "https://lawjusticediv.gov.bd/", tag: "Ministry", icon: "landmark" },
  { name: "Bangladesh Bar Council", bn: "বাংলাদেশ বার কাউন্সিল", desc: "Advocate enrolment exams, notices and the regulator of advocates.", url: "https://www.barcouncil.gov.bd/", tag: "Regulator", icon: "award" },
  { name: "Legislative & Parliamentary Affairs Division", bn: "লেজিসলেটিভ ও সংসদ বিষয়ক বিভাগ", desc: "Drafts and publishes every Act and Ordinance of Bangladesh.", url: "https://legislativediv.gov.bd/", tag: "Law texts", icon: "book" },
  { name: "Supreme Court of Bangladesh", bn: "বাংলাদেশ সুপ্রীম কোর্ট", desc: "Cause lists, judgments and notices of both Divisions.", url: "https://www.supremecourt.gov.bd/", tag: "Court", icon: "scale" },
  { name: "National Legal Aid (NLASO)", bn: "আইনগত সহায়তা অধিদপ্তর", desc: "Free legal aid for those who cannot afford a lawyer. Hotline 16430.", url: "http://nlaso.gov.bd/", tag: "Free help", icon: "heart" },
  { name: "Department of Registration", bn: "নিবন্ধন অধিদপ্তর", desc: "Deed registration, fees and sub-registry offices.", url: "https://rd.gov.bd/", tag: "Land", icon: "file" },
  { name: "Government e-services", bn: "সরকারি ই-সেবা", desc: "Every government e-service in one place, including court and legal services.", url: "https://bangladesh.gov.bd/site/view/all_eservices_in_bangladesh/", tag: "e-Services", icon: "globe" },
  { name: "Grievance Redress System", bn: "অভিযোগ প্রতিকার ব্যবস্থা", desc: "File an online complaint against any government office.", url: "http://www.grs.gov.bd/", tag: "Complaints", icon: "megaphone" },
];

/* Icon for each law / question category (names defined in icons.css). */
const CAT_ICON = {
  Constitution: "landmark", Criminal: "shield", Civil: "scale", Land: "home", Family: "users",
  Business: "briefcase", Citizen: "user", Money: "banknote", Cyber: "lock", General: "help",
};
