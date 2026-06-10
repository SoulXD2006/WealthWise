import { TrendingUp, TrendingDown } from "lucide-react";

const markets = [
  { symbol: "S&P 500", value: "5,308.13", change: "+0.87%", positive: true, spark: [52,55,51,58,56,60,57,63,61,65,62,68,66,70] },
  { symbol: "NASDAQ", value: "16,742.39", change: "+1.24%", positive: true, spark: [40,43,41,48,46,51,49,54,52,57,55,60,58,63] },
  { symbol: "DOW", value: "38,849.12", change: "-0.18%", positive: false, spark: [60,62,59,61,58,56,59,57,54,56,53,51,54,52] },
  { symbol: "BTC/USD", value: "$67,284", change: "+2.31%", positive: true, spark: [30,35,32,40,38,45,42,50,48,55,52,58,56,62] },
  { symbol: "ETH/USD", value: "$3,418", change: "+1.89%", positive: true, spark: [45,48,44,52,50,55,53,58,56,61,59,64,62,67] },
  { symbol: "Gold", value: "$2,347", change: "-0.42%", positive: false, spark: [55,57,54,56,53,55,52,50,53,51,48,50,47,49] },
];

function Sparkline({ values, positive, id }: { values: number[]; positive: boolean; id: string }) {
  const w = 60;
  const h = 28;
  const pad = 2;
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;
  const xStep = (w - pad * 2) / (values.length - 1);

  const pts = values.map((v, i) => ({
    x: pad + i * xStep,
    y: pad + (1 - (v - min) / range) * (h - pad * 2),
  }));

  const linePath = pts.map((p, i) => `${i === 0 ? "M" : "L"}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(" ");
  const areaPath = `${linePath} L${pts[pts.length - 1].x.toFixed(1)},${h} L${pts[0].x.toFixed(1)},${h} Z`;

  const color = positive ? "#10b981" : "#ef4444";
  const gradId = `spk-${id}`;

  return (
    <svg width={w} height={h} style={{ overflow: "visible" }}>
      <defs>
        <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity={0.2} />
          <stop offset="100%" stopColor={color} stopOpacity={0} />
        </linearGradient>
      </defs>
      <path d={areaPath} fill={`url(#${gradId})`} />
      <path d={linePath} fill="none" stroke={color} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function MarketWidget() {
  return (
    <div
      className="rounded-xl overflow-hidden"
      style={{
        background: "rgba(255,255,255,0.03)",
        border: "1px solid rgba(255,255,255,0.08)",
        backdropFilter: "blur(20px)",
        boxShadow: "0 4px 24px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.06)",
      }}
    >
      <div className="px-5 py-3.5" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        <p style={{ fontSize: "11px", fontWeight: 500, color: "#6b7494", letterSpacing: "0.05em", textTransform: "uppercase" }}>
          Market Overview
        </p>
      </div>
      <div>
        {markets.map((m, i) => (
          <div
            key={m.symbol}
            className="flex items-center px-5 py-3 transition-colors hover:bg-white/[0.025] cursor-pointer"
            style={{ borderBottom: i < markets.length - 1 ? "1px solid rgba(255,255,255,0.04)" : "none" }}
          >
            <div className="flex-1">
              <p className="font-mono" style={{ fontSize: "12px", fontWeight: 600, color: "#e8eaf0" }}>{m.symbol}</p>
              <p className="font-mono" style={{ fontSize: "10px", color: "#6b7494", marginTop: "1px" }}>{m.value}</p>
            </div>

            <Sparkline values={m.spark} positive={m.positive} id={`${m.symbol.replace(/[^a-z0-9]/gi, "")}-${i}`} />

            <div className="flex items-center gap-1 ml-3" style={{ minWidth: "64px", justifyContent: "flex-end" }}>
              {m.positive ? (
                <TrendingUp size={10} style={{ color: "#10b981" }} />
              ) : (
                <TrendingDown size={10} style={{ color: "#ef4444" }} />
              )}
              <span className="font-mono" style={{ fontSize: "11px", fontWeight: 600, color: m.positive ? "#10b981" : "#ef4444" }}>
                {m.change}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
