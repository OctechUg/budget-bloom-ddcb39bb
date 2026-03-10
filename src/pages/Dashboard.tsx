import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { BalanceCard } from "@/components/BalanceCard";
import { BudgetCard } from "@/components/BudgetCard";
import { QuickActions } from "@/components/QuickActions";
import { TransactionItem, Transaction } from "@/components/TransactionItem";
import { DepositModal } from "@/components/DepositModal";
import { WithdrawModal } from "@/components/WithdrawModal";
import { SetBudgetModal } from "@/components/SetBudgetModal";
import { TransferModal } from "@/components/TransferModal";
import { QuickServices } from "@/components/QuickServices";
import { NotificationsDropdown } from "@/components/NotificationsDropdown";
import { BottomNavigation } from "@/components/BottomNavigation";
import { PullToRefresh } from "@/components/PullToRefresh";
import { useAuth } from "@/hooks/useAuth";
import { useWallet } from "@/hooks/useWallet";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import {
  Utensils, Car, Book, ShoppingBag, Coffee,
  LogIn, Star,
} from "lucide-react";

const iconMap: Record<string, React.ReactNode> = {
  utensils: <Utensils className="h-4 w-4" />,
  car: <Car className="h-4 w-4" />,
  book: <Book className="h-4 w-4" />,
  "shopping-bag": <ShoppingBag className="h-4 w-4" />,
  coffee: <Coffee className="h-4 w-4" />,
};

export default function Dashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { wallet, transactions, budgets, deposit, withdraw, transfer, setBudget, refetch } = useWallet();
  const [depositOpen, setDepositOpen] = useState(false);
  const [withdrawOpen, setWithdrawOpen] = useState(false);
  const [budgetOpen, setBudgetOpen] = useState(false);
  const [transferOpen, setTransferOpen] = useState(false);
  const [showPromo, setShowPromo] = useState(true);
  const { toast } = useToast();

  const displayName = user?.email?.split("@")[0] || "Guest";

  // Map transactions to the TransactionItem format
  const displayTransactions: Transaction[] = transactions.slice(0, 3).map(t => ({
    id: t.id,
    type: t.type as any,
    category: t.category,
    description: t.description,
    amount: t.amount,
    date: t.date,
    status: t.status,
  }));

  // Map budgets to BudgetCard format
  const displayBudgets = budgets.slice(0, 2).map(b => ({
    category: b.name,
    icon: iconMap[b.icon] || <Utensils className="h-4 w-4" />,
    spent: b.spentAmount,
    budget: b.allocatedAmount,
  }));

  return (
    <PullToRefresh onRefresh={async () => { await refetch(); toast({ title: "Refreshed", description: "Your dashboard is up to date." }); }} className="min-h-screen">
    <div className="gradient-bg pb-24">
      <header className="px-4 pt-12 pb-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
              <span className="text-primary font-bold text-lg">
                {displayName.charAt(0).toUpperCase()}
              </span>
            </div>
            <div>
              <p className="text-muted-foreground text-sm">Hi {displayName}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {!user && (
              <Link to="/auth">
                <Button variant="outline" size="sm" className="gap-2 border-primary/30 text-primary hover:bg-primary/10">
                  <LogIn className="h-4 w-4" />
                  Login
                </Button>
              </Link>
            )}
            <NotificationsDropdown />
          </div>
        </div>

        <BalanceCard
          title="Wallet Balance"
          amount={wallet.balance}
          subtitle="Available for budgeting"
          showGrowth
          growthPercentage={wallet.totalDeposited > 0 ? Math.round((wallet.balance / wallet.totalDeposited) * 100) : 0}
        />
      </header>

      <main className="px-4 space-y-6">
        <section className="animate-fade-in" style={{ animationDelay: "0.1s" }}>
          <QuickActions
            onDeposit={() => setDepositOpen(true)}
            onSetBudget={() => setBudgetOpen(true)}
            onWithdraw={() => setWithdrawOpen(true)}
            onTransfer={() => setTransferOpen(true)}
          />
        </section>

        <section className="animate-fade-in" style={{ animationDelay: "0.15s" }}>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Quick Services</h2>
          </div>
          <QuickServices />
        </section>

        {showPromo && (
          <section className="animate-fade-in" style={{ animationDelay: "0.15s" }}>
            <div className="relative glass-card rounded-2xl p-4 flex items-center gap-3 overflow-hidden">
              <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center shrink-0">
                <Star className="h-6 w-6 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-foreground text-sm">Share with Friends</p>
                <p className="text-xs text-muted-foreground">Refer a friend and earn rewards</p>
              </div>
              <button
                onClick={() => {
                  if (navigator.share) {
                    navigator.share({ title: "BudgetWise", text: "Check out BudgetWise!", url: window.location.origin });
                  } else {
                    navigator.clipboard.writeText(window.location.origin);
                    toast({ title: "Link Copied!", description: "Share link copied to clipboard." });
                  }
                }}
                className="px-3 py-1.5 rounded-lg bg-primary/20 text-primary text-xs font-semibold hover:bg-primary/30 transition-colors shrink-0"
              >
                Share
              </button>
            </div>
          </section>
        )}

        <section className="animate-fade-in" style={{ animationDelay: "0.2s" }}>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Budget Overview</h2>
            <button onClick={() => navigate("/budget")} className="text-sm font-medium text-primary hover:underline">View All</button>
          </div>
          <div className="space-y-3">
            {displayBudgets.length > 0 ? displayBudgets.map((budget) => (
              <BudgetCard key={budget.category} category={budget.category} icon={budget.icon} spent={budget.spent} budget={budget.budget} />
            )) : (
              <div className="glass-card rounded-2xl p-4 text-center text-muted-foreground text-sm">
                No budgets set yet. Tap "Set Budget" to get started.
              </div>
            )}
          </div>
        </section>

      </main>

      <DepositModal open={depositOpen} onOpenChange={setDepositOpen} onDeposit={deposit} />
      <WithdrawModal open={withdrawOpen} onOpenChange={setWithdrawOpen} availableBalance={wallet.balance} onWithdraw={withdraw} />
      <SetBudgetModal open={budgetOpen} onOpenChange={setBudgetOpen} onSetBudget={setBudget} />
      <TransferModal open={transferOpen} onOpenChange={setTransferOpen} availableBalance={wallet.balance} onTransfer={transfer} />

      <BottomNavigation />
    </div>
  );
}
