import { useState } from "react";
import { BottomNavigation } from "@/components/BottomNavigation";
import { PullToRefresh } from "@/components/PullToRefresh";
import { SetBudgetModal } from "@/components/SetBudgetModal";
import { SpendModal } from "@/components/SpendModal";
import { Button } from "@/components/ui/button";
import { useWallet } from "@/hooks/useWallet";
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

const iconMap: Record<string, React.ReactNode> = {
  utensils: <Utensils className="h-4 w-4" />,
  car: <Car className="h-4 w-4" />,
  book: <Book className="h-4 w-4" />,
  "shopping-bag": <ShoppingBag className="h-4 w-4" />,
  "gamepad-2": <Gamepad2 className="h-4 w-4" />,
  lightbulb: <Lightbulb className="h-4 w-4" />,
  phone: <Phone className="h-4 w-4" />,
};

interface Category {
  id: string;
  category: string;
  icon: React.ReactNode;
  spent: number;
  budget: number;
}

const GREY_PALETTE = ["#9ca3af","#6b7280","#4b5563","#374151","#1f2937","#111827","#e5e7eb"];

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

const statusLabel: Record<Status, string> = { safe: "Safe", warning: "Warning", critical: "Critical", over: "Over" };
const statusDot: Record<Status, string> = { safe: "bg-muted-foreground/40", warning: "bg-muted-foreground/70", critical: "bg-foreground/60", over: "bg-foreground" };
const statusText: Record<Status, string> = { safe: "text-muted-foreground", warning: "text-muted-foreground", critical: "text-foreground", over: "text-foreground font-semibold" };
const barColor: Record<Status, string> = { safe: "bg-muted-foreground/50", warning: "bg-muted-foreground/70", critical: "bg-foreground/60", over: "bg-foreground" };

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
      <div className={`absolute left-0 top-0 h-full rounded-full transition-all duration-500 ${barColor[status]}`} style={{ width: `${Math.min(pct, 100)}%` }} />
    </div>
  );
}

function CategoryCard({ cat, onSelect, onEdit, onDelete, onSpend }: { cat: Category; onSelect: () => void; onEdit: () => void; onDelete: () => void; onSpend: () => void }) {
  const pct = cat.budget > 0 ? Math.min((cat.spent / cat.budget) * 100, 100) : 0;
  const remaining = cat.budget - cat.spent;
  const status = cat.budget > 0 ? getStatus((cat.spent / cat.budget) * 100) : "safe";

  return (
    <div className="glass-card rounded-2xl p-4 space-y-3">
      <div className="flex items-start justify-between">
        <button onClick={onSelect} className="flex items-center gap-3 flex-1 text-left group">
          <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center text-muted-foreground shrink-0">{cat.icon}</div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-foreground truncate group-hover:text-foreground/80">{cat.category}</p>
            <p className="text-[11px] text-muted-foreground">{fmt(cat.spent)} <span className="opacity-60">of</span> {fmt(cat.budget)}</p>
          </div>
        </button>
        <div className="flex items-center gap-1 ml-2 shrink-0">
          <StatusPill status={status} />
          <button onClick={onEdit} className="p-1.5 rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"><Edit2 className="h-3.5 w-3.5" /></button>
          <button onClick={onDelete} className="p-1.5 rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"><Trash2 className="h-3.5 w-3.5" /></button>
          <ChevronRight className="h-3.5 w-3.5 text-muted-foreground/50" />
        </div>
      </div>
      <ProgressBar pct={pct} status={status} />
      <div className="flex justify-between items-center text-[11px]">
        <span className="text-muted-foreground">{pct.toFixed(0)}% used</span>
        <div className="flex items-center gap-2">
          <span className={statusText[status]}>{remaining < 0 ? `Over by ${fmt(Math.abs(remaining))}` : `${fmt(remaining)} left`}</span>
          {remaining > 0 && (
            <button onClick={onSpend} className="px-2.5 py-1 rounded-lg bg-primary/15 text-primary text-[11px] font-semibold hover:bg-primary/25 transition-colors">
              Spend
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function SmartAlerts({ categories }: { categories: Category[] }) {
  const alerts: { id: string; level: "warn" | "crit" | "over"; text: string }[] = [];
  categories.forEach(c => {
    if (c.budget <= 0) return;
    const pct = (c.spent / c.budget) * 100;
    if (pct >= 100) alerts.push({ id: c.id, level: "over", text: `${c.category} is over budget.` });
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

export default function Budget() {
  const { budgets, setBudget, deleteBudget, spendFromBudget, transactions } = useWallet();
  const [budgetModalOpen, setBudgetModalOpen] = useState(false);
  const [selectedCat, setSelectedCat] = useState<Category | null>(null);
  const [spendCat, setSpendCat] = useState<{ id: string; name: string; remaining: number } | null>(null);

  const categories: Category[] = budgets.map(b => ({
    id: b.id,
    category: b.name,
    icon: iconMap[b.icon] || <Utensils className="h-4 w-4" />,
    spent: b.spentAmount,
    budget: b.allocatedAmount,
  }));

  const totalBudget = categories.reduce((s, c) => s + c.budget, 0);
  const totalSpent = categories.reduce((s, c) => s + c.spent, 0);
  const remaining = totalBudget - totalSpent;
  const overallPct = totalBudget > 0 ? (totalSpent / totalBudget) * 100 : 0;
  const overallStatus = getStatus(overallPct);

  const currentMonth = new Date().toLocaleString("default", { month: "long", year: "numeric" });
  const daysInMonth = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).getDate();
  const dayOfMonth = new Date().getDate();
  const daysLeft = daysInMonth - dayOfMonth;
  const dailySuggestion = remaining > 0 && daysLeft > 0 ? Math.floor(remaining / daysLeft) : 0;

  const smartInsight =
    totalBudget === 0 ? "Set your first budget to start tracking."
    : overallPct < 60 ? "You are within safe spending range."
    : overallPct < 80 ? "Spending is moderate — stay on track."
    : overallPct < 100 ? "You are approaching your monthly limit."
    : "Monthly budget exceeded. Review spending.";

  const pieData = categories.map(c => ({ name: c.category, value: c.spent }));

  const handleDelete = async (id: string) => {
    try {
      await deleteBudget(id);
    } catch (e) { /* handled by hook */ }
  };

  return (
    <div className="min-h-screen gradient-bg pb-28">
      <header className="px-4 pt-12 pb-4 max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-xl font-bold text-foreground tracking-tight">Budgeting</h1>
            <p className="text-xs text-muted-foreground mt-0.5">{currentMonth}</p>
          </div>
          <Button size="sm" onClick={() => setBudgetModalOpen(true)} className="gap-1.5">
            <Plus className="h-3.5 w-3.5" /> New Category
          </Button>
        </div>

        <div className="glass-card rounded-2xl p-5 space-y-4">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-[11px] text-muted-foreground uppercase tracking-widest font-medium">Monthly Budget</p>
              <p className="text-3xl font-bold text-foreground mt-1 tabular-nums">{fmt(totalSpent)}</p>
              <p className="text-xs text-muted-foreground mt-0.5">of {fmt(totalBudget)} total</p>
            </div>
            <div className="text-right">
              <p className="text-[11px] text-muted-foreground uppercase tracking-widest font-medium">Remaining</p>
              <p className="text-xl font-bold mt-1 tabular-nums text-foreground">{remaining < 0 ? "−" : ""}{fmt(remaining)}</p>
              <StatusPill status={overallStatus} />
            </div>
          </div>
          <div className="space-y-1.5">
            <ProgressBar pct={overallPct} status={overallStatus} />
            <div className="flex justify-between text-[11px] text-muted-foreground">
              <span>{overallPct.toFixed(1)}% used</span>
              <span>{Math.max(100 - overallPct, 0).toFixed(1)}% remaining</span>
            </div>
          </div>
          <div className="flex items-start gap-2 pt-1 border-t border-border/40">
            <Info className="h-3.5 w-3.5 text-muted-foreground shrink-0 mt-0.5" />
            <p className="text-[11px] text-muted-foreground">{smartInsight}</p>
          </div>
        </div>
      </header>

      <main className="px-4 max-w-5xl mx-auto space-y-6">
        <SmartAlerts categories={categories} />

        {totalBudget > 0 && (
          <div className="glass-card rounded-2xl p-4 flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-muted flex items-center justify-center text-muted-foreground shrink-0">
              <CalendarDays className="h-4 w-4" />
            </div>
            <div>
              <p className="text-xs font-semibold text-foreground">Daily Spending Suggestion</p>
              <p className="text-[11px] text-muted-foreground mt-0.5">
                You have <span className="text-foreground font-semibold">{fmt(dailySuggestion)}</span> left for today based on your remaining budget and {daysLeft} days left.
              </p>
            </div>
          </div>
        )}

        <section>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-[11px] font-semibold text-muted-foreground uppercase tracking-widest">Categories</h2>
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
                  onSpend={() => setSpendCat({ id: cat.id, name: cat.category, remaining: cat.budget - cat.spent })}
                />
              </div>
            ))}
            <button
              onClick={() => setBudgetModalOpen(true)}
              className="w-full glass-card rounded-2xl p-4 border-dashed border-border/60 flex items-center justify-center gap-2 text-muted-foreground hover:text-foreground hover:border-border transition-all duration-200 text-xs font-medium"
            >
              <Plus className="h-4 w-4" /> Add New Category
            </button>
          </div>
        </section>

        {categories.length > 0 && (
          <section>
            <h2 className="text-[11px] font-semibold text-muted-foreground uppercase tracking-widest mb-3">Spending Trends</h2>
            <div className="glass-card rounded-2xl p-4 space-y-2">
              <div className="flex items-center gap-1.5">
                <TrendingDown className="h-3.5 w-3.5 text-muted-foreground" />
                <p className="text-xs font-semibold text-foreground">By Category</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="h-28 flex-1">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={pieData} dataKey="value" cx="50%" cy="50%" innerRadius={30} outerRadius={50} strokeWidth={0}>
                        {pieData.map((_, i) => (<Cell key={i} fill={GREY_PALETTE[i % GREY_PALETTE.length]} />))}
                      </Pie>
                      <Tooltip contentStyle={{ background: "hsl(155 35% 10%)", border: "1px solid hsl(155 30% 18%)", borderRadius: 8, fontSize: 11 }} formatter={(v: number) => [`UGX ${v.toLocaleString()}`, ""]} />
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
                  {categories.length > 4 && <p className="text-muted-foreground/60">+{categories.length - 4} more</p>}
                </div>
              </div>
            </div>
          </section>
        )}
      </main>

      <SetBudgetModal open={budgetModalOpen} onOpenChange={setBudgetModalOpen} onSetBudget={setBudget} />
      {spendCat && (
        <SpendModal
          open={!!spendCat}
          onOpenChange={(open) => { if (!open) setSpendCat(null); }}
          categoryId={spendCat.id}
          categoryName={spendCat.name}
          remaining={spendCat.remaining}
          onSpend={spendFromBudget}
        />
      )}
      <BottomNavigation />
    </div>
  );
}
