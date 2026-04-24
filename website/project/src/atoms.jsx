// Shared atoms. Palette nods to paolorampino.it:
//   kali-green terminal, classified amber, red stamps, teal accents.
const { createElement, useEffect, useRef, useState, useMemo } = React;

function Icon({ name, size = 16, className = "", strokeWidth = 1.75, style }) {
  const ref = useRef(null);
  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    root.innerHTML = "";
    const lib = window.lucide;
    if (!lib) return;
    const icons = lib.icons || {};
    const key = Object.keys(icons).find(k => k.toLowerCase() === String(name).toLowerCase());
    const def = key ? icons[key] : null;
    if (!def) return;
    const svg = lib.createElement(def);
    svg.setAttribute("width", size);
    svg.setAttribute("height", size);
    svg.setAttribute("stroke-width", strokeWidth);
    svg.setAttribute("class", "");
    root.appendChild(svg);
  }, [name, size, strokeWidth]);
  return <span ref={ref} className={`inline-flex items-center justify-center ${className}`} style={{ width: size, height: size, ...style }} aria-hidden="true" />;
}

function StatusDot({ tone = "emerald", pulse = false, size = 8, className = "" }) {
  const map = {
    emerald: "bg-emerald-500",
    amber:   "bg-amber-400",
    red:     "bg-red-500",
    sky:     "bg-sky-400",
    teal:    "bg-teal-400",
    slate:   "bg-slate-500",
  };
  return (
    <span
      className={`inline-block rounded-full ${map[tone] || map.slate} ${pulse ? "da-pulse-dot" : ""} ${className}`}
      style={{ width: size, height: size }}
    />
  );
}

function Badge({ tone = "slate", children, className = "" }) {
  const map = {
    emerald: "text-emerald-400 bg-emerald-500/10 ring-emerald-500/20",
    amber:   "text-amber-300 bg-amber-500/10 ring-amber-500/30",
    red:     "text-red-400 bg-red-500/10 ring-red-500/30",
    sky:     "text-sky-400 bg-sky-500/10 ring-sky-500/20",
    teal:    "text-teal-300 bg-teal-500/10 ring-teal-500/25",
    slate:   "text-slate-400 bg-slate-800/60 ring-slate-700",
  };
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-md px-2 py-0.5 text-[10px] font-mono uppercase tracking-wider ring-1 ${map[tone]} ${className}`}>
      {children}
    </span>
  );
}

// Amber "CLASSIFIED"-style stamp, paolorampino-ish.
function ClassifiedStamp({ level = "SEC_LEVEL_3", className = "" }) {
  const tone =
    level === "SEC_LEVEL_5" ? "text-red-300 ring-red-500/40 bg-red-500/10"
    : level === "SEC_LEVEL_4" ? "text-amber-200 ring-amber-500/40 bg-amber-500/10"
    : level === "SEC_LEVEL_3" ? "text-amber-300 ring-amber-500/30 bg-amber-500/5"
    : "text-teal-300 ring-teal-500/30 bg-teal-500/5";
  return (
    <span className={`inline-flex items-center gap-1 rounded-sm px-1.5 py-[1px] font-mono text-[9px] uppercase tracking-[0.22em] ring-1 ${tone} ${className}`}>
      <Icon name="Lock" size={9} />
      {level}
    </span>
  );
}

function Kbd({ children }) {
  return (
    <span className="inline-flex items-center rounded border border-slate-700 bg-slate-900/60 px-1.5 py-[1px] font-mono text-[10px] text-slate-400">
      {children}
    </span>
  );
}

function Avatar({ initials = "??", size = 24, tone, ring = false, title }) {
  // More saturated palette, nods to the reference site.
  const palette = ["#22c55e","#14b8a6","#f59e0b","#e1615f","#8b5cf6","#06b6d4","#ef4444"];
  const hash = useMemo(() => {
    let h = 0;
    for (const c of initials) h = (h * 31 + c.charCodeAt(0)) >>> 0;
    return palette[h % palette.length];
  }, [initials]);
  const bg = tone || hash;
  return (
    <span
      title={title}
      className={`inline-flex items-center justify-center rounded-full font-mono font-semibold text-slate-950 ${ring ? "ring-2 ring-slate-950" : ""}`}
      style={{
        width: size, height: size,
        fontSize: Math.max(9, size * 0.38),
        background: `linear-gradient(135deg, ${bg}, ${bg}cc)`,
      }}
    >
      {initials}
    </span>
  );
}

function SectionLabel({ children, className = "" }) {
  return (
    <div className={`text-[10px] font-mono uppercase tracking-[0.18em] text-slate-500 ${className}`}>
      {children}
    </div>
  );
}

function Card({ className = "", children, ...rest }) {
  return (
    <div className={`rounded-lg border border-slate-800 bg-slate-900 ${className}`} {...rest}>
      {children}
    </div>
  );
}

Object.assign(window, { Icon, StatusDot, Badge, ClassifiedStamp, Kbd, Avatar, SectionLabel, Card });
