function Sparkline({ data, tone = "emerald" }) {
  const R = window.Recharts;
  if (!R) return <div className="h-5 w-full bg-slate-800/40" />;
  const { ResponsiveContainer } = R;
  const stroke = tone === "emerald" ? "#34d399" : tone === "sky" ? "#38bdf8" : tone === "amber" ? "#fbbf24" : tone === "teal" ? "#2dd4bf" : tone === "red" ? "#f87171" : "#a78bfa";
  const fill   = tone === "emerald" ? "#10b981" : tone === "sky" ? "#0ea5e9" : tone === "amber" ? "#f59e0b" : tone === "teal" ? "#14b8a6" : tone === "red" ? "#ef4444" : "#8b5cf6";
  const gid = React.useMemo(() => `g${Math.random().toString(36).slice(2,8)}`, []);
  return (
    <div className="h-6 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <R.AreaChart data={data} margin={{ top: 2, right: 0, bottom: 2, left: 0 }}>
          <defs>
            <linearGradient id={gid} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={fill} stopOpacity={0.32} />
              <stop offset="100%" stopColor={fill} stopOpacity={0} />
            </linearGradient>
          </defs>
          <R.Area
            type="monotone" dataKey="v" stroke={stroke} strokeWidth={1.6}
            fill={`url(#${gid})`} dot={false} isAnimationActive={false}
          />
        </R.AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

function MetricCard({ kpi, idx }) {
  const tones = ["emerald", "teal", "amber", "sky"];
  const tone = tones[idx % tones.length];
  const deltaTone = kpi.up ? "text-emerald-400" : "text-red-400";
  return (
    <div
      className="da-rise group rounded-lg border border-slate-800 bg-slate-900 p-4 transition-colors hover:border-slate-700"
      style={{ animationDelay: `${idx * 50}ms` }}
    >
      <div className="flex items-center justify-between">
        <SectionLabel>{kpi.label}</SectionLabel>
        <span className={`inline-flex items-center gap-1 font-mono text-[10px] ${deltaTone}`}>
          <Icon name={kpi.up ? "ArrowUpRight" : "ArrowDownRight"} size={10} />
          {kpi.delta}
        </span>
      </div>
      <div className="mt-3 flex items-baseline gap-2">
        <span className="font-mono text-3xl font-semibold tracking-tight text-slate-100">{kpi.value}</span>
      </div>
      <div className="mt-3">
        <Sparkline data={kpi.spark} tone={tone} />
      </div>
      <div className="mt-1 flex items-center justify-between font-mono text-[10px] text-slate-500">
        <span>last 5d</span>
        <span>updated 14:32</span>
      </div>
    </div>
  );
}

function MetricsRow() {
  return (
    <section>
      <div className="mb-3 flex items-end justify-between">
        <div>
          <SectionLabel>Ops metrics</SectionLabel>
          <h2 className="mt-0.5 text-[15px] font-semibold tracking-tight text-slate-100">Squad performance · last 5 days</h2>
        </div>
        <div className="flex items-center gap-1 font-mono text-[10px] text-slate-500">
          <Icon name="RefreshCw" size={10} />
          sync · 14:32:17
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {KPIS.map((k, i) => <MetricCard key={k.key} kpi={k} idx={i} />)}
      </div>
    </section>
  );
}

window.MetricsRow = MetricsRow;
