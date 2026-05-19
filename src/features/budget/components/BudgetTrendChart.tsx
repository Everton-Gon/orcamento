import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import { trendData } from "@/features/budget/data";
import { useState, useEffect } from "react";

type TrendRow = (typeof trendData)[number];

function CustomTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: Array<{
    dataKey?: string | number;
    value?: number;
    color?: string;
  }>;
  label?: string;
}) {
  if (!active || !payload?.length) return null;
  return (
    <div
      style={{
        background: "var(--card)",
        border: "1px solid var(--border)",
        borderRadius: 8,
        padding: "10px 14px",
        fontSize: 12,
      }}
    >
      <p className="font-semibold text-foreground mb-1">{label}</p>
      {payload.map((p) => (
        <p
          key={String(p.dataKey)}
          style={{ color: p.color }}
          className="mb-0.5"
        >
          {p.dataKey === "previsto" ? "Previsto" : "Realizado"}:{" "}
          <strong>R$ {p.value} mil</strong>
        </p>
      ))}
    </div>
  );
}

export function BudgetTrendChart() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return <div className="h-72 w-full bg-muted/10 animate-pulse rounded-lg" />;
  }

  return (
    <div className="bg-card p-6 rounded-xl border border-border shadow-sm h-full">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="font-bold text-foreground">Previsto vs Realizado</h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            Tendência mensal · valores em R$ mil
          </p>
        </div>
        <div className="flex gap-4 text-xs">
          <div className="flex items-center gap-2">
            <span
              className="inline-block h-px w-6 bg-muted-foreground/40"
              style={{
                borderTop: "2px dashed var(--muted-foreground)",
                opacity: 0.5,
              }}
            />
            <span className="text-muted-foreground">Previsto</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="inline-block h-0.5 w-6 rounded bg-accent" />
            <span className="text-muted-foreground">Realizado</span>
          </div>
        </div>
      </div>

      <div className="h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={trendData as TrendRow[]}
            margin={{ top: 4, right: 8, left: -8, bottom: 0 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="var(--border)"
              vertical={false}
            />
            <XAxis
              dataKey="mes"
              stroke="var(--muted-foreground)"
              fontSize={11}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              stroke="var(--muted-foreground)"
              fontSize={11}
              tickLine={false}
              axisLine={false}
              tickFormatter={(v) => `${v}k`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Line
              type="monotone"
              dataKey="previsto"
              stroke="var(--muted-foreground)"
              strokeWidth={1.5}
              strokeDasharray="5 3"
              dot={false}
              strokeOpacity={0.5}
            />
            <Line
              type="monotone"
              dataKey="realizado"
              stroke="var(--accent)"
              strokeWidth={2.5}
              dot={{ r: 3.5, fill: "var(--accent)", strokeWidth: 0 }}
              activeDot={{ r: 5, fill: "var(--accent)", strokeWidth: 0 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
