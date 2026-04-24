function LinksRow() {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-slate-800 bg-slate-900 px-4 py-3">
      <div className="flex flex-wrap items-center gap-4">
        {CONTACTS.filter(c => c.icon !== "Mail").map((c) => (
          <a
            key={c.label}
            href={c.href || "#"}
            target={c.href && c.href !== "#" ? "_blank" : undefined}
            rel="noreferrer"
            className="group inline-flex items-center gap-2 font-mono text-[12px] text-slate-400 transition-colors hover:text-emerald-400"
          >
            <Icon name={c.icon} size={13} className="text-slate-500 group-hover:text-emerald-400" />
            {c.label}
          </a>
        ))}
      </div>
      <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-slate-600">
        <Icon name="Lock" size={10} />
        Confidential · Internal use only
      </div>
    </div>
  );
}

window.LinksRow = LinksRow;
