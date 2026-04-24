// Interactive terminal — ls/cat/tree/find/report/readme/ai-key/ai-prompt/ai/chat.
// Narrower footprint: sits to the right of the 16rem sidebar so it doesn't cover nav.

// ---- Shared UI state (closed/minimized/expanded) for the Terminal ----
// Exposes a global object `window.TerminalUI` with show()/toggle() so the
// sidebar can reopen the terminal when the red button has closed it.
const TerminalUIContext = React.createContext(null);

function TerminalUIProvider({ children }) {
  // closed  → completely hidden, reopen via sidebar button
  // minimized → only the header bar is shown
  // expanded → wider + taller, centered on page
  const [closed,    setClosed]    = React.useState(false);
  const [minimized, setMinimized] = React.useState(false);
  const [expanded,  setExpanded]  = React.useState(false);

  const api = {
    closed, minimized, expanded,
    show:     () => { setClosed(false); setMinimized(false); },
    close:    () => setClosed(true),
    toggleMin:() => setMinimized(m => !m),
    toggleExp:() => setExpanded(e => !e),
    toggleOpen:() => setClosed(c => !c),
  };
  React.useEffect(() => { window.TerminalUI = api; });
  return <TerminalUIContext.Provider value={api}>{children}</TerminalUIContext.Provider>;
}

function useTerminalUI() {
  const v = React.useContext(TerminalUIContext);
  if (!v) throw new Error("useTerminalUI must be used inside <TerminalUIProvider>");
  return v;
}

function Terminal() {
  const PROMPT_USER = "team@digital-avengers";
  const ui = useTerminalUI();

  const [cwd, setCwd]              = React.useState("/");
  const [lines, setLines]          = React.useState(() => [
    { kind: "sys",  text: "Digital Avengers // ops-shell · v1.2" },
    { kind: "sys",  text: "type `help` to see commands · `ai-help` for the assistant." },
    { kind: "sys",  text: "" },
  ]);
  const [input, setInput]          = React.useState("");
  const [history, setHistory]      = React.useState([]);
  const [histIdx, setHistIdx]      = React.useState(-1);

  // ---- AI state (persisted in localStorage, never shown in UI) ----
  const AI_KEY_STORAGE    = "da.openrouter.key";
  const AI_PROMPT_STORAGE = "da.openrouter.prompt";
  const AI_MODEL_STORAGE  = "da.openrouter.model";
  const AI_MODE_STORAGE   = "da.openrouter.mode";
  const DEFAULT_PROMPT    = "You are ops-shell, the in-dashboard assistant for the Digital Avengers build-week team (7 operators, 9 cybersecurity deliverables: Day 1–5 + 4 CTF extras, all completed). Answer concisely in the user's language. When asked about projects, reference the deliverables by id (D01–D05, C01–C04). Default to offensive/defensive security perspective. Short paragraphs, no fluff.";
  const DEFAULT_MODEL     = "openai/gpt-4o-mini";

  const [aiKey,    setAiKey]    = React.useState(() => localStorage.getItem(AI_KEY_STORAGE) || "");
  const [aiPrompt, setAiPrompt] = React.useState(() => localStorage.getItem(AI_PROMPT_STORAGE) || DEFAULT_PROMPT);
  const [aiModel,  setAiModel]  = React.useState(() => localStorage.getItem(AI_MODEL_STORAGE) || DEFAULT_MODEL);
  const [aiMode,   setAiMode]   = React.useState(() => localStorage.getItem(AI_MODE_STORAGE) === "1");
  const [aiHistory, setAiHistory] = React.useState([]);   // in-memory chat history for AI
  const [aiBusy,   setAiBusy]   = React.useState(false);

  const bodyRef  = React.useRef(null);
  const inputRef = React.useRef(null);

  // Auto-scroll + focus
  React.useEffect(() => {
    const el = bodyRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [lines, ui.minimized, ui.closed]);
  React.useEffect(() => { if (!ui.minimized && !ui.closed) inputRef.current?.focus(); }, [ui.minimized, ui.closed]);

  // Persist AI config
  React.useEffect(() => { localStorage.setItem(AI_KEY_STORAGE, aiKey); }, [aiKey]);
  React.useEffect(() => { localStorage.setItem(AI_PROMPT_STORAGE, aiPrompt); }, [aiPrompt]);
  React.useEffect(() => { localStorage.setItem(AI_MODEL_STORAGE, aiModel); }, [aiModel]);
  React.useEffect(() => { localStorage.setItem(AI_MODE_STORAGE, aiMode ? "1" : "0"); }, [aiMode]);

  // ---- filesystem metaphor (matches the real repo tree) ----
  const FS = React.useMemo(() => {
    const root = ["day1/", "day2/", "day3/", "day4/", "day5/", "ctf/", "team/", "README.md", "mission.txt"];
    const ctf  = PROJECTS.filter(p => p.slug.startsWith("ctf-")).map(p => `${p.slug}/`);
    const team = MEMBERS.map(m => `${m.initials.toLowerCase()}.md`);
    const dirs = Object.fromEntries(PROJECTS.map(p => [`${p.slug}/`, p.artifacts.map(a => a.name)]));
    return { "/": root, "ctf/": ctf, "team/": team, ...dirs };
  }, []);

  // resolve user-typed path (absolute or relative to cwd) to an FS key
  function resolve(path) {
    if (!path || path === ".") return cwd;
    let p = path.replace(/^\.\/+/, "");
    if (p.startsWith("/")) p = p.slice(1);
    // go up
    if (p === "..") return cwd === "/" ? "/" : "/";
    const base = cwd === "/" ? "" : cwd;
    const joined = (base + p).replace(/\/+/g, "/");
    const key = joined.endsWith("/") || FS[joined + "/"] ? (joined.endsWith("/") ? joined : joined + "/") : joined;
    // try absolute if cwd-relative miss
    if (FS[key]) return key;
    if (FS[p]) return p;
    if (FS[p + "/"]) return p + "/";
    return key;
  }

  // ---- helpers ----
  const out   = (text, kind = "out") => ({ kind, text });
  const multi = (arr,  kind = "out") => arr.map(t => out(t, kind));
  const cwdLabel = () => cwd === "/" ? "~" : `~/${cwd.replace(/\/$/, "")}`;

  // find artifact anywhere by filename (case-insensitive, partial match OK)
  function findArtifacts(q) {
    const needle = q.toLowerCase();
    const out = [];
    for (const p of PROJECTS) {
      for (const a of p.artifacts) {
        if (a.name.toLowerCase().includes(needle)) out.push({ p, a });
      }
    }
    return out;
  }

  // render a report/file inline
  function readArtifact(p, a) {
    const lines = [
      `── ${p.path}/${a.name} ───────────────────────────`,
      `type:      ${a.kind.toUpperCase()}   owner: ${p.owner}   date: ${p.date}`,
      `clearance: ${p.sec}   project: ${p.id}`,
      `url:       ${a.url}`,
      "",
    ];
    if (a.kind === "pdf")   lines.push("[PDF BINARY — opening in a new tab for full view]");
    if (a.kind === "guide") lines.push("[HTML GUIDE — opening in a new tab for interactive view]");
    if (a.kind === "dir")   lines.push("[directory — use `ls " + p.slug + "/" + a.name + "` to peek]");
    if (a.kind === "code" || a.kind === "text") lines.push("[source file — opening raw on github]");
    lines.push("", "summary:", p.desc);
    const w = (window.WRITEUPS || {})[p.slug];
    if (w) lines.push("", `write-up: ${w.title}`, `intro:    ${w.intro}`);
    try { window.open(a.url, "_blank", "noopener"); } catch (e) {}
    return multi(lines);
  }

  // ---- AI: call OpenRouter ----
  async function askAI(prompt) {
    if (!aiKey) {
      appendLines([out("ai: no API key. set one with `ai-key <sk-or-v1-…>`", "err")]);
      return;
    }
    setAiBusy(true);
    appendLines([out(`[ai · ${aiModel}] thinking…`, "ai-sys")]);

    const msgs = [
      { role: "system", content: aiPrompt || DEFAULT_PROMPT },
      ...aiHistory.slice(-10),
      { role: "user", content: prompt },
    ];

    try {
      const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${aiKey}`,
          "HTTP-Referer":  window.location.href,
          "X-Title":       "Digital Avengers ops-shell",
        },
        body: JSON.stringify({
          model: aiModel,
          messages: msgs,
          temperature: 0.5,
          max_tokens: 700,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        const msg = data?.error?.message || res.statusText || "unknown error";
        appendLines([out(`ai: ${msg}`, "err")]);
        return;
      }
      const reply = data?.choices?.[0]?.message?.content?.trim() || "(empty reply)";
      setAiHistory(h => [...h, { role: "user", content: prompt }, { role: "assistant", content: reply }].slice(-24));
      const wrapped = reply.split("\n");
      appendLines(wrapped.map(t => out(t, "ai")));
    } catch (err) {
      appendLines([out(`ai: network error — ${String(err?.message || err)}`, "err")]);
    } finally {
      setAiBusy(false);
    }
  }

  function appendLines(arr) {
    setLines(prev => [...prev, ...arr].slice(-600));
  }

  // ---- command dispatch ----
  function run(raw) {
    const cmd = raw.trim();
    const echo = { kind: "prompt", text: raw, cwd: cwdLabel() };
    if (!cmd) return [echo];

    // AI chat mode — every non-slash line goes to AI
    if (aiMode && !cmd.startsWith("/")) {
      askAI(cmd);
      return [echo];
    }
    const real = aiMode && cmd.startsWith("/") ? cmd.slice(1) : cmd;
    const [head, ...rest] = real.split(/\s+/);
    const arg = rest.join(" ");

    switch (head.toLowerCase()) {
      case "help":
      case "?":
        return [echo, ...multi([
          "filesystem",
          "  ls [dir]              list files · try: ls, ls day1, ls ctf",
          "  cd <dir>              change directory (/, day1, ctf, team, ..)",
          "  pwd                   current directory",
          "  tree                  print full repo tree",
          "  cat <file|slug>       print file / deliverable summary",
          "  readme                render the repo README.md",
          "  report <slug>         open the PDF/HTML report for a deliverable",
          "  find <query>          search artifacts by filename",
          "  open <slug>           open a deliverable folder on github",
          "",
          "squad",
          "  whoami · team · projects · status · repo · date · echo",
          "",
          "ai assistant (OpenRouter)",
          "  ai-key <sk-or-v1-…>   store your OpenRouter API key",
          "  ai-prompt <text>      set the system prompt / personality",
          "  ai-model <id>         set model (default: openai/gpt-4o-mini)",
          "  ai-config             show current AI config (key masked)",
          "  ai-clear              clear chat history · ai-reset → full reset",
          "  ai <question>         ask one question",
          "  chat                  enter interactive chat mode (/exit to leave)",
          "  ai-help               assistant cheat-sheet",
          "",
          "shell",
          "  clear · exit · sudo · hack",
        ])];

      case "ai-help":
        return [echo, ...multi([
          "OpenRouter assistant",
          "  1. get a key  https://openrouter.ai/keys",
          "  2. ai-key <sk-or-v1-…>      — stored in your browser only (localStorage)",
          "  3. ai-prompt <personality>  — e.g. `ai-prompt You are a gloomy SOC analyst`",
          "  4. ai <question>            — one-shot query",
          "     chat                     — enter chat mode; type `/exit` to leave",
          "",
          "  tip · in chat mode prefix a command with `/` to run it (e.g. `/ls`)",
        ])];

      case "whoami":
        return [echo, out("user")];

      case "pwd":
        return [echo, out(cwd === "/" ? "/" : `/${cwd.replace(/\/$/, "")}`)];

      case "cd": {
        if (!arg || arg === "/" || arg === "~") { setCwd("/"); return [echo]; }
        if (arg === "..") { setCwd("/"); return [echo]; }
        const key = resolve(arg);
        if (FS[key]) { setCwd(key === "/" ? "/" : key); return [echo]; }
        return [echo, out(`cd: ${arg}: not a directory`, "err")];
      }

      case "ls": {
        const key = resolve(arg || "");
        const entries = FS[key];
        if (!entries) return [echo, out(`ls: cannot access '${arg || cwdLabel()}': No such directory`, "err")];
        const rows = [];
        for (let i = 0; i < entries.length; i += 2) {
          rows.push(entries.slice(i, i + 2).map(s => (s.endsWith("/") ? "\x1b[emerald]" + s : s).padEnd(42)).join(""));
        }
        return [echo, ...rows.map(r => out(r, "ls"))];
      }

      case "tree": {
        const lines = ["/"];
        const top = FS["/"];
        top.forEach((entry, i) => {
          const last = i === top.length - 1;
          lines.push(`${last ? "└──" : "├──"} ${entry}`);
          if (entry.endsWith("/") && FS[entry]) {
            const kids = FS[entry];
            kids.forEach((k, j) => {
              const jlast = j === kids.length - 1;
              lines.push(`${last ? "    " : "│   "}${jlast ? "└──" : "├──"} ${k}`);
            });
          }
        });
        return [echo, ...lines.map(l => out(l, "ls"))];
      }

      case "cat": {
        if (!arg) return [echo, out("cat: missing operand", "err")];
        const low = arg.toLowerCase().replace(/^\/+/, "");
        if (low === "readme.md" || low === "readme") return run("readme").slice(1) && [echo, ...runReadme()];
        if (low === "mission.txt") {
          return [echo, ...multi([
            "Ship evidence, not slides.",
            "Every offensive finding paired with a defensive artifact.",
          ])];
        }
        // project slug?
        const slug = low.replace(/\/$/, "").replace(/^(projects|ctf)\//, "");
        const p = PROJECTS.find(x => x.slug === slug || x.path.toLowerCase() === slug);
        if (p) {
          const w = (window.WRITEUPS || {})[p.slug];
          const body = [
            `── ${p.id} · ${p.title} ───────────────────────────`,
            `owner:     ${p.owner}    date: ${p.date}    status: completed`,
            `clearance: ${p.sec}`,
            `tags:      ${p.tags.join(", ")}`,
            `url:       ${p.url}`,
            "",
            p.desc,
            "",
            "artifacts:",
            ...p.artifacts.map(a => `  · ${a.kind.padEnd(5)} ${a.name}`),
          ];
          if (w) body.push("", `write-up: ${w.title}`, `author:   ${w.author} · ${w.readTime}`);
          return [echo, ...multi(body)];
        }
        // artifact filename?
        const hits = findArtifacts(arg);
        if (hits.length === 1) return [echo, ...readArtifact(hits[0].p, hits[0].a)];
        if (hits.length > 1) {
          return [echo, out(`cat: '${arg}' matches ${hits.length} files — be more specific or use \`find\``, "err"),
                  ...hits.slice(0, 6).map(h => out(`  · ${h.p.slug}/${h.a.name}`))];
        }
        return [echo, out(`cat: ${arg}: No such file or deliverable`, "err")];
      }

      case "readme":
        return [echo, ...runReadme()];

      case "report": {
        if (!arg) return [echo, out("report: missing operand (try `report day1`)", "err")];
        const slug = arg.toLowerCase().replace(/\/$/, "");
        const p = PROJECTS.find(x => x.slug === slug || x.path.toLowerCase() === slug || x.id.toLowerCase() === slug);
        if (!p) return [echo, out(`report: ${arg}: no such deliverable`, "err")];
        const pdf = p.artifacts.find(a => a.kind === "pdf") || p.artifacts.find(a => a.kind === "guide");
        if (!pdf) return [echo, out(`report: no pdf/guide found for ${p.slug}`, "err")];
        return [echo, ...readArtifact(p, pdf)];
      }

      case "find": {
        if (!arg) return [echo, out("find: missing query", "err")];
        const hits = findArtifacts(arg);
        if (!hits.length) return [echo, out(`find: no artifacts matching '${arg}'`, "err")];
        return [echo, out(`${hits.length} match${hits.length===1?"":"es"}:`),
                ...hits.map(h => out(`  ${h.p.slug.padEnd(20)} ${h.a.kind.padEnd(5)} ${h.a.name}`, "ls"))];
      }

      case "open": {
        if (!arg) return [echo, out("open: missing operand (try `open day1`)", "err")];
        const slug = arg.replace(/\/$/, "").toLowerCase();
        const p = PROJECTS.find(x => x.slug === slug || x.path.toLowerCase() === slug);
        if (!p) return [echo, out(`open: ${arg}: no such deliverable`, "err")];
        try { window.open(p.url, "_blank", "noopener"); } catch (e) {}
        return [echo, out(`opening ${p.url}`, "out")];
      }

      case "team":
        return [echo, ...multi([
          "7 operators · all online",
          "",
          ...MEMBERS.map(m => `  ● ${m.initials}   ${m.name.padEnd(30)} ${m.role}`),
        ])];

      case "projects":
        return [echo, ...multi([
          `${PROJECTS.length} deliverables · all completed`,
          "",
          ...PROJECTS.map(p => `  ${p.id}  ${p.slug.padEnd(20)} ${p.lang.padEnd(11)} ${p.owner}   ${p.sec}`),
          "",
          `repo: ${REPO.url}`,
        ])];

      case "status":
        return [echo, ...multi([
          "ops status:  all systems operational",
          "squad:       7/7 online",
          "buildweek:   6/6 days · closed",
          "",
          ...KPIS.map(k => `  ${k.label.padEnd(20)} ${String(k.value).padEnd(10)} ${k.delta}`),
        ])];

      case "date": return [echo, out(new Date().toString())];
      case "repo": return [echo, out(REPO.url, "out")];
      case "echo": return [echo, out(arg)];

      case "clear":
      case "cls":
        setTimeout(() => setLines([]), 0);
        return [];

      case "sudo":
        return [echo, out(`[sudo] password for user: ${"*".repeat(8)}`), out("user is not in the sudoers file. This incident will be reported.", "err")];

      case "exit":
      case "quit":
        if (aiMode) { setAiMode(false); return [echo, out("[ai] chat mode off", "ai-sys")]; }
        setTimeout(() => ui.close(), 10);
        return [echo, out("logout")];

      case "hack":
      case "hack-the-planet":
        return [echo, ...multi([
          "[ * ] mounting /dev/mainframe ...",
          "[ * ] bouncing through 7 proxies ...",
          "[ * ] cracking encryption ...",
          "[ ✓ ] just kidding — this is a mockup.",
        ])];

      // -------- AI commands --------
      case "ai-key": {
        if (!arg) return [echo, out("ai-key: paste your OpenRouter key. get one at https://openrouter.ai/keys", "err")];
        setAiKey(arg.trim());
        return [echo, out(`[ai] key stored locally (${arg.length} chars). use \`ai-config\` to verify.`, "ai-sys")];
      }
      case "ai-prompt": {
        if (!arg) return [echo, out(`[ai] current prompt:`, "ai-sys"), out(aiPrompt)];
        setAiPrompt(arg.trim());
        return [echo, out(`[ai] prompt updated (${arg.length} chars).`, "ai-sys")];
      }
      case "ai-model": {
        if (!arg) return [echo, out(`[ai] current model: ${aiModel}`, "ai-sys"),
                          out("  suggestions: openai/gpt-4o-mini · anthropic/claude-3.5-sonnet · meta-llama/llama-3.3-70b-instruct")];
        setAiModel(arg.trim());
        return [echo, out(`[ai] model set to ${arg.trim()}`, "ai-sys")];
      }
      case "ai-config": {
        const mask = aiKey ? aiKey.slice(0, 8) + "…" + aiKey.slice(-4) : "(not set)";
        return [echo, ...multi([
          `[ai] key:    ${mask}`,
          `[ai] model:  ${aiModel}`,
          `[ai] mode:   ${aiMode ? "chat (every line goes to AI — prefix / to run commands)" : "command"}`,
          `[ai] prompt: ${aiPrompt.slice(0, 120)}${aiPrompt.length > 120 ? "…" : ""}`,
          `[ai] chat history: ${aiHistory.length} turns`,
        ], "ai-sys")];
      }
      case "ai-clear":
        setAiHistory([]);
        return [echo, out("[ai] chat history cleared", "ai-sys")];
      case "ai-reset":
        setAiKey(""); setAiPrompt(DEFAULT_PROMPT); setAiModel(DEFAULT_MODEL); setAiHistory([]); setAiMode(false);
        return [echo, out("[ai] full reset — key/prompt/model/history wiped", "ai-sys")];

      case "ai":
      case "ask": {
        if (!arg) return [echo, out("ai: usage: ai <your question>", "err")];
        askAI(arg);
        return [echo];
      }
      case "chat": {
        if (!aiKey) return [echo, out("chat: no API key. run `ai-key <sk-or-v1-…>` first.", "err")];
        setAiMode(true);
        return [echo, ...multi([
          "[ai] chat mode ON — every line is sent to the assistant.",
          "[ai] prefix with `/` to run shell commands (e.g. /ls, /exit, /clear).",
          "[ai] `/exit` leaves chat mode.",
        ], "ai-sys")];
      }

      default:
        return [echo, out(`${head}: command not found. try 'help'.`, "err")];
    }
  }

  function runReadme() {
    return multi([
      "",
      "╭────────────────────────────────────────────────────╮",
      "│                                                    │",
      "│   DIGITAL AVENGERS · build-week team 4             │",
      "│   7 operators · 9 deliverables · 0 open tickets    │",
      "│                                                    │",
      "╰────────────────────────────────────────────────────╯",
      "",
      "# Overview",
      "",
      "Build-week consegnata: 5 giornate offensive + 4 CTF extra.",
      "Ogni exploit ha un report PDF/HTML, ogni finding ha un",
      "controesempio difensivo. Niente diapositive, solo evidence.",
      "",
      "# Deliverables",
      "",
      ...PROJECTS.map(p => `  ${p.id}  ${p.title}   (${p.owner})`),
      "",
      "# Stack",
      "",
      "  · offensive:  DVWA, Burp, Nmap, Nessus, Metasploit, GDB",
      "  · defensive:  Flask catcher, Sigma rules (WIP), report PDF",
      "  · build:      Python, C, HTML, Streamlit, OpenAI API",
      "",
      "# Links",
      "",
      `  repo:     ${REPO.url}`,
      `  branch:   ${REPO.branch}`,
      `  contact:  squad07@digital-avengers.dev`,
      "",
    ]);
  }

  // ---- submit + history ----
  function submit(e) {
    e.preventDefault();
    const raw = input;
    const pushed = run(raw);
    setLines(prev => [...prev, ...pushed].slice(-600));
    if (raw.trim()) { setHistory(h => [...h, raw]); setHistIdx(-1); }
    setInput("");
  }

  function onKey(e) {
    if (e.key === "ArrowUp") {
      e.preventDefault();
      setHistory(h => {
        if (!h.length) return h;
        const next = histIdx === -1 ? h.length - 1 : Math.max(0, histIdx - 1);
        setHistIdx(next);
        setInput(h[next] || "");
        return h;
      });
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      setHistory(h => {
        if (!h.length || histIdx === -1) return h;
        const next = histIdx + 1;
        if (next >= h.length) { setHistIdx(-1); setInput(""); }
        else { setHistIdx(next); setInput(h[next]); }
        return h;
      });
    } else if (e.key === "l" && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      setLines([]);
    }
  }

  // ---- rendering ----
  const PromptLabel = ({ cwdText }) => (
    <>
      <span className="text-emerald-400">{aiMode ? "ai" : PROMPT_USER}</span>
      <span className="text-slate-600">:</span>
      <span className="text-sky-400">{cwdText || cwdLabel()}</span>
      <span className="text-slate-600">$&nbsp;</span>
    </>
  );

  const renderLine = (l, i) => {
    if (l.kind === "prompt") {
      return (
        <div key={i} className="flex gap-0 font-mono text-[12px] leading-relaxed">
          <PromptLabel cwdText={l.cwd} />
          <span className="text-slate-200">{l.text}</span>
        </div>
      );
    }
    if (l.kind === "err")    return <div key={i} className="font-mono text-[12px] leading-relaxed text-red-400">{l.text}</div>;
    if (l.kind === "sys")    return <div key={i} className="font-mono text-[12px] leading-relaxed text-slate-500">{l.text || "\u00A0"}</div>;
    if (l.kind === "ai-sys") return <div key={i} className="font-mono text-[12px] leading-relaxed text-amber-300/80">{l.text}</div>;
    if (l.kind === "ai")     return <div key={i} className="font-mono text-[12px] leading-relaxed text-teal-200 whitespace-pre-wrap">{l.text || "\u00A0"}</div>;
    if (l.kind === "ls") {
      const parts = l.text.split(/(\x1b\[emerald\][^\s]+\/)/g);
      return (
        <div key={i} className="font-mono text-[12px] leading-relaxed whitespace-pre text-slate-300">
          {parts.map((p, j) => p.startsWith("\x1b[emerald]")
            ? <span key={j} className="text-emerald-400">{p.replace("\x1b[emerald]","")}</span>
            : <span key={j}>{p}</span>)}
        </div>
      );
    }
    return <div key={i} className="font-mono text-[12px] leading-relaxed text-slate-300 whitespace-pre-wrap">{l.text || "\u00A0"}</div>;
  };

  if (ui.closed) return null;

  // Size adapts to expanded mode.
  // Normal: narrow, aligned next to sidebar · Expanded: wider, centered, taller.
  const wrapperPad   = ui.expanded ? "px-8" : "pl-[16rem] pr-4";
  const innerMaxW    = ui.expanded ? "max-w-[1280px]" : "max-w-[980px]";
  const bodyHeight   = ui.expanded ? "h-[420px]" : "h-48";

  // Narrow width: aligns left edge with main content (right of 16rem sidebar)
  return (
    <div className={`pointer-events-none fixed inset-x-0 bottom-0 z-40 pb-4 ${wrapperPad}`}>
      <div className={`pointer-events-auto mx-auto w-full overflow-hidden rounded-lg border border-slate-800 bg-slate-950/95 shadow-[0_-8px_30px_-12px_rgba(0,0,0,0.7)] backdrop-blur ${innerMaxW}`}>
        {/* Header — traffic-light buttons are live */}
        <div
          className="flex h-10 items-center gap-3 border-b border-slate-800 bg-slate-900/80 px-3"
          onClick={() => inputRef.current?.focus()}
        >
          <span
            className="flex items-center gap-1.5"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={ui.close}
              title="close · reopen from sidebar"
              className="group relative inline-flex h-3 w-3 items-center justify-center rounded-full bg-red-500/80 ring-1 ring-red-500/40 hover:bg-red-500"
            >
              <Icon name="X" size={8} className="text-red-900 opacity-0 group-hover:opacity-100" />
            </button>
            <button
              onClick={ui.toggleMin}
              title={ui.minimized ? "restore" : "minimize"}
              className="group relative inline-flex h-3 w-3 items-center justify-center rounded-full bg-amber-400/80 ring-1 ring-amber-500/40 hover:bg-amber-400"
            >
              <Icon name={ui.minimized ? "Plus" : "Minus"} size={8} className="text-amber-900 opacity-0 group-hover:opacity-100" />
            </button>
            <button
              onClick={ui.toggleExp}
              title={ui.expanded ? "shrink" : "expand"}
              className="group relative inline-flex h-3 w-3 items-center justify-center rounded-full bg-emerald-500/80 ring-1 ring-emerald-500/40 hover:bg-emerald-500"
            >
              <Icon name={ui.expanded ? "Minimize2" : "Maximize2"} size={8} className="text-emerald-900 opacity-0 group-hover:opacity-100" />
            </button>
          </span>
          <span className="font-mono text-[11px] text-slate-400">
            <PromptLabel />
          </span>
          <span className="ml-1 font-mono text-[10px] text-slate-600">ops-shell</span>
          {aiMode && (
            <span className="ml-1 inline-flex items-center gap-1 rounded bg-teal-500/10 px-1.5 py-0.5 font-mono text-[9px] text-teal-300 ring-1 ring-teal-500/30">
              <span className="h-1.5 w-1.5 rounded-full bg-teal-400 da-pulse-dot" /> ai · {aiModel.split("/").pop()}
            </span>
          )}
          {aiBusy && (
            <span className="ml-1 font-mono text-[10px] text-amber-300">⟳ thinking</span>
          )}

          <div className="ml-auto flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 font-mono text-[10px] text-amber-300">
              <Icon name="Terminal" size={11} /> type <span className="rounded bg-slate-800 px-1 text-slate-400">help</span>
            </span>
          </div>
        </div>

        {/* Body */}
        {!ui.minimized && (
          <div
            ref={bodyRef}
            onClick={() => inputRef.current?.focus()}
            className={`cursor-text overflow-y-auto bg-black/60 px-3 py-2 ${bodyHeight}`}
          >
            {lines.map(renderLine)}

            {/* Active input line */}
            <form onSubmit={submit} className="flex items-center gap-0 font-mono text-[12px] leading-relaxed">
              <PromptLabel />
              <input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={onKey}
                spellCheck={false}
                autoCapitalize="off"
                autoComplete="off"
                disabled={aiBusy}
                placeholder={aiMode ? "ask the assistant… (/exit to leave chat)" : ""}
                className="flex-1 border-0 bg-transparent p-0 font-mono text-[12px] text-slate-200 caret-emerald-400 outline-none placeholder:text-slate-600 focus:outline-none focus:ring-0 disabled:opacity-50"
                aria-label="terminal input"
              />
            </form>
          </div>
        )}
      </div>
    </div>
  );
}

window.Terminal = Terminal;
window.TerminalUIProvider = TerminalUIProvider;
window.useTerminalUI = useTerminalUI;
