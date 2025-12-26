import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { BalanceCard } from "@/components/BalanceCard";
import { BudgetCard } from "@/components/BudgetCard";
import { QuickActions } from "@/components/QuickActions";
import { TransactionItem, Transaction } from "@/components/TransactionItem";
import { DepositModal } from "@/components/DepositModal";
import { WithdrawModal } from "@/components/WithdrawModal";
import { SetBudgetModal } from "@/components/SetBudgetModal";
import { NotificationsDropdown } from "@/components/NotificationsDropdown";
import { BottomNavigation } from "@/components/BottomNavigation";
import { 
  Utensils, 
  Car, 
  Book, 
  ShoppingBag, 
  Coffee,
} from "lucide-react";

const mockBudgets = [
  { category: "Food & Dining", icon: <Utensils className="h-5 w-5" />, spent: 145000, budget: 200000 },
  { category: "Transport", icon: <Car className="h-5 w-5" />, spent: 80000, budget: 80000 },
  { category: "Books & Supplies", icon: <Book className="h-5 w-5" />, spent: 35000, budget: 100000 },
  { category: "Shopping", icon: <ShoppingBag className="h-5 w-5" />, spent: 120000, budget: 150000 },
];

const mockTransactions: Transaction[] = [
  {
    id: "1",
    type: "expense",
    category: "Food & Dining",
    description: "Campus Cafeteria",
    amount: 15000,
    date: "Today",
    icon: <Utensils className="h-4 w-4" />,
  },
  {
    id: "2",
    type: "blocked",
    category: "Transport",
    description: "Boda Boda Ride",
    amount: 8000,
    date: "Today",
    icon: <Car className="h-4 w-4" />,
  },
  {
    id: "3",
    type: "income",
    category: "Deposit",
    description: "Mobile Money Deposit",
    amount: 200000,
    date: "Yesterday",
  },
  {
    id: "4",
    type: "expense",
    category: "Food & Dining",
    description: "Java House",
    amount: 25000,
    date: "Yesterday",
    icon: <Coffee className="h-4 w-4" />,
  },
];

export default function Dashboard() {
  const navigate = useNavigate();
  const [depositOpen, setDepositOpen] = useState(false);
  const [withdrawOpen, setWithdrawOpen] = useState(false);
  const [budgetOpen, setBudgetOpen] = useState(false);

  const withdrawableBalance = 125000;

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <header className="bg-primary px-4 pt-12 pb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-primary-foreground/80 text-sm">Good morning,</p>
            <h1 className="text-xl font-bold text-primary-foreground">James Ochieng</h1>
          </div>
          <NotificationsDropdown />
        </div>

        {/* Balance Cards */}
        <div className="space-y-3 -mb-16">
          <BalanceCard
            title="Wallet Balance"
            amount={485000}
            subtitle="Available for budgeting"
            variant="secondary"
          />
          <BalanceCard
            title="Withdrawable Savings"
            amount={withdrawableBalance}
            subtitle="From unused budgets"
            variant="secondary"
            showGrowth
            growthPercentage={12}
          />
        </div>
      </header>

      {/* Main Content */}
      <main className="px-4 pt-20 space-y-6">
        {/* Quick Actions */}
        <section className="animate-fade-in" style={{ animationDelay: "0.1s" }}>
          <h2 className="text-sm font-semibold text-muted-foreground mb-3 uppercase tracking-wide">
            Quick Actions
          </h2>
          <QuickActions
            onDeposit={() => setDepositOpen(true)}
            onSetBudget={() => setBudgetOpen(true)}
            onWithdraw={() => setWithdrawOpen(true)}
          />
        </section>

        {/* Budget Overview */}
        <section className="animate-fade-in" style={{ animationDelay: "0.2s" }}>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
              Budget Overview
            </h2>
            <button 
              onClick={() => navigate("/budget")}
              className="text-sm font-medium text-primary hover:underline"
            >
              View All
            </button>
          </div>
          <div className="space-y-3">
            {mockBudgets.map((budget) => (
              <BudgetCard
                key={budget.category}
                category={budget.category}
                icon={budget.icon}
                spent={budget.spent}
                budget={budget.budget}
              />
            ))}
          </div>
        </section>

        {/* Recent Transactions */}
        <section className="animate-fade-in" style={{ animationDelay: "0.3s" }}>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
              Recent Activity
            </h2>
            <button 
              onClick={() => navigate("/wallet")}
              className="text-sm font-medium text-primary hover:underline"
            >
              See All
            </button>
          </div>
          <div className="bg-card rounded-2xl p-4 shadow-soft border border-border">
            {mockTransactions.map((transaction) => (
              <TransactionItem key={transaction.id} transaction={transaction} />
            ))}
          </div>
        </section>
      </main>

      {/* Modals */}
      <DepositModal open={depositOpen} onOpenChange={setDepositOpen} />
      <WithdrawModal 
        open={withdrawOpen} 
        onOpenChange={setWithdrawOpen} 
        availableBalance={withdrawableBalance}
      />
      <SetBudgetModal open={budgetOpen} onOpenChange={setBudgetOpen} />

      <BottomNavigation />
    </div>
  );
}
