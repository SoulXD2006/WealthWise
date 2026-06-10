import { useState } from "react";

const sectors = [
  { name: "Technology", value: 38.5, color: "#3b82f6" },
  { name: "Financials", value: 18.2, color: "#a855f7" },
  { name: "Healthcare", value: 12.4, color: "#10b981" },
  { name: "Consumer", value: 11.8, color: "#f59e0b" },
  { name: "Energy", value: 8.6, color: "#06b6d4" },
  { name: "Real Estate", value: 5.9, color: "#ec4899" },
  { name: "Other", value: 4.6, color: "#6b7494" },
];

function DonutChart({ sectors, hovered }: { sectors: typeof sectors; hovered: string | null }) {
  const cx = 80; const cy = 80; const outerR = 72; const innerR = 52;
  const gap = 0.025;

  let cumAngle = -Math.PI / 2;
  const total = sectors.reduce((s, d) => s + d.value, 0);

  const slices = sectors.map(s => {
    const angle = (s.value / total) * (2 * Math.PI) - gap;
    const startAngle = cumAngle + gap / 2;
    const endAngle = startAngle + angle;
    cumAngle += (s.value / total) * (2 * Math.PI);

    const x1 = cx + outerR * Math.cos(startAngle);
    const y1 = cy + outerR * Math.sin(startAngle);
    const x2 = cx + outerR * Math.cos(endAngle);
    const y2 = cy + outerR * Math.sin(endAngle);
    const x3 = cx + innerR * Math.cos(endAngle);
    const y3 = cy + innerR * Math.sin(endAngle);
    const x4 = cx + innerR * Math.cos(startAngle);
    const y4 = cy + innerR * Math.sin(startAngle);

    const large = angle > Math.PI ? 1 : 0;
    const path = `M ${x1} ${y1} A ${outerR} ${outerR} 0 ${large} 1 ${x2} ${y2} L ${x3} ${y3} A ${innerR} ${innerR} 0 ${large} 0 ${x4} ${y4} Z`;

    return { ...s, path, startAngle, endAngle };
  });

  const active = hovered ? sectors.find(s => s.name === hovered) : null;

  return (
    <svg width={160} height={160} viewBox="0 0 160 160">
      {slices.map(s => {
        const isHov = hovered === s.name;
        const scale = isHov ? 1.05 : 1;
        return (
          <path
            key={s.name}
            d={s.path}
            fill={s.color}
            opacity={hovered && !isHov ? 0.35 : 0.88}
            style={{
              transform: `scale(${scale})`,
              transformOrigin: `${cx}px ${cy}px`,
              transition: "all 0.15s ease",
            }}
          />
        );
      })}
      {/* Center text */}
      <text x={cx} y={cy - 6} textAnchor="middle" fill="#e8eaf0" fontSize={active ? 14 : 11} fontWeight={700} fontFamily="JetBrains Mono, monospace">
        {active ? `${active.value}%` : "38.5%"}
      </text>
      <text x={cx} y={cy + 10} textAnchor="middle" fill="#6b7494" fontSize={9} fontFamily="Inter, sans-serif">
        {active ? active.name : "Technology"}
      </text>
    </svg>
  );
}

export function AllocationChart() {
  const [hovered, setHovered] = useState<string | null>(null);

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
      <div>
        <p style={{ fontSize: "11px", fontWeight: 500, color: "#6b7494", letterSpacing: "0.05em", textTransform: "uppercase" }}>
          Sector Allocation
        </p>
        <p style={{ fontSize: "13px", fontWeight: 500, color: "#e8eaf0", marginTop: "2px" }}>Diversification Index: 72</p>
      </div>

      <div className="flex justify-center">
        <DonutChart sectors={sectors} hovered={hovered} />
      </div>

      <div className="flex flex-col gap-2">
        {sectors.map((s) => (
          <div
            key={s.name}
            className="flex items-center gap-2 cursor-pointer transition-opacity"
            style={{ opacity: hovered && hovered !== s.name ? 0.45 : 1 }}
            onMouseEnter={() => setHovered(s.name)}
            onMouseLeave={() => setHovered(null)}
          >
            <span className="w-2 h-2 rounded-full shrink-0" style={{ background: s.color }} />
            <span style={{ fontSize: "11px", color: "#8892a4", flex: 1 }}>{s.name}</span>
            <div className="flex-1 h-1 rounded-full overflow-hidden mx-2" style={{ background: "rgba(255,255,255,0.06)" }}>
              <div className="h-full rounded-full transition-all" style={{ width: `${s.value * 2}%`, background: s.color, opacity: 0.8 }} />
            </div>
            <span className="font-mono" style={{ fontSize: "11px", fontWeight: 600, color: "#a0a8bc", minWidth: "36px", textAlign: "right" }}>
              {s.value}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
