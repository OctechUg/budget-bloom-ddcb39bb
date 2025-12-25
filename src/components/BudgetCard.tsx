import { cn } from "@/lib/utils";
import { AlertCircle } from "lucide-react";

interface BudgetCardProps {
  category: string;
  icon: React.ReactNode;
  spent: number;
  budget: number;
  color?: string;
}

export function BudgetCard({
  category,
  icon,
  spent,
  budget,
  color = "primary",
}: BudgetCardProps) {
  const percentage = Math.min((spent / budget) * 100, 100);
  const remaining = budget - spent;
  const isOverBudget = spent >= budget;
  const isWarning = percentage >= 80 && percentage < 100;

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-UG", {
      style: "currency",
      currency: "UGX",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(Math.abs(value));
  };

  return (
    <div
      className={cn(
        "bg-card rounded-2xl p-4 shadow-soft border transition-all duration-300 hover:shadow-card",
        isOverBudget ? "border-blocked/30" : "border-border"
      )}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div
            className={cn(
              "w-10 h-10 rounded-xl flex items-center justify-center",
              isOverBudget
                ? "bg-blocked/10 text-blocked"
                : isWarning
                ? "bg-warning/10 text-warning"
                : "bg-primary/10 text-primary"
            )}
          >
            {icon}
          </div>
          <div>
            <h3 className="font-semibold text-foreground">{category}</h3>
            <p className="text-xs text-muted-foreground">
              {formatCurrency(spent)} of {formatCurrency(budget)}
            </p>
          </div>
        </div>
        {isOverBudget && (
          <div className="flex items-center gap-1 text-blocked text-xs font-medium bg-blocked/10 px-2 py-1 rounded-full">
            <AlertCircle className="h-3 w-3" />
            <span>Blocked</span>
          </div>
        )}
      </div>

      {/* Progress bar */}
      <div className="relative h-2 bg-muted rounded-full overflow-hidden">
        <div
          className={cn(
            "absolute left-0 top-0 h-full rounded-full transition-all duration-500",
            isOverBudget
              ? "bg-blocked"
              : isWarning
              ? "bg-warning"
              : "bg-primary"
          )}
          style={{ width: `${percentage}%` }}
        />
      </div>

      {/* Remaining */}
      <div className="mt-2 flex items-center justify-between text-xs">
        <span className="text-muted-foreground">
          {isOverBudget ? "Over by" : "Remaining"}
        </span>
        <span
          className={cn(
            "font-medium",
            isOverBudget ? "text-blocked" : isWarning ? "text-warning" : "text-success"
          )}
        >
          {formatCurrency(Math.abs(remaining))}
        </span>
      </div>
    </div>
  );
}
