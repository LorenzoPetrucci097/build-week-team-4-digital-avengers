function Milestone({ m, idx, total }) {
  return (
    <div className="relative flex min-w-[220px] flex-1 flex-col">
      <div className="mb-3 flex items-center justify-between font-mono text-[10px] uppercase tracking-widest">
        <span className="text-slate-500">{m.date}</span>
        <span className="text-emerald-400">done</span>
      </div>

      {/* rail */}
      <div className="relative h-4">
        <div className={`absolute left-0 right-0 top-1/2 h-px -translate-y-1/2 ${idx === 0 ? "bg-transparent" : "bg-emerald-500/40"}`} style={{ right: "50%" }} />
        <div className={`absolute left-0 right-0 top-1/2 h-px -translate-y-1/2 ${idx === total - 1 ? "bg-transparent" : "bg-emerald-500/40"}`} style={{ left: "50%" }} />
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
          <span className="block rounded-full border border-emerald-400 bg-emerald-500" style={{ width: 12, height: 12 }} />
        </div>
      </div>

      <div className="mt-3 rounded-md border border-slate-800 bg-slate-900 p-3">
        <div className="text-[13px] font-semibold tracking-tight text-slate-100">{m.title}</div>
        <ul className="mt-2 space-y-1">
          {m.bullets.map((b) => (
            <li key={b} className="flex items-start gap-2 text-[11px] text-slate-400">
              <Icon name="Check" size={11} className="mt-[2px] shrink-0 text-emerald-400" />
              <span>{b}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function RoadmapTimeline() {
  return (
    <section>
      <div className="mb-3 flex items-end justify-between">
        <div>
          <SectionLabel>Roadmap</SectionLabel>
          <h2 className="mt-0.5 text-[15px] font-semibold tracking-tight text-slate-100">
            Build-week timeline · all milestones shipped
          </h2>
        </div>
        <div className="inline-flex items-center gap-1.5 rounded-md bg-emerald-500/10 px-2 py-1 font-mono text-[10px] uppercase tracking-widest text-emerald-300 ring-1 ring-emerald-500/25">
          <Icon name="CircleCheck" size={11} /> 5/5 complete
        </div>
      </div>

      <div className="rounded-lg border border-slate-800 bg-slate-900 p-5">
        <div className="no-scrollbar flex gap-4 overflow-x-auto pb-1">
          {MILESTONES.map((m, i) => (
            <Milestone key={m.id} m={m} idx={i} total={MILESTONES.length} />
          ))}
        </div>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-3">
        {[
          {
            tone: "emerald",
            label: "Mission",
            title: "Ship evidence, not slides",
            body: "Break things in lab, document exactly how we broke them, and hand defenders the rules to catch us next time. Every engagement left behind a reproducible artifact."
          },
          {
            tone: "amber",
            label: "Delivery",
            title: "Red + blue, one squad",
            body: "Web / AD / wireless pentesting, malware triage, detection engineering and secure-dev review. Delivered as reports, Sigma rules, runbooks and sanitized PoC repos."
          },
          {
            tone: "teal",
            label: "Outcome",
            title: "Closed the loop",
            body: "Every offensive finding this week has a paired defensive artifact in the same repo — Sigma rule, YARA rule, hardening patch or runbook entry."
          },
        ].map((c) => (
          <div key={c.label} className={`rounded-lg border bg-slate-900 p-4 ${
            c.tone === "emerald" ? "border-emerald-500/20"
            : c.tone === "amber" ? "border-amber-500/20"
            : "border-teal-500/20"
          }`}>
            <div className={`text-[10px] font-mono uppercase tracking-[0.18em] ${
              c.tone === "emerald" ? "text-emerald-400"
              : c.tone === "amber" ? "text-amber-300"
              : "text-teal-300"
            }`}>// {c.label}</div>
            <div className="mt-1.5 text-[14px] font-semibold tracking-tight text-slate-100">{c.title}</div>
            <p className="mt-2 text-[12px] leading-relaxed text-slate-400">{c.body}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

window.RoadmapTimeline = RoadmapTimeline;
