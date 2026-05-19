import { recentActivity, brl } from "@/features/budget/data";

function initials(name: string) {
  return name
    .split(" ")
    .map((s) => s[0])
    .slice(0, 2)
    .join("");
}

export function RecentActivityFeed() {
  return (
    <div className="bg-card rounded-xl border border-border shadow-sm">
      <div className="p-5 border-b border-border">
        <h3 className="font-bold text-foreground">Atividade Recente</h3>
        <p className="text-xs text-muted-foreground mt-0.5">
          Últimos eventos no sistema
        </p>
      </div>
      <div className="divide-y divide-border">
        {recentActivity.map((a, i) => (
          <div key={i} className="p-4 flex items-start gap-3">
            <div className="size-8 rounded-full bg-muted grid place-items-center text-[10px] font-bold text-muted-foreground shrink-0">
              {initials(a.quem)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs">
                <span className="font-semibold text-foreground">{a.quem}</span>{" "}
                <span className="text-muted-foreground">{a.acao}</span>{" "}
                <span className="font-medium text-foreground">{a.alvo}</span>
              </p>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-[11px] text-muted-foreground">
                  {a.quando}
                </span>
                {a.valor != null ? (
                  <span className="text-[11px] font-bold tabular-nums text-foreground">
                    · {brl(a.valor)}
                  </span>
                ) : null}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
