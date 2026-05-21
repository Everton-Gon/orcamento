import { brl } from "@/features/budget/data";
import { TrendingUp, TrendingDown } from "lucide-react";

export function KpiCard({
  label,
  value,
  formatAsCurrency,
  hint,
  delta,
  progress,
  tone = "neutral",
  icon: Icon,
}) {
  const display =
    typeof value === "number" && formatAsCurrency ? brl(value) : value;
  const accentBorder =
    tone === "accent"
      ? "border-l-4 border-l-accent"
      : tone === "negative"
        ? "border-l-4 border-l-destructive"
        : "";

  return (
    <div
      className={`bg-card p-5 rounded-xl border border-border shadow-sm ${accentBorder}`}
    >
      <div className="flex items-center justify-between mb-3">
        <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
          {label}
        </p>
        {Icon ? <Icon className="h-4 w-4 text-muted-foreground/60" /> : null}
      </div>
      <p className="text-2xl font-bold tracking-tight tabular-nums text-foreground">
        {display}
      </p>
      {progress !== undefined ? (
        <div className="mt-4 h-1.5 w-full bg-muted rounded-full overflow-hidden">
          <div
            className="h-full bg-accent rounded-full"
            style={{ width: `${Math.min(progress, 100)}%` }}
          />
        </div>
      ) : null}
      {delta ? (
        <div
          className={`mt-3 flex items-center gap-1.5 text-xs font-medium ${
            delta.positive ? "text-success" : "text-destructive"
          }`}
        >
          {delta.positive ? (
            <TrendingUp className="h-3 w-3" />
          ) : (
            <TrendingDown className="h-3 w-3" />
          )}
          <span>{delta.value}</span>
        </div>
      ) : null}
      {hint ? (
        <p className="mt-3 text-xs text-muted-foreground">{hint}</p>
      ) : null}
    </div>
  );
}
