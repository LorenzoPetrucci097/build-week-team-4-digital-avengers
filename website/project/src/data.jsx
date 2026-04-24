// Shared seed data. Synced with the real repo:
// https://github.com/LorenzoPetrucci097/build-week-team-4-digital-avengers

const MEMBERS = [
  { id: "lp", name: "Lorenzo Petrucci",            role: "Team Leader · Pen Testing / CTF / Report", status: "online", initials: "LP" },
  { id: "ck", name: "Christian Koscielniak Pinto", role: "Pen Testing · CTF · Report",               status: "online", initials: "CK" },
  { id: "gc", name: "Gabriele Chinnici",           role: "LLM Specialist · Pen Testing",             status: "online", initials: "GC" },
  { id: "ws", name: "Wafa Saghir",                 role: "C Dev · Malware Analysis · Report",        status: "online", initials: "WS" },
  { id: "aa", name: "Amy Antonella Acosta Hugo",   role: "C Dev · Malware Analysis · Report",        status: "online", initials: "AA" },
  { id: "dm", name: "Domenico Mendola",            role: "Pen Testing · CTF · Code",                 status: "online", initials: "DM" },
  { id: "cv", name: "Corrado Vaccarecci",          role: "Pen Testing · CTF · Code",                 status: "online", initials: "CV" },
];

const REPO = {
  org:  "LorenzoPetrucci097",
  name: "build-week-team-4-digital-avengers",
  url:  "https://github.com/LorenzoPetrucci097/build-week-team-4-digital-avengers",
  branch: "main",
};
const blob = (path) => `${REPO.url}/blob/${REPO.branch}/${path}`;
const tree = (path) => `${REPO.url}/tree/${REPO.branch}/${path}`;

// Every folder / deliverable from the repo, mapped 1:1.
const PROJECTS = [
  {
    id: "#D01", slug: "day1", path: "day1", title: "Day 1 — SQL Injection su DVWA",
    status: "completed", sec: "SEC_LEVEL_3",
    desc: "Sfruttamento sistematico della vulnerabilità SQLi su DVWA: estrazione dati da database MySQL, guida illustrata + report PDF.",
    tags: ["SQLi", "DVWA", "Burp Suite", "MySQL"], date: "20.04.26", owner: "LP",
    lang: "HTML", langColor: "#e34c26", url: tree("day1"),
    artifacts: [
      { name: "Guida_Illustrata_SQLi_DVWA_v2.html", kind: "guide", url: blob("day1/Guida_Illustrata_SQLi_DVWA_v2.html") },
      { name: "Report_Day1_Task01_SQLi_DVWA.pdf",   kind: "pdf",   url: blob("day1/Report_Day1_Task01_SQLi_DVWA.pdf") },
      { name: "img/",                               kind: "dir",   url: tree("day1/img") },
    ],
    featured: true,
  },
  {
    id: "#D02", slug: "day2", path: "day2", title: "Day 2 — XSS & Cookie Theft",
    status: "completed", sec: "SEC_LEVEL_3",
    desc: "Attacco XSS su DVWA, cattura cookie via Python (Flask), analisi dei dati rubati, logs CSV/JSONL.",
    tags: ["XSS", "DVWA", "Python", "Flask"], date: "21.04.26", owner: "CK",
    lang: "Python", langColor: "#3572A5", url: tree("day2"),
    artifacts: [
      { name: "Guida_Illustrata_XSS_DVWA_v2.html", kind: "guide", url: blob("day2/Guida_Illustrata_XSS_DVWA_v2.html") },
      { name: "cookie_catcher.py",                 kind: "code",  url: blob("day2/cookie_catcher.py") },
      { name: "logs/",                             kind: "dir",   url: tree("day2/logs") },
      { name: "Report_XSS_Day2/",                  kind: "dir",   url: tree("day2/Report_XSS_Day2") },
    ],
  },
  {
    id: "#D03", slug: "day3", path: "day3", title: "Day 3 — Buffer Overflow in C",
    status: "completed", sec: "SEC_LEVEL_4",
    desc: "Sviluppo exploit per buffer overflow, debugging con GDB, overflow ASLR-aware. BoF #1, BoF #2 + menu interattivo.",
    tags: ["BoF", "GDB", "GCC", "C"], date: "22.04.26", owner: "WS",
    lang: "C", langColor: "#555555", url: tree("day3"),
    artifacts: [
      { name: "Script/Bof_01.c",   kind: "code", url: blob("day3/Script/Bof_01.c") },
      { name: "Script/Bof_02.c",   kind: "code", url: blob("day3/Script/Bof_02.c") },
      { name: "Script/menu.c",     kind: "code", url: blob("day3/Script/menu.c") },
      { name: "Script/input.txt",  kind: "text", url: blob("day3/Script/input.txt") },
      { name: "report day 3.pdf",  kind: "pdf",  url: blob("day3/report%20day%203.pdf") },
    ],
  },
  {
    id: "#D04", slug: "day4", path: "day4", title: "Day 4 — Samba Exploitation",
    status: "completed", sec: "SEC_LEVEL_4",
    desc: "Ricognizione Samba con Nessus / Nmap, identificazione CVE, exploitation con tool custom, screenshot della catena d'attacco.",
    tags: ["Samba", "Nessus", "Nmap", "CVE"], date: "23.04.26", owner: "DM",
    lang: "PDF", langColor: "#b30b00", url: tree("day4"),
    artifacts: [
      { name: "Report_Day4_Samba_Exploit_DigitalAvengers.pdf", kind: "pdf", url: blob("day4/Report_Day4_Samba_Exploit_DigitalAvengers.pdf") },
      { name: "img/",                                          kind: "dir", url: tree("day4/img") },
    ],
  },
  {
    id: "#D05", slug: "day5", path: "day5", title: "Day 5 — Metasploit Professional",
    status: "completed", sec: "SEC_LEVEL_5",
    desc: "Automazione exploit via Metasploit Framework, moduli custom, post-exploitation, msfvenom + handler.",
    tags: ["Metasploit", "msfvenom", "Post-Ex"], date: "24.04.26", owner: "LP",
    lang: "PDF", langColor: "#b30b00", url: tree("day5"),
    artifacts: [
      { name: "Report_Giorno5_Metasploit_Professionale.pdf", kind: "pdf", url: blob("day5/Report_Giorno5_Metasploit_Professionale.pdf") },
    ],
  },
  {
    id: "#C01", slug: "ctf-jangow01", path: "CTF-Jangow01", title: "CTF — Jangow01 (Extra)",
    status: "completed", sec: "SEC_LEVEL_4",
    desc: "Web CTF con kernel exploit (CVE-45010), escalazione privilegi, flag finale. Gobuster → Nmap → kernel exploit → root.",
    tags: ["CTF", "Gobuster", "Nmap", "Kernel"], date: "extra", owner: "GC",
    lang: "PDF", langColor: "#b30b00", url: tree("CTF-Jangow01"),
    artifacts: [
      { name: "Report_BuildWeek_Task_Extra01_Jangow01_DigitalAvengers.pdf", kind: "pdf", url: blob("CTF-Jangow01/Report_BuildWeek_Task_Extra01_Jangow01_DigitalAvengers.pdf") },
      { name: "img/",                                                        kind: "dir", url: tree("CTF-Jangow01/img") },
    ],
  },
  {
    id: "#C02", slug: "ctf-lupinone", path: "CTF-LupinOne", title: "CTF — Lupin One (Extra)",
    status: "completed", sec: "SEC_LEVEL_3",
    desc: "Penetration testing indipendente con focus su exploitation e post-exploitation. Metasploit, network recon, privilege escalation.",
    tags: ["CTF", "Metasploit", "PrivEsc"], date: "extra", owner: "CV",
    lang: "PDF", langColor: "#b30b00", url: tree("CTF-LupinOne"),
    artifacts: [
      { name: "CTF_LupinOne_Report.pdf", kind: "pdf", url: blob("CTF-LupinOne/CTF_LupinOne_Report.pdf") },
      { name: "img/",                    kind: "dir", url: tree("CTF-LupinOne/img") },
    ],
  },
  {
    id: "#C03", slug: "ctf-epicodeharryp", path: "CTF-EpicodeHarryP", title: "CTF — Harry Potter / EPICODE (Hard)",
    status: "completed", sec: "SEC_LEVEL_5",
    desc: "CTF livello DIFFICILE — 3 bandiere. Network recon, privilege escalation, SQLi, port knocking, decriptaggio.",
    tags: ["CTF", "SQLi", "Knocking", "Crypto"], date: "extra", owner: "AA",
    lang: "HTML", langColor: "#e34c26", url: tree("CTF-EpicodeHarryP"),
    artifacts: [
      { name: "Report_Day3_Bonus_BlackBox_DigitalAvengers.html", kind: "guide", url: blob("CTF-EpicodeHarryP/Report_Day3_Bonus_BlackBox_DigitalAvengers.html") },
      { name: "img/",                                            kind: "dir",   url: tree("CTF-EpicodeHarryP/img") },
    ],
  },
  {
    id: "#C04", slug: "ctf-riccio-pazzo", path: "CTF Extra - Il Riccio Pazzo (Fatta dal team)", title: "CTF Extra — Il Riccio Pazzo (AI-powered)",
    status: "completed", sec: "SEC_LEVEL_4",
    desc: "Challenge AI-powered: Streamlit + OpenAI API + puzzle CTF, costruita dal team. Interfaccia interattiva per enigmi di sicurezza.",
    tags: ["CTF", "Streamlit", "OpenAI", "Python"], date: "extra", owner: "GC",
    lang: "Python", langColor: "#3572A5", url: tree("CTF%20Extra%20-%20Il%20Riccio%20Pazzo%20(Fatta%20dal%20team)"),
    external: "https://github.com/Olliys/Riccio-Pazzo-CTF",
    artifacts: [
      { name: "Riccio/Riccio2.py",        kind: "code", url: blob("CTF%20Extra%20-%20Il%20Riccio%20Pazzo%20(Fatta%20dal%20team)/Riccio/Riccio2.py") },
      { name: "Riccio/requirements.txt",  kind: "text", url: blob("CTF%20Extra%20-%20Il%20Riccio%20Pazzo%20(Fatta%20dal%20team)/Riccio/requirements.txt") },
      { name: "README.md",                kind: "text", url: blob("CTF%20Extra%20-%20Il%20Riccio%20Pazzo%20(Fatta%20dal%20team)/README.md") },
    ],
  },
];

const MILESTONES = [
  { id: "m1", date: "Day 1 · 20.04", title: "SQL Injection — DVWA",     state: "done",
    bullets: ["Login bypass + UNION extraction", "Guida illustrata HTML", "Report PDF consegnato"] },
  { id: "m2", date: "Day 2 · 21.04", title: "XSS & Cookie Theft",       state: "done",
    bullets: ["Cookie catcher Flask live", "Logs CSV / JSONL archiviati", "Report XSS consegnato"] },
  { id: "m3", date: "Day 3 · 22.04", title: "Buffer Overflow in C",     state: "done",
    bullets: ["BoF #1 + BoF #2 in C", "Debugging con GDB", "Bonus: HarryP Black Box CTF"] },
  { id: "m4", date: "Day 4 · 23.04", title: "Samba Exploitation",       state: "done",
    bullets: ["Recon Nessus + Nmap", "CVE identificata ed exploit-ata", "Report con screenshots"] },
  { id: "m5", date: "Day 5 · 24.04", title: "Metasploit Professional",  state: "done",
    bullets: ["Moduli custom + msfvenom", "Post-exploitation end-to-end", "Report finale"] },
  { id: "m6", date: "Extra",         title: "CTF × 4",                  state: "done",
    bullets: ["Jangow01 · Lupin One", "HarryP / EPICODE (hard)", "Il Riccio Pazzo — AI-powered"] },
];

const mkSpark = (arr) => arr.map((v, i) => ({ i, v }));
const KPIS = [
  { key: "TASKS_COMPLETED", label: "TASKS_COMPLETED", value: "9/9",   delta: "+100%", up: true,
    spark: mkSpark([1,3,4,5,6,7,8,9]) },
  { key: "CVE_MAPPED",      label: "CVE_MAPPED",      value: "14",    delta: "+6",    up: true,
    spark: mkSpark([2,4,6,8,10,12,13,14]) },
  { key: "IOC_COLLECTED",   label: "IOC_COLLECTED",   value: "38",    delta: "+12",   up: true,
    spark: mkSpark([8,14,20,25,28,32,35,38]) },
  { key: "LINES_OF_CODE",   label: "LINES_OF_CODE",   value: "2,847", delta: "+312",  up: true,
    spark: mkSpark([400,800,1200,1600,2000,2400,2650,2847]) },
];

const CONTACTS = [
  { icon: "Github",       label: `github.com/${REPO.org}/${REPO.name}`, href: REPO.url },
  { icon: "ExternalLink", label: "buildweek.epicode",                    href: REPO.url },
  { icon: "Mail",         label: "squad07@digital-avengers.dev",         href: "#" },
];

Object.assign(window, { MEMBERS, PROJECTS, MILESTONES, KPIS, CONTACTS, REPO, blob, tree });
