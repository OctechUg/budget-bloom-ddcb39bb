import { cn } from "@/lib/utils";
import { Eye, EyeOff, TrendingUp } from "lucide-react";
import { useState } from "react";

interface BalanceCardProps {
  title: string;
  amount: number;
  subtitle?: string;
  variant?: "primary" | "secondary";
  showGrowth?: boolean;
  growthPercentage?: number;
}

export function BalanceCard({
  title,
  amount,
  subtitle,
  variant = "primary",
  showGrowth = false,
  growthPercentage = 0,
}: BalanceCardProps) {
  const [isHidden, setIsHidden] = useState(false);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-UG", {
      style: "currency",
      currency: "UGX",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-2xl p-5 shadow-card transition-all duration-300 hover:shadow-elevated",
        variant === "primary"
          ? "bg-primary text-primary-foreground"
          : "bg-card text-card-foreground border border-border"
      )}
    >
      {/* Background decoration */}
      {variant === "primary" && (
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
      )}

      <div className="relative z-10">
        <div className="flex items-center justify-between mb-2">
          <span
            className={cn(
              "text-sm font-medium",
              variant === "primary"
                ? "text-primary-foreground/80"
                : "text-muted-foreground"
            )}
          >
            {title}
          </span>
          <button
            onClick={() => setIsHidden(!isHidden)}
            className={cn(
              "p-1.5 rounded-lg transition-colors",
              variant === "primary"
                ? "hover:bg-white/10"
                : "hover:bg-muted"
            )}
          >
            {isHidden ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
          </button>
        </div>

        <div className="mb-1">
          <span className="text-2xl font-bold tracking-tight">
            {isHidden ? "••••••" : formatCurrency(amount)}
          </span>
        </div>

        {subtitle && (
          <p
            className={cn(
              "text-xs",
              variant === "primary"
                ? "text-primary-foreground/70"
                : "text-muted-foreground"
            )}
          >
            {subtitle}
          </p>
        )}

        {showGrowth && growthPercentage > 0 && (
          <div className="flex items-center gap-1 mt-2">
            <div className="flex items-center gap-0.5 text-success bg-success/10 px-2 py-0.5 rounded-full">
              <TrendingUp className="h-3 w-3" />
              <span className="text-xs font-medium">+{growthPercentage}%</span>
            </div>
            <span className="text-xs text-muted-foreground">this month</span>
          </div>
        )}
      </div>
    </div>
  );
}
