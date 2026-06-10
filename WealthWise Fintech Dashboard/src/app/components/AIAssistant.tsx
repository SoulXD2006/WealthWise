import { useState, useRef, useEffect } from "react";
import { Bot, Send, Sparkles, TrendingUp, AlertTriangle, Lightbulb } from "lucide-react";

interface Message {
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

const suggestions = [
  { icon: TrendingUp, label: "Analyze NVDA position", color: "#3b82f6" },
  { icon: AlertTriangle, label: "Risk exposure check", color: "#f59e0b" },
  { icon: Lightbulb, label: "Rebalancing ideas", color: "#10b981" },
];

const assistantResponses: Record<string, string> = {
  default: "I've analyzed your portfolio. Your current allocation shows strong tech sector concentration at 38.5%. With NVDA up 112.3% since entry, consider taking partial profits to reduce single-stock risk. Your Sharpe ratio of 2.14 is excellent, indicating strong risk-adjusted returns.",
  nvda: "NVDA is your largest holding at $36,758 (14.8% weight), with an unrealized gain of +$19,449 (+112.3%). Given the AI infrastructure spending cycle, the position remains attractive, but consider trimming 20-25% to lock in gains and reduce concentration risk. Target price consensus sits at $950.",
  risk: "Portfolio risk metrics look healthy: Beta 1.12, Max Drawdown -8.3%, VaR (95%) -$4,820/day. Primary risks: tech sector concentration (38.5%), single-name NVDA exposure (14.8%), and rising rate sensitivity in your REIT allocation. Consider hedging with put options on QQQ.",
  rebalance: "Suggested rebalancing actions: 1) Trim NVDA by ~$8k (overweight vs target), 2) Add to Healthcare sector (underweight by 4%), 3) Consider initiating BRK.A position for defensive balance. Expected Sharpe improvement: +0.08. Tax impact: ~$2,100 in realized gains.",
};

function getResponse(input: string): string {
  const lower = input.toLowerCase();
  if (lower.includes("nvda") || lower.includes("nvidia")) return assistantResponses.nvda;
  if (lower.includes("risk") || lower.includes("exposure")) return assistantResponses.risk;
  if (lower.includes("rebalanc") || lower.includes("ideas")) return assistantResponses.rebalance;
  return assistantResponses.default;
}

export function AIAssistant() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Hi Alex. I've reviewed your portfolio and have 3 actionable insights ready. Your NVDA position has grown to 14.8% of AUM — above your 12% target. Want me to suggest a rebalancing plan?",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typing]);

  const send = async (text: string) => {
    if (!text.trim()) return;
    const userMsg: Message = { role: "user", content: text, timestamp: new Date() };
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setTyping(true);
    await new Promise(r => setTimeout(r, 900 + Math.random() * 600));
    setTyping(false);
    setMessages(prev => [...prev, { role: "assistant", content: getResponse(text), timestamp: new Date() }]);
  };

  return (
    <div
      className="rounded-xl flex flex-col overflow-hidden"
      style={{
        background: "rgba(255,255,255,0.03)",
        border: "1px solid rgba(255,255,255,0.08)",
        backdropFilter: "blur(20px)",
        boxShadow: "0 4px 24px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.06)",
        height: "420px",
      }}
    >
      {/* Header */}
      <div
        className="flex items-center gap-3 px-4 py-3 shrink-0"
        style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}
      >
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center"
          style={{ background: "linear-gradient(135deg, #3b82f6, #8b5cf6)", boxShadow: "0 2px 8px rgba(139,92,246,0.3)" }}
        >
          <Sparkles size={14} color="#fff" />
        </div>
        <div>
          <p style={{ fontSize: "13px", fontWeight: 600, color: "#e8eaf0" }}>WealthWise AI</p>
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full" style={{ background: "#10b981", boxShadow: "0 0 4px #10b981" }} />
            <p style={{ fontSize: "10px", color: "#10b981" }}>Online · GPT-4 Turbo</p>
          </div>
        </div>
        <div
          className="ml-auto px-2 py-1 rounded-md"
          style={{ background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.15)" }}
        >
          <span style={{ fontSize: "10px", fontWeight: 600, color: "#10b981" }}>3 insights</span>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-3 flex flex-col gap-3">
        {messages.map((m, i) => (
          <div key={i} className={`flex gap-2.5 ${m.role === "user" ? "flex-row-reverse" : "flex-row"}`}>
            {m.role === "assistant" && (
              <div
                className="w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-0.5"
                style={{ background: "linear-gradient(135deg, #3b82f6, #8b5cf6)" }}
              >
                <Bot size={11} color="#fff" />
              </div>
            )}
            <div
              className="rounded-xl px-3 py-2.5 max-w-[85%]"
              style={{
                background: m.role === "user"
                  ? "linear-gradient(135deg, rgba(59,130,246,0.25), rgba(59,130,246,0.15))"
                  : "rgba(255,255,255,0.05)",
                border: m.role === "user"
                  ? "1px solid rgba(59,130,246,0.3)"
                  : "1px solid rgba(255,255,255,0.07)",
              }}
            >
              <p style={{ fontSize: "12px", color: "#d4d8e8", lineHeight: 1.6 }}>{m.content}</p>
              <p style={{ fontSize: "9px", color: "#6b7494", marginTop: "4px" }}>
                {m.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
              </p>
            </div>
          </div>
        ))}
        {typing && (
          <div className="flex gap-2.5">
            <div
              className="w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-0.5"
              style={{ background: "linear-gradient(135deg, #3b82f6, #8b5cf6)" }}
            >
              <Bot size={11} color="#fff" />
            </div>
            <div className="rounded-xl px-3 py-2.5" style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.07)" }}>
              <div className="flex gap-1 items-center h-4">
                {[0, 1, 2].map(n => (
                  <span
                    key={n}
                    className="w-1.5 h-1.5 rounded-full"
                    style={{
                      background: "#6b7494",
                      animation: `bounce 1.2s ease-in-out ${n * 0.2}s infinite`,
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Suggestions */}
      <div className="px-4 pb-2 flex gap-2 overflow-x-auto shrink-0">
        {suggestions.map(({ icon: Icon, label, color }) => (
          <button
            key={label}
            onClick={() => send(label)}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg whitespace-nowrap transition-colors hover:brightness-110 shrink-0"
            style={{
              background: `${color}10`,
              border: `1px solid ${color}22`,
            }}
          >
            <Icon size={10} style={{ color }} />
            <span style={{ fontSize: "10px", fontWeight: 500, color: "#8892a4" }}>{label}</span>
          </button>
        ))}
      </div>

      {/* Input */}
      <div className="px-4 pb-4 shrink-0">
        <div
          className="flex items-center gap-2 px-3 py-2 rounded-xl"
          style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)" }}
        >
          <input
            className="flex-1 bg-transparent outline-none placeholder:text-muted-foreground"
            style={{ fontSize: "12px", color: "#e8eaf0" }}
            placeholder="Ask about your portfolio…"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === "Enter" && send(input)}
          />
          <button
            onClick={() => send(input)}
            disabled={!input.trim()}
            className="w-6 h-6 rounded-lg flex items-center justify-center transition-all"
            style={{
              background: input.trim() ? "linear-gradient(135deg, #3b82f6, #2563eb)" : "rgba(255,255,255,0.06)",
              boxShadow: input.trim() ? "0 2px 8px rgba(59,130,246,0.3)" : "none",
            }}
          >
            <Send size={11} color={input.trim() ? "#fff" : "#6b7494"} />
          </button>
        </div>
      </div>

      <style>{`
        @keyframes bounce {
          0%, 60%, 100% { transform: translateY(0); }
          30% { transform: translateY(-4px); }
        }
      `}</style>
    </div>
  );
}
