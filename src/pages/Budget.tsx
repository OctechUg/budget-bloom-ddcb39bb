import { useState } from "react";
import { BottomNavigation } from "@/components/BottomNavigation";
import { BudgetCard } from "@/components/BudgetCard";
import { SetBudgetModal } from "@/components/SetBudgetModal";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Utensils,
  Car,
  Book,
  ShoppingBag,
  Gamepad2,
  Lightbulb,
  Phone,
  Plus,
  TrendingUp,
} from "lucide-react";

const budgetCategories = [
  { category: "Food & Dining", icon: <Utensils className="h-5 w-5" />, spent: 145000, budget: 200000 },
  { category: "Transport", icon: <Car className="h-5 w-5" />, spent: 80000, budget: 80000 },
  { category: "Books & Supplies", icon: <Book className="h-5 w-5" />, spent: 35000, budget: 100000 },
  { category: "Shopping", icon: <ShoppingBag className="h-5 w-5" />, spent: 120000, budget: 150000 },
  { category: "Entertainment", icon: <Gamepad2 className="h-5 w-5" />, spent: 25000, budget: 50000 },
  { category: "Utilities", icon: <Lightbulb className="h-5 w-5" />, spent: 20000, budget: 30000 },
  { category: "Airtime & Data", icon: <Phone className="h-5 w-5" />, spent: 40000, budget: 60000 },
];

export default function Budget() {
  const [budgetModalOpen, setBudgetModalOpen] = useState(false);

  const totalBudget = budgetCategories.reduce((sum, b) => sum + b.budget, 0);
  const totalSpent = budgetCategories.reduce((sum, b) => sum + b.spent, 0);
  const overallPercentage = (totalSpent / totalBudget) * 100;

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-UG", {
      style: "currency",
      currency: "UGX",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <div className="min-h-screen gradient-bg pb-24">
      <header className="px-4 pt-12 pb-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-foreground">Budgets</h1>
          <Button size="sm" onClick={() => setBudgetModalOpen(true)}>
            <Plus className="h-4 w-4" />
            New Budget
          </Button>
        </div>

        <div className="glass-card rounded-2xl p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">Monthly Budget</span>
            <div className="flex items-center gap-1 text-success text-xs font-medium">
              <TrendingUp className="h-3 w-3" />
              <span>On track</span>
            </div>
          </div>
          <div className="flex items-end gap-2 mb-3">
            <span className="text-2xl font-bold text-foreground">{formatCurrency(totalSpent)}</span>
            <span className="text-muted-foreground text-sm mb-1">of {formatCurrency(totalBudget)}</span>
          </div>
          <Progress value={overallPercentage} className="h-2" />
          <p className="text-xs text-muted-foreground mt-2">{formatCurrency(totalBudget - totalSpent)} remaining</p>
        </div>
      </header>

      <main className="px-4">
        <h2 className="text-sm font-semibold text-muted-foreground mb-4 uppercase tracking-wide">Categories</h2>
        <div className="space-y-3">
          {budgetCategories.map((budget) => (
            <BudgetCard key={budget.category} category={budget.category} icon={budget.icon} spent={budget.spent} budget={budget.budget} />
          ))}
        </div>
      </main>

      <SetBudgetModal open={budgetModalOpen} onOpenChange={setBudgetModalOpen} />
      <BottomNavigation />
    </div>
  );
}