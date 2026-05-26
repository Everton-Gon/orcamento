import { brl } from "@/features/budget/data";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { useBudgetSession } from "@/features/budget/BudgetSessionContext";
import { REQUEST_TYPE_LABELS } from "@/features/budget/lib/requestTypes";
import { getCurrentWorkflowStep } from "@/features/budget/lib/workflow";

export function ApprovalsList({ limit = 4 }) {
  const { approvals } = useBudgetSession();
  const items = approvals.slice(0, limit);

  return (
    <div className="bg-card rounded-xl border border-border shadow-sm flex flex-col h-full">
      <div className="p-5 border-b border-border flex items-center justify-between">
        <div>
          <h3 className="font-bold text-foreground">Fila de Aprovação</h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            {approvals.length} requisições pendentes
          </p>
        </div>
      </div>
      <div className="flex-1 divide-y divide-border">
        {items.map((a) => (
          <Link
            key={a.id}
            to="/aprovacoes"
            search={{ req: a.id }}
            className="block w-full text-left p-4 hover:bg-muted/50 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] font-mono text-muted-foreground">
                {a.id}
              </span>
              <span
                className={`text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded ${
                  a.status === "urgente"
                    ? "bg-destructive/10 text-destructive"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                {a.status}
              </span>
            </div>
            <p className="text-[10px] text-muted-foreground mb-0.5">
              {REQUEST_TYPE_LABELS[a.tipo] ?? "Solicitação"}
            </p>
            <p className="text-sm font-semibold text-foreground">{a.titulo}</p>
            <p className="text-xs text-muted-foreground">{a.centro}</p>
            {getCurrentWorkflowStep(a) ? (
              <p className="text-[10px] text-primary mt-1">
                Aguarda: {getCurrentWorkflowStep(a).nome}
              </p>
            ) : null}
            <div className="flex items-center justify-between mt-2">
              <span className="text-sm font-bold tabular-nums">
                {a.valor > 0 ? brl(a.valor) : "—"}
              </span>
              <span className="text-[11px] text-muted-foreground">Vence {a.prazo}</span>
            </div>
          </Link>
        ))}
      </div>
      <Link
        to="/aprovacoes"
        className="p-4 text-center text-xs font-bold text-foreground hover:bg-muted border-t border-border flex items-center justify-center gap-1.5"
      >
        Ver todas as pendências <ArrowRight className="h-3 w-3" />
      </Link>
    </div>
  );
}
