import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { BottomNavigation } from "@/components/BottomNavigation";
import { PullToRefresh } from "@/components/PullToRefresh";
import { useWallet } from "@/hooks/useWallet";
import { useToast } from "@/hooks/use-toast";
import {
  PiggyBank,
  Lock,
  Unlock,
  Clock,
  TrendingUp,
  ChevronLeft,
  Plus,
  Minus,
  CalendarPlus,
  ShieldCheck,
  ArrowDownToLine,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

export default function Savings() {
  const navigate = useNavigate();
  const { wallet, transactions, updateSavingsRate, extendSavingsLock, refetch } = useWallet();
  const { toast } = useToast();
  const [extendOpen, setExtendOpen] = useState(false);
  const [rateOpen, setRateOpen] = useState(false);
  const [selectedMonths, setSelectedMonths] = useState(1);
  const [newRate, setNewRate] = useState(wallet.savingsRate);
  const [loading, setLoading] = useState(false);

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat("en-UG", { style: "currency", currency: "UGX", minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(value);

  const now = new Date();
  const lockDate = wallet.savingsLockedUntil ? new Date(wallet.savingsLockedUntil) : null;
  const isLocked = lockDate ? lockDate > now : false;

  // Calculate days remaining
  const daysRemaining = lockDate && isLocked
    ? Math.ceil((lockDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
    : 0;
  const totalLockDays = 30; // approximate month
  const lockProgress = isLocked ? Math.max(0, Math.min(100, ((totalLockDays - daysRemaining) / totalLockDays) * 100)) : 100;

  const formatDate = (date: Date) =>
    date.toLocaleDateString("en-UG", { weekday: "short", month: "short", day: "numeric", year: "numeric" });

  // Filter savings-related transactions (deposits show savings portion)
  const savingsTransactions = transactions
    .filter((t) => t.type === "income" && t.description.toLowerCase().includes("deposit"))
    .slice(0, 10)
    .map((t) => ({
      ...t,
      savingsPortion: Math.abs(t.amount + (t.amount < 0 ? 0 : 0)) * (wallet.savingsRate / (100)),
    }));

  const handleExtendLock = async () => {
    setLoading(true);
    try {
      await extendSavingsLock(selectedMonths);
      toast({ title: "Lock Extended", description: `Savings locked for ${selectedMonths} more month${selectedMonths > 1 ? "s" : ""}.` });
      setExtendOpen(false);
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateRate = async () => {
    setLoading(true);
    try {
      await updateSavingsRate(newRate);
      toast({ title: "Rate Updated", description: `Savings rate set to ${newRate}% of every deposit.` });
      setRateOpen(false);
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <PullToRefresh onRefresh={async () => { await refetch(); }} className="min-h-screen">
    <div className="gradient-bg pb-24">
      {/* Header */}
      <header className="px-4 pt-12 pb-4">
        <div className="flex items-center justify-between mb-2">
          <button
            onClick={() => navigate("/wallet")}
            className="w-10 h-10 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <h1 className="text-lg font-semibold text-foreground">Savings</h1>
          <div className="w-10" />
        </div>
      </header>

      <main className="px-4 space-y-5">
        {/* Savings Balance Hero */}
        <section className="glass-card rounded-2xl p-6 relative overflow-hidden animate-fade-in">
          <div className="absolute -top-10 -right-10 w-32 h-32 rounded-full blur-3xl opacity-20 bg-warning" />
          <div className="relative z-10 flex flex-col items-center text-center gap-2">
            <div className="w-14 h-14 rounded-2xl bg-warning/15 flex items-center justify-center mb-1">
              <PiggyBank className="h-7 w-7 text-warning" />
            </div>
            <p className="text-sm text-muted-foreground">Total Savings</p>
            <p className="text-3xl font-bold text-foreground">{formatCurrency(wallet.savingsBalance)}</p>
            <div className="flex items-center gap-1.5 mt-1">
              <TrendingUp className="h-3.5 w-3.5 text-success" />
              <span className="text-xs text-success font-medium">{wallet.savingsRate}% of every deposit</span>
            </div>
          </div>
        </section>

        {/* Lock Status */}
        <section className="glass-card rounded-2xl p-5 animate-fade-in" style={{ animationDelay: "0.05s" }}>
          <div className="flex items-center gap-3 mb-4">
            {isLocked ? (
              <div className="w-10 h-10 rounded-xl bg-destructive/15 flex items-center justify-center">
                <Lock className="h-5 w-5 text-destructive" />
              </div>
            ) : (
              <div className="w-10 h-10 rounded-xl bg-success/15 flex items-center justify-center">
                <Unlock className="h-5 w-5 text-success" />
              </div>
            )}
            <div className="flex-1">
              <p className="text-sm font-semibold text-foreground">
                {isLocked ? "Savings Locked" : "Savings Unlocked"}
              </p>
              <p className="text-xs text-muted-foreground">
                {isLocked && lockDate
                  ? `Unlocks ${formatDate(lockDate)}`
                  : "Your savings are available for withdrawal"}
              </p>
            </div>
          </div>

          {isLocked && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground flex items-center gap-1">
                  <Clock className="h-3 w-3" /> {daysRemaining} day{daysRemaining !== 1 ? "s" : ""} remaining
                </span>
                <span className="text-muted-foreground">{Math.round(lockProgress)}% elapsed</span>
              </div>
              <Progress value={lockProgress} className="h-2" />
            </div>
          )}
        </section>

        {/* Actions */}
        <section className="grid grid-cols-2 gap-3 animate-fade-in" style={{ animationDelay: "0.1s" }}>
          <button
            onClick={() => setExtendOpen(true)}
            className="glass-card rounded-2xl p-4 flex flex-col items-center gap-2.5 hover:bg-muted/50 transition-colors"
          >
            <div className="w-11 h-11 rounded-xl bg-warning/15 flex items-center justify-center">
              <CalendarPlus className="h-5 w-5 text-warning" />
            </div>
            <span className="text-xs font-semibold text-foreground">Extend Lock</span>
            <span className="text-[10px] text-muted-foreground text-center leading-tight">
              Lock for more months to save longer
            </span>
          </button>

          <button
            onClick={() => { setNewRate(wallet.savingsRate); setRateOpen(true); }}
            className="glass-card rounded-2xl p-4 flex flex-col items-center gap-2.5 hover:bg-muted/50 transition-colors"
          >
            <div className="w-11 h-11 rounded-xl bg-primary/15 flex items-center justify-center">
              <TrendingUp className="h-5 w-5 text-primary" />
            </div>
            <span className="text-xs font-semibold text-foreground">Savings Rate</span>
            <span className="text-[10px] text-muted-foreground text-center leading-tight">
              Currently {wallet.savingsRate}% per deposit
            </span>
          </button>
        </section>

        {/* Info Card */}
        <section className="glass-card rounded-2xl p-4 animate-fade-in" style={{ animationDelay: "0.15s" }}>
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-lg bg-secondary/15 flex items-center justify-center shrink-0 mt-0.5">
              <ShieldCheck className="h-4 w-4 text-secondary" />
            </div>
            <div>
              <p className="text-xs font-semibold text-foreground mb-1">How Savings Work</p>
              <ul className="text-[11px] text-muted-foreground space-y-1.5 leading-relaxed">
                <li className="flex items-start gap-1.5">
                  <ArrowDownToLine className="h-3 w-3 mt-0.5 text-warning shrink-0" />
                  <span><strong>{wallet.savingsRate}%</strong> of every deposit is automatically saved</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <Lock className="h-3 w-3 mt-0.5 text-destructive shrink-0" />
                  <span>Savings are locked for <strong>1 month</strong> from first deposit</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <CalendarPlus className="h-3 w-3 mt-0.5 text-primary shrink-0" />
                  <span>You can extend the lock period anytime for better discipline</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <Unlock className="h-3 w-3 mt-0.5 text-success shrink-0" />
                  <span>After the lock expires, savings become available to withdraw</span>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* Savings History */}
        <section className="animate-fade-in" style={{ animationDelay: "0.2s" }}>
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">Recent Savings</h2>
          <div className="glass-card rounded-2xl p-4 space-y-3">
            {savingsTransactions.length > 0 ? (
              savingsTransactions.map((t) => (
                <div key={t.id} className="flex items-center justify-between py-2 border-b border-border/50 last:border-b-0">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-warning/15 flex items-center justify-center">
                      <PiggyBank className="h-4 w-4 text-warning" />
                    </div>
                    <div>
                      <p className="text-xs font-medium text-foreground">Savings from deposit</p>
                      <p className="text-[10px] text-muted-foreground">{t.date}</p>
                    </div>
                  </div>
                  <p className="text-xs font-semibold text-warning">
                    +{formatCurrency(t.savingsPortion)}
                  </p>
                </div>
              ))
            ) : (
              <div className="py-6 text-center">
                <PiggyBank className="h-8 w-8 text-muted-foreground/30 mx-auto mb-2" />
                <p className="text-xs text-muted-foreground">No savings yet</p>
                <p className="text-[10px] text-muted-foreground mt-0.5">Deposit funds and {wallet.savingsRate}% will be saved automatically</p>
              </div>
            )}
          </div>
        </section>
      </main>

      {/* Extend Lock Dialog */}
      <Dialog open={extendOpen} onOpenChange={setExtendOpen}>
        <DialogContent className="w-[calc(100%-2rem)] rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-center">Extend Savings Lock</DialogTitle>
          </DialogHeader>
          <div className="space-y-5 pt-2">
            <p className="text-xs text-muted-foreground text-center">
              {isLocked && lockDate
                ? `Currently locked until ${formatDate(lockDate)}. Extend from that date.`
                : "Start a new lock period from today."}
            </p>

            <div className="flex items-center justify-center gap-4">
              <button
                onClick={() => setSelectedMonths(Math.max(1, selectedMonths - 1))}
                className="w-10 h-10 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
              >
                <Minus className="h-4 w-4" />
              </button>
              <div className="text-center">
                <p className="text-4xl font-bold text-foreground">{selectedMonths}</p>
                <p className="text-xs text-muted-foreground">month{selectedMonths > 1 ? "s" : ""}</p>
              </div>
              <button
                onClick={() => setSelectedMonths(Math.min(12, selectedMonths + 1))}
                className="w-10 h-10 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>

            <div className="grid grid-cols-4 gap-2">
              {[1, 3, 6, 12].map((m) => (
                <button
                  key={m}
                  onClick={() => setSelectedMonths(m)}
                  className={cn(
                    "py-2 rounded-xl text-xs font-semibold transition-colors",
                    selectedMonths === m
                      ? "bg-warning text-warning-foreground"
                      : "bg-muted/50 text-muted-foreground hover:bg-muted"
                  )}
                >
                  {m} mo
                </button>
              ))}
            </div>

            <Button
              onClick={handleExtendLock}
              disabled={loading}
              className="w-full bg-warning text-warning-foreground hover:bg-warning/90 rounded-xl h-12 font-semibold"
            >
              {loading ? "Extending..." : `Lock for ${selectedMonths} More Month${selectedMonths > 1 ? "s" : ""}`}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Rate Dialog */}
      <Dialog open={rateOpen} onOpenChange={setRateOpen}>
        <DialogContent className="w-[calc(100%-2rem)] rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-center">Savings Rate</DialogTitle>
          </DialogHeader>
          <div className="space-y-5 pt-2">
            <p className="text-xs text-muted-foreground text-center">
              Set the percentage of each deposit that goes to savings
            </p>

            <div className="flex items-center justify-center gap-4">
              <button
                onClick={() => setNewRate(Math.max(1, newRate - 1))}
                className="w-10 h-10 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
              >
                <Minus className="h-4 w-4" />
              </button>
              <div className="text-center">
                <p className="text-4xl font-bold text-foreground">{newRate}%</p>
                <p className="text-xs text-muted-foreground">per deposit</p>
              </div>
              <button
                onClick={() => setNewRate(Math.min(50, newRate + 1))}
                className="w-10 h-10 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>

            <div className="grid grid-cols-4 gap-2">
              {[5, 10, 15, 20].map((r) => (
                <button
                  key={r}
                  onClick={() => setNewRate(r)}
                  className={cn(
                    "py-2 rounded-xl text-xs font-semibold transition-colors",
                    newRate === r
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted/50 text-muted-foreground hover:bg-muted"
                  )}
                >
                  {r}%
                </button>
              ))}
            </div>

            <Button
              onClick={handleUpdateRate}
              disabled={loading}
              className="w-full rounded-xl h-12 font-semibold"
            >
              {loading ? "Saving..." : `Set Rate to ${newRate}%`}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <BottomNavigation />
    </div>
  );
}
