import { cn } from "@/lib/utils";
import { ArrowDownLeft, ArrowUpRight, Ban } from "lucide-react";

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

  return (
    <div className="flex items-center gap-3 py-3 border-b border-border last:border-0">
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
        <p className="font-medium text-foreground truncate">
          {transaction.description}
        </p>
        <p className="text-xs text-muted-foreground">{transaction.category}</p>
      </div>

      <div className="text-right">
        <p
          className={cn(
            "font-semibold",
            transaction.type === "income" && "text-success",
            transaction.type === "expense" && "text-foreground",
            transaction.type === "blocked" && "text-blocked line-through"
          )}
        >
          {transaction.type === "income" ? "+" : "-"}
          {formatCurrency(transaction.amount)}
        </p>
        <p className="text-xs text-muted-foreground">{transaction.date}</p>
      </div>
    </div>
  );
}
