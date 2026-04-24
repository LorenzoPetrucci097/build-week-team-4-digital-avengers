function Sidebar({ active, onNavigate }) {
  const termUI = useTerminalUI();
  const nav = [
    { id: "overview",   label: "Overview",     icon: "LayoutDashboard" },
    { id: "metrics",    label: "Metrics",      icon: "Activity" },
    { id: "projects",   label: "Projects",     icon: "FolderGit2" },
    { id: "roadmap",    label: "Roadmap",      icon: "GitBranch" },
    { id: "cases",      label: "Case Studies", icon: "FileCode2" },
    { id: "team",       label: "Team",         icon: "Users" },
  ];

  const scrollTo = (id) => {
    onNavigate?.(id);
    const scroller = document.getElementById("main-scroll");
    const el = document.getElementById(id);
    if (scroller && el) {
      const top = el.getBoundingClientRect().top - scroller.getBoundingClientRect().top + scroller.scrollTop - 12;
      scroller.scrollTo({ top, behavior: "smooth" });
    }
  };

  return (
    <aside className="flex w-64 shrink-0 flex-col border-r border-slate-800 bg-slate-900">
      {/* Logo */}
      <div className="flex h-14 items-center gap-2 border-b border-slate-800 px-4">
        <span className="font-mono text-[13px] text-slate-100">
          <span className="text-emerald-400">&gt;</span> digital_avengers<span className="da-blink text-emerald-400">_</span>
        </span>
        <button
          onClick={termUI.toggleOpen}
          title={termUI.closed ? "open terminal" : "close terminal"}
          className={`ml-auto inline-flex h-6 w-6 items-center justify-center rounded-md border transition-colors
            ${termUI.closed
              ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-300 hover:bg-emerald-500/20"
              : "border-slate-800 bg-slate-900 text-slate-400 hover:text-slate-200"}`}
        >
          <Icon name="Terminal" size={12} />
        </button>
      </div>

      {/* Nav */}
      <nav className="px-2 pt-3">
        <SectionLabel className="px-3 pb-2">Navigation</SectionLabel>
        <ul className="space-y-0.5">
          {nav.map((n) => {
            const isActive = active === n.id;
            return (
              <li key={n.id}>
                <button
                  onClick={() => scrollTo(n.id)}
                  className={`group relative flex w-full items-center gap-2.5 rounded-md px-3 py-1.5 text-left text-[13px] transition-colors
                    ${isActive
                      ? "bg-slate-800 text-emerald-400"
                      : "text-slate-300 hover:bg-slate-800/50"}`}
                >
                  {isActive && (
                    <span className="absolute left-0 top-1 bottom-1 w-0.5 rounded-full bg-emerald-400" />
                  )}
                  <Icon name={n.icon} size={15} className={isActive ? "text-emerald-400" : "text-slate-400 group-hover:text-slate-200"} />
                  <span className="flex-1">{n.label}</span>
                  {n.id === "projects" && (
                    <span className="rounded bg-slate-800 px-1.5 font-mono text-[10px] text-emerald-400">9</span>
                  )}
                  {n.id === "cases" && (
                    <span className="rounded bg-amber-500/10 px-1.5 font-mono text-[10px] text-amber-300 ring-1 ring-amber-500/20">9</span>
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Team roster */}
      <div className="mt-6 px-2">
        <div className="flex items-center justify-between px-3 pb-2">
          <SectionLabel>Team · 7 operators</SectionLabel>
          <span className="font-mono text-[10px] text-emerald-400">7/7 up</span>
        </div>
        <ul className="space-y-0.5">
          {MEMBERS.map((m) => (
            <li key={m.id}>
              <div className="flex items-center gap-2.5 rounded-md px-3 py-1.5 hover:bg-slate-800/50">
                <div className="relative">
                  <Avatar initials={m.initials} size={24} />
                  <span
                    className="absolute -bottom-0.5 -right-0.5 rounded-full bg-emerald-500 ring-2 ring-slate-900"
                    style={{ width: 8, height: 8 }}
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="truncate text-[12px] text-slate-200">{m.name.split(" ").slice(0,2).join(" ")}</div>
                  <div className="truncate font-mono text-[10px] text-slate-500">{m.role.toLowerCase()}</div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <div className="flex-1" />

      {/* Footer */}
      <div className="border-t border-slate-800 px-4 py-3">
        <div className="flex items-center justify-between">
          <span className="font-mono text-[10px] text-slate-500">v1.0.0 · closed</span>
          <span className="inline-flex items-center gap-1 font-mono text-[10px] text-emerald-400">
            <Icon name="Check" size={10} />
            shipped
          </span>
        </div>
        <div className="mt-1.5 h-1 w-full overflow-hidden rounded-full bg-slate-800">
          <div className="h-full w-full rounded-full bg-gradient-to-r from-emerald-500 via-teal-400 to-amber-400" />
        </div>
        <div className="mt-1 flex items-center justify-between font-mono text-[10px] text-slate-500">
          <span>build-week</span>
          <span>6/6 days</span>
        </div>
      </div>
    </aside>
  );
}

window.Sidebar = Sidebar;
