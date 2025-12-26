import { ArrowDownToLine, ArrowUpFromLine, Target } from "lucide-react";
import { cn } from "@/lib/utils";

interface QuickActionProps {
  icon: React.ReactNode;
  label: string;
  onClick?: () => void;
  variant?: "primary" | "secondary" | "success";
}

function QuickAction({ icon, label, onClick, variant = "primary" }: QuickActionProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex flex-col items-center gap-2 p-4 rounded-2xl transition-all duration-200 active:scale-95",
        variant === "primary" && "bg-primary/10 text-primary hover:bg-primary/15",
        variant === "secondary" && "bg-warning/10 text-warning hover:bg-warning/15",
        variant === "success" && "bg-success/10 text-success hover:bg-success/15"
      )}
    >
      <div
        className={cn(
          "w-12 h-12 rounded-xl flex items-center justify-center",
          variant === "primary" && "bg-primary text-primary-foreground",
          variant === "secondary" && "bg-warning text-warning-foreground",
          variant === "success" && "bg-success text-success-foreground"
        )}
      >
        {icon}
      </div>
      <span className="text-xs font-medium text-foreground">{label}</span>
    </button>
  );
}

interface QuickActionsProps {
  onDeposit: () => void;
  onSetBudget: () => void;
  onWithdraw: () => void;
}

export function QuickActions({ onDeposit, onSetBudget, onWithdraw }: QuickActionsProps) {
  return (
    <div className="grid grid-cols-3 gap-3">
      <QuickAction
        icon={<ArrowDownToLine className="h-5 w-5" />}
        label="Deposit"
        variant="primary"
        onClick={onDeposit}
      />
      <QuickAction
        icon={<Target className="h-5 w-5" />}
        label="Set Budget"
        variant="secondary"
        onClick={onSetBudget}
      />
      <QuickAction
        icon={<ArrowUpFromLine className="h-5 w-5" />}
        label="Withdraw"
        variant="success"
        onClick={onWithdraw}
      />
    </div>
  );
}
