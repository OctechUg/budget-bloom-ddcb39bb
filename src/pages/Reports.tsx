import { useState } from "react";
import { BottomNavigation } from "@/components/BottomNavigation";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, TrendingUp, TrendingDown } from "lucide-react";

const spendingData = [
  { month: "Jul", amount: 450000 },
  { month: "Aug", amount: 520000 },
  { month: "Sep", amount: 380000 },
  { month: "Oct", amount: 490000 },
  { month: "Nov", amount: 420000 },
  { month: "Dec", amount: 465000 },
];

const categoryBreakdown = [
  { name: "Food & Dining", amount: 145000, percentage: 31 },
  { name: "Shopping", amount: 120000, percentage: 26 },
  { name: "Transport", amount: 80000, percentage: 17 },
  { name: "Airtime & Data", amount: 40000, percentage: 9 },
  { name: "Books & Supplies", amount: 35000, percentage: 8 },
  { name: "Others", amount: 45000, percentage: 9 },
];

const months = ["January 2025", "February 2025", "March 2025", "April 2025", "May 2025", "June 2025", "July 2025", "August 2025", "September 2025", "October 2025", "November 2025", "December 2025"];

export default function Reports() {
  const [currentMonthIndex, setCurrentMonthIndex] = useState(11);
  const maxAmount = Math.max(...spendingData.map((d) => d.amount));

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-UG", { style: "currency", currency: "UGX", minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(value);
  };

  return (
    <div className="min-h-screen gradient-bg pb-24">
      <header className="px-4 pt-12 pb-6">
        <h1 className="text-2xl font-bold text-foreground mb-4">Reports</h1>
        <div className="flex items-center justify-between glass-card rounded-xl p-2">
          <Button variant="ghost" size="icon" onClick={() => setCurrentMonthIndex((prev) => Math.max(0, prev - 1))} disabled={currentMonthIndex === 0}>
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <span className="font-semibold text-foreground">{months[currentMonthIndex]}</span>
          <Button variant="ghost" size="icon" onClick={() => setCurrentMonthIndex((prev) => Math.min(11, prev + 1))} disabled={currentMonthIndex === 11}>
            <ChevronRight className="h-5 w-5" />
          </Button>
        </div>
      </header>

      <main className="px-4 space-y-6">
        <div className="grid grid-cols-2 gap-3">
          <div className="glass-card rounded-2xl p-4">
            <p className="text-xs text-muted-foreground mb-1">Total Spent</p>
            <p className="text-xl font-bold text-foreground">{formatCurrency(465000)}</p>
            <div className="flex items-center gap-1 mt-1 text-success text-xs">
              <TrendingDown className="h-3 w-3" />
              <span>-12% vs last month</span>
            </div>
          </div>
          <div className="glass-card rounded-2xl p-4">
            <p className="text-xs text-muted-foreground mb-1">Savings Added</p>
            <p className="text-xl font-bold text-success">{formatCurrency(125000)}</p>
            <div className="flex items-center gap-1 mt-1 text-success text-xs">
              <TrendingUp className="h-3 w-3" />
              <span>+24% vs last month</span>
            </div>
          </div>
        </div>

        <section>
          <h2 className="text-sm font-semibold text-muted-foreground mb-4 uppercase tracking-wide">Spending Trend</h2>
          <div className="glass-card rounded-2xl p-4">
            <div className="flex items-end justify-between gap-2 h-32">
              {spendingData.map((data) => {
                const height = (data.amount / maxAmount) * 100;
                const isCurrentMonth = data.month === "Dec";
                return (
                  <div key={data.month} className="flex-1 flex flex-col items-center gap-2">
                    <div className="w-full relative" style={{ height: "100px" }}>
                      <div className={`absolute bottom-0 w-full rounded-t-lg ${isCurrentMonth ? "bg-primary" : "bg-primary/30"}`} style={{ height: `${height}%` }} />
                    </div>
                    <span className={`text-xs ${isCurrentMonth ? "font-semibold text-primary" : "text-muted-foreground"}`}>{data.month}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-sm font-semibold text-muted-foreground mb-4 uppercase tracking-wide">By Category</h2>
          <div className="glass-card rounded-2xl p-4 space-y-3">
            {categoryBreakdown.map((category) => (
              <div key={category.name} className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-primary" style={{ opacity: 1 - categoryBreakdown.indexOf(category) * 0.15 }} />
                <span className="flex-1 text-sm text-foreground">{category.name}</span>
                <span className="text-sm font-medium text-foreground">{formatCurrency(category.amount)}</span>
                <span className="text-xs text-muted-foreground w-10 text-right">{category.percentage}%</span>
              </div>
            ))}
          </div>
        </section>
      </main>

      <BottomNavigation />
    </div>
  );
}