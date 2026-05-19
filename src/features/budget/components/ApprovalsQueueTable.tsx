import { brl, type Approval } from "@/features/budget/data";
import { Check, X } from "lucide-react";
import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

type Props = {
  items: Approval[];
  highlightReqId?: string;
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
};

export function ApprovalsQueueTable({
  items,
  highlightReqId,
  onApprove,
  onReject,
}: Props) {
  const highlightRef = useRef<HTMLTableRowElement | null>(null);

  useEffect(() => {
    if (!highlightReqId) return;
    const id = requestAnimationFrame(() => {
      highlightRef.current?.scrollIntoView({ block: "center", behavior: "smooth" });
    });
    return () => cancelAnimationFrame(id);
  }, [highlightReqId]);

  return (
    <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
      <table className="w-full text-left">
        <thead>
          <tr className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest border-b border-border bg-muted/30">
            <th className="px-5 py-3">ID</th>
            <th className="px-5 py-3">Requisição</th>
            <th className="px-5 py-3">Centro de Custo</th>
            <th className="px-5 py-3">Solicitante</th>
            <th className="px-5 py-3">Status</th>
            <th className="px-5 py-3 text-right">Valor</th>
            <th className="px-5 py-3">Nível</th>
            <th className="px-5 py-3 text-right">Ações</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border text-sm">
          {items.length === 0 ? (
            <tr>
              <td
                colSpan={8}
                className="px-5 py-20 text-center text-muted-foreground"
              >
                Nenhuma aprovação pendente. Bom trabalho!
              </td>
            </tr>
          ) : (
            items.map((a) => {
              const isHi = highlightReqId === a.id;
              return (
                <tr
                  key={a.id}
                  ref={isHi ? highlightRef : undefined}
                  className={cn(
                    "hover:bg-muted/40 transition-colors",
                    isHi && "bg-primary/5 ring-2 ring-inset ring-primary/40",
                  )}
                >
                  <td className="px-5 py-4 font-mono text-xs text-muted-foreground">{a.id}</td>
                  <td className="px-5 py-4 font-semibold text-foreground">{a.titulo}</td>
                  <td className="px-5 py-4 text-muted-foreground">{a.centro}</td>
                  <td className="px-5 py-4 text-muted-foreground">{a.solicitante}</td>
                  <td className="px-5 py-4">
                    <span
                      className={`text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded ${
                        a.status === "urgente"
                          ? "bg-destructive/10 text-destructive"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {a.status}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-right font-bold tabular-nums">{brl(a.valor)}</td>
                  <td className="px-5 py-4 text-xs text-muted-foreground">{a.nivel}</td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-1.5 justify-end">
                      <button
                        type="button"
                        onClick={() => onReject(a.id)}
                        className="h-8 w-8 grid place-items-center rounded-md border border-border hover:bg-destructive/10 hover:border-destructive/30 hover:text-destructive transition-colors"
                        aria-label={`Rejeitar ${a.id}`}
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => onApprove(a.id)}
                        className="h-8 px-3 text-xs font-semibold rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-colors flex items-center gap-1.5"
                      >
                        <Check className="h-3.5 w-3.5" /> Aprovar
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
  );
}
