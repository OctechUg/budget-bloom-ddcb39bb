import { ArrowDownToLine, ArrowUpFromLine, ArrowRightLeft } from "lucide-react";
import { cn } from "@/lib/utils";

interface QuickActionProps {
  icon: React.ReactNode;
  label: string;
  onClick?: () => void;
  variant?: "deposit" | "withdraw" | "transfer";
}

function QuickAction({ icon, label, onClick, variant = "deposit" }: QuickActionProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex-1 flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl font-semibold transition-all duration-200 active:scale-95",
        variant === "deposit" && "bg-success text-success-foreground hover:bg-success/90",
        variant === "withdraw" && "bg-primary text-primary-foreground hover:bg-primary/90 shadow-glow",
        variant === "transfer" && "bg-accent text-accent-foreground hover:bg-accent/90 border border-border"
      )}
    >
      {icon}
      <span className="text-sm">{label}</span>
    </button>
  );
}

interface QuickActionsProps {
  onDeposit: () => void;
  onSetBudget: () => void;
  onWithdraw: () => void;
  onTransfer?: () => void;
}

export function QuickActions({ onDeposit, onWithdraw, onTransfer }: QuickActionsProps) {
  return (
    <div className="flex gap-3">
      <QuickAction
        icon={<ArrowDownToLine className="h-4 w-4" />}
        label="Top Up"
        variant="deposit"
        onClick={onDeposit}
      />
      <QuickAction
        icon={<ArrowRightLeft className="h-4 w-4" />}
        label="Transfer"
        variant="transfer"
        onClick={onTransfer}
      />
      <QuickAction
        icon={<ArrowUpFromLine className="h-4 w-4" />}
        label="Withdraw"
        variant="withdraw"
        onClick={onWithdraw}
      />
    </div>
  );
}