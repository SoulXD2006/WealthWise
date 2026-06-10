import {
  LayoutDashboard, TrendingUp, Briefcase, BarChart2, Bot,
  Settings, ArrowLeftRight, ChevronDown, Wallet, LogOut, PiggyBank, Newspaper
} from "lucide-react";

type Page = "dashboard" | "portfolio" | "markets" | "analytics" | "ai" | "transactions" | "budget" | "settings" | "news";

interface SidebarProps {
  activePage: Page;
  onNavigate: (page: Page) => void;
}

const navItems = [
  { id: "dashboard" as Page, label: "Dashboard", icon: LayoutDashboard },
  { id: "portfolio" as Page, label: "Portfolio", icon: Briefcase },
  { id: "markets" as Page, label: "Markets", icon: TrendingUp },
  { id: "analytics" as Page, label: "Analytics", icon: BarChart2 },
  { id: "ai" as Page, label: "AI Assistant", icon: Bot, badge: "NEW" },
  { id: "budget" as Page, label: "Budget", icon: PiggyBank },
  { id: "news" as Page, label: "Market News", icon: Newspaper },
  { id: "transactions" as Page, label: "Transactions", icon: ArrowLeftRight },
];

const bottomItems = [
  { id: "settings" as Page, label: "Settings", icon: Settings },
];

export function Sidebar({ activePage, onNavigate }: SidebarProps) {
  return (
    <aside
      className="flex flex-col h-screen w-[220px] shrink-0"
      style={{
        background: "linear-gradient(180deg, #0f1219 0%, #0b0d13 100%)",
        borderRight: "1px solid rgba(255,255,255,0.06)",
      }}
    >
      {/* Logo */}
      <div className="flex items-center gap-2.5 px-5 h-[60px] shrink-0" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
          style={{
            background: "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)",
            boxShadow: "0 4px 12px rgba(59,130,246,0.35)",
          }}
        >
          <Wallet size={16} color="#fff" strokeWidth={2.5} />
        </div>
        <span style={{ fontFamily: "'Inter', sans-serif", fontWeight: 700, fontSize: "15px", color: "#e8eaf0", letterSpacing: "-0.02em" }}>
          WealthWise
        </span>
      </div>

      {/* Workspace badge */}
      <div className="px-4 py-3">
        <button
          className="w-full flex items-center justify-between px-3 py-2 rounded-lg transition-colors hover:bg-white/5"
          style={{ border: "1px solid rgba(255,255,255,0.07)" }}
        >
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-md flex items-center justify-center" style={{ background: "linear-gradient(135deg, #a855f7, #6366f1)" }}>
              <span style={{ fontSize: "9px", fontWeight: 700, color: "#fff" }}>P</span>
            </div>
            <span style={{ fontSize: "12px", fontWeight: 500, color: "#a0a8bc" }}>Pro Workspace</span>
          </div>
          <ChevronDown size={12} color="#6b7494" />
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 pb-3 overflow-y-auto">
        <p style={{ fontSize: "10px", fontWeight: 600, color: "#6b7494", letterSpacing: "0.08em", textTransform: "uppercase", padding: "8px 8px 6px" }}>
          Main
        </p>
        <div className="flex flex-col gap-0.5">
          {navItems.map(({ id, label, icon: Icon, badge }) => {
            const active = activePage === id;
            return (
              <button
                key={id}
                onClick={() => onNavigate(id)}
                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg transition-all duration-150 group relative text-left"
                style={{
                  background: active ? "rgba(59,130,246,0.12)" : "transparent",
                  border: active ? "1px solid rgba(59,130,246,0.2)" : "1px solid transparent",
                }}
              >
                {active && (
                  <span
                    className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-4 rounded-r-full"
                    style={{ background: "#3b82f6" }}
                  />
                )}
                <Icon
                  size={15}
                  style={{ color: active ? "#3b82f6" : "#6b7494" }}
                  strokeWidth={active ? 2.2 : 1.8}
                />
                <span
                  style={{
                    fontSize: "13px",
                    fontWeight: active ? 500 : 400,
                    color: active ? "#e8eaf0" : "#8892a4",
                    flex: 1,
                  }}
                >
                  {label}
                </span>
                {badge && (
                  <span
                    className="px-1.5 py-0.5 rounded text-[9px] font-bold tracking-wide"
                    style={{ background: "rgba(16,185,129,0.15)", color: "#10b981", border: "1px solid rgba(16,185,129,0.2)" }}
                  >
                    {badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        <p style={{ fontSize: "10px", fontWeight: 600, color: "#6b7494", letterSpacing: "0.08em", textTransform: "uppercase", padding: "16px 8px 6px" }}>
          Account
        </p>
        <div className="flex flex-col gap-0.5">
          {bottomItems.map(({ id, label, icon: Icon }) => {
            const active = activePage === id;
            return (
              <button
                key={id}
                onClick={() => onNavigate(id)}
                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg transition-all duration-150 text-left"
                style={{
                  background: active ? "rgba(59,130,246,0.12)" : "transparent",
                }}
              >
                <Icon size={15} style={{ color: active ? "#3b82f6" : "#6b7494" }} strokeWidth={1.8} />
                <span style={{ fontSize: "13px", fontWeight: 400, color: active ? "#e8eaf0" : "#8892a4" }}>{label}</span>
              </button>
            );
          })}
        </div>
      </nav>

      {/* User */}
      <div
        className="mx-3 mb-3 p-3 rounded-xl flex items-center gap-2.5 cursor-pointer hover:bg-white/5 transition-colors"
        style={{ border: "1px solid rgba(255,255,255,0.07)" }}
      >
        <div
          className="w-8 h-8 rounded-full flex items-center justify-center shrink-0"
          style={{ background: "linear-gradient(135deg, #3b82f6, #8b5cf6)" }}
        >
          <span style={{ fontSize: "12px", fontWeight: 700, color: "#fff" }}>AK</span>
        </div>
        <div className="flex-1 min-w-0">
          <p style={{ fontSize: "12px", fontWeight: 500, color: "#e8eaf0" }}>Alex Kim</p>
          <p style={{ fontSize: "10px", color: "#6b7494" }}>Pro Plan</p>
        </div>
        <LogOut size={13} color="#6b7494" />
      </div>
    </aside>
  );
}
