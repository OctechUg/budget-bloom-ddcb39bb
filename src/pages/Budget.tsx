import { BottomNavigation } from "@/components/BottomNavigation";
import { BudgetCard } from "@/components/BudgetCard";
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
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <header className="bg-card px-4 pt-12 pb-6 border-b border-border">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-foreground">Budgets</h1>
          <Button variant="action" size="sm">
            <Plus className="h-4 w-4" />
            New Budget
          </Button>
        </div>

        {/* Overall Budget Summary */}
        <div className="bg-primary/5 rounded-2xl p-4 border border-primary/20">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">Monthly Budget</span>
            <div className="flex items-center gap-1 text-success text-xs font-medium">
              <TrendingUp className="h-3 w-3" />
              <span>On track</span>
            </div>
          </div>
          <div className="flex items-end gap-2 mb-3">
            <span className="text-2xl font-bold text-foreground">
              {formatCurrency(totalSpent)}
            </span>
            <span className="text-muted-foreground text-sm mb-1">
              of {formatCurrency(totalBudget)}
            </span>
          </div>
          <Progress value={overallPercentage} className="h-2" />
          <p className="text-xs text-muted-foreground mt-2">
            {formatCurrency(totalBudget - totalSpent)} remaining this month
          </p>
        </div>
      </header>

      {/* Budget Categories */}
      <main className="px-4 pt-6">
        <h2 className="text-sm font-semibold text-muted-foreground mb-4 uppercase tracking-wide">
          Categories
        </h2>
        <div className="space-y-3">
          {budgetCategories.map((budget, index) => (
            <div
              key={budget.category}
              className="animate-fade-in"
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              <BudgetCard
                category={budget.category}
                icon={budget.icon}
                spent={budget.spent}
                budget={budget.budget}
              />
            </div>
          ))}
        </div>

        {/* Info Card */}
        <div className="mt-6 bg-success/10 rounded-2xl p-4 border border-success/20">
          <h3 className="font-semibold text-foreground mb-1">
            💡 Budget Tip
          </h3>
          <p className="text-sm text-muted-foreground">
            Unused budget funds are automatically moved to your withdrawable savings at the end of each month.
          </p>
        </div>
      </main>

      <BottomNavigation />
    </div>
  );
}
