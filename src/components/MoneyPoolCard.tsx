import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface MoneyPoolCardProps {
  title: string;
  amount: number;
  description: string;
  icon: LucideIcon;
  variant: "available" | "budgeted" | "savings";
  actionLabel?: string;
  onAction?: () => void;
}

export function MoneyPoolCard({
  title,
  amount,
  description,
  icon: Icon,
  variant,
  actionLabel,
  onAction,
}: MoneyPoolCardProps) {
  const formatCurrency = (value: number) =>
    new Intl.NumberFormat("en-UG", { style: "currency", currency: "UGX", minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(value);

  return (
    <div
      className={cn(
        "glass-card rounded-2xl p-4 flex flex-col gap-3 relative overflow-hidden",
        variant === "available" && "border-l-4 border-l-success",
        variant === "budgeted" && "border-l-4 border-l-primary",
        variant === "savings" && "border-l-4 border-l-warning"
      )}
    >
      {/* Glow */}
      <div
        className={cn(
          "absolute -top-8 -right-8 w-24 h-24 rounded-full blur-2xl opacity-20",
          variant === "available" && "bg-success",
          variant === "budgeted" && "bg-primary",
          variant === "savings" && "bg-warning"
        )}
      />

      <div className="relative z-10 flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div
            className={cn(
              "w-10 h-10 rounded-xl flex items-center justify-center",
              variant === "available" && "bg-success/15 text-success",
              variant === "budgeted" && "bg-primary/15 text-primary",
              variant === "savings" && "bg-warning/15 text-warning"
            )}
          >
            <Icon className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground">{title}</p>
            <p className="text-xl font-bold text-foreground">{formatCurrency(amount)}</p>
          </div>
        </div>
      </div>

      <div className="relative z-10 flex items-center justify-between">
        <p className="text-[11px] text-muted-foreground">{description}</p>
        {actionLabel && onAction && (
          <button
            onClick={onAction}
            className={cn(
              "px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors",
              variant === "available" && "bg-success/15 text-success hover:bg-success/25",
              variant === "budgeted" && "bg-primary/15 text-primary hover:bg-primary/25",
              variant === "savings" && "bg-warning/15 text-warning hover:bg-warning/25"
            )}
          >
            {actionLabel}
          </button>
        )}
      </div>
    </div>
  );
}
