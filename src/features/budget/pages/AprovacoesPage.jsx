import { useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { PageHeader } from "@/components/common/PageHeader";
import { KpiCard } from "@/features/budget/components/KpiCard";
import { ApprovalsQueueTable } from "@/features/budget/components/ApprovalsQueueTable";
import { useBudgetSession } from "@/features/budget/BudgetSessionContext";
import { useAuth } from "@/contexts/AuthContext";
import { canUserApproveStep, FIXED_APPROVERS } from "@/features/budget/lib/workflow";
import { Clock, AlertTriangle, CheckCircle2, Mail } from "lucide-react";
import { toast } from "sonner";

export function AprovacoesPage() {
  const [searchParams] = useSearchParams();
  const highlightReq = searchParams.get("req") || undefined;
  const { approvals, advanceRequestStep, rejectRequest } = useBudgetSession();
  const { user } = useAuth();

  const minhasPendencias = useMemo(
    () =>
      user
        ? approvals.filter((a) => canUserApproveStep(a, user.email))
        : [],
    [approvals, user],
  );

  const handleApprove = (id, email) => {
    advanceRequestStep(id, email);
  };

  const handleReject = (id, email) => {
    rejectRequest(id, email);
  };

  const totalPendencias = approvals.length;
  const totalValor = approvals.reduce((acc, curr) => acc + (curr.valor || 0), 0);
  const urgentes = approvals.filter((a) => a.status === "urgente").length;

  return (
    <>
      <PageHeader
        eyebrow="Workflow Multinível"
        title="Fila de Aprovações"
        description="Analista, gestor da área e diretor corporativo aprovam em sequência. Cada etapa dispara um e-mail de notificação ao próximo aprovador."
      />

      {user ? (
        <div className="mb-6 rounded-xl border border-border bg-card p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <p className="text-sm font-semibold text-foreground flex items-center gap-2">
              <Mail className="h-4 w-4 text-muted-foreground" />
              Sessão: {user.email}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              {minhasPendencias.length > 0
                ? `${minhasPendencias.length} solicitação(ões) aguardam sua aprovação nesta etapa.`
                : "Nenhuma solicitação pendente para o seu e-mail no momento."}
            </p>
          </div>
          <div className="text-[10px] text-muted-foreground space-y-1 sm:text-right">
            <p>
              <span className="font-medium text-foreground">Analista:</span>{" "}
              {FIXED_APPROVERS.analista.email}
            </p>
            <p>
              <span className="font-medium text-foreground">Diretor:</span>{" "}
              {FIXED_APPROVERS.diretor_corporativo.email}
            </p>
            <p>
              <span className="font-medium text-foreground">Gestor:</span> e-mail do gestor do CC
            </p>
          </div>
        </div>
      ) : null}

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <KpiCard label="Total Pendente" value={String(totalPendencias)} icon={Clock} />
        <KpiCard
          label="Minha etapa"
          value={String(minhasPendencias.length)}
          tone={minhasPendencias.length > 0 ? "accent" : "neutral"}
          icon={CheckCircle2}
        />
        <KpiCard label="Valor em Análise" value={totalValor} formatAsCurrency icon={CheckCircle2} />
        <KpiCard
          label="Urgentes"
          value={String(urgentes)}
          tone={urgentes > 0 ? "negative" : "neutral"}
          icon={AlertTriangle}
        />
      </div>

      <ApprovalsQueueTable
        items={approvals}
        highlightReqId={highlightReq}
        onApproveStep={handleApprove}
        onReject={handleReject}
      />
    </>
  );
}
