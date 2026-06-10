import { useState } from "react";
import { TrendingUp, TrendingDown, ChevronDown, ChevronUp, Star, MoreHorizontal } from "lucide-react";

interface Holding {
  symbol: string;
  name: string;
  sector: string;
  shares: number;
  avgCost: number;
  currentPrice: number;
  marketValue: number;
  pnl: number;
  pnlPct: number;
  weight: number;
  dayChange: number;
  dayChangePct: number;
  starred: boolean;
}

const holdings: Holding[] = [
  { symbol: "NVDA", name: "NVIDIA Corp", sector: "Technology", shares: 42, avgCost: 412.50, currentPrice: 875.20, marketValue: 36758, pnl: 19449, pnlPct: 112.3, weight: 14.8, dayChange: 1248, dayChangePct: 3.51, starred: true },
  { symbol: "AAPL", name: "Apple Inc", sector: "Technology", shares: 85, avgCost: 148.20, currentPrice: 189.40, marketValue: 16099, pnl: 3502, pnlPct: 27.8, weight: 6.5, dayChange: -242, dayChangePct: -1.48, starred: true },
  { symbol: "MSFT", name: "Microsoft Corp", sector: "Technology", shares: 30, avgCost: 280.00, currentPrice: 415.80, marketValue: 12474, pnl: 4074, pnlPct: 48.5, weight: 5.0, dayChange: 186, dayChangePct: 1.51, starred: false },
  { symbol: "BRK.B", name: "Berkshire Hathaway", sector: "Financials", shares: 52, avgCost: 298.40, currentPrice: 358.20, marketValue: 18626, pnl: 3109, pnlPct: 20.1, weight: 7.5, dayChange: 94, dayChangePct: 0.51, starred: false },
  { symbol: "AMZN", name: "Amazon.com", sector: "Consumer", shares: 48, avgCost: 142.80, currentPrice: 178.40, marketValue: 8563, pnl: 1709, pnlPct: 24.9, weight: 3.4, dayChange: -312, dayChangePct: -3.52, starred: true },
  { symbol: "GOOGL", name: "Alphabet Inc", sector: "Technology", shares: 38, avgCost: 130.20, currentPrice: 168.90, marketValue: 6418, pnl: 1471, pnlPct: 29.7, weight: 2.6, dayChange: 128, dayChangePct: 2.04, starred: false },
  { symbol: "META", name: "Meta Platforms", sector: "Technology", shares: 25, avgCost: 295.00, currentPrice: 512.30, marketValue: 12808, pnl: 5433, pnlPct: 73.7, weight: 5.1, dayChange: 384, dayChangePct: 3.09, starred: false },
  { symbol: "JPM", name: "JPMorgan Chase", sector: "Financials", shares: 65, avgCost: 148.50, currentPrice: 196.80, marketValue: 12792, pnl: 3140, pnlPct: 32.5, weight: 5.1, dayChange: -156, dayChangePct: -1.21, starred: false },
];

type SortKey = "symbol" | "marketValue" | "pnlPct" | "dayChangePct" | "weight";

export function HoldingsTable() {
  const [sortKey, setSortKey] = useState<SortKey>("marketValue");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");
  const [starred, setStarred] = useState<Set<string>>(new Set(holdings.filter(h => h.starred).map(h => h.symbol)));

  const handleSort = (key: SortKey) => {
    if (sortKey === key) setStarDir(d => d === "desc" ? "asc" : "desc");
    else { setSortKey(key); setSortDir("desc"); }
  };

  function setStarDir(updater: (d: "asc" | "desc") => "asc" | "desc") {
    setSortDir(prev => updater(prev));
  }

  const sorted = [...holdings].sort((a, b) => {
    const va = a[sortKey] as number | string;
    const vb = b[sortKey] as number | string;
    const cmp = typeof va === "string" ? va.localeCompare(vb as string) : (va as number) - (vb as number);
    return sortDir === "desc" ? -cmp : cmp;
  });

  const SortIcon = ({ k }: { k: SortKey }) =>
    sortKey === k ? (
      sortDir === "desc" ? <ChevronDown size={10} style={{ color: "#3b82f6" }} /> : <ChevronUp size={10} style={{ color: "#3b82f6" }} />
    ) : <ChevronDown size={10} style={{ color: "#6b7494", opacity: 0.4 }} />;

  const ColHeader = ({ label, k }: { label: string; k: SortKey }) => (
    <th
      className="px-3 py-2.5 text-left cursor-pointer hover:text-foreground transition-colors select-none"
      onClick={() => handleSort(k)}
      style={{ fontSize: "10px", fontWeight: 600, color: "#6b7494", letterSpacing: "0.06em", textTransform: "uppercase" }}
    >
      <div className="flex items-center gap-1">
        {label}
        <SortIcon k={k} />
      </div>
    </th>
  );

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
      <div className="flex items-center justify-between px-5 py-4" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        <div>
          <h3 style={{ fontSize: "13px", fontWeight: 600, color: "#e8eaf0" }}>Holdings</h3>
          <p style={{ fontSize: "11px", color: "#6b7494", marginTop: "1px" }}>{holdings.length} positions · $123,538 total</p>
        </div>
        <div className="flex gap-2">
          <button
            className="px-3 h-7 rounded-lg text-xs transition-colors hover:bg-white/8"
            style={{ border: "1px solid rgba(255,255,255,0.08)", color: "#8892a4", fontSize: "11px" }}
          >
            Export CSV
          </button>
          <button
            className="px-3 h-7 rounded-lg text-xs transition-colors"
            style={{ background: "rgba(59,130,246,0.12)", border: "1px solid rgba(59,130,246,0.2)", color: "#3b82f6", fontSize: "11px" }}
          >
            + Add Position
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
              <th className="px-3 py-2.5 w-8" />
              <ColHeader label="Asset" k="symbol" />
              <th className="px-3 py-2.5 text-right" style={{ fontSize: "10px", fontWeight: 600, color: "#6b7494", letterSpacing: "0.06em", textTransform: "uppercase" }}>Shares</th>
              <th className="px-3 py-2.5 text-right" style={{ fontSize: "10px", fontWeight: 600, color: "#6b7494", letterSpacing: "0.06em", textTransform: "uppercase" }}>Price</th>
              <ColHeader label="Mkt Value" k="marketValue" />
              <ColHeader label="P&L" k="pnlPct" />
              <ColHeader label="Day" k="dayChangePct" />
              <ColHeader label="Weight" k="weight" />
              <th className="px-3 py-2.5 w-8" />
            </tr>
          </thead>
          <tbody>
            {sorted.map((h, i) => {
              const isStarred = starred.has(h.symbol);
              return (
                <tr
                  key={h.symbol}
                  className="group transition-colors"
                  style={{
                    borderBottom: i < sorted.length - 1 ? "1px solid rgba(255,255,255,0.04)" : "none",
                    background: "transparent",
                  }}
                  onMouseEnter={e => (e.currentTarget.style.background = "rgba(255,255,255,0.025)")}
                  onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
                >
                  <td className="px-3 py-3">
                    <button
                      onClick={() => setStarred(prev => { const n = new Set(prev); isStarred ? n.delete(h.symbol) : n.add(h.symbol); return n; })}
                    >
                      <Star size={12} fill={isStarred ? "#f59e0b" : "none"} style={{ color: isStarred ? "#f59e0b" : "#6b7494" }} />
                    </button>
                  </td>
                  <td className="px-3 py-3">
                    <div className="flex items-center gap-2.5">
                      <div
                        className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
                        style={{
                          background: `hsl(${(h.symbol.charCodeAt(0) * 37) % 360}, 50%, 18%)`,
                          border: `1px solid hsl(${(h.symbol.charCodeAt(0) * 37) % 360}, 50%, 28%)`,
                        }}
                      >
                        <span style={{ fontSize: "9px", fontWeight: 700, color: `hsl(${(h.symbol.charCodeAt(0) * 37) % 360}, 80%, 70%)` }}>
                          {h.symbol.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <p className="font-mono" style={{ fontSize: "12px", fontWeight: 600, color: "#e8eaf0" }}>{h.symbol}</p>
                        <p style={{ fontSize: "10px", color: "#6b7494" }}>{h.sector}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-3 py-3 text-right">
                    <span className="font-mono" style={{ fontSize: "12px", color: "#a0a8bc" }}>{h.shares}</span>
                  </td>
                  <td className="px-3 py-3 text-right">
                    <span className="font-mono" style={{ fontSize: "12px", color: "#a0a8bc" }}>${h.currentPrice.toFixed(2)}</span>
                  </td>
                  <td className="px-3 py-3 text-right">
                    <span className="font-mono" style={{ fontSize: "12px", fontWeight: 500, color: "#e8eaf0" }}>${h.marketValue.toLocaleString()}</span>
                  </td>
                  <td className="px-3 py-3 text-right">
                    <div className="flex flex-col items-end gap-0.5">
                      <span className="font-mono" style={{ fontSize: "11px", fontWeight: 600, color: h.pnl >= 0 ? "#10b981" : "#ef4444" }}>
                        {h.pnl >= 0 ? "+" : ""}${Math.abs(h.pnl).toLocaleString()}
                      </span>
                      <span className="font-mono" style={{ fontSize: "10px", color: h.pnlPct >= 0 ? "#10b981" : "#ef4444", opacity: 0.8 }}>
                        {h.pnlPct >= 0 ? "+" : ""}{h.pnlPct.toFixed(1)}%
                      </span>
                    </div>
                  </td>
                  <td className="px-3 py-3 text-right">
                    <div className="flex items-center justify-end gap-1">
                      {h.dayChange >= 0 ? (
                        <TrendingUp size={10} style={{ color: "#10b981" }} />
                      ) : (
                        <TrendingDown size={10} style={{ color: "#ef4444" }} />
                      )}
                      <span className="font-mono" style={{ fontSize: "11px", fontWeight: 600, color: h.dayChange >= 0 ? "#10b981" : "#ef4444" }}>
                        {h.dayChangePct >= 0 ? "+" : ""}{h.dayChangePct.toFixed(2)}%
                      </span>
                    </div>
                  </td>
                  <td className="px-3 py-3">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-1 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.06)", minWidth: "40px" }}>
                        <div
                          className="h-full rounded-full"
                          style={{ width: `${h.weight * 4}%`, background: "linear-gradient(90deg, #3b82f6, #2563eb)" }}
                        />
                      </div>
                      <span className="font-mono" style={{ fontSize: "10px", color: "#6b7494", minWidth: "32px", textAlign: "right" }}>
                        {h.weight}%
                      </span>
                    </div>
                  </td>
                  <td className="px-3 py-3">
                    <button className="opacity-0 group-hover:opacity-100 transition-opacity">
                      <MoreHorizontal size={14} style={{ color: "#6b7494" }} />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
