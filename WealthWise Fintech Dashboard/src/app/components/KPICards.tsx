import { TrendingUp, TrendingDown, DollarSign, BarChart2, Percent, Activity } from "lucide-react";

interface KPICardProps {
  label: string;
  value: string;
  change: string;
  changePositive: boolean;
  subValue?: string;
  icon: React.ReactNode;
  accentColor: string;
  glowColor: string;
}

function KPICard({ label, value, change, changePositive, subValue, icon, accentColor, glowColor }: KPICardProps) {
  return (
    <div
      className="rounded-xl p-4 flex flex-col gap-3 relative overflow-hidden transition-transform duration-200 hover:-translate-y-0.5"
      style={{
        background: "rgba(255,255,255,0.03)",
        border: "1px solid rgba(255,255,255,0.08)",
        backdropFilter: "blur(20px)",
        boxShadow: "0 4px 24px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.06)",
      }}
    >
      {/* Subtle glow */}
      <div
        className="absolute -top-6 -right-6 w-20 h-20 rounded-full opacity-10 blur-2xl pointer-events-none"
        style={{ background: glowColor }}
      />

      <div className="flex items-start justify-between">
        <div>
          <p style={{ fontSize: "11px", fontWeight: 500, color: "#6b7494", letterSpacing: "0.03em", textTransform: "uppercase" }}>
            {label}
          </p>
          <p
            className="font-mono mt-1"
            style={{ fontSize: "22px", fontWeight: 600, color: "#e8eaf0", letterSpacing: "-0.02em", lineHeight: 1 }}
          >
            {value}
          </p>
        </div>
        <div
          className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
          style={{ background: `${accentColor}15`, border: `1px solid ${accentColor}25` }}
        >
          {icon}
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div
          className="flex items-center gap-1 px-2 py-1 rounded-md"
          style={{
            background: changePositive ? "rgba(16,185,129,0.1)" : "rgba(239,68,68,0.1)",
            border: `1px solid ${changePositive ? "rgba(16,185,129,0.2)" : "rgba(239,68,68,0.2)"}`,
          }}
        >
          {changePositive ? (
            <TrendingUp size={10} style={{ color: "#10b981" }} />
          ) : (
            <TrendingDown size={10} style={{ color: "#ef4444" }} />
          )}
          <span
            className="font-mono"
            style={{ fontSize: "11px", fontWeight: 600, color: changePositive ? "#10b981" : "#ef4444" }}
          >
            {change}
          </span>
        </div>
        {subValue && (
          <span style={{ fontSize: "11px", color: "#6b7494" }}>{subValue}</span>
        )}
      </div>
    </div>
  );
}

export function KPICards() {
  const cards: KPICardProps[] = [
    {
      label: "Total Portfolio",
      value: "$248,932",
      change: "+$4,218",
      changePositive: true,
      subValue: "+1.72% today",
      icon: <DollarSign size={16} style={{ color: "#3b82f6" }} />,
      accentColor: "#3b82f6",
      glowColor: "#3b82f6",
    },
    {
      label: "Day P&L",
      value: "+$4,218",
      change: "+1.72%",
      changePositive: true,
      subValue: "vs yesterday",
      icon: <TrendingUp size={16} style={{ color: "#10b981" }} />,
      accentColor: "#10b981",
      glowColor: "#10b981",
    },
    {
      label: "All-Time Return",
      value: "+$68,421",
      change: "+37.9%",
      changePositive: true,
      subValue: "since Jan 2022",
      icon: <BarChart2 size={16} style={{ color: "#a855f7" }} />,
      accentColor: "#a855f7",
      glowColor: "#a855f7",
    },
    {
      label: "Sharpe Ratio",
      value: "2.14",
      change: "+0.18",
      changePositive: true,
      subValue: "12-mo trailing",
      icon: <Activity size={16} style={{ color: "#f59e0b" }} />,
      accentColor: "#f59e0b",
      glowColor: "#f59e0b",
    },
    {
      label: "Win Rate",
      value: "68.4%",
      change: "+2.1%",
      changePositive: true,
      subValue: "last 90 trades",
      icon: <Percent size={16} style={{ color: "#06b6d4" }} />,
      accentColor: "#06b6d4",
      glowColor: "#06b6d4",
    },
    {
      label: "Max Drawdown",
      value: "-8.3%",
      change: "-1.2%",
      changePositive: false,
      subValue: "current period",
      icon: <TrendingDown size={16} style={{ color: "#ef4444" }} />,
      accentColor: "#ef4444",
      glowColor: "#ef4444",
    },
  ];

  return (
    <div className="grid grid-cols-6 gap-3" style={{ gridTemplateColumns: "repeat(6, 1fr)" }}>
      {cards.map((card) => (
        <KPICard key={card.label} {...card} />
      ))}
    </div>
  );
}
