import { useState, useRef } from "react";
import { AuthPage } from "./components/AuthPage";
import { Onboarding } from "./components/Onboarding";
import { Sidebar } from "./components/Sidebar";
import { TopNav } from "./components/TopNav";
import { KPICards } from "./components/KPICards";
import { PortfolioChart } from "./components/PortfolioChart";
import { HoldingsTable } from "./components/HoldingsTable";
import { AllocationChart } from "./components/AllocationChart";
import { AIAssistant } from "./components/AIAssistant";
import { MarketWidget } from "./components/MarketWidget";
import { BudgetTracker } from "./components/BudgetTracker";
import { SettingsPage } from "./components/SettingsPage";
import { NewsPage } from "./components/NewsPage";
import { Calendar, ChevronRight } from "lucide-react";

type Page = "dashboard" | "portfolio" | "markets" | "analytics" | "ai" | "budget" | "transactions" | "settings" | "news";

const pageConfig: Record<Page, { title: string; subtitle: string }> = {
  dashboard: { title: "Dashboard", subtitle: "Welcome back, Alex · Jun 9, 2026" },
  portfolio: { title: "Portfolio", subtitle: "8 positions · $248,932 total" },
  markets: { title: "Markets", subtitle: "Real-time market data" },
  analytics: { title: "Analytics", subtitle: "Performance & risk analytics" },
  ai: { title: "AI Assistant", subtitle: "Powered by WealthWise AI" },
  budget: { title: "Budget Tracker", subtitle: "Monthly income, spending & savings goals" },
  transactions: { title: "Transactions", subtitle: "All activity" },
  settings: { title: "Settings", subtitle: "Account & preferences" },
  news: { title: "Market News", subtitle: "Live financial news & AI sentiment analysis" },
};

const typeColors: Record<string, { bg: string; text: string }> = {
  BUY: { bg: "rgba(16,185,129,0.12)", text: "#10b981" },
  SELL: { bg: "rgba(239,68,68,0.12)", text: "#ef4444" },
  DIV: { bg: "rgba(245,158,11,0.12)", text: "#f59e0b" },
};

const monthlyPnlData = [
  { month: "Jan", pnl: 4200 },
  { month: "Feb", pnl: -1800 },
  { month: "Mar", pnl: 6400 },
  { month: "Apr", pnl: 3100 },
  { month: "May", pnl: -900 },
  { month: "Jun", pnl: 4218 },
];

function MonthlyBarChart() {
  const [tooltip, setTooltip] = useState<{ x: number; y: number; label: string; value: number } | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const W = 480; const H = 160;
  const pad = { top: 10, right: 8, bottom: 28, left: 44 };
  const w = W - pad.left - pad.right;
  const h = H - pad.top - pad.bottom;

  const maxAbs = Math.max(...monthlyPnlData.map(d => Math.abs(d.pnl)));
  const barW = Math.floor(w / monthlyPnlData.length) - 8;
  const zero = pad.top + h / 2;

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
        <p style={{ fontSize: "11px", fontWeight: 500, color: "#6b7494", letterSpacing: "0.05em", textTransform: "uppercase" }}>Monthly P&L</p>
        <p style={{ fontSize: "13px", fontWeight: 500, color: "#e8eaf0", marginTop: "2px" }}>
          YTD: <span className="font-mono" style={{ color: "#10b981" }}>+$15,212</span>
        </p>
      </div>
      <div style={{ height: `${H}px`, position: "relative" }}>
        {tooltip && (
          <div
            style={{
              position: "absolute",
              left: tooltip.x,
              top: tooltip.y - 48,
              transform: "translateX(-50%)",
              background: "rgba(15,18,25,0.95)",
              border: "1px solid rgba(255,255,255,0.12)",
              borderRadius: "8px",
              padding: "6px 10px",
              pointerEvents: "none",
              zIndex: 10,
            }}
          >
            <p style={{ fontSize: "10px", color: "#6b7494" }}>{tooltip.label}</p>
            <p className="font-mono" style={{ fontSize: "12px", fontWeight: 600, color: tooltip.value >= 0 ? "#10b981" : "#ef4444" }}>
              {tooltip.value >= 0 ? "+" : ""}${Math.abs(tooltip.value).toLocaleString()}
            </p>
          </div>
        )}
        <svg ref={svgRef} width="100%" height={H} viewBox={`0 0 ${W} ${H}`} onMouseLeave={() => setTooltip(null)}>
          {/* Grid lines */}
          {[-1, -0.5, 0, 0.5, 1].map((t, i) => {
            const y = pad.top + h / 2 - t * (h / 2);
            return (
              <g key={i}>
                <line x1={pad.left} y1={y} x2={pad.left + w} y2={y} stroke={t === 0 ? "rgba(255,255,255,0.1)" : "rgba(255,255,255,0.04)"} strokeWidth={t === 0 ? 1 : 1} />
                <text x={pad.left - 4} y={y + 4} textAnchor="end" fill="#6b7494" fontSize={9} fontFamily="JetBrains Mono,monospace">
                  {t === 0 ? "0" : `${t > 0 ? "+" : ""}${(t * maxAbs / 1000).toFixed(0)}k`}
                </text>
              </g>
            );
          })}
          {/* Bars */}
          {monthlyPnlData.map((d, i) => {
            const xCenter = pad.left + (i + 0.5) * (w / monthlyPnlData.length);
            const barH = Math.abs(d.pnl) / maxAbs * (h / 2);
            const barY = d.pnl >= 0 ? zero - barH : zero;
            const color = d.pnl >= 0 ? "#10b981" : "#ef4444";
            return (
              <g key={d.month}
                onMouseEnter={() => setTooltip({ x: xCenter, y: barY, label: d.month, value: d.pnl })}
              >
                <rect
                  x={xCenter - barW / 2} y={barY}
                  width={barW} height={Math.max(barH, 2)}
                  rx={3} fill={color} opacity={0.85}
                />
                <text x={xCenter} y={H - 6} textAnchor="middle" fill="#6b7494" fontSize={10} fontFamily="JetBrains Mono,monospace">
                  {d.month}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
}

function RecentTransactions() {
  const txns = [
    { date: "Jun 9", type: "BUY", symbol: "NVDA", shares: 5, price: "$875.20", total: "$4,376", status: "Filled" },
    { date: "Jun 7", type: "SELL", symbol: "TSLA", shares: 12, price: "$182.40", total: "$2,189", status: "Filled" },
    { date: "Jun 5", type: "BUY", symbol: "META", shares: 3, price: "$510.80", total: "$1,532", status: "Filled" },
    { date: "Jun 3", type: "DIV", symbol: "JPM", shares: 0, price: "$1.05", total: "$68", status: "Received" },
    { date: "Jun 1", type: "BUY", symbol: "MSFT", shares: 8, price: "$413.20", total: "$3,306", status: "Filled" },
  ];

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
      <div className="flex items-center justify-between px-5 py-3.5" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        <p style={{ fontSize: "11px", fontWeight: 500, color: "#6b7494", letterSpacing: "0.05em", textTransform: "uppercase" }}>Recent Activity</p>
        <button className="flex items-center gap-1" style={{ fontSize: "11px", color: "#3b82f6" }}>
          View all <ChevronRight size={10} />
        </button>
      </div>
      <div>
        {txns.map((t, i) => (
          <div
            key={i}
            className="flex items-center gap-3 px-5 py-3 transition-colors hover:bg-white/[0.025]"
            style={{ borderBottom: i < txns.length - 1 ? "1px solid rgba(255,255,255,0.04)" : "none" }}
          >
            <div
              className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
              style={{ background: typeColors[t.type]?.bg ?? "rgba(255,255,255,0.06)" }}
            >
              <span style={{ fontSize: "9px", fontWeight: 700, color: typeColors[t.type]?.text ?? "#8892a4" }}>{t.type}</span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-mono" style={{ fontSize: "12px", fontWeight: 600, color: "#e8eaf0" }}>{t.symbol}</span>
                {t.shares > 0 && <span style={{ fontSize: "10px", color: "#6b7494" }}>{t.shares} shares @ {t.price}</span>}
              </div>
              <p style={{ fontSize: "10px", color: "#6b7494", marginTop: "1px" }}>{t.date}</p>
            </div>
            <div className="text-right">
              <p className="font-mono" style={{ fontSize: "12px", fontWeight: 600, color: "#e8eaf0" }}>{t.total}</p>
              <p style={{ fontSize: "10px", color: "#10b981", marginTop: "1px" }}>{t.status}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function DashboardPage() {
  return (
    <div className="flex flex-col gap-4">
      <KPICards />
      <div className="grid gap-4" style={{ gridTemplateColumns: "1fr 280px" }}>
        <PortfolioChart />
        <MarketWidget />
      </div>
      <div className="grid gap-4" style={{ gridTemplateColumns: "1fr 1fr 1fr" }}>
        <div style={{ gridColumn: "1 / 3" }}>
          <HoldingsTable />
        </div>
        <AllocationChart />
      </div>
      <div className="grid gap-4" style={{ gridTemplateColumns: "1fr 1fr" }}>
        <MonthlyBarChart />
        <RecentTransactions />
      </div>
    </div>
  );
}

function AnalyticsPage() {
  const riskData = Array.from({ length: 24 }, (_, i) => ({
    month: `M${i + 1}`,
    portfolio: +(100 + i * 2.8 + (Math.sin(i * 0.7) * 4)).toFixed(1),
    benchmark: +(100 + i * 1.4 + (Math.sin(i * 0.5) * 2)).toFixed(1),
  }));

  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: "Alpha", value: "+4.2%", desc: "vs S&P 500", color: "#10b981" },
          { label: "Beta", value: "1.12", desc: "12-month", color: "#3b82f6" },
          { label: "Sharpe", value: "2.14", desc: "Risk-adjusted", color: "#a855f7" },
          { label: "Sortino", value: "3.08", desc: "Downside risk", color: "#f59e0b" },
        ].map(m => (
          <div
            key={m.label}
            className="rounded-xl p-4"
            style={{
              background: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(255,255,255,0.08)",
              backdropFilter: "blur(20px)",
              boxShadow: "0 4px 24px rgba(0,0,0,0.15), inset 0 1px 0 rgba(255,255,255,0.06)",
            }}
          >
            <p style={{ fontSize: "10px", fontWeight: 600, color: "#6b7494", letterSpacing: "0.06em", textTransform: "uppercase" }}>{m.label}</p>
            <p className="font-mono" style={{ fontSize: "28px", fontWeight: 700, color: m.color, letterSpacing: "-0.03em", marginTop: "4px" }}>{m.value}</p>
            <p style={{ fontSize: "11px", color: "#6b7494", marginTop: "2px" }}>{m.desc}</p>
          </div>
        ))}
      </div>

      <div
        className="rounded-xl p-5"
        style={{
          background: "rgba(255,255,255,0.03)",
          border: "1px solid rgba(255,255,255,0.08)",
          backdropFilter: "blur(20px)",
          boxShadow: "0 4px 24px rgba(0,0,0,0.15), inset 0 1px 0 rgba(255,255,255,0.06)",
        }}
      >
        <div className="flex items-center justify-between mb-4">
          <div>
            <p style={{ fontSize: "11px", fontWeight: 500, color: "#6b7494", letterSpacing: "0.05em", textTransform: "uppercase" }}>Growth vs Benchmark</p>
            <p style={{ fontSize: "13px", fontWeight: 500, color: "#e8eaf0", marginTop: "2px" }}>24-month normalized (base 100)</p>
          </div>
          <div className="flex gap-4">
            {[{ label: "Portfolio", color: "#3b82f6" }, { label: "S&P 500", color: "rgba(107,116,148,0.6)" }].map(l => (
              <div key={l.label} className="flex items-center gap-1.5">
                <span className="w-3 h-0.5 rounded-full" style={{ background: l.color }} />
                <span style={{ fontSize: "11px", color: "#8892a4" }}>{l.label}</span>
              </div>
            ))}
          </div>
        </div>
        <div style={{ height: "240px" }}>
          {(() => {
            const W = 700; const H = 240;
            const pad = { top: 8, right: 8, bottom: 28, left: 40 };
            const cw = W - pad.left - pad.right;
            const ch = H - pad.top - pad.bottom;
            const allV = riskData.flatMap(d => [d.portfolio, d.benchmark]);
            const minV = Math.min(...allV) * 0.998;
            const maxV = Math.max(...allV) * 1.002;
            const xS = (i: number) => (i / (riskData.length - 1)) * cw;
            const yS = (v: number) => ch - ((v - minV) / (maxV - minV)) * ch;
            const toPath = (key: "portfolio" | "benchmark") =>
              riskData.map((d, i) => `${i === 0 ? "M" : "L"}${xS(i).toFixed(1)},${yS(d[key]).toFixed(1)}`).join(" ");
            const yTicks = [0, 0.25, 0.5, 0.75, 1].map(t => minV + t * (maxV - minV));
            const xStep = Math.floor(riskData.length / 6);
            return (
              <svg width="100%" height={H} viewBox={`0 0 ${W} ${H}`}>
                <g transform={`translate(${pad.left},${pad.top})`}>
                  {yTicks.map((v, i) => (
                    <g key={i}>
                      <line x1={0} y1={yS(v).toFixed(1)} x2={cw} y2={yS(v).toFixed(1)} stroke="rgba(255,255,255,0.04)" strokeWidth={1} />
                      <text x={-4} y={yS(v) + 4} textAnchor="end" fill="#6b7494" fontSize={10} fontFamily="JetBrains Mono,monospace">{v.toFixed(0)}</text>
                    </g>
                  ))}
                  {riskData.filter((_, i) => i % xStep === 0 || i === riskData.length - 1).map((d, idx) => {
                    const i = riskData.indexOf(d);
                    return <text key={idx} x={xS(i).toFixed(1)} y={ch + 18} textAnchor="middle" fill="#6b7494" fontSize={10} fontFamily="JetBrains Mono,monospace">{d.month}</text>;
                  })}
                  <path d={toPath("benchmark")} fill="none" stroke="rgba(107,116,148,0.45)" strokeWidth={1.5} strokeDasharray="4 4" />
                  <path d={toPath("portfolio")} fill="none" stroke="#3b82f6" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                </g>
              </svg>
            );
          })()}
        </div>
      </div>

      <div className="grid gap-4" style={{ gridTemplateColumns: "1fr 1fr" }}>
        <AllocationChart />
        <MonthlyBarChart />
      </div>
    </div>
  );
}

function TransactionsPage() {
  const allTxns = [
    { date: "Jun 9, 2026", type: "BUY", symbol: "NVDA", shares: 5, price: "$875.20", total: "$4,376", status: "Filled", account: "Brokerage" },
    { date: "Jun 7, 2026", type: "SELL", symbol: "TSLA", shares: 12, price: "$182.40", total: "$2,189", status: "Filled", account: "Brokerage" },
    { date: "Jun 5, 2026", type: "BUY", symbol: "META", shares: 3, price: "$510.80", total: "$1,532", status: "Filled", account: "IRA" },
    { date: "Jun 3, 2026", type: "DIV", symbol: "JPM", shares: 0, price: "$1.05", total: "$68", status: "Received", account: "Brokerage" },
    { date: "Jun 1, 2026", type: "BUY", symbol: "MSFT", shares: 8, price: "$413.20", total: "$3,306", status: "Filled", account: "Brokerage" },
    { date: "May 28, 2026", type: "SELL", symbol: "GOOGL", shares: 6, price: "$166.50", total: "$999", status: "Filled", account: "IRA" },
    { date: "May 24, 2026", type: "BUY", symbol: "AAPL", shares: 10, price: "$186.30", total: "$1,863", status: "Filled", account: "Brokerage" },
    { date: "May 20, 2026", type: "DIV", symbol: "BRK.B", shares: 0, price: "$0.82", total: "$43", status: "Received", account: "Brokerage" },
    { date: "May 15, 2026", type: "BUY", symbol: "AMZN", shares: 7, price: "$176.20", total: "$1,233", status: "Filled", account: "IRA" },
    { date: "May 10, 2026", type: "SELL", symbol: "NVDA", shares: 3, price: "$860.40", total: "$2,581", status: "Filled", account: "Brokerage" },
  ];

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
          <h3 style={{ fontSize: "13px", fontWeight: 600, color: "#e8eaf0" }}>Transaction History</h3>
          <p style={{ fontSize: "11px", color: "#6b7494", marginTop: "1px" }}>All accounts · Last 30 days</p>
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-1.5 px-3 h-7 rounded-lg" style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)", color: "#8892a4", fontSize: "11px" }}>
            <Calendar size={11} /> Filter
          </button>
          <button className="px-3 h-7 rounded-lg" style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)", color: "#8892a4", fontSize: "11px" }}>
            Export
          </button>
        </div>
      </div>
      <table className="w-full">
        <thead>
          <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
            {["Date", "Type", "Symbol", "Shares", "Price", "Total", "Account", "Status"].map(h => (
              <th key={h} className="px-4 py-2.5 text-left" style={{ fontSize: "10px", fontWeight: 600, color: "#6b7494", letterSpacing: "0.06em", textTransform: "uppercase" }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {allTxns.map((t, i) => (
            <tr
              key={i}
              style={{ borderBottom: i < allTxns.length - 1 ? "1px solid rgba(255,255,255,0.04)" : "none" }}
              onMouseEnter={e => (e.currentTarget.style.background = "rgba(255,255,255,0.025)")}
              onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
            >
              <td className="px-4 py-3 font-mono" style={{ fontSize: "11px", color: "#6b7494" }}>{t.date}</td>
              <td className="px-4 py-3">
                <span className="px-2 py-0.5 rounded" style={{ background: typeColors[t.type]?.bg, color: typeColors[t.type]?.text, fontSize: "10px", fontWeight: 700 }}>
                  {t.type}
                </span>
              </td>
              <td className="px-4 py-3 font-mono" style={{ fontSize: "12px", fontWeight: 600, color: "#e8eaf0" }}>{t.symbol}</td>
              <td className="px-4 py-3 font-mono" style={{ fontSize: "12px", color: "#a0a8bc" }}>{t.shares > 0 ? t.shares : "—"}</td>
              <td className="px-4 py-3 font-mono" style={{ fontSize: "12px", color: "#a0a8bc" }}>{t.price}</td>
              <td className="px-4 py-3 font-mono" style={{ fontSize: "12px", fontWeight: 600, color: "#e8eaf0" }}>{t.total}</td>
              <td className="px-4 py-3" style={{ fontSize: "11px", color: "#6b7494" }}>{t.account}</td>
              <td className="px-4 py-3" style={{ fontSize: "10px", fontWeight: 500, color: "#10b981" }}>{t.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function AIPage() {
  return (
    <div className="grid gap-4" style={{ gridTemplateColumns: "1fr 320px" }}>
      <div className="flex flex-col gap-4">
        <AIAssistant />
        <div
          className="rounded-xl p-5"
          style={{
            background: "rgba(255,255,255,0.03)",
            border: "1px solid rgba(255,255,255,0.08)",
            backdropFilter: "blur(20px)",
            boxShadow: "0 4px 24px rgba(0,0,0,0.15), inset 0 1px 0 rgba(255,255,255,0.06)",
          }}
        >
          <p style={{ fontSize: "11px", fontWeight: 600, color: "#6b7494", letterSpacing: "0.05em", textTransform: "uppercase", marginBottom: "12px" }}>
            AI Insights
          </p>
          <div className="flex flex-col gap-3">
            {[
              { title: "NVDA Overconcentration Risk", desc: "Your NVDA position (14.8%) exceeds your 12% target. Consider trimming $8k to reduce single-stock risk.", color: "#f59e0b" },
              { title: "Rebalancing Opportunity", desc: "Healthcare sector is underweight by ~4%. Adding exposure would improve portfolio diversification.", color: "#3b82f6" },
              { title: "Strong Risk-Adjusted Returns", desc: "Your Sharpe ratio of 2.14 places you in the top 15% of similar portfolios tracked by WealthWise AI.", color: "#10b981" },
            ].map(insight => (
              <div key={insight.title} className="flex gap-3 p-3 rounded-lg" style={{ background: `${insight.color}08`, border: `1px solid ${insight.color}18` }}>
                <div className="w-1 rounded-full shrink-0 self-stretch" style={{ background: insight.color, opacity: 0.6 }} />
                <div>
                  <p style={{ fontSize: "12px", fontWeight: 600, color: "#e8eaf0" }}>{insight.title}</p>
                  <p style={{ fontSize: "11px", color: "#8892a4", marginTop: "2px", lineHeight: 1.5 }}>{insight.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-4">
        <MarketWidget />
        <AllocationChart />
      </div>
    </div>
  );
}

function PortfolioPage() {
  return (
    <div className="flex flex-col gap-4">
      <div className="grid gap-4" style={{ gridTemplateColumns: "1fr 280px" }}>
        <PortfolioChart />
        <AllocationChart />
      </div>
      <HoldingsTable />
    </div>
  );
}

function MarketsPage() {
  return (
    <div className="flex flex-col gap-4">
      <div className="grid gap-4" style={{ gridTemplateColumns: "1fr 1fr" }}>
        <MarketWidget />
        <MonthlyBarChart />
      </div>
      <HoldingsTable />
    </div>
  );
}

export default function App() {
  const [authed, setAuthed] = useState(false);
  const [activePage, setActivePage] = useState<Page>("dashboard");

  if (!authed) return <AuthPage onAuth={() => setAuthed(true)} />;
  const { title, subtitle } = pageConfig[activePage];

  const renderPage = () => {
    switch (activePage) {
      case "dashboard": return <DashboardPage />;
      case "portfolio": return <PortfolioPage />;
      case "markets": return <MarketsPage />;
      case "analytics": return <AnalyticsPage />;
      case "ai": return <AIPage />;
      case "budget": return <BudgetTracker />;
      case "transactions": return <TransactionsPage />;
      case "settings": return <SettingsPage />;
      case "news": return <NewsPage />;
      default: return (
        <div className="flex items-center justify-center h-64">
          <p style={{ color: "#6b7494", fontSize: "13px" }}>Coming soon</p>
        </div>
      );
    }
  };

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: "#0b0e14", fontFamily: "'Inter', system-ui, sans-serif" }}>
      {/* Background radial glows */}
      <div
        className="fixed pointer-events-none"
        style={{
          top: "-20%", left: "15%", width: "600px", height: "400px",
          background: "radial-gradient(ellipse, rgba(59,130,246,0.04) 0%, transparent 70%)",
          zIndex: 0,
        }}
      />
      <div
        className="fixed pointer-events-none"
        style={{
          bottom: "0", right: "10%", width: "500px", height: "300px",
          background: "radial-gradient(ellipse, rgba(16,185,129,0.03) 0%, transparent 70%)",
          zIndex: 0,
        }}
      />

      <Sidebar activePage={activePage} onNavigate={setActivePage} />

      <div className="flex flex-col flex-1 min-w-0 relative" style={{ zIndex: 1 }}>
        <TopNav title={title} subtitle={subtitle} />
        <main className="flex-1 overflow-y-auto p-5">
          {renderPage()}
        </main>
      </div>
    </div>
  );
}
