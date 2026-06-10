import { Search, Bell, Plus, Zap } from "lucide-react";

interface TopNavProps {
  title: string;
  subtitle?: string;
}

export function TopNav({ title, subtitle }: TopNavProps) {
  return (
    <header
      className="flex items-center justify-between px-6 h-[60px] shrink-0"
      style={{
        background: "rgba(11,14,20,0.8)",
        backdropFilter: "blur(12px)",
        borderBottom: "1px solid rgba(255,255,255,0.06)",
        zIndex: 10,
      }}
    >
      <div>
        <h1 style={{ fontSize: "15px", fontWeight: 600, color: "#e8eaf0", letterSpacing: "-0.01em", lineHeight: 1 }}>{title}</h1>
        {subtitle && <p style={{ fontSize: "11px", color: "#6b7494", marginTop: "2px" }}>{subtitle}</p>}
      </div>

      <div className="flex items-center gap-2">
        {/* Search */}
        <div
          className="flex items-center gap-2 px-3 h-8 rounded-lg"
          style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.07)", minWidth: "200px" }}
        >
          <Search size={12} color="#6b7494" />
          <span style={{ fontSize: "12px", color: "#6b7494" }}>Search assets, news...</span>
          <span
            className="ml-auto px-1.5 py-0.5 rounded text-[10px]"
            style={{ background: "rgba(255,255,255,0.06)", color: "#6b7494", fontFamily: "monospace" }}
          >
            ⌘K
          </span>
        </div>

        {/* Live indicator */}
        <div
          className="flex items-center gap-1.5 px-3 h-8 rounded-lg"
          style={{ background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.2)" }}
        >
          <span className="w-1.5 h-1.5 rounded-full" style={{ background: "#10b981", boxShadow: "0 0 6px #10b981", animation: "pulse 2s infinite" }} />
          <span style={{ fontSize: "11px", fontWeight: 500, color: "#10b981" }}>Live</span>
        </div>

        {/* Notifications */}
        <button
          className="relative w-8 h-8 rounded-lg flex items-center justify-center hover:bg-white/8 transition-colors"
          style={{ border: "1px solid rgba(255,255,255,0.07)" }}
        >
          <Bell size={14} color="#8892a4" />
          <span
            className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full"
            style={{ background: "#ef4444" }}
          />
        </button>

        {/* New trade */}
        <button
          className="flex items-center gap-1.5 px-3 h-8 rounded-lg transition-all duration-150 hover:brightness-110"
          style={{
            background: "linear-gradient(135deg, #3b82f6, #2563eb)",
            boxShadow: "0 2px 8px rgba(59,130,246,0.3)",
          }}
        >
          <Plus size={13} color="#fff" strokeWidth={2.5} />
          <span style={{ fontSize: "12px", fontWeight: 600, color: "#fff" }}>New Trade</span>
        </button>
      </div>
    </header>
  );
}
