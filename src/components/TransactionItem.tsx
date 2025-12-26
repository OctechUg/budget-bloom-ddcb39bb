import { cn } from "@/lib/utils";
import { ArrowDownLeft, ArrowUpRight, Ban, ExternalLink } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export interface Transaction {
  id: string;
  type: "income" | "expense" | "blocked";
  category: string;
  description: string;
  amount: number;
  date: string;
  icon?: React.ReactNode;
}

interface TransactionItemProps {
  transaction: Transaction;
}

export function TransactionItem({ transaction }: TransactionItemProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-UG", {
      style: "currency",
      currency: "UGX",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(Math.abs(value));
  };

  const getIcon = () => {
    if (transaction.type === "blocked") {
      return <Ban className="h-4 w-4" />;
    }
    if (transaction.type === "income") {
      return <ArrowDownLeft className="h-4 w-4" />;
    }
    return <ArrowUpRight className="h-4 w-4" />;
  };

  const getStatusBadge = () => {
    return (
      <Badge 
        variant="outline" 
        className={cn(
          "text-[10px] px-1.5 py-0 h-4",
          transaction.type === "income" && "border-success/50 text-success bg-success/10",
          transaction.type === "expense" && "border-primary/50 text-primary bg-primary/10",
          transaction.type === "blocked" && "border-blocked/50 text-blocked bg-blocked/10"
        )}
      >
        {transaction.type === "blocked" ? "blocked" : "confirmed"}
      </Badge>
    );
  };

  return (
    <div className="flex items-center gap-3 py-3 border-b border-border/50 last:border-0">
      <div
        className={cn(
          "w-10 h-10 rounded-xl flex items-center justify-center",
          transaction.type === "income" && "bg-success/10 text-success",
          transaction.type === "expense" && "bg-primary/10 text-primary",
          transaction.type === "blocked" && "bg-blocked/10 text-blocked"
        )}
      >
        {transaction.icon || getIcon()}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <p className="font-medium text-foreground truncate text-sm">
            {transaction.category}
          </p>
          {getStatusBadge()}
        </div>
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <span>{transaction.date}</span>
          <span>•</span>
          <span className="font-mono text-[10px]">0xA3...9C78</span>
          <ExternalLink className="h-2.5 w-2.5" />
        </div>
      </div>

      <div className="text-right">
        <p
          className={cn(
            "font-bold text-sm",
            transaction.type === "income" && "text-success",
            transaction.type === "expense" && "text-foreground",
            transaction.type === "blocked" && "text-blocked line-through"
          )}
        >
          {transaction.type === "income" ? "+" : "-"}
          {formatCurrency(transaction.amount)}
        </p>
        <p className="text-[10px] text-muted-foreground">
          ~0.066 USDC
        </p>
      </div>
    </div>
  );
}