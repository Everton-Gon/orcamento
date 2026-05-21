import { costCenters, brl } from "@/features/budget/data";
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from "recharts";
import { useState, useEffect } from "react";

const COLORS = [
  "var(--chart-1, #10b981)",
  "var(--chart-2, #6366f1)",
  "var(--chart-3, #f59e0b)",
  "var(--chart-4, #3b82f6)",
  "var(--chart-5, #ef4444)",
  "var(--accent,  #10b981)",
  "var(--muted-foreground, #9ca3af)",
];

function PieTooltip({ active, payload }) {
  if (!active || !payload?.length) return null;
  const row = payload[0].payload;
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
      <p className="font-semibold text-foreground mb-1">{row.name}</p>
      <p className="text-muted-foreground">
        Realizado: <strong className="text-foreground">{brl(row.value)}</strong>
      </p>
      <p className="text-muted-foreground">
        {((row.value / row.total) * 100).toFixed(1)}% do total
      </p>
    </div>
  );
}

export function DepartmentRealizadoChart() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const totalRealizado = costCenters.reduce((s, c) => s + c.realizado, 0);
  const distribution = costCenters.map((c) => ({
    name: c.departamento,
    value: c.realizado,
    total: totalRealizado,
  }));

  return (
    <div className="bg-card p-6 rounded-xl border border-border shadow-sm flex flex-col">
      <h3 className="font-bold text-foreground mb-1">
        Distribuição do Realizado
      </h3>
      <p className="text-xs text-muted-foreground mb-4">
        Por departamento · YTD
      </p>

      <div className="flex-1 min-h-[220px]">
        {isMounted ? (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={distribution}
                dataKey="value"
                nameKey="name"
                innerRadius="38%"
                outerRadius="70%"
                paddingAngle={2}
                startAngle={90}
                endAngle={-270}
              >
                {distribution.map((_, i) => (
                  <Cell
                    key={`slice-${i}`}
                    fill={COLORS[i % COLORS.length]}
                    stroke="var(--card)"
                    strokeWidth={2}
                  />
                ))}
              </Pie>
              <Tooltip content={<PieTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        ) : (
          <div className="size-full bg-muted/10 animate-pulse rounded-full" />
        )}
      </div>

      <div className="grid grid-cols-2 gap-x-4 gap-y-2 mt-4 border-t border-border pt-4">
        {distribution.map((d, i) => (
          <div key={d.name} className="flex items-center gap-2 min-w-0">
            <span
              className="size-2 rounded-full shrink-0"
              style={{ backgroundColor: COLORS[i % COLORS.length] }}
            />
            <span
              className="text-[10px] text-muted-foreground truncate"
              title={d.name}
            >
              {d.name}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
