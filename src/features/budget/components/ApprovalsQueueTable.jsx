import { useState } from "react";
import { brl } from "@/features/budget/data";
import { REQUEST_TYPE_LABELS } from "@/features/budget/lib/requestTypes";
import { canUserApproveStep, getCurrentWorkflowStep } from "@/features/budget/lib/workflow";
import { RequestWorkflowSteps } from "@/features/budget/components/RequestWorkflowSteps";
import { useAuth } from "@/contexts/AuthContext";
import { Check, X, Eye, Mail } from "lucide-react";
import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export function ApprovalsQueueTable({
  items,
  highlightReqId,
  onApproveStep,
  onReject,
}) {
  const { user } = useAuth();
  const [detailReq, setDetailReq] = useState(null);
  const highlightRef = useRef(null);

  useEffect(() => {
    if (!highlightReqId) return;
    const id = requestAnimationFrame(() => {
      highlightRef.current?.scrollIntoView({ block: "center", behavior: "smooth" });
    });
    return () => cancelAnimationFrame(id);
  }, [highlightReqId]);

  return (
    <>
      <div className="bg-card rounded-xl border border-border shadow-sm overflow-x-auto">
        <table className="w-full text-left min-w-[960px]">
          <thead>
            <tr className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest border-b border-border bg-muted/30">
              <th className="px-4 py-3">ID</th>
              <th className="px-4 py-3">Tipo</th>
              <th className="px-4 py-3">Solicitação</th>
              <th className="px-4 py-3">Centro</th>
              <th className="px-4 py-3">Aprovação</th>
              <th className="px-4 py-3 text-right">Valor</th>
              <th className="px-4 py-3 text-right">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border text-sm">
            {items.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-5 py-20 text-center text-muted-foreground">
                  Nenhuma aprovação pendente. Bom trabalho!
                </td>
              </tr>
            ) : (
              items.map((a) => {
                const isHi = highlightReqId === a.id;
                const current = getCurrentWorkflowStep(a);
                const canApprove = user && canUserApproveStep(a, user.email);
                const tipoLabel = REQUEST_TYPE_LABELS[a.tipo] ?? a.tipo;

                return (
                  <tr
                    key={a.id}
                    ref={isHi ? highlightRef : undefined}
                    className={cn(
                      "hover:bg-muted/40 transition-colors",
                      isHi && "bg-primary/5 ring-2 ring-inset ring-primary/40",
                      canApprove && "bg-accent/5",
                    )}
                  >
                    <td className="px-4 py-3 font-mono text-xs text-muted-foreground">{a.id}</td>
                    <td className="px-4 py-3">
                      <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-muted">
                        {tipoLabel}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <p className="font-semibold text-foreground">{a.titulo}</p>
                      <p className="text-xs text-muted-foreground">{a.solicitante}</p>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground text-xs">{a.centro}</td>
                    <td className="px-4 py-3">
                      <RequestWorkflowSteps request={a} compact />
                      {current ? (
                        <p className="text-[10px] text-primary mt-1 flex items-center gap-1">
                          <Mail className="h-3 w-3" />
                          {current.email}
                        </p>
                      ) : null}
                    </td>
                    <td className="px-4 py-3 text-right font-bold tabular-nums">
                      {a.valor > 0 ? brl(a.valor) : "—"}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1 justify-end flex-wrap">
                        <button
                          type="button"
                          onClick={() => setDetailReq(a)}
                          className="h-8 w-8 grid place-items-center rounded-md border border-border hover:bg-muted"
                          title="Ver fluxo"
                        >
                          <Eye className="h-3.5 w-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => onReject(a.id, user?.email)}
                          disabled={!canApprove}
                          className="h-8 w-8 grid place-items-center rounded-md border border-border hover:bg-destructive/10 hover:border-destructive/30 hover:text-destructive transition-colors disabled:opacity-40"
                          aria-label={`Rejeitar ${a.id}`}
                        >
                          <X className="h-3.5 w-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => onApproveStep(a.id, user?.email)}
                          disabled={!canApprove}
                          className="h-8 px-2.5 text-xs font-semibold rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-colors flex items-center gap-1 disabled:opacity-40"
                          title={
                            canApprove
                              ? "Aprovar etapa atual"
                              : `Aguardando ${current?.email ?? "outro aprovador"}`
                          }
                        >
                          <Check className="h-3.5 w-3.5" />
                          Aprovar
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      <Dialog open={!!detailReq} onOpenChange={(o) => !o && setDetailReq(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-base">
              Fluxo · {detailReq?.id}
            </DialogTitle>
          </DialogHeader>
          {detailReq ? (
            <div className="space-y-4">
              <div>
                <p className="text-sm font-semibold">{detailReq.titulo}</p>
                <p className="text-xs text-muted-foreground">
                  {REQUEST_TYPE_LABELS[detailReq.tipo]} · {detailReq.solicitante}
                </p>
              </div>
              <RequestWorkflowSteps request={detailReq} />
              {user && canUserApproveStep(detailReq, user.email) ? (
                <Button
                  type="button"
                  className="w-full"
                  onClick={() => {
                    onApproveStep(detailReq.id, user.email);
                    setDetailReq(null);
                  }}
                >
                  Aprovar como {user.email}
                </Button>
              ) : (
                <p className="text-xs text-muted-foreground text-center">
                  Inicie sessão com o e-mail do aprovador atual para aprovar nesta etapa.
                </p>
              )}
            </div>
          ) : null}
        </DialogContent>
      </Dialog>
    </>
  );
}
