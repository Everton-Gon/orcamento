import { getRouteApi } from "@tanstack/react-router";
import { PageHeader } from "@/components/common/PageHeader";
import { KpiCard } from "@/features/budget/components/KpiCard";
import { ApprovalsQueueTable } from "@/features/budget/components/ApprovalsQueueTable";
import { useBudgetSession } from "@/features/budget/BudgetSessionContext";
import { Clock, AlertTriangle, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

const aprovacoesRoute = getRouteApi("/_app/aprovacoes");

export function AprovacoesPage() {
  const { req: highlightReq } = aprovacoesRoute.useSearch();
  const { approvals, removeApproval } = useBudgetSession();

  const handleApprove = (id: string) => {
    removeApproval(id);
    toast.success(`Requisição ${id} aprovada com sucesso!`);
  };

  const handleReject = (id: string) => {
    removeApproval(id);
    toast.error(`Requisição ${id} foi rejeitada.`);
  };

  const totalPendencias = approvals.length;
  const totalValor = approvals.reduce((acc, curr) => acc + curr.valor, 0);
  const urgentes = approvals.filter((a) => a.status === "urgente").length;

  return (
    <>
      <PageHeader
        eyebrow="Workflow Multinível"
        title="Fila de Aprovações"
        description="Requisições aguardando deliberação. Cada nível segue a alçada definida na matriz de governança."
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <KpiCard label="Total Pendente" value={String(totalPendencias)} icon={Clock} />
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
        onApprove={handleApprove}
        onReject={handleReject}
      />
    </>
  );
}
