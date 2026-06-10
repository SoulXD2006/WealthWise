import { useState, useRef } from "react";
import {
  User, Shield, Bell, Sliders, Bot, LayoutDashboard, FileText,
  Sun, Moon, Monitor, Trash2, ChevronRight, Check, X, AlertTriangle,
  Upload, Camera, Globe, DollarSign, Phone, Mail, Lock, Key,
  Smartphone, LogOut, Download, FileSpreadsheet,
  TrendingUp, Target, Activity, Zap, Newspaper, PiggyBank,
  Eye, EyeOff, Copy, RefreshCw, Circle, Wifi, Database,
  Server, AlertCircle, ChevronDown, ExternalLink, Palette
} from "lucide-react";

// ─── Types ───────────────────────────────────────────────────────────────────

type Theme = "dark" | "light" | "system";
type Section =
  | "profile" | "security" | "financial" | "notifications"
  | "ai" | "dashboard" | "reports" | "appearance" | "status" | "danger";

// ─── Reusable Primitives ─────────────────────────────────────────────────────

const glass: React.CSSProperties = {
  background: "rgba(255,255,255,0.03)",
  border: "1px solid rgba(255,255,255,0.08)",
  backdropFilter: "blur(20px)",
  boxShadow: "0 4px 24px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.06)",
};

function Toggle({ value, onChange, color = "#3b82f6" }: { value: boolean; onChange: (v: boolean) => void; color?: string }) {
  return (
    <button
      onClick={() => onChange(!value)}
      className="relative shrink-0 transition-all duration-200"
      style={{
        width: "36px", height: "20px", borderRadius: "10px",
        background: value ? color : "rgba(255,255,255,0.1)",
        border: `1px solid ${value ? color + "80" : "rgba(255,255,255,0.15)"}`,
        boxShadow: value ? `0 0 10px ${color}40` : "none",
      }}
    >
      <div
        className="absolute top-0.5 w-4 h-4 rounded-full transition-all duration-200"
        style={{
          left: value ? "18px" : "2px",
          background: value ? "#fff" : "rgba(255,255,255,0.4)",
          boxShadow: value ? "0 1px 4px rgba(0,0,0,0.3)" : "none",
        }}
      />
    </button>
  );
}

function SettingRow({
  label, desc, children, danger
}: { label: string; desc?: string; children: React.ReactNode; danger?: boolean }) {
  return (
    <div className="flex items-center justify-between gap-6 py-3.5" style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
      <div className="flex-1 min-w-0">
        <p style={{ fontSize: "13px", fontWeight: 500, color: danger ? "#ef4444" : "#e8eaf0" }}>{label}</p>
        {desc && <p style={{ fontSize: "11px", color: "#6b7494", marginTop: "2px", lineHeight: 1.5 }}>{desc}</p>}
      </div>
      <div className="shrink-0">{children}</div>
    </div>
  );
}

function SectionCard({ title, icon: Icon, iconColor = "#3b82f6", children }: {
  title: string; icon: React.ElementType; iconColor?: string; children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl overflow-hidden" style={glass}>
      <div className="flex items-center gap-3 px-6 py-4" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
          style={{ background: `${iconColor}15`, border: `1px solid ${iconColor}25` }}>
          <Icon size={15} style={{ color: iconColor }} />
        </div>
        <h3 style={{ fontSize: "14px", fontWeight: 700, color: "#e8eaf0", letterSpacing: "-0.01em" }}>{title}</h3>
      </div>
      <div className="px-6 pb-2">{children}</div>
    </div>
  );
}

function Input({ label, value, onChange, type = "text", placeholder, disabled }: {
  label: string; value: string; onChange?: (v: string) => void;
  type?: string; placeholder?: string; disabled?: boolean;
}) {
  return (
    <div>
      <label style={{ fontSize: "10px", fontWeight: 600, color: "#6b7494", letterSpacing: "0.07em", textTransform: "uppercase" }}>
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={e => onChange?.(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        className="w-full mt-1.5 h-10 px-3 rounded-xl outline-none transition-all"
        style={{
          background: disabled ? "rgba(255,255,255,0.02)" : "rgba(255,255,255,0.05)",
          border: "1px solid rgba(255,255,255,0.09)",
          color: disabled ? "#6b7494" : "#e8eaf0",
          fontSize: "13px",
          cursor: disabled ? "default" : "text",
        }}
        onFocus={e => { if (!disabled) e.currentTarget.style.borderColor = "rgba(59,130,246,0.5)"; }}
        onBlur={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.09)"; }}
      />
    </div>
  );
}

function Select({ label, value, onChange, options }: {
  label: string; value: string; onChange: (v: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <div>
      <label style={{ fontSize: "10px", fontWeight: 600, color: "#6b7494", letterSpacing: "0.07em", textTransform: "uppercase" }}>
        {label}
      </label>
      <div className="relative mt-1.5">
        <select
          value={value}
          onChange={e => onChange(e.target.value)}
          className="w-full h-10 px-3 rounded-xl outline-none appearance-none cursor-pointer"
          style={{
            background: "rgba(255,255,255,0.05)",
            border: "1px solid rgba(255,255,255,0.09)",
            color: "#e8eaf0",
            fontSize: "13px",
          }}
        >
          {options.map(o => <option key={o.value} value={o.value} style={{ background: "#141720" }}>{o.label}</option>)}
        </select>
        <ChevronDown size={13} style={{ position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)", color: "#6b7494", pointerEvents: "none" }} />
      </div>
    </div>
  );
}

// ─── Delete Account Modal ─────────────────────────────────────────────────────

function DeleteModal({ onClose, onConfirm }: { onClose: () => void; onConfirm: () => void }) {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [typed, setTyped] = useState("");
  const PHRASE = "delete my account";

  return (
    <div className="fixed inset-0 flex items-center justify-center" style={{ background: "rgba(0,0,0,0.7)", backdropFilter: "blur(12px)", zIndex: 100 }}
      onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="w-[480px] rounded-2xl overflow-hidden" style={{
        background: "linear-gradient(135deg, #141720, #0f1219)",
        border: "1px solid rgba(239,68,68,0.2)",
        boxShadow: "0 32px 80px rgba(0,0,0,0.7), 0 0 40px rgba(239,68,68,0.08)",
      }}>
        {/* Red header bar */}
        <div className="px-6 py-4 flex items-center gap-3" style={{ background: "rgba(239,68,68,0.08)", borderBottom: "1px solid rgba(239,68,68,0.15)" }}>
          <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: "rgba(239,68,68,0.15)" }}>
            <Trash2 size={16} style={{ color: "#ef4444" }} />
          </div>
          <div>
            <p style={{ fontSize: "14px", fontWeight: 700, color: "#ef4444" }}>Delete Account</p>
            <p style={{ fontSize: "11px", color: "#6b7494" }}>Step {step} of 3 — This action is irreversible</p>
          </div>
          <button onClick={onClose} className="ml-auto w-7 h-7 rounded-lg flex items-center justify-center hover:bg-white/8" style={{ color: "#6b7494" }}>
            <X size={13} />
          </button>
        </div>

        <div className="p-6 flex flex-col gap-5">
          {/* Step indicators */}
          <div className="flex gap-2">
            {[1, 2, 3].map(s => (
              <div key={s} className="flex-1 h-1 rounded-full transition-all" style={{ background: s <= step ? "#ef4444" : "rgba(255,255,255,0.08)" }} />
            ))}
          </div>

          {step === 1 && (
            <>
              <div className="rounded-xl p-4 flex flex-col gap-2" style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.18)" }}>
                <p style={{ fontSize: "13px", fontWeight: 600, color: "#ef4444" }}>⚠ You will permanently lose:</p>
                {["All portfolio data & holdings", "Transaction history & reports", "AI insights & preferences", "Budget categories & goals", "Your WealthWise Pro subscription"].map(item => (
                  <div key={item} className="flex items-center gap-2">
                    <X size={10} style={{ color: "#ef4444" }} />
                    <span style={{ fontSize: "12px", color: "#a0a8bc" }}>{item}</span>
                  </div>
                ))}
              </div>
              <button onClick={() => setStep(2)} className="w-full h-10 rounded-xl flex items-center justify-center gap-2 transition-all hover:brightness-110"
                style={{ background: "rgba(239,68,68,0.15)", border: "1px solid rgba(239,68,68,0.3)", color: "#ef4444", fontSize: "13px", fontWeight: 600 }}>
                I understand, continue
                <ChevronRight size={14} />
              </button>
            </>
          )}

          {step === 2 && (
            <>
              <div>
                <p style={{ fontSize: "13px", color: "#a0a8bc", lineHeight: 1.7 }}>
                  Before we delete your account, please sign out of all active sessions and disconnect any linked services. Your data will be scheduled for permanent deletion within <span style={{ color: "#ef4444", fontWeight: 600 }}>30 days</span>.
                </p>
              </div>
              <div className="flex flex-col gap-2">
                {["Sign out all devices", "Revoke Google OAuth", "Cancel active subscriptions"].map((task, i) => (
                  <div key={task} className="flex items-center gap-3 p-3 rounded-lg" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}>
                    <div className="w-5 h-5 rounded-full flex items-center justify-center" style={{ background: "rgba(16,185,129,0.15)" }}>
                      <Check size={10} style={{ color: "#10b981" }} />
                    </div>
                    <span style={{ fontSize: "12px", color: "#a0a8bc" }}>{task}</span>
                  </div>
                ))}
              </div>
              <button onClick={() => setStep(3)} className="w-full h-10 rounded-xl flex items-center justify-center gap-2 transition-all"
                style={{ background: "rgba(239,68,68,0.15)", border: "1px solid rgba(239,68,68,0.3)", color: "#ef4444", fontSize: "13px", fontWeight: 600 }}>
                Continue to final step
              </button>
            </>
          )}

          {step === 3 && (
            <>
              <div>
                <p style={{ fontSize: "13px", color: "#a0a8bc" }}>
                  Type <span className="font-mono" style={{ color: "#ef4444", background: "rgba(239,68,68,0.1)", padding: "2px 6px", borderRadius: "4px" }}>
                    {PHRASE}
                  </span> below to confirm:
                </p>
                <input
                  type="text"
                  value={typed}
                  onChange={e => setTyped(e.target.value)}
                  placeholder={PHRASE}
                  className="w-full mt-3 h-10 px-3 rounded-xl outline-none"
                  style={{
                    background: "rgba(255,255,255,0.04)",
                    border: `1px solid ${typed === PHRASE ? "rgba(239,68,68,0.5)" : "rgba(255,255,255,0.09)"}`,
                    color: "#e8eaf0", fontSize: "13px",
                  }}
                  autoFocus
                />
              </div>
              <div className="flex gap-3">
                <button onClick={onClose} className="flex-1 h-10 rounded-xl" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.09)", color: "#8892a4", fontSize: "13px" }}>
                  Cancel
                </button>
                <button
                  onClick={() => typed === PHRASE && onConfirm()}
                  disabled={typed !== PHRASE}
                  className="flex-1 h-10 rounded-xl flex items-center justify-center gap-2 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                  style={{ background: typed === PHRASE ? "#ef4444" : "rgba(239,68,68,0.2)", color: "#fff", fontSize: "13px", fontWeight: 700, boxShadow: typed === PHRASE ? "0 4px 16px rgba(239,68,68,0.4)" : "none" }}
                >
                  <Trash2 size={13} /> Delete Forever
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Sidebar nav items ────────────────────────────────────────────────────────

const navItems: { id: Section; label: string; icon: React.ElementType; color: string }[] = [
  { id: "profile", label: "Profile", icon: User, color: "#3b82f6" },
  { id: "security", label: "Security", icon: Shield, color: "#10b981" },
  { id: "financial", label: "Financial Prefs", icon: DollarSign, color: "#f59e0b" },
  { id: "notifications", label: "Notifications", icon: Bell, color: "#a855f7" },
  { id: "ai", label: "AI Preferences", icon: Bot, color: "#06b6d4" },
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard, color: "#ec4899" },
  { id: "reports", label: "Reports & Export", icon: FileText, color: "#8b5cf6" },
  { id: "appearance", label: "Appearance", icon: Palette, color: "#f59e0b" },
  { id: "status", label: "Platform Status", icon: Activity, color: "#10b981" },
  { id: "danger", label: "Danger Zone", icon: AlertTriangle, color: "#ef4444" },
];

// ─── Main Settings Component ─────────────────────────────────────────────────

export function SettingsPage() {
  const [active, setActive] = useState<Section>("profile");
  const [theme, setTheme] = useState<Theme>("dark");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [saved, setSaved] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  // Profile state
  const [profile, setProfile] = useState({
    name: "Alex Kim", email: "alex@wealthwise.app",
    phone: "+1 (415) 555-0192", country: "United States", currency: "USD",
    avatar: "",
  });

  // Notification toggles
  const [notifs, setNotifs] = useState({
    stockAlerts: true, marketNews: false, budgetWarnings: true,
    goalMilestones: true, weeklyReports: true, aiRecommendations: true,
  });

  // AI prefs
  const [aiPrefs, setAiPrefs] = useState({
    personalizedInsights: true, portfolioAnalysis: true, spendingAnalysis: false,
  });

  // Dashboard widgets
  const [widgets, setWidgets] = useState({
    netWorth: true, performance: true, watchlist: false,
    marketNews: true, aiInsights: true, goalsProgress: false,
  });

  // Financial prefs
  const [finPrefs, setFinPrefs] = useState({
    currency: "USD", budgetTarget: "1200", riskProfile: "moderate", investGoal: "growth",
  });

  // 2FA
  const [twoFA, setTwoFA] = useState(false);

  const saveProfile = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const sessions = [
    { device: "MacBook Pro 16\"", location: "San Francisco, CA", time: "Active now", current: true },
    { device: "iPhone 15 Pro", location: "San Francisco, CA", time: "2 hours ago", current: false },
    { device: "Chrome · Windows 11", location: "New York, NY", time: "3 days ago", current: false },
  ];

  const loginHistory = [
    { event: "Successful login", device: "MacBook Pro", time: "Today, 9:41 AM", ok: true },
    { event: "Successful login", device: "iPhone 15 Pro", time: "Today, 7:12 AM", ok: true },
    { event: "Failed attempt", device: "Unknown device", time: "Yesterday, 11:54 PM", ok: false },
    { event: "Successful login", device: "MacBook Pro", time: "Jun 8, 3:22 PM", ok: true },
  ];

  const statusItems = [
    { name: "Gemini API", status: "operational", latency: "142ms" },
    { name: "Market Data API", status: "operational", latency: "38ms" },
    { name: "News API", status: "degraded", latency: "890ms" },
    { name: "Database", status: "operational", latency: "12ms" },
    { name: "Backend Services", status: "operational", latency: "56ms" },
  ];

  const statusColor = (s: string) => s === "operational" ? "#10b981" : s === "degraded" ? "#f59e0b" : "#ef4444";
  const statusLabel = (s: string) => s === "operational" ? "Operational" : s === "degraded" ? "Degraded" : "Down";

  return (
    <div className="flex gap-5 min-h-full">
      {/* ── Left nav ── */}
      <aside className="w-[200px] shrink-0">
        <div className="rounded-2xl overflow-hidden sticky top-0" style={glass}>
          <div className="px-4 py-3" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
            <p style={{ fontSize: "10px", fontWeight: 700, color: "#6b7494", letterSpacing: "0.08em", textTransform: "uppercase" }}>Settings</p>
          </div>
          <nav className="p-2 flex flex-col gap-0.5">
            {navItems.map(({ id, label, icon: Icon, color }) => {
              const isActive = active === id;
              return (
                <button
                  key={id}
                  onClick={() => setActive(id)}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-left transition-all duration-150 relative"
                  style={{
                    background: isActive ? `${color}12` : "transparent",
                    border: isActive ? `1px solid ${color}22` : "1px solid transparent",
                  }}
                >
                  {isActive && <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-4 rounded-r-full" style={{ background: color }} />}
                  <Icon size={13} style={{ color: isActive ? color : "#6b7494" }} strokeWidth={isActive ? 2.2 : 1.8} />
                  <span style={{ fontSize: "12px", fontWeight: isActive ? 600 : 400, color: isActive ? "#e8eaf0" : "#8892a4" }}>{label}</span>
                </button>
              );
            })}
          </nav>
        </div>
      </aside>

      {/* ── Content ── */}
      <div className="flex-1 flex flex-col gap-5 min-w-0">

        {/* ── Profile ── */}
        {active === "profile" && (
          <div className="flex flex-col gap-4">
            <SectionCard title="Public Profile" icon={User} iconColor="#3b82f6">
              {/* Avatar */}
              <div className="flex items-center gap-5 py-5" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                <div className="relative">
                  <div className="w-20 h-20 rounded-2xl flex items-center justify-center overflow-hidden"
                    style={{ background: "linear-gradient(135deg, #3b82f6, #8b5cf6)", boxShadow: "0 4px 20px rgba(59,130,246,0.3)" }}>
                    {profile.avatar
                      ? <img src={profile.avatar} alt="avatar" className="w-full h-full object-cover" />
                      : <span style={{ fontSize: "28px", fontWeight: 700, color: "#fff" }}>AK</span>
                    }
                  </div>
                  <button
                    onClick={() => fileRef.current?.click()}
                    className="absolute -bottom-1 -right-1 w-7 h-7 rounded-lg flex items-center justify-center transition-all hover:scale-110"
                    style={{ background: "linear-gradient(135deg, #3b82f6, #2563eb)", boxShadow: "0 2px 8px rgba(59,130,246,0.4)" }}>
                    <Camera size={12} color="#fff" />
                  </button>
                  <input ref={fileRef} type="file" accept="image/*" className="hidden"
                    onChange={e => {
                      const f = e.target.files?.[0];
                      if (f) setProfile(p => ({ ...p, avatar: URL.createObjectURL(f) }));
                    }} />
                </div>
                <div>
                  <p style={{ fontSize: "16px", fontWeight: 700, color: "#e8eaf0" }}>{profile.name}</p>
                  <p style={{ fontSize: "12px", color: "#6b7494", marginTop: "2px" }}>{profile.email}</p>
                  <div className="flex gap-2 mt-3">
                    <button onClick={() => fileRef.current?.click()} className="flex items-center gap-1.5 px-3 h-7 rounded-lg text-xs transition-all hover:brightness-110"
                      style={{ background: "rgba(59,130,246,0.12)", border: "1px solid rgba(59,130,246,0.25)", color: "#3b82f6" }}>
                      <Upload size={11} /> Upload photo
                    </button>
                    {profile.avatar && (
                      <button onClick={() => setProfile(p => ({ ...p, avatar: "" }))} className="px-3 h-7 rounded-lg text-xs"
                        style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", color: "#6b7494" }}>
                        Remove
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Fields */}
              <div className="grid grid-cols-2 gap-4 py-5">
                <Input label="Full Name" value={profile.name} onChange={v => setProfile(p => ({ ...p, name: v }))} />
                <Input label="Email Address" value={profile.email} onChange={v => setProfile(p => ({ ...p, email: v }))} type="email" />
                <Input label="Phone Number" value={profile.phone} onChange={v => setProfile(p => ({ ...p, phone: v }))} />
                <Select label="Country" value={profile.country} onChange={v => setProfile(p => ({ ...p, country: v }))} options={[
                  { value: "United States", label: "🇺🇸 United States" },
                  { value: "United Kingdom", label: "🇬🇧 United Kingdom" },
                  { value: "Canada", label: "🇨🇦 Canada" },
                  { value: "Germany", label: "🇩🇪 Germany" },
                  { value: "Australia", label: "🇦🇺 Australia" },
                  { value: "Singapore", label: "🇸🇬 Singapore" },
                ]} />
                <Select label="Preferred Currency" value={profile.currency} onChange={v => setProfile(p => ({ ...p, currency: v }))} options={[
                  { value: "USD", label: "USD — US Dollar" },
                  { value: "EUR", label: "EUR — Euro" },
                  { value: "GBP", label: "GBP — British Pound" },
                  { value: "JPY", label: "JPY — Japanese Yen" },
                  { value: "CAD", label: "CAD — Canadian Dollar" },
                ]} />
              </div>

              <div className="pb-4 flex gap-3">
                <button onClick={saveProfile}
                  className="flex items-center gap-2 px-5 h-10 rounded-xl transition-all hover:brightness-110"
                  style={{ background: "linear-gradient(135deg, #3b82f6, #2563eb)", boxShadow: "0 4px 14px rgba(59,130,246,0.35)", color: "#fff", fontSize: "13px", fontWeight: 600 }}>
                  {saved ? <><Check size={14} /> Saved!</> : "Save Changes"}
                </button>
                <button className="px-5 h-10 rounded-xl" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.09)", color: "#8892a4", fontSize: "13px" }}>
                  Discard
                </button>
              </div>
            </SectionCard>
          </div>
        )}

        {/* ── Security ── */}
        {active === "security" && (
          <div className="flex flex-col gap-4">
            <SectionCard title="Password & Authentication" icon={Lock} iconColor="#10b981">
              <SettingRow label="Change Password" desc="Last changed 45 days ago">
                <button className="flex items-center gap-1.5 px-3 h-8 rounded-lg text-xs"
                  style={{ background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.2)", color: "#10b981" }}>
                  <Lock size={11} /> Change
                </button>
              </SettingRow>
              <SettingRow label="Two-Factor Authentication" desc={twoFA ? "Secured via authenticator app" : "Add an extra layer of protection"}>
                <Toggle value={twoFA} onChange={setTwoFA} color="#10b981" />
              </SettingRow>
              {twoFA && (
                <div className="py-3" style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                  <div className="flex items-center gap-3 p-3 rounded-xl" style={{ background: "rgba(16,185,129,0.07)", border: "1px solid rgba(16,185,129,0.15)" }}>
                    <Smartphone size={16} style={{ color: "#10b981" }} />
                    <div className="flex-1">
                      <p style={{ fontSize: "12px", fontWeight: 500, color: "#e8eaf0" }}>Authenticator App</p>
                      <p style={{ fontSize: "10px", color: "#10b981" }}>Active · Google Authenticator</p>
                    </div>
                    <button style={{ fontSize: "11px", color: "#6b7494", border: "1px solid rgba(255,255,255,0.08)", padding: "4px 10px", borderRadius: "6px" }}>Manage</button>
                  </div>
                </div>
              )}
              <SettingRow label="Google Account" desc="alex@gmail.com connected">
                <div className="flex items-center gap-2 px-3 h-8 rounded-lg" style={{ background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.2)" }}>
                  <div className="w-2 h-2 rounded-full" style={{ background: "#10b981" }} />
                  <span style={{ fontSize: "11px", fontWeight: 500, color: "#10b981" }}>Connected</span>
                </div>
              </SettingRow>
              <div className="pb-2" />
            </SectionCard>

            <SectionCard title="Active Sessions" icon={Monitor} iconColor="#10b981">
              <div className="flex flex-col gap-2 py-4">
                {sessions.map((s, i) => (
                  <div key={i} className="flex items-center gap-4 p-3 rounded-xl transition-colors hover:bg-white/[0.025]"
                    style={{ background: s.current ? "rgba(16,185,129,0.06)" : "transparent", border: s.current ? "1px solid rgba(16,185,129,0.15)" : "1px solid rgba(255,255,255,0.05)" }}>
                    <div className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0" style={{ background: "rgba(255,255,255,0.05)" }}>
                      <Monitor size={15} style={{ color: "#6b7494" }} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <p style={{ fontSize: "12px", fontWeight: 500, color: "#e8eaf0" }}>{s.device}</p>
                        {s.current && <span style={{ fontSize: "9px", fontWeight: 700, color: "#10b981", background: "rgba(16,185,129,0.12)", padding: "1px 6px", borderRadius: "4px" }}>CURRENT</span>}
                      </div>
                      <p style={{ fontSize: "10px", color: "#6b7494" }}>{s.location} · {s.time}</p>
                    </div>
                    {!s.current && (
                      <button className="px-3 h-7 rounded-lg text-xs hover:bg-red-500/10 transition-colors"
                        style={{ border: "1px solid rgba(255,255,255,0.07)", color: "#6b7494" }}>
                        Revoke
                      </button>
                    )}
                  </div>
                ))}
              </div>
              <div className="pb-4">
                <button className="flex items-center gap-1.5 text-xs" style={{ color: "#ef4444" }}>
                  <LogOut size={12} /> Sign out all other sessions
                </button>
              </div>
            </SectionCard>

            <SectionCard title="Login History" icon={Key} iconColor="#10b981">
              <div className="flex flex-col py-2">
                {loginHistory.map((l, i) => (
                  <div key={i} className="flex items-center gap-3 py-3" style={{ borderBottom: i < loginHistory.length - 1 ? "1px solid rgba(255,255,255,0.05)" : "none" }}>
                    <div className="w-2 h-2 rounded-full shrink-0" style={{ background: l.ok ? "#10b981" : "#ef4444" }} />
                    <div className="flex-1">
                      <p style={{ fontSize: "12px", color: "#e8eaf0" }}>{l.event}</p>
                      <p style={{ fontSize: "10px", color: "#6b7494" }}>{l.device}</p>
                    </div>
                    <span style={{ fontSize: "10px", color: "#6b7494", fontFamily: "JetBrains Mono, monospace" }}>{l.time}</span>
                  </div>
                ))}
              </div>
              <div className="pb-3" />
            </SectionCard>
          </div>
        )}

        {/* ── Financial ── */}
        {active === "financial" && (
          <SectionCard title="Financial Preferences" icon={DollarSign} iconColor="#f59e0b">
            <div className="grid grid-cols-2 gap-4 py-5">
              <Select label="Default Currency" value={finPrefs.currency} onChange={v => setFinPrefs(p => ({ ...p, currency: v }))} options={[
                { value: "USD", label: "USD — US Dollar" },
                { value: "EUR", label: "EUR — Euro" },
                { value: "GBP", label: "GBP — British Pound" },
                { value: "CAD", label: "CAD — Canadian Dollar" },
                { value: "SGD", label: "SGD — Singapore Dollar" },
              ]} />
              <div>
                <label style={{ fontSize: "10px", fontWeight: 600, color: "#6b7494", letterSpacing: "0.07em", textTransform: "uppercase" }}>Monthly Budget Target</label>
                <div className="flex items-center gap-2 mt-1.5 px-3 h-10 rounded-xl" style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.09)" }}>
                  <DollarSign size={13} style={{ color: "#6b7494" }} />
                  <input type="text" value={finPrefs.budgetTarget} onChange={e => setFinPrefs(p => ({ ...p, budgetTarget: e.target.value }))}
                    className="flex-1 bg-transparent outline-none font-mono" style={{ fontSize: "13px", color: "#e8eaf0" }} />
                </div>
              </div>
            </div>

            {/* Risk profile */}
            <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: "20px" }}>
              <p style={{ fontSize: "10px", fontWeight: 600, color: "#6b7494", letterSpacing: "0.07em", textTransform: "uppercase", marginBottom: "12px" }}>Risk Profile</p>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { id: "conservative", label: "Conservative", desc: "Capital preservation", color: "#10b981" },
                  { id: "moderate", label: "Moderate", desc: "Balanced growth", color: "#3b82f6" },
                  { id: "aggressive", label: "Aggressive", desc: "Maximum returns", color: "#ef4444" },
                ].map(r => {
                  const sel = finPrefs.riskProfile === r.id;
                  return (
                    <button key={r.id} onClick={() => setFinPrefs(p => ({ ...p, riskProfile: r.id }))}
                      className="p-3 rounded-xl text-left transition-all"
                      style={{ background: sel ? `${r.color}12` : "rgba(255,255,255,0.03)", border: sel ? `1px solid ${r.color}35` : "1px solid rgba(255,255,255,0.08)" }}>
                      <div className="flex items-center justify-between mb-2">
                        <span style={{ fontSize: "12px", fontWeight: 600, color: sel ? "#e8eaf0" : "#a0a8bc" }}>{r.label}</span>
                        <div className="w-4 h-4 rounded-full flex items-center justify-center" style={{ border: `2px solid ${sel ? r.color : "rgba(255,255,255,0.2)"}` }}>
                          {sel && <div className="w-2 h-2 rounded-full" style={{ background: r.color }} />}
                        </div>
                      </div>
                      <p style={{ fontSize: "10px", color: "#6b7494" }}>{r.desc}</p>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Investment goal */}
            <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)", padding: "20px 0" }}>
              <p style={{ fontSize: "10px", fontWeight: 600, color: "#6b7494", letterSpacing: "0.07em", textTransform: "uppercase", marginBottom: "12px" }}>Investment Goal</p>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: "growth", label: "🚀 Grow Wealth", desc: "Long-term capital appreciation" },
                  { id: "income", label: "💰 Generate Income", desc: "Dividends & yield focus" },
                  { id: "retire", label: "🌅 Retirement", desc: "Secure comfortable future" },
                  { id: "preserve", label: "🛡 Preserve Capital", desc: "Protect existing wealth" },
                ].map(g => {
                  const sel = finPrefs.investGoal === g.id;
                  return (
                    <button key={g.id} onClick={() => setFinPrefs(p => ({ ...p, investGoal: g.id }))}
                      className="flex items-center gap-3 p-3 rounded-xl text-left transition-all"
                      style={{ background: sel ? "rgba(59,130,246,0.1)" : "rgba(255,255,255,0.03)", border: sel ? "1px solid rgba(59,130,246,0.3)" : "1px solid rgba(255,255,255,0.07)" }}>
                      <span style={{ fontSize: "18px" }}>{g.label.split(" ")[0]}</span>
                      <div>
                        <p style={{ fontSize: "12px", fontWeight: 500, color: sel ? "#e8eaf0" : "#a0a8bc" }}>{g.label.slice(2)}</p>
                        <p style={{ fontSize: "10px", color: "#6b7494" }}>{g.desc}</p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="pb-4">
              <button onClick={saveProfile} className="flex items-center gap-2 px-5 h-10 rounded-xl transition-all hover:brightness-110"
                style={{ background: "linear-gradient(135deg, #f59e0b, #d97706)", boxShadow: "0 4px 14px rgba(245,158,11,0.3)", color: "#000", fontSize: "13px", fontWeight: 700 }}>
                {saved ? <><Check size={14} /> Saved!</> : "Save Preferences"}
              </button>
            </div>
          </SectionCard>
        )}

        {/* ── Notifications ── */}
        {active === "notifications" && (
          <SectionCard title="Notification Settings" icon={Bell} iconColor="#a855f7">
            {[
              { key: "stockAlerts", label: "Stock Price Alerts", desc: "Get notified when your stocks hit price targets", color: "#3b82f6" },
              { key: "marketNews", label: "Market News Alerts", desc: "Breaking financial news that affects your portfolio", color: "#06b6d4" },
              { key: "budgetWarnings", label: "Budget Warnings", desc: "Alert when spending approaches category limits", color: "#f59e0b" },
              { key: "goalMilestones", label: "Goal Milestones", desc: "Celebrate when you hit savings milestones", color: "#10b981" },
              { key: "weeklyReports", label: "Weekly Wealth Reports", desc: "Every Sunday — portfolio summary & insights", color: "#a855f7" },
              { key: "aiRecommendations", label: "AI Recommendations", desc: "Personalized insights from WealthWise AI", color: "#ec4899" },
            ].map(({ key, label, desc, color }) => (
              <SettingRow key={key} label={label} desc={desc}>
                <Toggle value={notifs[key as keyof typeof notifs]} onChange={v => setNotifs(p => ({ ...p, [key]: v }))} color={color} />
              </SettingRow>
            ))}
            <div className="py-3" />
          </SectionCard>
        )}

        {/* ── AI ── */}
        {active === "ai" && (
          <SectionCard title="AI Preferences" icon={Bot} iconColor="#06b6d4">
            <SettingRow label="Personalized Financial Insights" desc="AI learns from your spending and investment patterns">
              <Toggle value={aiPrefs.personalizedInsights} onChange={v => setAiPrefs(p => ({ ...p, personalizedInsights: v }))} color="#06b6d4" />
            </SettingRow>
            <SettingRow label="Portfolio Analysis" desc="AI analyzes risk, allocation, and suggests rebalancing">
              <Toggle value={aiPrefs.portfolioAnalysis} onChange={v => setAiPrefs(p => ({ ...p, portfolioAnalysis: v }))} color="#3b82f6" />
            </SettingRow>
            <SettingRow label="Spending Analysis" desc="Categorize and analyze your spending patterns">
              <Toggle value={aiPrefs.spendingAnalysis} onChange={v => setAiPrefs(p => ({ ...p, spendingAnalysis: v }))} color="#10b981" />
            </SettingRow>
            <div className="py-4" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
              <p style={{ fontSize: "11px", fontWeight: 600, color: "#6b7494", letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: "12px" }}>AI Model</p>
              <div className="flex items-center gap-3 p-4 rounded-xl" style={{ background: "rgba(6,182,212,0.07)", border: "1px solid rgba(6,182,212,0.18)" }}>
                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: "linear-gradient(135deg, #06b6d4, #3b82f6)" }}>
                  <Bot size={18} color="#fff" />
                </div>
                <div className="flex-1">
                  <p style={{ fontSize: "13px", fontWeight: 600, color: "#e8eaf0" }}>WealthWise AI · GPT-4 Turbo</p>
                  <p style={{ fontSize: "11px", color: "#6b7494" }}>Fine-tuned on 10M+ financial data points</p>
                </div>
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg" style={{ background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.2)" }}>
                  <div className="w-1.5 h-1.5 rounded-full" style={{ background: "#10b981" }} />
                  <span style={{ fontSize: "10px", fontWeight: 600, color: "#10b981" }}>Active</span>
                </div>
              </div>
            </div>
            <div className="pb-2" />
          </SectionCard>
        )}

        {/* ── Dashboard ── */}
        {active === "dashboard" && (
          <SectionCard title="Dashboard Customization" icon={LayoutDashboard} iconColor="#ec4899">
            <p style={{ fontSize: "12px", color: "#6b7494", padding: "16px 0 4px" }}>
              Choose which widgets appear on your main dashboard.
            </p>
            {[
              { key: "netWorth", label: "Net Worth", desc: "Total assets vs liabilities overview", color: "#3b82f6" },
              { key: "performance", label: "Portfolio Performance", desc: "Returns chart and benchmark comparison", color: "#10b981" },
              { key: "watchlist", label: "Watchlist", desc: "Track stocks you're monitoring", color: "#f59e0b" },
              { key: "marketNews", label: "Market News", desc: "Live financial news feed", color: "#06b6d4" },
              { key: "aiInsights", label: "AI Insights", desc: "Personalized recommendations panel", color: "#ec4899" },
              { key: "goalsProgress", label: "Goals Progress", desc: "Track your financial goals", color: "#a855f7" },
            ].map(({ key, label, desc, color }) => (
              <SettingRow key={key} label={label} desc={desc}>
                <Toggle value={widgets[key as keyof typeof widgets]} onChange={v => setWidgets(p => ({ ...p, [key]: v }))} color={color} />
              </SettingRow>
            ))}
            <div className="py-4 flex items-center justify-between" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
              <p style={{ fontSize: "12px", color: "#6b7494" }}>
                <span style={{ color: "#e8eaf0", fontWeight: 600 }}>{Object.values(widgets).filter(Boolean).length}</span> of 6 widgets active
              </p>
              <button onClick={() => setWidgets({ netWorth: true, performance: true, watchlist: true, marketNews: true, aiInsights: true, goalsProgress: true })}
                style={{ fontSize: "11px", color: "#3b82f6" }}>
                Enable all
              </button>
            </div>
          </SectionCard>
        )}

        {/* ── Reports ── */}
        {active === "reports" && (
          <SectionCard title="Reports & Export" icon={FileText} iconColor="#8b5cf6">
            <div className="flex flex-col gap-3 py-4">
              {[
                { icon: Download, label: "Download Monthly Report", desc: "June 2026 — PDF summary of portfolio & spending", color: "#3b82f6", action: "Download PDF" },
                { icon: FileSpreadsheet, label: "Export Transactions CSV", desc: "All transactions from Jan–Jun 2026 (847 records)", color: "#10b981", action: "Export CSV" },
                { icon: FileText, label: "Export Financial Summary", desc: "Complete financial overview with charts & analytics", color: "#a855f7", action: "Export PDF" },
              ].map(({ icon: Icon, label, desc, color, action }) => (
                <div key={label} className="flex items-center gap-4 p-4 rounded-xl transition-all hover:bg-white/[0.025]"
                  style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.07)" }}>
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: `${color}15`, border: `1px solid ${color}25` }}>
                    <Icon size={17} style={{ color }} />
                  </div>
                  <div className="flex-1">
                    <p style={{ fontSize: "13px", fontWeight: 500, color: "#e8eaf0" }}>{label}</p>
                    <p style={{ fontSize: "11px", color: "#6b7494", marginTop: "2px" }}>{desc}</p>
                  </div>
                  <button className="flex items-center gap-1.5 px-4 h-8 rounded-lg text-xs transition-all hover:brightness-110 shrink-0"
                    style={{ background: `${color}12`, border: `1px solid ${color}25`, color, fontWeight: 600 }}>
                    <Download size={11} /> {action}
                  </button>
                </div>
              ))}
            </div>
            <div className="pb-2 flex items-center gap-2 px-1 pb-4">
              <RefreshCw size={12} style={{ color: "#6b7494" }} />
              <span style={{ fontSize: "11px", color: "#6b7494" }}>Reports auto-generate on the 1st of each month</span>
            </div>
          </SectionCard>
        )}

        {/* ── Appearance ── */}
        {active === "appearance" && (
          <SectionCard title="Appearance" icon={Palette} iconColor="#f59e0b">
            <div className="py-5 flex flex-col gap-5">
              <div>
                <p style={{ fontSize: "10px", fontWeight: 600, color: "#6b7494", letterSpacing: "0.07em", textTransform: "uppercase", marginBottom: "12px" }}>Theme</p>
                <div className="grid grid-cols-3 gap-3">
                  {([
                    { id: "dark", label: "Dark", icon: Moon, preview: ["#0b0e14", "#141720", "#3b82f6"], desc: "Easy on the eyes" },
                    { id: "light", label: "Light", icon: Sun, preview: ["#f8fafc", "#ffffff", "#3b82f6"], desc: "Clean and bright" },
                    { id: "system", label: "System", icon: Monitor, preview: ["#1e293b", "#f1f5f9", "#3b82f6"], desc: "Follows OS setting" },
                  ] as { id: Theme; label: string; icon: React.ElementType; preview: string[]; desc: string }[]).map(t => {
                    const sel = theme === t.id;
                    const Icon = t.icon;
                    return (
                      <button key={t.id} onClick={() => setTheme(t.id)}
                        className="flex flex-col gap-3 p-4 rounded-xl text-left transition-all"
                        style={{ background: sel ? "rgba(59,130,246,0.1)" : "rgba(255,255,255,0.03)", border: sel ? "1px solid rgba(59,130,246,0.35)" : "1px solid rgba(255,255,255,0.08)", boxShadow: sel ? "0 4px 20px rgba(59,130,246,0.15)" : "none" }}>
                        {/* Mini preview */}
                        <div className="w-full h-16 rounded-lg overflow-hidden relative" style={{ background: t.preview[0] }}>
                          <div className="absolute inset-x-0 top-0 h-5" style={{ background: t.preview[1], borderBottom: `1px solid ${t.preview[2]}20` }} />
                          <div className="absolute left-2 top-6 w-6 h-8 rounded" style={{ background: t.preview[1], opacity: 0.6 }} />
                          <div className="absolute left-10 top-6 right-2 h-3 rounded" style={{ background: t.preview[2], opacity: 0.3 }} />
                          <div className="absolute left-10 top-11 right-2 h-2 rounded" style={{ background: t.preview[1], opacity: 0.4 }} />
                          {sel && (
                            <div className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full flex items-center justify-center" style={{ background: "#3b82f6" }}>
                              <Check size={9} color="#fff" strokeWidth={3} />
                            </div>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <Icon size={13} style={{ color: sel ? "#3b82f6" : "#6b7494" }} />
                          <div>
                            <p style={{ fontSize: "12px", fontWeight: sel ? 600 : 400, color: sel ? "#e8eaf0" : "#a0a8bc" }}>{t.label}</p>
                            <p style={{ fontSize: "10px", color: "#6b7494" }}>{t.desc}</p>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: "20px" }}>
                <p style={{ fontSize: "10px", fontWeight: 600, color: "#6b7494", letterSpacing: "0.07em", textTransform: "uppercase", marginBottom: "12px" }}>Interface Density</p>
                <div className="flex gap-3">
                  {[{ id: "compact", label: "Compact", desc: "More data at once" }, { id: "default", label: "Default", desc: "Balanced layout" }, { id: "comfortable", label: "Comfortable", desc: "Spacious UI" }].map(d => (
                    <button key={d.id} className="flex-1 p-3 rounded-xl text-left" style={{ background: d.id === "default" ? "rgba(59,130,246,0.1)" : "rgba(255,255,255,0.03)", border: d.id === "default" ? "1px solid rgba(59,130,246,0.3)" : "1px solid rgba(255,255,255,0.08)" }}>
                      <p style={{ fontSize: "12px", fontWeight: 500, color: d.id === "default" ? "#e8eaf0" : "#a0a8bc" }}>{d.label}</p>
                      <p style={{ fontSize: "10px", color: "#6b7494" }}>{d.desc}</p>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </SectionCard>
        )}

        {/* ── Status ── */}
        {active === "status" && (
          <SectionCard title="Platform Status" icon={Activity} iconColor="#10b981">
            <div className="py-3 flex items-center gap-3 mb-2">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg" style={{ background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.2)" }}>
                <div className="w-2 h-2 rounded-full" style={{ background: "#10b981", boxShadow: "0 0 6px #10b981" }} />
                <span style={{ fontSize: "12px", fontWeight: 600, color: "#10b981" }}>All Systems Operational</span>
              </div>
              <span style={{ fontSize: "11px", color: "#6b7494" }}>Last checked: just now</span>
            </div>
            <div className="flex flex-col gap-2 pb-4">
              {statusItems.map((s, i) => (
                <div key={i} className="flex items-center gap-4 p-4 rounded-xl transition-all hover:bg-white/[0.02]"
                  style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)" }}>
                  <div className="w-2 h-2 rounded-full shrink-0" style={{ background: statusColor(s.status), boxShadow: `0 0 6px ${statusColor(s.status)}` }} />
                  <p style={{ fontSize: "13px", fontWeight: 500, color: "#e8eaf0", flex: 1 }}>{s.name}</p>
                  <span className="font-mono" style={{ fontSize: "11px", color: "#6b7494" }}>{s.latency}</span>
                  <span className="px-2.5 py-1 rounded-lg" style={{ fontSize: "10px", fontWeight: 600, color: statusColor(s.status), background: `${statusColor(s.status)}12`, border: `1px solid ${statusColor(s.status)}22` }}>
                    {statusLabel(s.status)}
                  </span>
                </div>
              ))}
            </div>
            <div className="pb-4">
              <button className="flex items-center gap-1.5 text-xs" style={{ color: "#3b82f6" }}>
                <ExternalLink size={11} /> View full status page
              </button>
            </div>
          </SectionCard>
        )}

        {/* ── Danger Zone ── */}
        {active === "danger" && (
          <div className="flex flex-col gap-4">
            <div className="rounded-2xl overflow-hidden" style={{ ...glass, border: "1px solid rgba(239,68,68,0.15)" }}>
              <div className="flex items-center gap-3 px-6 py-4" style={{ background: "rgba(239,68,68,0.06)", borderBottom: "1px solid rgba(239,68,68,0.12)" }}>
                <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: "rgba(239,68,68,0.15)" }}>
                  <AlertTriangle size={15} style={{ color: "#ef4444" }} />
                </div>
                <div>
                  <h3 style={{ fontSize: "14px", fontWeight: 700, color: "#ef4444" }}>Danger Zone</h3>
                  <p style={{ fontSize: "11px", color: "#6b7494" }}>These actions are permanent and cannot be undone.</p>
                </div>
              </div>
              <div className="px-6 pb-2">
                <SettingRow label="Export All Data" desc="Download a complete archive of all your WealthWise data before deleting.">
                  <button className="flex items-center gap-1.5 px-3 h-8 rounded-lg text-xs"
                    style={{ border: "1px solid rgba(255,255,255,0.1)", color: "#8892a4" }}>
                    <Download size={11} /> Export
                  </button>
                </SettingRow>
                <SettingRow label="Deactivate Account" desc="Temporarily disable your account. You can reactivate anytime.">
                  <button className="flex items-center gap-1.5 px-3 h-8 rounded-lg text-xs"
                    style={{ background: "rgba(245,158,11,0.1)", border: "1px solid rgba(245,158,11,0.25)", color: "#f59e0b" }}>
                    Deactivate
                  </button>
                </SettingRow>
                <div className="py-3.5 flex items-center justify-between" style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}>
                  <div>
                    <p style={{ fontSize: "13px", fontWeight: 500, color: "#ef4444" }}>Delete Account</p>
                    <p style={{ fontSize: "11px", color: "#6b7494", marginTop: "2px" }}>Permanently delete your account and all associated data. This cannot be undone.</p>
                  </div>
                  <button
                    onClick={() => setShowDeleteModal(true)}
                    className="flex items-center gap-1.5 px-4 h-9 rounded-xl text-xs transition-all hover:brightness-110 shrink-0 ml-6"
                    style={{ background: "rgba(239,68,68,0.15)", border: "1px solid rgba(239,68,68,0.35)", color: "#ef4444", fontWeight: 600, fontSize: "12px" }}>
                    <Trash2 size={13} /> Delete Account
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>

      {/* Delete modal */}
      {showDeleteModal && (
        <DeleteModal
          onClose={() => setShowDeleteModal(false)}
          onConfirm={() => { setShowDeleteModal(false); alert("Account scheduled for deletion."); }}
        />
      )}

      <style>{`
        select option { background: #141720; color: #e8eaf0; }
        input::placeholder, textarea::placeholder { color: #6b7494; }
      `}</style>
    </div>
  );
}
