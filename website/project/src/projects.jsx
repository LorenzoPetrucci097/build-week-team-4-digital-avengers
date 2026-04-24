function artifactIcon(kind) {
  if (kind === "pdf")   return "FileText";
  if (kind === "guide") return "BookOpen";
  if (kind === "code")  return "Code2";
  if (kind === "dir")   return "Folder";
  return "File";
}

function ProjectCard({ p, idx }) {
  const [open, setOpen] = React.useState(false);
  return (
    <article
      className="da-rise group relative flex flex-col rounded-lg border border-slate-800 bg-slate-900 p-4 transition-all duration-200 hover:-translate-y-0.5 hover:border-emerald-500/40 hover:ring-1 hover:ring-emerald-500/20"
      style={{ animationDelay: `${idx * 50}ms` }}
    >
      <div className="flex items-center justify-between">
        <a href={p.url} target="_blank" rel="noreferrer" className="flex min-w-0 items-center gap-2 font-mono text-[11px] text-slate-400 hover:text-emerald-300">
          <Icon name="FolderGit2" size={11} className="text-emerald-400" />
          <span className="truncate text-slate-200">{p.path}</span>
        </a>
        <Badge tone="emerald">
          <StatusDot tone="emerald" size={6} />
          Completed
        </Badge>
      </div>

      <h3 className="mt-2 text-[14px] font-semibold tracking-tight text-slate-100 group-hover:text-emerald-300">
        {p.title}
      </h3>
      <p className="mt-1 line-clamp-2 text-[12px] leading-relaxed text-slate-400">{p.desc}</p>

      <div className="mt-3 flex flex-wrap items-center gap-1.5">
        {p.tags.map((t) => (
          <span key={t} className="rounded border border-slate-800 bg-slate-800/40 px-1.5 py-0.5 font-mono text-[10px] text-slate-300">
            {t}
          </span>
        ))}
      </div>

      {/* Artifacts list */}
      <div className="mt-3 rounded-md border border-slate-800 bg-slate-950/60">
        <button
          onClick={() => setOpen(o => !o)}
          className="flex w-full items-center justify-between px-2.5 py-1.5 font-mono text-[11px] text-slate-400 hover:text-slate-200"
        >
          <span className="inline-flex items-center gap-1.5">
            <Icon name={open ? "ChevronDown" : "ChevronRight"} size={11} />
            artifacts · {p.artifacts.length}
          </span>
          <span className="text-slate-600">{p.artifacts.filter(a=>a.kind==="pdf").length} pdf</span>
        </button>
        {open && (
          <ul className="border-t border-slate-800 px-2 py-1.5">
            {p.artifacts.map(a => (
              <li key={a.name}>
                <a
                  href={a.url} target="_blank" rel="noreferrer"
                  className="flex items-center gap-2 rounded px-1.5 py-1 font-mono text-[11px] text-slate-300 hover:bg-slate-800/60 hover:text-emerald-300"
                >
                  <Icon name={artifactIcon(a.kind)} size={11} className={
                    a.kind === "pdf" ? "text-red-400"
                    : a.kind === "guide" ? "text-amber-300"
                    : a.kind === "code" ? "text-sky-400"
                    : a.kind === "dir" ? "text-emerald-400"
                    : "text-slate-400"
                  } />
                  <span className="truncate">{a.name}</span>
                  <Icon name="ArrowUpRight" size={10} className="ml-auto text-slate-600" />
                </a>
              </li>
            ))}
            {p.external && (
              <li className="mt-1 border-t border-slate-800 pt-1">
                <a href={p.external} target="_blank" rel="noreferrer" className="flex items-center gap-2 rounded px-1.5 py-1 font-mono text-[11px] text-teal-300 hover:bg-slate-800/60">
                  <Icon name="ExternalLink" size={11} />
                  <span className="truncate">{p.external.replace("https://","")}</span>
                </a>
              </li>
            )}
          </ul>
        )}
      </div>

      {/* Footer */}
      <div className="mt-3 flex items-center justify-between border-t border-slate-800 pt-3 font-mono text-[11px]">
        <div className="flex items-center gap-3 text-slate-400">
          <span className="inline-flex items-center gap-1">
            <span className="inline-block h-2 w-2 rounded-full" style={{ background: p.langColor }} />
            <span>{p.lang}</span>
          </span>
          <ClassifiedStamp level={p.sec} />
        </div>
        <div className="flex items-center gap-2">
          <Avatar initials={p.owner} size={18} />
          <span className="text-slate-500">{p.date}</span>
        </div>
      </div>
    </article>
  );
}

function ProjectsGrid() {
  // simple filter left in: "all" / by owner, nothing else — everything is done
  const [filter, setFilter] = React.useState("all");
  const owners = ["all", ...Array.from(new Set(PROJECTS.map(p => p.owner)))];
  const shown = filter === "all" ? PROJECTS : PROJECTS.filter(p => p.owner === filter);

  return (
    <section>
      <div className="mb-3 flex flex-wrap items-end justify-between gap-3">
        <div>
          <SectionLabel>Projects</SectionLabel>
          <h2 className="mt-0.5 text-[15px] font-semibold tracking-tight text-slate-100">Build-week deliverables</h2>
        </div>
        <div className="flex items-center gap-2 font-mono text-[11px] text-slate-400">
          <Icon name="Github" size={13} className="text-slate-300" />
          <span className="text-slate-500">synced from</span>
          <a href={REPO.url} target="_blank" rel="noreferrer" className="text-emerald-400 hover:underline">
            {REPO.org}/{REPO.name}
          </a>
          <span className="inline-flex items-center gap-1 rounded border border-slate-800 bg-slate-900 px-1.5 py-0.5 text-[10px] text-slate-400">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 da-pulse-dot" /> {PROJECTS.length} folders
          </span>
        </div>
      </div>

      {/* Owner filter pills */}
      <div className="mb-3 flex flex-wrap items-center gap-1 rounded-md border border-slate-800 bg-slate-900 p-0.5">
        {owners.map(o => (
          <button
            key={o}
            onClick={() => setFilter(o)}
            className={`inline-flex items-center gap-1.5 rounded-[5px] px-2 py-1 font-mono text-[11px] transition-colors
              ${filter === o ? "bg-slate-800 text-emerald-400" : "text-slate-400 hover:text-slate-200"}`}
          >
            {o === "all" ? "@ all" : `@ ${o}`}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {shown.map((p, i) => <ProjectCard key={p.id} p={p} idx={i} />)}
      </div>
    </section>
  );
}

window.ProjectsGrid = ProjectsGrid;
