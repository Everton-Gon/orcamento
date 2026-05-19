import { useState } from "react";
import { PageHeader } from "@/components/common/PageHeader";
import { KpiCard } from "@/features/budget/components/KpiCard";
import { BudgetTrendChart } from "@/features/budget/components/BudgetTrendChart";
import { ApprovalsList } from "@/features/budget/components/ApprovalsList";
import { CostCentersTable } from "@/features/budget/components/CostCentersTable";
import { RecentActivityFeed } from "@/features/budget/components/RecentActivityFeed";
import { NewRequestDialog } from "@/features/budget/components/NewRequestDialog";
import { totals, brl } from "@/features/budget/data";
import { downloadTextFile } from "@/features/budget/lib/downloadFile";
import {
  Wallet,
  Activity,
  AlertTriangle,
  Clock,
  Download,
  Plus,
} from "lucide-react";
import { toast } from "sonner";

export function DashboardPage() {
  const [novaOpen, setNovaOpen] = useState(false);

  const exportDashboard = () => {
    const lines = [
      "Indicador,Valor",
      `Orçamento Total,${totals.orcamento}`,
      `Realizado YTD,${totals.realizado}`,
      `Saldo Disponível,${totals.saldo}`,
      `Desvio projetado (%),${totals.desvio}`,
      `Burn rate mensal,${totals.burnRate}`,
      "",
      "Gerado em," + new Date().toISOString(),
    ];
    downloadTextFile(
      `dashboard_orcamento_${new Date().toISOString().split("T")[0]}.csv`,
      lines.join("\n"),
      "text/csv;charset=utf-8",
    );
    toast.success("Relatório consolidado exportado (CSV).");
  };

  return (
    <>
      <PageHeader
        eyebrow="Visão Geral · EXERCÍCIO 2024"
        title="Painel de Controle Orçamentário"
        description="Consolidação de todos os centros de custo, aprovações pendentes e tendência previsto vs realizado."
        actions={
          <>
            <button
              type="button"
              onClick={exportDashboard}
              className="px-3 h-9 text-xs font-semibold border border-border rounded-md hover:bg-muted transition-colors flex items-center gap-1.5"
            >
              <Download className="h-3.5 w-3.5" /> Exportar
            </button>
            <button
              type="button"
              onClick={() => setNovaOpen(true)}
              className="px-3 h-9 text-xs font-semibold bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors flex items-center gap-1.5"
            >
              <Plus className="h-3.5 w-3.5" /> Nova requisição
            </button>
          </>
        }
      />

      <NewRequestDialog open={novaOpen} onOpenChange={setNovaOpen} />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <KpiCard
          label="Orçamento Total"
          value={totals.orcamento}
          formatAsCurrency
          delta={{ value: "↑ 12% vs 2023", positive: true }}
          icon={Wallet}
        />
        <KpiCard
          label="Realizado YTD"
          value={totals.realizado}
          formatAsCurrency
          progress={(totals.realizado / totals.orcamento) * 100}
          hint={`${Math.round((totals.realizado / totals.orcamento) * 100)}% consumido`}
          icon={Activity}
        />
        <KpiCard
          label="Saldo Disponível"
          value={totals.saldo}
          formatAsCurrency
          hint={`Burn rate ${brl(totals.burnRate)}/mês`}
          icon={Clock}
        />
        <KpiCard
          label="Desvio Projetado"
          value={`${totals.desvio}%`}
          tone="negative"
          delta={{ value: "Acima da meta em 2 CCs", positive: false }}
          icon={AlertTriangle}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2">
          <BudgetTrendChart />
        </div>
        <ApprovalsList />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2">
          <CostCentersTable />
        </div>
        <RecentActivityFeed />
      </div>
    </>
  );
}
