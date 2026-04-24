// Topbar — breadcrumb, live search (ajax-feel), auth button.
function TopBar({ section, onNavigate }) {
  const { user, logout, setLoginOpen } = useAuth();
  const crumb = ({
    overview: "overview",
    metrics:  "metrics",
    projects: "projects",
    roadmap:  "roadmap",
    cases:    "case-studies",
    team:     "team",
  })[section] || "overview";

  // Build the searchable index from HUB resources.
  const INDEX = React.useMemo(() => {
    const items = [];
    PROJECTS.forEach((p) => {
      items.push({
        kind: "deliverable", label: p.title, sub: `${p.id} · ${p.slug} · ${p.owner}`,
        icon: "FolderGit2", tone: "emerald", url: p.url, tags: [p.slug, p.id, ...p.tags, p.owner],
        target: "_blank",
      });
      p.artifacts.forEach((a) => items.push({
        kind: a.kind.toUpperCase(), label: a.name, sub: `${p.slug}/${a.name}`,
        icon: a.kind === "pdf" ? "FileText" : a.kind === "guide" ? "BookOpen" : a.kind === "code" ? "Code2" : "Folder",
        tone: a.kind === "pdf" ? "red" : a.kind === "guide" ? "amber" : "sky",
        url: a.url, tags: [a.name, p.slug, a.kind], target: "_blank",
      }));
    });
    MILESTONES.forEach((m) => items.push({
      kind: "milestone", label: m.title, sub: m.date, icon: "GitBranch", tone: "teal",
      sectionId: "roadmap", tags: [m.title, m.date, ...m.bullets],
    }));
    MEMBERS.forEach((m) => items.push({
      kind: "operator", label: m.name, sub: m.role,
      icon: "User", tone: "slate", sectionId: "team",
      tags: [m.name, m.initials, m.role],
    }));
    KPIS.forEach((k) => items.push({
      kind: "metric", label: k.label, sub: `${k.value} · ${k.delta}`,
      icon: "Activity", tone: "sky", sectionId: "metrics",
      tags: [k.label, String(k.value)],
    }));
    // static sections
    [["overview","Overview hero"],["projects","Projects grid"],["cases","Case studies"]]
      .forEach(([id,label]) => items.push({ kind: "section", label, sub: `#${id}`, icon: "LayoutDashboard", tone: "slate", sectionId: id, tags: [id,label] }));
    return items;
  }, []);

  const [q, setQ]             = React.useState("");
  const [open, setOpen]       = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [results, setResults] = React.useState([]);
  const [hover, setHover]     = React.useState(0);
  const boxRef  = React.useRef(null);
  const inputRef = React.useRef(null);

  // Keyboard: Cmd+K focus, / focus
  React.useEffect(() => {
    const onKey = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault(); inputRef.current?.focus(); setOpen(true);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // Click outside
  React.useEffect(() => {
    const onClick = (e) => { if (boxRef.current && !boxRef.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  // Debounced "ajax" filter — simulates network roundtrip
  React.useEffect(() => {
    if (!q.trim()) { setResults([]); setLoading(false); return; }
    setLoading(true);
    const t = setTimeout(() => {
      const needle = q.trim().toLowerCase();
      const scored = INDEX.map((it) => {
        const hay = (it.label + " " + it.sub + " " + it.tags.join(" ")).toLowerCase();
        if (!hay.includes(needle)) return null;
        // light relevance boost on label match
        const s = (it.label.toLowerCase().includes(needle) ? 2 : 0)
                + (it.tags.some(t => String(t).toLowerCase() === needle) ? 1 : 0);
        return { it, s };
      }).filter(Boolean).sort((a,b) => b.s - a.s).slice(0, 12).map(x => x.it);
      setResults(scored);
      setHover(0);
      setLoading(false);
    }, 220);
    return () => clearTimeout(t);
  }, [q, INDEX]);

  const choose = (r) => {
    setOpen(false); setQ("");
    if (r.url) { try { window.open(r.url, r.target || "_self", "noopener"); } catch(e){} return; }
    if (r.sectionId) {
      onNavigate?.(r.sectionId);
      const scroller = document.getElementById("main-scroll");
      const el = document.getElementById(r.sectionId);
      if (scroller && el) {
        const top = el.getBoundingClientRect().top - scroller.getBoundingClientRect().top + scroller.scrollTop - 12;
        scroller.scrollTo({ top, behavior: "smooth" });
      }
    }
  };

  const onInputKey = (e) => {
    if (e.key === "ArrowDown") { e.preventDefault(); setHover(h => Math.min(results.length - 1, h + 1)); }
    else if (e.key === "ArrowUp") { e.preventDefault(); setHover(h => Math.max(0, h - 1)); }
    else if (e.key === "Enter" && results[hover]) { e.preventDefault(); choose(results[hover]); }
    else if (e.key === "Escape") setOpen(false);
  };

  return (
    <header className="flex h-14 items-center gap-4 border-b border-slate-800 bg-slate-950/80 px-5 backdrop-blur">
      <div className="flex items-center gap-1.5 font-mono text-[12px]">
        <button onClick={() => onNavigate?.("overview")} className="text-slate-500 hover:text-slate-300">dashboard</button>
        <span className="text-slate-700">/</span>
        <span className="text-slate-200">{crumb}</span>
      </div>

      {/* Search + live dropdown */}
      <div ref={boxRef} className="relative mx-auto w-full max-w-md">
        <div className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-slate-500">
          {loading ? <Icon name="Loader" size={14} className="da-spin" /> : <Icon name="Search" size={14} />}
        </div>
        <input
          ref={inputRef}
          type="text"
          value={q}
          onFocus={() => setOpen(true)}
          onChange={(e) => { setQ(e.target.value); setOpen(true); }}
          onKeyDown={onInputKey}
          placeholder="search HUB · projects, reports, cves, operators…"
          className="h-8 w-full rounded-md border border-slate-800 bg-slate-900 pl-9 pr-16 font-mono text-[12px] text-slate-200 placeholder:text-slate-500 focus:border-slate-700 focus:outline-none focus:ring-1 focus:ring-emerald-500/40"
        />
        <div className="absolute inset-y-0 right-2 flex items-center gap-1">
          <Kbd>⌘</Kbd><Kbd>K</Kbd>
        </div>

        {open && q.trim() && (
          <div className="absolute left-0 right-0 top-[calc(100%+6px)] z-50 overflow-hidden rounded-md border border-slate-800 bg-slate-950 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.7)]">
            <div className="flex items-center gap-2 border-b border-slate-800 px-3 py-1.5 font-mono text-[10px] text-slate-500">
              {loading ? (
                <>
                  <Icon name="Loader" size={10} className="da-spin text-emerald-400" />
                  <span>GET /api/search?q={encodeURIComponent(q)} · streaming…</span>
                </>
              ) : (
                <>
                  <StatusDot tone="emerald" size={6} />
                  <span>200 OK · {results.length} result{results.length===1?"":"s"} · {INDEX.length} indexed</span>
                </>
              )}
            </div>
            <ul className="max-h-80 overflow-y-auto py-1">
              {!loading && results.length === 0 && (
                <li className="px-3 py-4 text-center font-mono text-[11px] text-slate-500">no matches · try `day1`, `pdf`, `xss`, `LP`…</li>
              )}
              {results.map((r, i) => (
                <li key={i}>
                  <button
                    onMouseEnter={() => setHover(i)}
                    onClick={() => choose(r)}
                    className={`flex w-full items-center gap-3 px-3 py-1.5 text-left transition-colors ${hover === i ? "bg-slate-800/80" : "hover:bg-slate-800/50"}`}
                  >
                    <span className={`inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-md ring-1
                      ${r.tone === "emerald" ? "bg-emerald-500/10 text-emerald-300 ring-emerald-500/20"
                      : r.tone === "amber"   ? "bg-amber-500/10 text-amber-300 ring-amber-500/25"
                      : r.tone === "red"     ? "bg-red-500/10 text-red-300 ring-red-500/25"
                      : r.tone === "teal"    ? "bg-teal-500/10 text-teal-300 ring-teal-500/25"
                      : r.tone === "sky"     ? "bg-sky-500/10 text-sky-300 ring-sky-500/20"
                      :                         "bg-slate-800 text-slate-300 ring-slate-700"}`}>
                      <Icon name={r.icon} size={12} />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-[12px] text-slate-100">{r.label}</span>
                      <span className="block truncate font-mono text-[10px] text-slate-500">{r.sub}</span>
                    </span>
                    <span className="rounded bg-slate-800/80 px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-widest text-slate-400">{r.kind}</span>
                    {r.url && <Icon name="ArrowUpRight" size={11} className="text-slate-500" />}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Status + auth */}
      <div className="ml-auto flex items-center gap-3">
        <div className="hidden items-center gap-2 rounded-md border border-slate-800 bg-slate-900 px-2.5 py-1 md:flex">
          <StatusDot tone="emerald" pulse size={8} />
          <span className="font-mono text-[10px] uppercase tracking-widest text-slate-300">All systems operational</span>
        </div>

        {user ? (
          <div className="flex items-center gap-1">
            <div className="flex items-center gap-2 rounded-md border border-slate-800 bg-slate-900 py-1 pl-1 pr-2.5">
              <Avatar initials={user.initials} size={22} />
              <div className="leading-tight">
                <div className="text-[11px] text-slate-200">{user.displayName}</div>
                <div className="font-mono text-[9px] text-emerald-400">● {user.role.toLowerCase()}</div>
              </div>
            </div>
            <button
              onClick={logout}
              className="inline-flex items-center gap-1.5 rounded-md border border-slate-800 bg-slate-900 px-2.5 py-1.5 font-mono text-[11px] text-slate-300 hover:border-red-500/40 hover:text-red-300"
              title="sign out"
            >
              <Icon name="LogOut" size={12} />
              logout
            </button>
          </div>
        ) : (
          <button
            onClick={() => setLoginOpen(true)}
            className="inline-flex items-center gap-1.5 rounded-md bg-emerald-500 px-3 py-1.5 font-mono text-[11px] font-semibold uppercase tracking-widest text-slate-950 hover:bg-emerald-400"
            title="sign in"
          >
            <Icon name="LogIn" size={12} />
            login
          </button>
        )}
      </div>
    </header>
  );
}

window.TopBar = TopBar;
