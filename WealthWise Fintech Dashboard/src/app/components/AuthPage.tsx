import { useState } from "react";
import { Eye, EyeOff, Mail, Lock, User, ArrowRight, Wallet, Check, TrendingUp, Shield, Zap } from "lucide-react";

type AuthMode = "login" | "signup";

const features = [
  { icon: TrendingUp, text: "Real-time portfolio analytics" },
  { icon: Shield, text: "Bank-grade security & encryption" },
  { icon: Zap, text: "AI-powered investment insights" },
];

const GoogleIcon = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
    <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4"/>
    <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z" fill="#34A853"/>
    <path d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05"/>
    <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335"/>
  </svg>
);

export function AuthPage({ onAuth }: { onAuth: () => void }) {
  const [mode, setMode] = useState<AuthMode>("login");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [agreed, setAgreed] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await new Promise(r => setTimeout(r, 1200));
    setLoading(false);
    onAuth();
  };

  const handleGoogle = async () => {
    setGoogleLoading(true);
    await new Promise(r => setTimeout(r, 1000));
    setGoogleLoading(false);
    onAuth();
  };

  return (
    <div
      className="flex h-screen overflow-hidden"
      style={{ background: "#0b0e14", fontFamily: "'Inter', system-ui, sans-serif" }}
    >
      {/* Left panel — branding */}
      <div
        className="hidden lg:flex flex-col justify-between w-[45%] p-12 relative overflow-hidden"
        style={{
          background: "linear-gradient(135deg, #0d1117 0%, #0f1420 60%, #0a1628 100%)",
          borderRight: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        {/* Grid overlay */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: `
              linear-gradient(rgba(59,130,246,0.04) 1px, transparent 1px),
              linear-gradient(90deg, rgba(59,130,246,0.04) 1px, transparent 1px)
            `,
            backgroundSize: "48px 48px",
          }}
        />

        {/* Glow orbs */}
        <div className="absolute pointer-events-none" style={{ top: "-80px", left: "-80px", width: "400px", height: "400px", background: "radial-gradient(ellipse, rgba(59,130,246,0.1) 0%, transparent 65%)" }} />
        <div className="absolute pointer-events-none" style={{ bottom: "0", right: "-60px", width: "350px", height: "350px", background: "radial-gradient(ellipse, rgba(16,185,129,0.07) 0%, transparent 65%)" }} />

        {/* Logo */}
        <div className="relative flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{ background: "linear-gradient(135deg, #3b82f6, #2563eb)", boxShadow: "0 4px 16px rgba(59,130,246,0.4)" }}
          >
            <Wallet size={18} color="#fff" strokeWidth={2.5} />
          </div>
          <span style={{ fontSize: "18px", fontWeight: 700, color: "#e8eaf0", letterSpacing: "-0.02em" }}>WealthWise</span>
        </div>

        {/* Hero text */}
        <div className="relative flex flex-col gap-8">
          <div>
            <h1 style={{ fontSize: "38px", fontWeight: 700, color: "#e8eaf0", letterSpacing: "-0.03em", lineHeight: 1.1 }}>
              Your wealth,<br />
              <span style={{ background: "linear-gradient(135deg, #3b82f6, #06b6d4)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                intelligently managed.
              </span>
            </h1>
            <p style={{ fontSize: "15px", color: "#6b7494", marginTop: "16px", lineHeight: 1.7, maxWidth: "380px" }}>
              Join 48,000+ investors using WealthWise to track portfolios, analyze markets, and grow wealth with AI-powered insights.
            </p>
          </div>

          {/* Feature list */}
          <div className="flex flex-col gap-3">
            {features.map(({ icon: Icon, text }) => (
              <div key={text} className="flex items-center gap-3">
                <div
                  className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
                  style={{ background: "rgba(59,130,246,0.12)", border: "1px solid rgba(59,130,246,0.2)" }}
                >
                  <Icon size={13} style={{ color: "#3b82f6" }} />
                </div>
                <span style={{ fontSize: "13px", color: "#a0a8bc" }}>{text}</span>
              </div>
            ))}
          </div>

          {/* Social proof */}
          <div
            className="flex items-center gap-4 p-4 rounded-2xl"
            style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}
          >
            <div className="flex -space-x-2">
              {["#3b82f6", "#10b981", "#a855f7", "#f59e0b"].map((c, i) => (
                <div
                  key={i}
                  className="w-8 h-8 rounded-full flex items-center justify-center"
                  style={{ background: `linear-gradient(135deg, ${c}, ${c}aa)`, border: "2px solid #0d1117", zIndex: 4 - i }}
                >
                  <span style={{ fontSize: "10px", fontWeight: 700, color: "#fff" }}>{["AK","MR","JL","SP"][i]}</span>
                </div>
              ))}
            </div>
            <div>
              <div className="flex gap-0.5 mb-1">
                {[1,2,3,4,5].map(s => (
                  <svg key={s} width="12" height="12" viewBox="0 0 12 12" fill="#f59e0b"><path d="M6 1l1.3 3.9H11L8.2 7.1l1 3.8L6 8.9l-3.2 2 1-3.8L1 4.9h3.7z"/></svg>
                ))}
              </div>
              <p style={{ fontSize: "11px", color: "#6b7494" }}>
                <span style={{ color: "#e8eaf0", fontWeight: 600 }}>4.9/5</span> from 12,400+ reviews
              </p>
            </div>
          </div>
        </div>

        {/* Bottom badge */}
        <div className="relative flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full" style={{ background: "#10b981", boxShadow: "0 0 6px #10b981" }} />
          <span style={{ fontSize: "11px", color: "#6b7494" }}>All systems operational · 99.99% uptime</span>
        </div>
      </div>

      {/* Right panel — form */}
      <div className="flex-1 flex items-center justify-center px-6 relative">
        {/* Subtle glow */}
        <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse at 50% 40%, rgba(59,130,246,0.04) 0%, transparent 60%)" }} />

        <div className="w-full max-w-[400px] relative">
          {/* Mobile logo */}
          <div className="flex lg:hidden items-center gap-2.5 mb-8">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: "linear-gradient(135deg, #3b82f6, #2563eb)", boxShadow: "0 4px 12px rgba(59,130,246,0.35)" }}>
              <Wallet size={15} color="#fff" strokeWidth={2.5} />
            </div>
            <span style={{ fontSize: "16px", fontWeight: 700, color: "#e8eaf0" }}>WealthWise</span>
          </div>

          {/* Heading */}
          <div className="mb-7">
            <h2 style={{ fontSize: "24px", fontWeight: 700, color: "#e8eaf0", letterSpacing: "-0.02em" }}>
              {mode === "login" ? "Welcome back" : "Create your account"}
            </h2>
            <p style={{ fontSize: "13px", color: "#6b7494", marginTop: "6px" }}>
              {mode === "login"
                ? "Sign in to your WealthWise dashboard"
                : "Start your 14-day free trial — no credit card required"}
            </p>
          </div>

          {/* Google button */}
          <button
            onClick={handleGoogle}
            disabled={googleLoading}
            className="w-full flex items-center justify-center gap-3 h-11 rounded-xl transition-all duration-150 hover:brightness-110 active:scale-[0.99] mb-5"
            style={{
              background: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(255,255,255,0.12)",
              color: "#e8eaf0",
              fontSize: "13px",
              fontWeight: 500,
            }}
          >
            {googleLoading ? (
              <div className="w-4 h-4 rounded-full border-2 border-t-blue-400" style={{ borderColor: "rgba(255,255,255,0.2)", borderTopColor: "#3b82f6", animation: "spin 0.8s linear infinite" }} />
            ) : (
              <GoogleIcon />
            )}
            {googleLoading ? "Connecting…" : `Continue with Google`}
          </button>

          {/* Divider */}
          <div className="flex items-center gap-3 mb-5">
            <div className="flex-1 h-px" style={{ background: "rgba(255,255,255,0.07)" }} />
            <span style={{ fontSize: "11px", color: "#6b7494", letterSpacing: "0.04em" }}>OR</span>
            <div className="flex-1 h-px" style={{ background: "rgba(255,255,255,0.07)" }} />
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            {mode === "signup" && (
              <div>
                <label style={{ fontSize: "11px", fontWeight: 600, color: "#6b7494", letterSpacing: "0.05em", textTransform: "uppercase" }}>Full Name</label>
                <div className="relative mt-1.5">
                  <User size={14} style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "#6b7494" }} />
                  <input
                    type="text"
                    placeholder="Alex Kim"
                    value={form.name}
                    onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                    className="w-full h-11 rounded-xl pl-10 pr-4 outline-none transition-all"
                    style={{
                      background: "rgba(255,255,255,0.05)",
                      border: "1px solid rgba(255,255,255,0.1)",
                      color: "#e8eaf0",
                      fontSize: "13px",
                    }}
                    onFocus={e => (e.currentTarget.style.borderColor = "rgba(59,130,246,0.5)")}
                    onBlur={e => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)")}
                  />
                </div>
              </div>
            )}

            <div>
              <label style={{ fontSize: "11px", fontWeight: 600, color: "#6b7494", letterSpacing: "0.05em", textTransform: "uppercase" }}>Email</label>
              <div className="relative mt-1.5">
                <Mail size={14} style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "#6b7494" }} />
                <input
                  type="email"
                  placeholder="alex@example.com"
                  value={form.email}
                  onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                  className="w-full h-11 rounded-xl pl-10 pr-4 outline-none transition-all"
                  style={{
                    background: "rgba(255,255,255,0.05)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    color: "#e8eaf0",
                    fontSize: "13px",
                  }}
                  onFocus={e => (e.currentTarget.style.borderColor = "rgba(59,130,246,0.5)")}
                  onBlur={e => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)")}
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label style={{ fontSize: "11px", fontWeight: 600, color: "#6b7494", letterSpacing: "0.05em", textTransform: "uppercase" }}>Password</label>
                {mode === "login" && (
                  <button type="button" style={{ fontSize: "11px", color: "#3b82f6" }}>Forgot password?</button>
                )}
              </div>
              <div className="relative mt-1.5">
                <Lock size={14} style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "#6b7494" }} />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder={mode === "signup" ? "Min. 8 characters" : "Enter your password"}
                  value={form.password}
                  onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                  className="w-full h-11 rounded-xl pl-10 pr-10 outline-none transition-all"
                  style={{
                    background: "rgba(255,255,255,0.05)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    color: "#e8eaf0",
                    fontSize: "13px",
                  }}
                  onFocus={e => (e.currentTarget.style.borderColor = "rgba(59,130,246,0.5)")}
                  onBlur={e => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)")}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(v => !v)}
                  style={{ position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)", color: "#6b7494" }}
                >
                  {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>

              {/* Password strength (signup only) */}
              {mode === "signup" && form.password.length > 0 && (
                <div className="mt-2 flex gap-1">
                  {[1, 2, 3, 4].map(n => {
                    const strength = Math.min(4, Math.floor(form.password.length / 3));
                    const colors = ["#ef4444", "#f59e0b", "#3b82f6", "#10b981"];
                    return (
                      <div
                        key={n}
                        className="flex-1 h-1 rounded-full transition-all duration-300"
                        style={{ background: n <= strength ? colors[strength - 1] : "rgba(255,255,255,0.08)" }}
                      />
                    );
                  })}
                </div>
              )}
            </div>

            {/* Terms (signup) */}
            {mode === "signup" && (
              <div className="flex items-start gap-3 mt-1">
                <button
                  type="button"
                  onClick={() => setAgreed(v => !v)}
                  className="w-5 h-5 rounded-md shrink-0 mt-0.5 flex items-center justify-center transition-all"
                  style={{
                    background: agreed ? "linear-gradient(135deg, #3b82f6, #2563eb)" : "rgba(255,255,255,0.05)",
                    border: agreed ? "1px solid #3b82f6" : "1px solid rgba(255,255,255,0.15)",
                    boxShadow: agreed ? "0 2px 8px rgba(59,130,246,0.3)" : "none",
                  }}
                >
                  {agreed && <Check size={11} color="#fff" strokeWidth={3} />}
                </button>
                <p style={{ fontSize: "11px", color: "#6b7494", lineHeight: 1.6 }}>
                  I agree to WealthWise's{" "}
                  <span style={{ color: "#3b82f6", cursor: "pointer" }}>Terms of Service</span> and{" "}
                  <span style={{ color: "#3b82f6", cursor: "pointer" }}>Privacy Policy</span>
                </p>
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading || (mode === "signup" && !agreed)}
              className="w-full h-11 rounded-xl flex items-center justify-center gap-2 mt-1 transition-all duration-150 hover:brightness-110 active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                background: "linear-gradient(135deg, #3b82f6, #2563eb)",
                boxShadow: "0 4px 16px rgba(59,130,246,0.35)",
                color: "#fff",
                fontSize: "13px",
                fontWeight: 600,
              }}
            >
              {loading ? (
                <div className="w-4 h-4 rounded-full border-2" style={{ borderColor: "rgba(255,255,255,0.3)", borderTopColor: "#fff", animation: "spin 0.8s linear infinite" }} />
              ) : (
                <>
                  {mode === "login" ? "Sign in to Dashboard" : "Create Account"}
                  <ArrowRight size={14} />
                </>
              )}
            </button>
          </form>

          {/* Toggle mode */}
          <p className="text-center mt-6" style={{ fontSize: "12px", color: "#6b7494" }}>
            {mode === "login" ? "Don't have an account? " : "Already have an account? "}
            <button
              onClick={() => setMode(mode === "login" ? "signup" : "login")}
              style={{ color: "#3b82f6", fontWeight: 600 }}
            >
              {mode === "login" ? "Sign up free" : "Sign in"}
            </button>
          </p>

          {/* Security note */}
          <div className="flex items-center justify-center gap-2 mt-6">
            <Shield size={11} style={{ color: "#6b7494" }} />
            <span style={{ fontSize: "11px", color: "#6b7494" }}>256-bit SSL encryption · SOC 2 Type II certified</span>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        input::placeholder { color: #6b7494; }
      `}</style>
    </div>
  );
}
