function Hero() {
  return (
    <section className="da-rise overflow-hidden rounded-xl border border-slate-800 bg-gradient-to-br from-slate-900 via-slate-900 to-teal-950/40">
      <div className="relative da-grid-bg">
        {/* top meta strip */}
        <div className="flex items-center justify-between border-b border-slate-800/80 px-6 py-2.5">
          <div className="flex items-center gap-3 font-mono text-[10px] uppercase tracking-widest text-slate-500">
            <span className="inline-flex items-center gap-1.5">
              <StatusDot tone="emerald" pulse size={7} /> squad-07
            </span>
            <span className="text-slate-700">·</span>
            <span className="text-teal-400">build-week-cyber</span>
            <span className="text-slate-700">·</span>
            <span>20.04.26 → 25.04.26</span>
          </div>
          <div className="hidden items-center gap-3 font-mono text-[10px] text-slate-500 md:flex">
            <ClassifiedStamp level="SEC_LEVEL_4" />
            <span className="inline-flex items-center gap-1.5">
              <Icon name="MapPin" size={10} /> milan · hq
            </span>
          </div>
        </div>

        <div className="grid grid-cols-12 gap-6 px-6 py-7">
          {/* Left: title + tagline */}
          <div className="col-span-12 lg:col-span-8">
            <div className="flex items-baseline gap-3">
              <span className="font-mono text-[11px] uppercase tracking-widest text-emerald-400">// mission_header</span>
              <span className="font-mono text-[10px] text-amber-300">clearance: internal</span>
            </div>
            <h1 className="mt-2 text-4xl font-semibold tracking-tight text-slate-100">
              DIGITAL <span className="text-emerald-400">AVENGERS</span>
            </h1>
            <p className="mt-2 max-w-xl text-[14px] text-slate-400">
              Offensive + defensive security collective. <span className="text-slate-200">7 operators, 1 mission.</span>
              {" "}Red and blue side-by-side, every finding shipped with a defender’s playbook.
            </p>

            <div className="mt-5 flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-md border border-emerald-500/20 bg-emerald-500/5 px-2 py-1 font-mono text-[11px] text-emerald-300">
                <Icon name="ShieldCheck" size={12} />
                offensive-sec
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-md border border-sky-500/20 bg-sky-500/5 px-2 py-1 font-mono text-[11px] text-sky-300">
                <Icon name="Radar" size={12} />
                blue-team
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-md border border-amber-500/25 bg-amber-500/5 px-2 py-1 font-mono text-[11px] text-amber-300">
                <Icon name="Bug" size={12} />
                malware-analysis
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-md border border-teal-500/20 bg-teal-500/5 px-2 py-1 font-mono text-[11px] text-teal-300">
                <Icon name="Network" size={12} />
                forensics
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-md border border-red-500/25 bg-red-500/5 px-2 py-1 font-mono text-[11px] text-red-300">
                <Icon name="Flame" size={12} />
                threat-intel
              </span>
            </div>
          </div>

          {/* Right: member grid */}
          <div className="col-span-12 lg:col-span-4">
            <div className="flex items-center justify-between">
              <SectionLabel>Active operators</SectionLabel>
              <span className="font-mono text-[10px] text-emerald-400">07/07 ONLINE</span>
            </div>
            <div className="mt-3 grid grid-cols-4 gap-2">
              {MEMBERS.map((m) => (
                <div key={m.id} className="group relative" title={`${m.name} — ${m.role}`}>
                  <div className="relative flex aspect-square items-center justify-center rounded-md border border-slate-800 bg-slate-900/80 transition-colors hover:border-emerald-500/40 hover:bg-slate-900">
                    <Avatar initials={m.initials} size={28} />
                    <span className="absolute bottom-1 right-1 block h-1.5 w-1.5 rounded-full bg-emerald-500 ring-1 ring-slate-900" />
                  </div>
                  <div className="pointer-events-none absolute left-1/2 top-full z-10 mt-1.5 w-max -translate-x-1/2 scale-95 rounded-md border border-slate-800 bg-slate-950 px-2 py-1 opacity-0 shadow-xl transition-all group-hover:scale-100 group-hover:opacity-100">
                    <div className="text-[11px] text-slate-200">{m.name}</div>
                    <div className="font-mono text-[10px] text-emerald-400">online · {m.role.toLowerCase()}</div>
                  </div>
                </div>
              ))}
              <div className="flex aspect-square items-center justify-center rounded-md border border-dashed border-slate-800 font-mono text-[10px] text-slate-600">
                +0
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

window.Hero = Hero;
