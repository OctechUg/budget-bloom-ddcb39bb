import { useState } from "react";
import { BottomNavigation } from "@/components/BottomNavigation";
import { SetBudgetModal } from "@/components/SetBudgetModal";
import { Button } from "@/components/ui/button";
import {
  Utensils, Car, Book, ShoppingBag, Gamepad2, Lightbulb,
  Phone, Plus, TrendingUp, TrendingDown, AlertTriangle,
  AlertCircle, ChevronRight, Search, X, Edit2, Trash2,
  CalendarDays, Info,
} from "lucide-react";
import {
  LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, Tooltip, ResponsiveContainer,
} from "recharts";

// ─── types ───────────────────────────────────────────────────────────────────
interface Category {
  id: string;
  category: string;
  icon: React.ReactNode;
  spent: number;
  budget: number;
}

interface Tx {
  id: string;
  categoryId: string;
  vendor: string;
  date: string;
  amount: number;
}

// ─── mock data ────────────────────────────────────────────────────────────────
const initialCategories: Category[] = [
  { id: "food",    category: "Food & Dining",   icon: <Utensils className="h-4 w-4" />, spent: 145000, budget: 200000 },
  { id: "trans",   category: "Transport",        icon: <Car      className="h-4 w-4" />, spent: 80000,  budget: 80000  },
  { id: "books",   category: "Books & Supplies", icon: <Book     className="h-4 w-4" />, spent: 35000,  budget: 100000 },
  { id: "shop",    category: "Shopping",         icon: <ShoppingBag className="h-4 w-4" />, spent: 120000, budget: 150000 },
  { id: "enter",   category: "Entertainment",    icon: <Gamepad2 className="h-4 w-4" />, spent: 25000,  budget: 50000  },
  { id: "util",    category: "Utilities",        icon: <Lightbulb className="h-4 w-4" />, spent: 20000,  budget: 30000  },
  { id: "airtime", category: "Airtime & Data",   icon: <Phone    className="h-4 w-4" />, spent: 40000,  budget: 60000  },
];

const mockTransactions: Tx[] = [
  { id:"t1", categoryId:"food",    vendor:"Cafe Java",         date:"19 Feb", amount:18000 },
  { id:"t2", categoryId:"food",    vendor:"Cafeteria – MAK",   date:"18 Feb", amount:12000 },
  { id:"t3", categoryId:"food",    vendor:"Nandos",            date:"17 Feb", amount:35000 },
  { id:"t4", categoryId:"trans",   vendor:"SafeBoda",          date:"19 Feb", amount:8000  },
  { id:"t5", categoryId:"trans",   vendor:"UMA Bus",           date:"18 Feb", amount:4500  },
  { id:"t6", categoryId:"books",   vendor:"Aristoc Booklex",   date:"15 Feb", amount:22000 },
  { id:"t7", categoryId:"shop",    vendor:"Shoprite",          date:"16 Feb", amount:55000 },
  { id:"t8", categoryId:"shop",    vendor:"Quality Supermarket",date:"14 Feb",amount:38000 },
  { id:"t9", categoryId:"enter",   vendor:"Netflix",           date:"12 Feb", amount:15000 },
  { id:"t10",categoryId:"util",    vendor:"UMEME",             date:"10 Feb", amount:20000 },
  { id:"t11",categoryId:"airtime", vendor:"MTN MoMo",          date:"19 Feb", amount:20000 },
  { id:"t12",categoryId:"airtime", vendor:"Airtel",            date:"13 Feb", amount:10000 },
];

const trendData = [
  { week: "W1", spent: 95000  },
  { week: "W2", spent: 142000 },
  { week: "W3", spent: 118000 },
  { week: "W4", spent: 110000 },
];

const GREY_PALETTE = ["#9ca3af","#6b7280","#4b5563","#374151","#1f2937","#111827","#e5e7eb"];

// ─── helpers ──────────────────────────────────────────────────────────────────
const fmt = (v: number) =>
  new Intl.NumberFormat("en-UG", {
    style: "currency", currency: "UGX",
    minimumFractionDigits: 0, maximumFractionDigits: 0,
  }).format(Math.abs(v));

type Status = "safe" | "warning" | "critical" | "over";
function getStatus(pct: number): Status {
  if (pct >= 100) return "over";
  if (pct >= 90)  return "critical";
  if (pct >= 75)  return "warning";
  return "safe";
}

const statusLabel: Record<Status, string> = {
  safe: "Safe", warning: "Warning", critical: "Critical", over: "Over",
};
const statusDot: Record<Status, string> = {
  safe: "bg-muted-foreground/40",
  warning: "bg-muted-foreground/70",
  critical: "bg-foreground/60",
  over: "bg-foreground",
};
const statusText: Record<Status, string> = {
  safe: "text-muted-foreground",
  warning: "text-muted-foreground",
  critical: "text-foreground",
  over: "text-foreground font-semibold",
};
const barColor: Record<Status, string> = {
  safe: "bg-muted-foreground/50",
  warning: "bg-muted-foreground/70",
  critical: "bg-foreground/60",
  over: "bg-foreground",
};

// ─── sub-components ──────────────────────────────────────────────────────────

function StatusPill({ status }: { status: Status }) {
  return (
    <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full border border-border/60 text-[10px] font-medium ${statusText[status]}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${statusDot[status]}`} />
      {statusLabel[status]}
    </span>
  );
}

function ProgressBar({ pct, status }: { pct: number; status: Status }) {
  return (
    <div className="relative h-1.5 bg-muted rounded-full overflow-hidden">
      <div
        className={`absolute left-0 top-0 h-full rounded-full transition-all duration-500 ${barColor[status]}`}
        style={{ width: `${Math.min(pct, 100)}%` }}
      />
    </div>
  );
}

function CategoryCard({
  cat,
  onSelect,
  onEdit,
  onDelete,
}: {
  cat: Category;
  onSelect: () => void;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const pct = Math.min((cat.spent / cat.budget) * 100, 100);
  const remaining = cat.budget - cat.spent;
  const status = getStatus((cat.spent / cat.budget) * 100);

  return (
    <div className="glass-card rounded-2xl p-4 space-y-3">
      {/* header */}
      <div className="flex items-start justify-between">
        <button onClick={onSelect} className="flex items-center gap-3 flex-1 text-left group">
          <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center text-muted-foreground shrink-0">
            {cat.icon}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-foreground truncate group-hover:text-foreground/80">
              {cat.category}
            </p>
            <p className="text-[11px] text-muted-foreground">
              {fmt(cat.spent)} <span className="opacity-60">of</span> {fmt(cat.budget)}
            </p>
          </div>
        </button>
        <div className="flex items-center gap-1 ml-2 shrink-0">
          <StatusPill status={status} />
          <button onClick={onEdit} className="p-1.5 rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-foreground">
            <Edit2 className="h-3.5 w-3.5" />
          </button>
          <button onClick={onDelete} className="p-1.5 rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-foreground">
            <Trash2 className="h-3.5 w-3.5" />
          </button>
          <ChevronRight className="h-3.5 w-3.5 text-muted-foreground/50" />
        </div>
      </div>

      {/* progress */}
      <ProgressBar pct={pct} status={status} />

      {/* footer */}
      <div className="flex justify-between text-[11px]">
        <span className="text-muted-foreground">{pct.toFixed(0)}% used</span>
        <span className={statusText[status]}>
          {remaining < 0 ? `Over by ${fmt(Math.abs(remaining))}` : `${fmt(remaining)} left`}
        </span>
      </div>
    </div>
  );
}

function TxDrillDown({
  cat,
  onClose,
}: {
  cat: Category;
  onClose: () => void;
}) {
  const [search, setSearch] = useState("");
  const txs = mockTransactions
    .filter(t => t.categoryId === cat.id)
    .filter(t => t.vendor.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="glass-card rounded-2xl p-4 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-muted flex items-center justify-center text-muted-foreground">
            {cat.icon}
          </div>
          <h3 className="text-sm font-semibold text-foreground">{cat.category}</h3>
        </div>
        <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-muted transition-colors text-muted-foreground">
          <X className="h-4 w-4" />
        </button>
      </div>

      {/* search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search transactions…"
          className="w-full pl-8 pr-3 py-2 text-xs bg-muted border border-border/60 rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-border"
        />
      </div>

      {/* tx list */}
      <div className="space-y-2">
        {txs.length === 0 && (
          <p className="text-xs text-muted-foreground text-center py-4">No transactions found.</p>
        )}
        {txs.map(tx => (
          <div key={tx.id} className="flex items-center justify-between py-2 border-b border-border/40 last:border-0">
            <div>
              <p className="text-xs font-medium text-foreground">{tx.vendor}</p>
              <p className="text-[11px] text-muted-foreground flex items-center gap-1">
                <CalendarDays className="h-2.5 w-2.5" /> {tx.date}
              </p>
            </div>
            <span className="text-xs font-semibold text-foreground">−{fmt(tx.amount)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── alerts ───────────────────────────────────────────────────────────────────
function SmartAlerts({ categories }: { categories: Category[] }) {
  const alerts: { id: string; level: "warn" | "crit" | "over"; text: string }[] = [];
  categories.forEach(c => {
    const pct = (c.spent / c.budget) * 100;
    if (pct >= 100) alerts.push({ id: c.id, level: "over",  text: `${c.category} is over budget.` });
    else if (pct >= 90) alerts.push({ id: c.id, level: "crit", text: `${c.category} is at ${pct.toFixed(0)}% — critical.` });
    else if (pct >= 75) alerts.push({ id: c.id, level: "warn", text: `${c.category} has reached ${pct.toFixed(0)}% — nearing limit.` });
  });
  if (alerts.length === 0) return null;

  const icon = { warn: <AlertTriangle className="h-3.5 w-3.5" />, crit: <AlertCircle className="h-3.5 w-3.5" />, over: <AlertCircle className="h-3.5 w-3.5" /> };
  const border = { warn: "border-muted-foreground/30", crit: "border-muted-foreground/60", over: "border-foreground/60" };

  return (
    <div className="space-y-2">
      {alerts.map(a => (
        <div key={a.id} className={`flex items-start gap-2.5 p-3 rounded-xl border bg-muted/40 ${border[a.level]}`}>
          <span className="text-muted-foreground mt-0.5 shrink-0">{icon[a.level]}</span>
          <p className="text-[11px] text-muted-foreground">{a.text}</p>
        </div>
      ))}
    </div>
  );
}

// ─── main page ────────────────────────────────────────────────────────────────
export default function Budget() {
  const [categories, setCategories] = useState<Category[]>(initialCategories);
  const [budgetModalOpen, setBudgetModalOpen] = useState(false);
  const [selectedCat, setSelectedCat] = useState<Category | null>(null);

  const totalBudget = categories.reduce((s, c) => s + c.budget, 0);
  const totalSpent  = categories.reduce((s, c) => s + c.spent,  0);
  const remaining   = totalBudget - totalSpent;
  const overallPct  = (totalSpent / totalBudget) * 100;
  const overallStatus = getStatus(overallPct);

  // daily suggestion (30-day month)
  const daysLeft = 9; // mock: 9 days left in month
  const dailySuggestion = remaining > 0 ? Math.floor(remaining / daysLeft) : 0;

  const smartInsight =
    overallPct < 60 ? "You are within safe spending range."
    : overallPct < 80 ? "Spending is moderate — stay on track."
    : overallPct < 100 ? "You are approaching your monthly limit."
    : "Monthly budget exceeded. Review spending.";

  const pieData = categories.map(c => ({ name: c.category, value: c.spent }));

  const handleDelete = (id: string) => setCategories(cats => cats.filter(c => c.id !== id));

  return (
    <div className="min-h-screen gradient-bg pb-28">
      {/* ── header ── */}
      <header className="px-4 pt-12 pb-4 max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-xl font-bold text-foreground tracking-tight">Budget Management</h1>
            <p className="text-xs text-muted-foreground mt-0.5">February 2026</p>
          </div>
          <Button size="sm" onClick={() => setBudgetModalOpen(true)} className="gap-1.5">
            <Plus className="h-3.5 w-3.5" />
            New Category
          </Button>
        </div>

        {/* ── overview card ── */}
        <div className="glass-card rounded-2xl p-5 space-y-4">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-[11px] text-muted-foreground uppercase tracking-widest font-medium">Monthly Budget</p>
              <p className="text-3xl font-bold text-foreground mt-1 tabular-nums">{fmt(totalSpent)}</p>
              <p className="text-xs text-muted-foreground mt-0.5">of {fmt(totalBudget)} total</p>
            </div>
            <div className="text-right">
              <p className="text-[11px] text-muted-foreground uppercase tracking-widest font-medium">Remaining</p>
              <p className={`text-xl font-bold mt-1 tabular-nums ${remaining < 0 ? "text-foreground" : "text-foreground"}`}>
                {remaining < 0 ? "-" : ""}{fmt(remaining)}
              </p>
              <StatusPill status={overallStatus} />
            </div>
          </div>

          {/* overall bar */}
          <div className="space-y-1.5">
            <ProgressBar pct={overallPct} status={overallStatus} />
            <div className="flex justify-between text-[11px] text-muted-foreground">
              <span>{overallPct.toFixed(1)}% used</span>
              <span>{(100 - overallPct).toFixed(1)}% remaining</span>
            </div>
          </div>

          {/* smart insight */}
          <div className="flex items-start gap-2 pt-1 border-t border-border/40">
            <Info className="h-3.5 w-3.5 text-muted-foreground shrink-0 mt-0.5" />
            <p className="text-[11px] text-muted-foreground">{smartInsight}</p>
          </div>
        </div>
      </header>

      <main className="px-4 max-w-5xl mx-auto space-y-6">

        {/* ── smart alerts ── */}
        <SmartAlerts categories={categories} />

        {/* ── daily suggestion ── */}
        <div className="glass-card rounded-2xl p-4 flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-muted flex items-center justify-center text-muted-foreground shrink-0">
            <CalendarDays className="h-4 w-4" />
          </div>
          <div>
            <p className="text-xs font-semibold text-foreground">Daily Spending Suggestion</p>
            <p className="text-[11px] text-muted-foreground mt-0.5">
              You have{" "}
              <span className="text-foreground font-semibold">{fmt(dailySuggestion)}</span>{" "}
              left for today based on your remaining budget and {daysLeft} days left.
            </p>
          </div>
        </div>

        {/* ── spending trends ── */}
        <section>
          <h2 className="text-[11px] font-semibold text-muted-foreground uppercase tracking-widest mb-3">
            Spending Trends
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* line chart */}
            <div className="glass-card rounded-2xl p-4 space-y-2">
              <div className="flex items-center gap-1.5">
                <TrendingUp className="h-3.5 w-3.5 text-muted-foreground" />
                <p className="text-xs font-semibold text-foreground">Monthly Trend</p>
              </div>
              <p className="text-[10px] text-muted-foreground">Weekly spending this month</p>
              <div className="h-28">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={trendData} margin={{ top: 4, right: 4, left: -24, bottom: 0 }}>
                    <XAxis dataKey="week" tick={{ fontSize: 10, fill: "hsl(155 15% 55%)" }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 10, fill: "hsl(155 15% 55%)" }} axisLine={false} tickLine={false}
                      tickFormatter={v => `${(v/1000).toFixed(0)}k`} />
                    <Tooltip
                      contentStyle={{ background: "hsl(155 35% 10%)", border: "1px solid hsl(155 30% 18%)", borderRadius: 8, fontSize: 11 }}
                      formatter={(v: number) => [`UGX ${v.toLocaleString()}`, "Spent"]}
                    />
                    <Line type="monotone" dataKey="spent" stroke="hsl(155 15% 55%)" strokeWidth={2} dot={{ r: 3, fill: "hsl(155 15% 55%)" }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* pie chart */}
            <div className="glass-card rounded-2xl p-4 space-y-2">
              <div className="flex items-center gap-1.5">
                <TrendingDown className="h-3.5 w-3.5 text-muted-foreground" />
                <p className="text-xs font-semibold text-foreground">By Category</p>
              </div>
              <p className="text-[10px] text-muted-foreground">Spending distribution</p>
              <div className="flex items-center gap-3">
                <div className="h-28 flex-1">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={pieData} dataKey="value" cx="50%" cy="50%" innerRadius={30} outerRadius={50} strokeWidth={0}>
                        {pieData.map((_, i) => (
                          <Cell key={i} fill={GREY_PALETTE[i % GREY_PALETTE.length]} />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{ background: "hsl(155 35% 10%)", border: "1px solid hsl(155 30% 18%)", borderRadius: 8, fontSize: 11 }}
                        formatter={(v: number) => [`UGX ${v.toLocaleString()}`, ""]}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="space-y-1 text-[10px] text-muted-foreground">
                  {categories.slice(0, 4).map((c, i) => (
                    <div key={c.id} className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-sm shrink-0" style={{ background: GREY_PALETTE[i] }} />
                      <span className="truncate max-w-[80px]">{c.category.split(" ")[0]}</span>
                    </div>
                  ))}
                  {categories.length > 4 && (
                    <p className="text-muted-foreground/60">+{categories.length - 4} more</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── categories ── */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-[11px] font-semibold text-muted-foreground uppercase tracking-widest">
              Categories
            </h2>
            <span className="text-[11px] text-muted-foreground">{categories.length} total</span>
          </div>

          <div className="space-y-3">
            {categories.map(cat => (
              <div key={cat.id}>
                <CategoryCard
                  cat={cat}
                  onSelect={() => setSelectedCat(selectedCat?.id === cat.id ? null : cat)}
                  onEdit={() => setBudgetModalOpen(true)}
                  onDelete={() => handleDelete(cat.id)}
                />
                {/* drill-down inline */}
                {selectedCat?.id === cat.id && (
                  <div className="mt-2">
                    <TxDrillDown cat={cat} onClose={() => setSelectedCat(null)} />
                  </div>
                )}
              </div>
            ))}

            {/* add category shortcut */}
            <button
              onClick={() => setBudgetModalOpen(true)}
              className="w-full glass-card rounded-2xl p-4 border-dashed border-border/60 flex items-center justify-center gap-2 text-muted-foreground hover:text-foreground hover:border-border transition-all duration-200 text-xs font-medium"
            >
              <Plus className="h-4 w-4" />
              Add New Category
            </button>
          </div>
        </section>

      </main>

      <SetBudgetModal open={budgetModalOpen} onOpenChange={setBudgetModalOpen} />
      <BottomNavigation />
    </div>
  );
}
