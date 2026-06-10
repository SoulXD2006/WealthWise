import { useState, useRef, useMemo } from "react";

const generateData = (months: number, startValue: number) => {
  const data = [];
  let value = startValue;
  const now = new Date();
  // Use deterministic seed based on months so data is stable across renders
  for (let i = months; i >= 0; i--) {
    const d = new Date(now);
    d.setMonth(d.getMonth() - i);
    const seed = (months * 31 + i * 17) % 100;
    const change = (((seed * 9301 + 49297) % 233280) / 233280 - 0.42) * 8000;
    value = Math.max(value + change, startValue * 0.7);
    data.push({
      date: d.toLocaleDateString("en-US", { month: "short", year: "2-digit" }),
      value: Math.round(value),
      benchmark: Math.round(startValue + (startValue * 0.12 * (months - i)) / months + (((i * 9301 + 49297) % 233280) / 233280 - 0.5) * 3000),
    });
  }
  return data;
};

const ranges = [
  { label: "1W", months: 1 },
  { label: "1M", months: 2 },
  { label: "3M", months: 3 },
  { label: "6M", months: 6 },
  { label: "1Y", months: 12 },
  { label: "ALL", months: 36 },
];

function SvgLineChart({
  data,
  lines,
  width,
  height,
  gradientId,
}: {
  data: { value: number; benchmark: number }[];
  lines: { key: "value" | "benchmark"; color: string; dash?: string; gradId?: string }[];
  width: number;
  height: number;
  gradientId: string;
}) {
  const pad = { top: 8, right: 8, bottom: 28, left: 48 };
  const w = width - pad.left - pad.right;
  const h = height - pad.top - pad.bottom;

  const allVals = data.flatMap(d => [d.value, d.benchmark]);
  const minV = Math.min(...allVals) * 0.995;
  const maxV = Math.max(...allVals) * 1.005;

  const xScale = (i: number) => (i / (data.length - 1)) * w;
  const yScale = (v: number) => h - ((v - minV) / (maxV - minV)) * h;

  const toPath = (key: "value" | "benchmark") => {
    return data
      .map((d, i) => `${i === 0 ? "M" : "L"}${xScale(i).toFixed(1)},${yScale(d[key]).toFixed(1)}`)
      .join(" ");
  };

  const toArea = (key: "value" | "benchmark") => {
    const line = toPath(key);
    return `${line} L${xScale(data.length - 1).toFixed(1)},${h} L0,${h} Z`;
  };

  // Y axis ticks
  const yTicks = [0, 0.25, 0.5, 0.75, 1].map(t => minV + t * (maxV - minV));
  // X axis ticks (show ~5)
  const step = Math.max(1, Math.floor(data.length / 5));
  const xTicks = data.filter((_, i) => i % step === 0 || i === data.length - 1);

  return (
    <svg width={width} height={height} style={{ overflow: "visible" }}>
      <defs>
        <linearGradient id={`${gradientId}-val`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.22} />
          <stop offset="100%" stopColor="#3b82f6" stopOpacity={0} />
        </linearGradient>
        <linearGradient id={`${gradientId}-bench`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#6b7494" stopOpacity={0.06} />
          <stop offset="100%" stopColor="#6b7494" stopOpacity={0} />
        </linearGradient>
        <clipPath id={`${gradientId}-clip`}>
          <rect x={0} y={0} width={w} height={h} />
        </clipPath>
      </defs>
      <g transform={`translate(${pad.left},${pad.top})`}>
        {/* Grid lines */}
        {yTicks.map((v, i) => (
          <line key={i} x1={0} y1={yScale(v).toFixed(1)} x2={w} y2={yScale(v).toFixed(1)} stroke="rgba(255,255,255,0.04)" strokeWidth={1} />
        ))}

        <g clipPath={`url(#${gradientId}-clip)`}>
          {/* Benchmark area */}
          <path d={toArea("benchmark")} fill={`url(#${gradientId}-bench)`} />
          {/* Value area */}
          <path d={toArea("value")} fill={`url(#${gradientId}-val)`} />
          {/* Benchmark line */}
          <path d={toPath("benchmark")} fill="none" stroke="rgba(107,116,148,0.4)" strokeWidth={1.5} strokeDasharray="4 4" />
          {/* Value line */}
          <path d={toPath("value")} fill="none" stroke="#3b82f6" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
        </g>

        {/* Y axis labels */}
        {yTicks.filter((_, i) => i % 2 === 0).map((v, i) => (
          <text key={i} x={-6} y={yScale(v) + 4} textAnchor="end" fill="#6b7494" fontSize={10} fontFamily="JetBrains Mono, monospace">
            ${(v / 1000).toFixed(0)}k
          </text>
        ))}

        {/* X axis labels */}
        {xTicks.map((d, i) => {
          const idx = data.indexOf(d);
          return (
            <text key={i} x={xScale(idx)} y={h + 18} textAnchor="middle" fill="#6b7494" fontSize={10} fontFamily="JetBrains Mono, monospace">
              {d.date}
            </text>
          );
        })}
      </g>
    </svg>
  );
}

export function PortfolioChart() {
  const [activeRange, setActiveRange] = useState("1Y");
  const idRef = useRef(`pc-${Math.random().toString(36).slice(2)}`);
  const months = ranges.find(r => r.label === activeRange)?.months ?? 12;
  const data = useMemo(() => generateData(months, 180000), [months]);

  const first = data[0]?.value ?? 0;
  const last = data[data.length - 1]?.value ?? 0;
  const gain = last - first;
  const gainPct = ((gain / first) * 100).toFixed(2);
  const positive = gain >= 0;

  const [containerWidth, setContainerWidth] = useState(600);
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <div
      className="rounded-xl p-5 flex flex-col gap-4"
      style={{
        background: "rgba(255,255,255,0.03)",
        border: "1px solid rgba(255,255,255,0.08)",
        backdropFilter: "blur(20px)",
        boxShadow: "0 4px 24px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.06)",
      }}
    >
      <div className="flex items-start justify-between">
        <div>
          <p style={{ fontSize: "11px", fontWeight: 500, color: "#6b7494", letterSpacing: "0.05em", textTransform: "uppercase" }}>
            Portfolio Performance
          </p>
          <div className="flex items-end gap-3 mt-1">
            <span className="font-mono" style={{ fontSize: "26px", fontWeight: 700, color: "#e8eaf0", letterSpacing: "-0.03em" }}>
              ${last.toLocaleString()}
            </span>
            <span className="font-mono mb-1" style={{ fontSize: "13px", fontWeight: 600, color: positive ? "#10b981" : "#ef4444" }}>
              {positive ? "+" : ""}${Math.abs(gain).toLocaleString()} ({positive ? "+" : ""}{gainPct}%)
            </span>
          </div>
        </div>

        <div className="flex gap-0.5 p-1 rounded-lg" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)" }}>
          {ranges.map(({ label }) => (
            <button
              key={label}
              onClick={() => setActiveRange(label)}
              className="px-2.5 py-1 rounded-md transition-all duration-150"
              style={{
                background: activeRange === label ? "rgba(59,130,246,0.2)" : "transparent",
                border: activeRange === label ? "1px solid rgba(59,130,246,0.3)" : "1px solid transparent",
                color: activeRange === label ? "#3b82f6" : "#6b7494",
                fontSize: "11px",
                fontWeight: 500,
              }}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Legend */}
      <div className="flex gap-4">
        {[{ label: "Portfolio", color: "#3b82f6", dash: false }, { label: "S&P 500", color: "rgba(107,116,148,0.6)", dash: true }].map(l => (
          <div key={l.label} className="flex items-center gap-1.5">
            <span className="w-3 h-0.5 rounded-full inline-block" style={{ background: l.color, borderTop: l.dash ? "1px dashed" : "none" }} />
            <span style={{ fontSize: "11px", color: "#8892a4" }}>{l.label}</span>
          </div>
        ))}
      </div>

      <div
        ref={containerRef}
        style={{ height: "210px", width: "100%" }}
      >
        <SvgLineChart
          data={data}
          lines={[]}
          width={containerRef.current?.clientWidth ?? 560}
          height={210}
          gradientId={idRef.current}
        />
      </div>
    </div>
  );
}
