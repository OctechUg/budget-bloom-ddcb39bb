import { cn } from "@/lib/utils";
import { Eye, EyeOff, TrendingUp } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

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
  showGrowth = false,
  growthPercentage = 0,
}: BalanceCardProps) {
  const [isHidden, setIsHidden] = useState(false);
  const { toast } = useToast();

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-UG", {
      style: "currency",
      currency: "UGX",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(formatCurrency(amount));
    toast({ title: "Copied to clipboard" });
  };

  return (
    <div className="relative overflow-hidden rounded-2xl p-5 glass-card border border-primary/20">
      {/* Orange glow accent */}
      <div className="absolute -top-12 -right-12 w-32 h-32 bg-primary/20 rounded-full blur-2xl" />
      
      <div className="relative z-10">

        {/* Title */}
        <div className="flex items-center justify-between mb-1">
          <span className="text-sm text-muted-foreground flex items-center gap-2">
            {title}
            <button
              onClick={() => setIsHidden(!isHidden)}
              className="p-1 rounded hover:bg-muted/50 transition-colors"
            >
              {isHidden ? (
                <EyeOff className="h-3.5 w-3.5" />
              ) : (
                <Eye className="h-3.5 w-3.5" />
              )}
            </button>
          </span>
        </div>

        {/* Amount */}
        <div className="mb-1">
          <span className="text-3xl font-bold tracking-tight text-foreground">
            {isHidden ? "••••••" : formatCurrency(amount)}
          </span>
        </div>

        {/* Subtitle & Growth */}
        <div className="flex items-center justify-between">
          {subtitle && (
            <p className="text-xs text-muted-foreground">
              ~ {subtitle}
            </p>
          )}

          {showGrowth && growthPercentage > 0 && (
            <div className="flex items-center gap-1">
              <div className="flex items-center gap-0.5 text-success bg-success/10 px-2 py-0.5 rounded-full">
                <TrendingUp className="h-3 w-3" />
                <span className="text-xs font-medium">+{growthPercentage}%</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}