import { cn } from "@/lib/utils";
import { Mail, Check, Clock, Ban } from "lucide-react";
import { formatWorkflowProgress } from "@/features/budget/lib/workflow";

const statusIcon = {
  aprovado: Check,
  aguardando: Clock,
  bloqueado: Ban,
  rejeitado: Ban,
};

const statusClass = {
  aprovado: "bg-success/15 text-success border-success/30",
  aguardando: "bg-primary/15 text-primary border-primary/40",
  bloqueado: "bg-muted text-muted-foreground border-border",
  rejeitado: "bg-destructive/10 text-destructive border-destructive/30",
};

export function RequestWorkflowSteps({ request, compact = false }) {
  if (!request?.workflow?.length) return null;

  if (compact) {
    const current = request.workflow.find((s) => s.status === "aguardando");
    return (
      <div className="text-[10px] text-muted-foreground">
        <span className="font-medium text-foreground">
          {formatWorkflowProgress(request)}
        </span>
        {current ? (
          <span className="block truncate max-w-[180px]" title={current.email}>
            Aguarda: {current.nome}
          </span>
        ) : null}
      </div>
    );
  }

  return (
    <ol className="space-y-2 min-w-[220px]">
      {request.workflow.map((step) => {
        const Icon = statusIcon[step.status] ?? Clock;
        return (
          <li
            key={step.key}
            className={cn(
              "flex gap-2 rounded-lg border px-2.5 py-2 text-[11px]",
              statusClass[step.status],
            )}
          >
            <Icon className="h-3.5 w-3.5 shrink-0 mt-0.5" />
            <div className="min-w-0 flex-1">
              <p className="font-semibold">{step.label}</p>
              <p className="truncate">{step.nome}</p>
              <p className="truncate opacity-80 flex items-center gap-1">
                <Mail className="h-3 w-3 shrink-0" />
                {step.email}
              </p>
              {step.notifiedAt && step.status === "aguardando" ? (
                <p className="text-[10px] mt-0.5 opacity-70">E-mail de aprovação enviado</p>
              ) : null}
              {step.status === "aprovado" && step.decidedAt ? (
                <p className="text-[10px] mt-0.5 opacity-70">Aprovado</p>
              ) : null}
            </div>
          </li>
        );
      })}
    </ol>
  );
}
