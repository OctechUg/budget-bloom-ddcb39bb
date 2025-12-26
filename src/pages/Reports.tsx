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
  { name: "Food & Dining", amount: 145000, percentage: 31, color: "bg-primary" },
  { name: "Shopping", amount: 120000, percentage: 26, color: "bg-warning" },
  { name: "Transport", amount: 80000, percentage: 17, color: "bg-success" },
  { name: "Airtime & Data", amount: 40000, percentage: 9, color: "bg-accent" },
  { name: "Books & Supplies", amount: 35000, percentage: 8, color: "bg-muted-foreground" },
  { name: "Others", amount: 45000, percentage: 9, color: "bg-muted" },
];

const months = [
  "January 2025", "February 2025", "March 2025", "April 2025",
  "May 2025", "June 2025", "July 2025", "August 2025",
  "September 2025", "October 2025", "November 2025", "December 2025"
];

export default function Reports() {
  const [currentMonthIndex, setCurrentMonthIndex] = useState(11); // December
  const maxAmount = Math.max(...spendingData.map((d) => d.amount));

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-UG", {
      style: "currency",
      currency: "UGX",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const handlePrevMonth = () => {
    setCurrentMonthIndex((prev) => (prev > 0 ? prev - 1 : prev));
  };

  const handleNextMonth = () => {
    setCurrentMonthIndex((prev) => (prev < months.length - 1 ? prev + 1 : prev));
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <header className="bg-card px-4 pt-12 pb-6 border-b border-border">
        <h1 className="text-2xl font-bold text-foreground mb-4">Reports</h1>

        {/* Month Selector */}
        <div className="flex items-center justify-between bg-muted rounded-xl p-2">
          <Button 
            variant="ghost" 
            size="icon"
            onClick={handlePrevMonth}
            disabled={currentMonthIndex === 0}
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <span className="font-semibold text-foreground">{months[currentMonthIndex]}</span>
          <Button 
            variant="ghost" 
            size="icon"
            onClick={handleNextMonth}
            disabled={currentMonthIndex === months.length - 1}
          >
            <ChevronRight className="h-5 w-5" />
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="px-4 pt-6 space-y-6">
        {/* Summary Cards */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-card rounded-2xl p-4 shadow-soft border border-border">
            <p className="text-xs text-muted-foreground mb-1">Total Spent</p>
            <p className="text-xl font-bold text-foreground">
              {formatCurrency(465000)}
            </p>
            <div className="flex items-center gap-1 mt-1 text-success text-xs">
              <TrendingDown className="h-3 w-3" />
              <span>-12% vs last month</span>
            </div>
          </div>
          <div className="bg-card rounded-2xl p-4 shadow-soft border border-border">
            <p className="text-xs text-muted-foreground mb-1">Savings Added</p>
            <p className="text-xl font-bold text-success">
              {formatCurrency(125000)}
            </p>
            <div className="flex items-center gap-1 mt-1 text-success text-xs">
              <TrendingUp className="h-3 w-3" />
              <span>+24% vs last month</span>
            </div>
          </div>
        </div>

        {/* Spending Chart */}
        <section>
          <h2 className="text-sm font-semibold text-muted-foreground mb-4 uppercase tracking-wide">
            Spending Trend
          </h2>
          <div className="bg-card rounded-2xl p-4 shadow-soft border border-border">
            <div className="flex items-end justify-between gap-2 h-40">
              {spendingData.map((data, index) => {
                const height = (data.amount / maxAmount) * 100;
                const isCurrentMonth = data.month === "Dec";
                return (
                  <div key={data.month} className="flex-1 flex flex-col items-center gap-2">
                    <div
                      className="w-full relative group"
                      style={{ height: "120px" }}
                    >
                      <div
                        className={`absolute bottom-0 w-full rounded-t-lg transition-all duration-300 ${
                          isCurrentMonth ? "bg-primary" : "bg-primary/30"
                        }`}
                        style={{ height: `${height}%` }}
                      />
                    </div>
                    <span
                      className={`text-xs ${
                        isCurrentMonth
                          ? "font-semibold text-primary"
                          : "text-muted-foreground"
                      }`}
                    >
                      {data.month}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Category Breakdown */}
        <section>
          <h2 className="text-sm font-semibold text-muted-foreground mb-4 uppercase tracking-wide">
            Spending by Category
          </h2>
          <div className="bg-card rounded-2xl p-4 shadow-soft border border-border">
            {/* Donut Chart Placeholder */}
            <div className="flex items-center justify-center mb-6">
              <div className="relative w-32 h-32">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                  {categoryBreakdown.reduce(
                    (acc, category, index) => {
                      const circumference = 2 * Math.PI * 40;
                      const strokeDasharray = (category.percentage / 100) * circumference;
                      const strokeDashoffset = acc.offset;

                      acc.elements.push(
                        <circle
                          key={category.name}
                          cx="50"
                          cy="50"
                          r="40"
                          fill="none"
                          stroke={`hsl(var(--${index === 0 ? "primary" : index === 1 ? "warning" : index === 2 ? "success" : "muted-foreground"}))`}
                          strokeWidth="16"
                          strokeDasharray={`${strokeDasharray} ${circumference}`}
                          strokeDashoffset={-strokeDashoffset}
                          className="transition-all duration-500"
                          style={{ opacity: 1 - index * 0.15 }}
                        />
                      );

                      acc.offset += strokeDasharray;
                      return acc;
                    },
                    { elements: [] as JSX.Element[], offset: 0 }
                  ).elements}
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <p className="text-xs text-muted-foreground">Total</p>
                    <p className="text-sm font-bold text-foreground">465K</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Category List */}
            <div className="space-y-3">
              {categoryBreakdown.map((category, index) => (
                <div
                  key={category.name}
                  className="flex items-center gap-3 animate-fade-in"
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  <div className={`w-3 h-3 rounded-full ${category.color}`} />
                  <span className="flex-1 text-sm text-foreground">
                    {category.name}
                  </span>
                  <span className="text-sm font-medium text-foreground">
                    {formatCurrency(category.amount)}
                  </span>
                  <span className="text-xs text-muted-foreground w-10 text-right">
                    {category.percentage}%
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <BottomNavigation />
    </div>
  );
}
