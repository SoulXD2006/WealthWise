import { useState, useRef } from "react";
import {
  Plus, Trash2, Edit2, Check, X, DollarSign, Target,
  TrendingDown, TrendingUp, ShoppingCart, Home, Car, Utensils,
  Zap, Heart, Tv, Briefcase, GraduationCap, Plane, MoreHorizontal,
  ChevronDown, AlertTriangle, ArrowRight, PiggyBank
} from "lucide-react";

// ─── Types ───────────────────────────────────────────────────────────────────

interface Category {
  id: string;
  name: string;
  icon: string;
  color: string;
  budget: number;
  spent: number;
  type: "expense" | "income";
}

interface Transaction {
  id: string;
  categoryId: string;
  amount: number;
  note: string;
  date: string;
}

// ─── Constants ───────────────────────────────────────────────────────────────

const iconMap: Record<string, React.ElementType> = {
  ShoppingCart, Home, Car, Utensils, Zap, Heart, Tv,
  Briefcase, GraduationCap, Plane, DollarSign, Target,
};

const colorOptions = [
  "#3b82f6", "#10b981", "#a855f7", "#f59e0b",
  "#ef4444", "#06b6d4", "#ec4899", "#8b5cf6",
];

const iconOptions = [
  "ShoppingCart", "Home", "Car", "Utensils", "Zap",
  "Heart", "Tv", "Briefcase", "GraduationCap", "Plane", "DollarSign",
];

const defaultCategories: Category[] = [
  { id: "c1", name: "Rent & Housing", icon: "Home", color: "#3b82f6", budget: 2000, spent: 2000, type: "expense" },
  { id: "c2", name: "Groceries", icon: "ShoppingCart", color: "#10b981", budget: 600, spent: 432, type: "expense" },
  { id: "c3", name: "Dining Out", icon: "Utensils", color: "#f59e0b", budget: 300, spent: 287, type: "expense" },
  { id: "c4", name: "Transport", icon: "Car", color: "#a855f7", budget: 250, spent: 198, type: "expense" },
  { id: "c5", name: "Utilities", icon: "Zap", color: "#06b6d4", budget: 180, spent: 154, type: "expense" },
  { id: "c6", name: "Health", icon: "Heart", color: "#ec4899", budget: 150, spent: 89, type: "expense" },
  { id: "c7", name: "Entertainment", icon: "Tv", color: "#8b5cf6", budget: 200, spent: 165, type: "expense" },
  { id: "c8", name: "Education", icon: "GraduationCap", color: "#ef4444", budget: 100, spent: 0, type: "expense" },
];

// ─── Sub-components ───────────────────────────────────────────────────────────

function RadialProgress({ pct, color, size = 56 }: { pct: number; color: string; size?: number }) {
  const r = (size - 8) / 2;
  const circ = 2 * Math.PI * r;
  const capped = Math.min(pct, 100);
  const over = pct > 100;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ transform: "rotate(-90deg)" }}>
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={6} />
      <circle
        cx={size / 2} cy={size / 2} r={r} fill="none"
        stroke={over ? "#ef4444" : color}
        strokeWidth={6}
        strokeDasharray={circ}
        strokeDashoffset={circ * (1 - capped / 100)}
        strokeLinecap="round"
        style={{ transition: "stroke-dashoffset 0.6s ease, stroke 0.3s" }}
      />
    </svg>
  );
}

function SvgSavingsBar({ income, expenses, target }: { income: number; expenses: number; target: number }) {
  const W = 460; const H = 48;
  const saved = Math.max(0, income - expenses);
  const pct = income > 0 ? Math.min(saved / income, 1) : 0;
  const tPct = income > 0 ? Math.min(target / income, 1) : 0;
  const barW = W;

  return (
    <svg width="100%" height={H} viewBox={`0 0 ${W} ${H}`}>
      {/* Background */}
      <rect x={0} y={12} width={barW} height={16} rx={8} fill="rgba(255,255,255,0.06)" />
      {/* Expenses fill */}
      <rect x={0} y={12} width={barW * Math.min((income > 0 ? expenses / income : 0), 1)} height={16} rx={8} fill="rgba(239,68,68,0.5)" />
      {/* Savings fill on top */}
      {pct > 0 && (
        <rect
          x={barW * Math.min((income > 0 ? expenses / income : 0), 1)}
          y={12} width={barW * pct} height={16} rx={4}
          fill="#10b981" opacity={0.8}
        />
      )}
      {/* Target marker */}
      {tPct > 0 && (
        <g>
          <line x1={barW * tPct} y1={6} x2={barW * tPct} y2={42} stroke="#f59e0b" strokeWidth={2} strokeDasharray="3 2" />
          <text x={barW * tPct} y={4} textAnchor="middle" fill="#f59e0b" fontSize={9} fontFamily="JetBrains Mono,monospace">
            Target
          </text>
        </g>
      )}
      {/* Labels */}
      <text x={0} y={H} fill="#6b7494" fontSize={9} fontFamily="JetBrains Mono,monospace">Expenses</text>
      <text x={barW} y={H} textAnchor="end" fill="#10b981" fontSize={9} fontFamily="JetBrains Mono,monospace">Saved</text>
    </svg>
  );
}

// ─── Category Card ────────────────────────────────────────────────────────────

function CategoryCard({
  cat,
  onEdit,
  onDelete,
  onAddSpend,
}: {
  cat: Category;
  onEdit: (c: Category) => void;
  onDelete: (id: string) => void;
  onAddSpend: (id: string, amount: number, note: string) => void;
}) {
  const [showAdd, setShowAdd] = useState(false);
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");
  const Icon = iconMap[cat.icon] ?? DollarSign;
  const pct = cat.budget > 0 ? (cat.spent / cat.budget) * 100 : 0;
  const over = pct > 100;
  const remaining = cat.budget - cat.spent;

  const submit = () => {
    const v = parseFloat(amount.replace(/,/g, ""));
    if (!isNaN(v) && v > 0) {
      onAddSpend(cat.id, v, note);
      setAmount(""); setNote(""); setShowAdd(false);
    }
  };

  return (
    <div
      className="rounded-xl p-4 flex flex-col gap-3 transition-all duration-200"
      style={{
        background: "rgba(255,255,255,0.03)",
        border: over ? `1px solid rgba(239,68,68,0.3)` : "1px solid rgba(255,255,255,0.08)",
        backdropFilter: "blur(20px)",
        boxShadow: over ? "0 4px 20px rgba(239,68,68,0.1)" : "0 2px 12px rgba(0,0,0,0.15)",
      }}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2.5">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
            style={{ background: `${cat.color}18`, border: `1px solid ${cat.color}28` }}
          >
            <Icon size={14} style={{ color: cat.color }} />
          </div>
          <div>
            <p style={{ fontSize: "12px", fontWeight: 600, color: "#e8eaf0" }}>{cat.name}</p>
            <p style={{ fontSize: "10px", color: over ? "#ef4444" : "#6b7494" }}>
              {over ? `Over by $${Math.abs(remaining).toLocaleString()}` : `$${remaining.toLocaleString()} left`}
            </p>
          </div>
        </div>
        <div className="relative shrink-0">
          <RadialProgress pct={pct} color={cat.color} size={44} />
          <span
            className="font-mono absolute inset-0 flex items-center justify-center"
            style={{ fontSize: "9px", fontWeight: 700, color: over ? "#ef4444" : cat.color, transform: "rotate(90deg)" }}
          >
            {Math.round(pct)}%
          </span>
        </div>
      </div>

      {/* Progress bar */}
      <div>
        <div className="flex justify-between mb-1.5">
          <span className="font-mono" style={{ fontSize: "11px", color: "#e8eaf0" }}>
            ${cat.spent.toLocaleString()}
          </span>
          <span className="font-mono" style={{ fontSize: "11px", color: "#6b7494" }}>
            / ${cat.budget.toLocaleString()}
          </span>
        </div>
        <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.06)" }}>
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{
              width: `${Math.min(pct, 100)}%`,
              background: over
                ? "linear-gradient(90deg, #ef4444, #dc2626)"
                : pct > 80
                  ? `linear-gradient(90deg, ${cat.color}, #f59e0b)`
                  : `linear-gradient(90deg, ${cat.color}, ${cat.color}cc)`,
            }}
          />
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex gap-2">
        <button
          onClick={() => setShowAdd(v => !v)}
          className="flex-1 flex items-center justify-center gap-1.5 h-7 rounded-lg transition-all"
          style={{
            background: showAdd ? `${cat.color}18` : "rgba(255,255,255,0.04)",
            border: showAdd ? `1px solid ${cat.color}30` : "1px solid rgba(255,255,255,0.08)",
            color: showAdd ? cat.color : "#8892a4",
            fontSize: "11px",
            fontWeight: 500,
          }}
        >
          <Plus size={11} />
          Add Spend
        </button>
        <button
          onClick={() => onEdit(cat)}
          className="w-7 h-7 rounded-lg flex items-center justify-center transition-colors hover:bg-white/8"
          style={{ border: "1px solid rgba(255,255,255,0.08)", color: "#6b7494" }}
        >
          <Edit2 size={11} />
        </button>
        <button
          onClick={() => onDelete(cat.id)}
          className="w-7 h-7 rounded-lg flex items-center justify-center transition-colors hover:bg-red-500/10"
          style={{ border: "1px solid rgba(255,255,255,0.08)", color: "#6b7494" }}
        >
          <Trash2 size={11} />
        </button>
      </div>

      {/* Quick-add form */}
      {showAdd && (
        <div
          className="flex flex-col gap-2 pt-2"
          style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}
        >
          <div className="flex gap-2">
            <div
              className="flex items-center gap-1.5 flex-1 px-2.5 h-8 rounded-lg"
              style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)" }}
            >
              <DollarSign size={11} style={{ color: "#6b7494" }} />
              <input
                type="text"
                placeholder="Amount"
                value={amount}
                onChange={e => setAmount(e.target.value)}
                onKeyDown={e => e.key === "Enter" && submit()}
                className="flex-1 bg-transparent outline-none"
                style={{ fontSize: "12px", color: "#e8eaf0" }}
                autoFocus
              />
            </div>
            <input
              type="text"
              placeholder="Note (optional)"
              value={note}
              onChange={e => setNote(e.target.value)}
              onKeyDown={e => e.key === "Enter" && submit()}
              className="flex-1 px-2.5 h-8 rounded-lg outline-none"
              style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", fontSize: "12px", color: "#e8eaf0" }}
            />
          </div>
          <div className="flex gap-2">
            <button
              onClick={submit}
              className="flex-1 h-7 rounded-lg flex items-center justify-center gap-1.5 transition-all"
              style={{ background: cat.color, color: "#fff", fontSize: "11px", fontWeight: 600 }}
            >
              <Check size={11} /> Log Expense
            </button>
            <button
              onClick={() => { setShowAdd(false); setAmount(""); setNote(""); }}
              className="w-7 h-7 rounded-lg flex items-center justify-center"
              style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", color: "#6b7494" }}
            >
              <X size={11} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Category Modal ────────────────────────────────────────────────────────────

function CategoryModal({
  initial,
  onSave,
  onClose,
}: {
  initial?: Partial<Category>;
  onSave: (c: Omit<Category, "id" | "spent">) => void;
  onClose: () => void;
}) {
  const [name, setName] = useState(initial?.name ?? "");
  const [icon, setIcon] = useState(initial?.icon ?? "DollarSign");
  const [color, setColor] = useState(initial?.color ?? "#3b82f6");
  const [budget, setBudget] = useState(initial?.budget?.toString() ?? "");

  const save = () => {
    const b = parseFloat(budget.replace(/,/g, ""));
    if (!name.trim() || isNaN(b) || b <= 0) return;
    onSave({ name: name.trim(), icon, color, budget: b, type: "expense" });
  };

  const Icon = iconMap[icon] ?? DollarSign;

  return (
    <div
      className="fixed inset-0 flex items-center justify-center"
      style={{ background: "rgba(0,0,0,0.6)", backdropFilter: "blur(8px)", zIndex: 50 }}
      onClick={e => e.target === e.currentTarget && onClose()}
    >
      <div
        className="w-[440px] rounded-2xl p-6 flex flex-col gap-5"
        style={{
          background: "linear-gradient(135deg, #141720, #0f1219)",
          border: "1px solid rgba(255,255,255,0.1)",
          boxShadow: "0 24px 80px rgba(0,0,0,0.6)",
        }}
      >
        <div className="flex items-center justify-between">
          <h3 style={{ fontSize: "16px", fontWeight: 700, color: "#e8eaf0" }}>
            {initial?.id ? "Edit Category" : "New Budget Category"}
          </h3>
          <button onClick={onClose} className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-white/8" style={{ color: "#6b7494" }}>
            <X size={14} />
          </button>
        </div>

        {/* Preview */}
        <div
          className="flex items-center gap-3 p-3 rounded-xl"
          style={{ background: `${color}10`, border: `1px solid ${color}25` }}
        >
          <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `${color}20` }}>
            <Icon size={18} style={{ color }} />
          </div>
          <div>
            <p style={{ fontSize: "13px", fontWeight: 600, color: "#e8eaf0" }}>{name || "Category Name"}</p>
            <p style={{ fontSize: "11px", color: "#6b7494" }}>
              Budget: <span className="font-mono" style={{ color }}>${budget || "0"}/mo</span>
            </p>
          </div>
        </div>

        {/* Name */}
        <div>
          <label style={{ fontSize: "11px", fontWeight: 600, color: "#6b7494", letterSpacing: "0.06em", textTransform: "uppercase" }}>Category Name</label>
          <input
            type="text"
            placeholder="e.g. Groceries"
            value={name}
            onChange={e => setName(e.target.value)}
            className="w-full mt-1.5 h-10 px-3 rounded-xl outline-none"
            style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "#e8eaf0", fontSize: "13px" }}
            onFocus={e => (e.currentTarget.style.borderColor = "rgba(59,130,246,0.5)")}
            onBlur={e => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)")}
          />
        </div>

        {/* Budget */}
        <div>
          <label style={{ fontSize: "11px", fontWeight: 600, color: "#6b7494", letterSpacing: "0.06em", textTransform: "uppercase" }}>Monthly Budget</label>
          <div
            className="flex items-center gap-2 mt-1.5 px-3 h-10 rounded-xl"
            style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)" }}
          >
            <DollarSign size={13} style={{ color: "#6b7494" }} />
            <input
              type="text"
              placeholder="e.g. 500"
              value={budget}
              onChange={e => setBudget(e.target.value)}
              className="flex-1 bg-transparent outline-none"
              style={{ fontSize: "13px", color: "#e8eaf0" }}
            />
          </div>
        </div>

        {/* Icon */}
        <div>
          <label style={{ fontSize: "11px", fontWeight: 600, color: "#6b7494", letterSpacing: "0.06em", textTransform: "uppercase", display: "block", marginBottom: "8px" }}>Icon</label>
          <div className="flex flex-wrap gap-2">
            {iconOptions.map(ic => {
              const Ic = iconMap[ic] ?? DollarSign;
              return (
                <button
                  key={ic}
                  onClick={() => setIcon(ic)}
                  className="w-9 h-9 rounded-lg flex items-center justify-center transition-all"
                  style={{
                    background: icon === ic ? `${color}20` : "rgba(255,255,255,0.04)",
                    border: icon === ic ? `1px solid ${color}40` : "1px solid rgba(255,255,255,0.08)",
                  }}
                >
                  <Ic size={15} style={{ color: icon === ic ? color : "#6b7494" }} />
                </button>
              );
            })}
          </div>
        </div>

        {/* Color */}
        <div>
          <label style={{ fontSize: "11px", fontWeight: 600, color: "#6b7494", letterSpacing: "0.06em", textTransform: "uppercase", display: "block", marginBottom: "8px" }}>Color</label>
          <div className="flex gap-2">
            {colorOptions.map(c => (
              <button
                key={c}
                onClick={() => setColor(c)}
                className="w-8 h-8 rounded-full transition-transform hover:scale-110"
                style={{
                  background: c,
                  border: color === c ? "3px solid white" : "3px solid transparent",
                  boxShadow: color === c ? `0 0 12px ${c}80` : "none",
                }}
              />
            ))}
          </div>
        </div>

        <div className="flex gap-3 pt-1">
          <button onClick={onClose} className="flex-1 h-10 rounded-xl" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", color: "#8892a4", fontSize: "13px" }}>
            Cancel
          </button>
          <button
            onClick={save}
            disabled={!name.trim() || !budget}
            className="flex-1 h-10 rounded-xl flex items-center justify-center gap-2 disabled:opacity-40"
            style={{ background: "linear-gradient(135deg, #3b82f6, #2563eb)", color: "#fff", fontSize: "13px", fontWeight: 600, boxShadow: "0 4px 14px rgba(59,130,246,0.35)" }}
          >
            <Check size={14} />
            {initial?.id ? "Save Changes" : "Add Category"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Main BudgetTracker ───────────────────────────────────────────────────────

export function BudgetTracker() {
  const [categories, setCategories] = useState<Category[]>(defaultCategories);
  const [transactions, setTransactions] = useState<Transaction[]>([
    { id: "t1", categoryId: "c1", amount: 2000, note: "Monthly rent", date: "Jun 1" },
    { id: "t2", categoryId: "c2", amount: 180, note: "Weekly groceries", date: "Jun 2" },
    { id: "t3", categoryId: "c3", amount: 67, note: "Dinner with friends", date: "Jun 3" },
    { id: "t4", categoryId: "c2", amount: 95, note: "Costco run", date: "Jun 5" },
    { id: "t5", categoryId: "c4", amount: 120, note: "Gas + parking", date: "Jun 6" },
    { id: "t6", categoryId: "c5", amount: 154, note: "Electric & internet", date: "Jun 7" },
  ]);

  const [modal, setModal] = useState<{ open: boolean; category?: Category }>({ open: false });
  const [monthlyIncome, setMonthlyIncome] = useState("8500");
  const [savingsTarget, setSavingsTarget] = useState("1200");
  const [editingIncome, setEditingIncome] = useState(false);
  const [editingSavings, setEditingSavings] = useState(false);
  const incomeRef = useRef<HTMLInputElement>(null);
  const savingsRef = useRef<HTMLInputElement>(null);

  const totalBudget = categories.filter(c => c.type === "expense").reduce((s, c) => s + c.budget, 0);
  const totalSpent = categories.filter(c => c.type === "expense").reduce((s, c) => s + c.spent, 0);
  const income = parseFloat(monthlyIncome.replace(/,/g, "")) || 0;
  const target = parseFloat(savingsTarget.replace(/,/g, "")) || 0;
  const actualSaved = Math.max(0, income - totalSpent);
  const savingsPct = income > 0 ? (actualSaved / income) * 100 : 0;
  const overBudget = categories.filter(c => c.spent > c.budget);

  const addSpend = (catId: string, amount: number, note: string) => {
    setCategories(prev => prev.map(c => c.id === catId ? { ...c, spent: c.spent + amount } : c));
    setTransactions(prev => [{
      id: `t${Date.now()}`,
      categoryId: catId,
      amount,
      note: note || "—",
      date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric" }),
    }, ...prev]);
  };

  const deleteCategory = (id: string) => {
    setCategories(prev => prev.filter(c => c.id !== id));
  };

  const saveCategory = (data: Omit<Category, "id" | "spent">) => {
    if (modal.category?.id) {
      setCategories(prev => prev.map(c => c.id === modal.category!.id ? { ...c, ...data } : c));
    } else {
      setCategories(prev => [...prev, { ...data, id: `c${Date.now()}`, spent: 0 }]);
    }
    setModal({ open: false });
  };

  const glass = {
    background: "rgba(255,255,255,0.03)",
    border: "1px solid rgba(255,255,255,0.08)",
    backdropFilter: "blur(20px)",
    boxShadow: "0 4px 24px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.06)",
  } as React.CSSProperties;

  return (
    <div className="flex flex-col gap-5">

      {/* ── Header KPIs ── */}
      <div className="grid grid-cols-4 gap-4">
        {/* Monthly Income */}
        <div className="rounded-xl p-4 flex flex-col gap-2" style={glass}>
          <div className="flex items-center justify-between">
            <p style={{ fontSize: "10px", fontWeight: 600, color: "#6b7494", letterSpacing: "0.07em", textTransform: "uppercase" }}>Monthly Income</p>
            <button onClick={() => { setEditingIncome(true); setTimeout(() => incomeRef.current?.focus(), 50); }} style={{ color: "#6b7494" }}>
              <Edit2 size={11} />
            </button>
          </div>
          {editingIncome ? (
            <div className="flex items-center gap-1">
              <span style={{ fontSize: "13px", color: "#6b7494" }}>$</span>
              <input
                ref={incomeRef}
                value={monthlyIncome}
                onChange={e => setMonthlyIncome(e.target.value)}
                onBlur={() => setEditingIncome(false)}
                onKeyDown={e => e.key === "Enter" && setEditingIncome(false)}
                className="flex-1 bg-transparent outline-none font-mono"
                style={{ fontSize: "20px", fontWeight: 700, color: "#3b82f6" }}
              />
            </div>
          ) : (
            <p className="font-mono" style={{ fontSize: "22px", fontWeight: 700, color: "#e8eaf0", letterSpacing: "-0.02em" }}>
              ${parseInt(monthlyIncome.replace(/,/g, "") || "0").toLocaleString()}
            </p>
          )}
          <p style={{ fontSize: "10px", color: "#6b7494" }}>Click ✎ to update</p>
        </div>

        {/* Savings Target */}
        <div className="rounded-xl p-4 flex flex-col gap-2" style={glass}>
          <div className="flex items-center justify-between">
            <p style={{ fontSize: "10px", fontWeight: 600, color: "#6b7494", letterSpacing: "0.07em", textTransform: "uppercase" }}>Savings Target</p>
            <button onClick={() => { setEditingSavings(true); setTimeout(() => savingsRef.current?.focus(), 50); }} style={{ color: "#6b7494" }}>
              <Edit2 size={11} />
            </button>
          </div>
          {editingSavings ? (
            <div className="flex items-center gap-1">
              <span style={{ fontSize: "13px", color: "#6b7494" }}>$</span>
              <input
                ref={savingsRef}
                value={savingsTarget}
                onChange={e => setSavingsTarget(e.target.value)}
                onBlur={() => setEditingSavings(false)}
                onKeyDown={e => e.key === "Enter" && setEditingSavings(false)}
                className="flex-1 bg-transparent outline-none font-mono"
                style={{ fontSize: "20px", fontWeight: 700, color: "#f59e0b" }}
              />
            </div>
          ) : (
            <p className="font-mono" style={{ fontSize: "22px", fontWeight: 700, color: "#e8eaf0", letterSpacing: "-0.02em" }}>
              ${parseInt(savingsTarget.replace(/,/g, "") || "0").toLocaleString()}
            </p>
          )}
          <div className="flex items-center gap-1.5">
            <div className="flex-1 h-1 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.06)" }}>
              <div className="h-full rounded-full transition-all" style={{ width: `${Math.min((actualSaved / Math.max(target, 1)) * 100, 100)}%`, background: actualSaved >= target ? "#10b981" : "#f59e0b" }} />
            </div>
            <span className="font-mono" style={{ fontSize: "9px", color: actualSaved >= target ? "#10b981" : "#f59e0b" }}>
              {Math.round((actualSaved / Math.max(target, 1)) * 100)}%
            </span>
          </div>
        </div>

        {/* Total Spent */}
        <div className="rounded-xl p-4 flex flex-col gap-2" style={glass}>
          <p style={{ fontSize: "10px", fontWeight: 600, color: "#6b7494", letterSpacing: "0.07em", textTransform: "uppercase" }}>Total Spent</p>
          <p className="font-mono" style={{ fontSize: "22px", fontWeight: 700, color: "#ef4444", letterSpacing: "-0.02em" }}>
            ${totalSpent.toLocaleString()}
          </p>
          <div className="flex items-center gap-1.5">
            <TrendingDown size={10} style={{ color: "#ef4444" }} />
            <span style={{ fontSize: "10px", color: "#6b7494" }}>
              of <span className="font-mono" style={{ color: "#a0a8bc" }}>${totalBudget.toLocaleString()}</span> budgeted
            </span>
          </div>
        </div>

        {/* Actual Savings */}
        <div
          className="rounded-xl p-4 flex flex-col gap-2"
          style={{
            ...glass,
            border: actualSaved >= target ? "1px solid rgba(16,185,129,0.25)" : "1px solid rgba(255,255,255,0.08)",
            background: actualSaved >= target ? "rgba(16,185,129,0.05)" : "rgba(255,255,255,0.03)",
          }}
        >
          <div className="flex items-center justify-between">
            <p style={{ fontSize: "10px", fontWeight: 600, color: "#6b7494", letterSpacing: "0.07em", textTransform: "uppercase" }}>Actual Saved</p>
            {actualSaved >= target && <span style={{ fontSize: "9px", fontWeight: 600, color: "#10b981", background: "rgba(16,185,129,0.12)", padding: "2px 6px", borderRadius: "4px", border: "1px solid rgba(16,185,129,0.2)" }}>ON TRACK</span>}
          </div>
          <p className="font-mono" style={{ fontSize: "22px", fontWeight: 700, color: actualSaved >= target ? "#10b981" : "#e8eaf0", letterSpacing: "-0.02em" }}>
            ${actualSaved.toLocaleString()}
          </p>
          <div className="flex items-center gap-1.5">
            <PiggyBank size={10} style={{ color: actualSaved >= target ? "#10b981" : "#6b7494" }} />
            <span style={{ fontSize: "10px", color: "#6b7494" }}>
              <span className="font-mono" style={{ color: actualSaved >= target ? "#10b981" : "#a0a8bc" }}>{savingsPct.toFixed(1)}%</span> of income
            </span>
          </div>
        </div>
      </div>

      {/* ── Savings bar ── */}
      <div className="rounded-xl p-5" style={glass}>
        <div className="flex items-center justify-between mb-4">
          <div>
            <p style={{ fontSize: "11px", fontWeight: 500, color: "#6b7494", letterSpacing: "0.05em", textTransform: "uppercase" }}>Income Breakdown</p>
            <p style={{ fontSize: "13px", color: "#e8eaf0", marginTop: "2px" }}>
              <span className="font-mono" style={{ color: "#ef4444" }}>${totalSpent.toLocaleString()}</span> spent ·{" "}
              <span className="font-mono" style={{ color: "#10b981" }}>${actualSaved.toLocaleString()}</span> saved ·{" "}
              <span className="font-mono" style={{ color: "#f59e0b" }}>${target.toLocaleString()}</span> target
            </p>
          </div>
          {overBudget.length > 0 && (
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg" style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)" }}>
              <AlertTriangle size={12} style={{ color: "#ef4444" }} />
              <span style={{ fontSize: "11px", fontWeight: 600, color: "#ef4444" }}>
                {overBudget.length} over budget
              </span>
            </div>
          )}
        </div>
        <SvgSavingsBar income={income} expenses={totalSpent} target={target} />

        {/* Legend */}
        <div className="flex gap-5 mt-3">
          {[
            { color: "rgba(239,68,68,0.5)", label: "Expenses" },
            { color: "#10b981", label: "Savings" },
            { color: "#f59e0b", label: "Target", dash: true },
          ].map(l => (
            <div key={l.label} className="flex items-center gap-1.5">
              {l.dash ? (
                <div className="w-4 h-0 border-t-2 border-dashed" style={{ borderColor: l.color }} />
              ) : (
                <div className="w-3 h-2 rounded-sm" style={{ background: l.color }} />
              )}
              <span style={{ fontSize: "10px", color: "#6b7494" }}>{l.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Categories grid + recent ── */}
      <div className="grid gap-4" style={{ gridTemplateColumns: "1fr 300px" }}>
        {/* Categories */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 style={{ fontSize: "13px", fontWeight: 600, color: "#e8eaf0" }}>Budget Categories</h3>
              <p style={{ fontSize: "11px", color: "#6b7494", marginTop: "1px" }}>{categories.length} categories · ${totalBudget.toLocaleString()} total budget</p>
            </div>
            <button
              onClick={() => setModal({ open: true })}
              className="flex items-center gap-1.5 px-3 h-8 rounded-lg transition-all hover:brightness-110"
              style={{ background: "linear-gradient(135deg, #3b82f6, #2563eb)", boxShadow: "0 2px 10px rgba(59,130,246,0.3)", color: "#fff", fontSize: "12px", fontWeight: 600 }}
            >
              <Plus size={13} /> New Category
            </button>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {categories.map(cat => (
              <CategoryCard
                key={cat.id}
                cat={cat}
                onEdit={c => setModal({ open: true, category: c })}
                onDelete={deleteCategory}
                onAddSpend={addSpend}
              />
            ))}
          </div>
        </div>

        {/* Right: Recent transactions + summary */}
        <div className="flex flex-col gap-4">
          {/* Budget health */}
          <div className="rounded-xl p-4 flex flex-col gap-3" style={glass}>
            <p style={{ fontSize: "11px", fontWeight: 500, color: "#6b7494", letterSpacing: "0.05em", textTransform: "uppercase" }}>Budget Health</p>
            <div className="flex flex-col gap-2.5">
              {[
                { label: "On Budget", count: categories.filter(c => c.spent / c.budget <= 0.8).length, color: "#10b981" },
                { label: "Near Limit", count: categories.filter(c => c.spent / c.budget > 0.8 && c.spent <= c.budget).length, color: "#f59e0b" },
                { label: "Over Budget", count: overBudget.length, color: "#ef4444" },
              ].map(({ label, count, color }) => (
                <div key={label} className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full shrink-0" style={{ background: color }} />
                  <span style={{ fontSize: "12px", color: "#a0a8bc", flex: 1 }}>{label}</span>
                  <span className="font-mono" style={{ fontSize: "13px", fontWeight: 700, color }}>{count}</span>
                </div>
              ))}
            </div>
            <div className="h-px" style={{ background: "rgba(255,255,255,0.06)" }} />
            <div className="flex items-center justify-between">
              <span style={{ fontSize: "11px", color: "#6b7494" }}>Budget utilization</span>
              <span className="font-mono" style={{ fontSize: "12px", fontWeight: 600, color: totalBudget > 0 ? (totalSpent / totalBudget > 1 ? "#ef4444" : "#e8eaf0") : "#6b7494" }}>
                {totalBudget > 0 ? ((totalSpent / totalBudget) * 100).toFixed(1) : "0"}%
              </span>
            </div>
            <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.06)" }}>
              <div
                className="h-full rounded-full transition-all"
                style={{
                  width: `${Math.min((totalSpent / Math.max(totalBudget, 1)) * 100, 100)}%`,
                  background: totalSpent / totalBudget > 1 ? "#ef4444" : totalSpent / totalBudget > 0.85 ? "#f59e0b" : "#10b981",
                }}
              />
            </div>
          </div>

          {/* Recent transactions */}
          <div className="rounded-xl overflow-hidden flex flex-col" style={glass}>
            <div className="px-4 py-3.5 flex items-center justify-between" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
              <p style={{ fontSize: "11px", fontWeight: 500, color: "#6b7494", letterSpacing: "0.05em", textTransform: "uppercase" }}>Recent Expenses</p>
              <span style={{ fontSize: "10px", color: "#6b7494" }}>{transactions.length} entries</span>
            </div>
            <div className="overflow-y-auto" style={{ maxHeight: "320px" }}>
              {transactions.slice(0, 12).map((tx, i) => {
                const cat = categories.find(c => c.id === tx.categoryId);
                if (!cat) return null;
                const Icon = iconMap[cat.icon] ?? DollarSign;
                return (
                  <div
                    key={tx.id}
                    className="flex items-center gap-3 px-4 py-2.5 transition-colors hover:bg-white/[0.02]"
                    style={{ borderBottom: i < Math.min(transactions.length, 12) - 1 ? "1px solid rgba(255,255,255,0.04)" : "none" }}
                  >
                    <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0" style={{ background: `${cat.color}15` }}>
                      <Icon size={12} style={{ color: cat.color }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p style={{ fontSize: "11px", fontWeight: 500, color: "#e8eaf0" }} className="truncate">{tx.note}</p>
                      <p style={{ fontSize: "10px", color: "#6b7494" }}>{cat.name} · {tx.date}</p>
                    </div>
                    <span className="font-mono" style={{ fontSize: "12px", fontWeight: 600, color: "#ef4444", flexShrink: 0 }}>
                      −${tx.amount.toLocaleString()}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Modal */}
      {modal.open && (
        <CategoryModal
          initial={modal.category}
          onSave={saveCategory}
          onClose={() => setModal({ open: false })}
        />
      )}

      <style>{`input::placeholder { color: #6b7494; }`}</style>
    </div>
  );
}
