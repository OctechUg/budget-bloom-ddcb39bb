import { useMemo } from "react";

interface FundDistributionProps {
  available: number;
  budgeted: number;
  savings: number;
}

export function FundDistribution({ available, budgeted, savings }: FundDistributionProps) {
  const total = available + budgeted + savings;

  const segments = useMemo(() => {
    if (total === 0) return [
      { label: "Available", percent: 33.3, color: "hsl(var(--success))" },
      { label: "Budgeted", percent: 33.3, color: "hsl(var(--primary))" },
      { label: "Savings", percent: 33.4, color: "hsl(var(--warning))" },
    ];
    return [
      { label: "Available", percent: (available / total) * 100, color: "hsl(var(--success))" },
      { label: "Budgeted", percent: (budgeted / total) * 100, color: "hsl(var(--primary))" },
      { label: "Savings", percent: (savings / total) * 100, color: "hsl(var(--warning))" },
    ];
  }, [available, budgeted, savings, total]);

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat("en-UG", { style: "currency", currency: "UGX", minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(value);

  // SVG donut chart
  const radius = 70;
  const strokeWidth = 14;
  const circumference = 2 * Math.PI * radius;
  let cumulativeOffset = 0;

  return (
    <div className="glass-card rounded-2xl p-5">
      <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-4">
        Fund Distribution
      </h3>

      <div className="flex items-center gap-6">
        {/* Donut Chart */}
        <div className="relative shrink-0">
          <svg width="160" height="160" viewBox="0 0 160 160">
            {/* Background circle */}
            <circle
              cx="80" cy="80" r={radius}
              fill="none"
              stroke="hsl(var(--muted))"
              strokeWidth={strokeWidth}
            />
            {/* Segments */}
            {segments.map((seg, i) => {
              const dashLength = (seg.percent / 100) * circumference;
              const dashGap = circumference - dashLength;
              const offset = -cumulativeOffset + circumference * 0.25;
              cumulativeOffset += dashLength;

              return (
                <circle
                  key={i}
                  cx="80" cy="80" r={radius}
                  fill="none"
                  stroke={seg.color}
                  strokeWidth={strokeWidth}
                  strokeDasharray={`${dashLength} ${dashGap}`}
                  strokeDashoffset={offset}
                  strokeLinecap="round"
                  className="transition-all duration-700"
                />
              );
            })}
          </svg>
          {/* Center text */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-[10px] text-muted-foreground">Total</span>
            <span className="text-lg font-bold text-foreground">
              {total > 0 ? formatCurrency(total) : "UGX 0"}
            </span>
          </div>
        </div>

        {/* Legend */}
        <div className="flex-1 space-y-3">
          {segments.map((seg, i) => (
            <div key={i} className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: seg.color }} />
              <div className="flex-1 min-w-0">
                <p className="text-xs text-muted-foreground">{seg.label}</p>
                <p className="text-sm font-semibold text-foreground">
                  {formatCurrency(i === 0 ? available : i === 1 ? budgeted : savings)}
                </p>
              </div>
              <span className="text-xs text-muted-foreground font-mono">
                {total > 0 ? `${seg.percent.toFixed(0)}%` : "0%"}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
