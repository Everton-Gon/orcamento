import { PageHeader } from "@/components/common/PageHeader";
import { BudgetTrendChart } from "@/features/budget/components/BudgetTrendChart";
import { DepartmentRealizadoChart } from "@/features/budget/components/DepartmentRealizadoChart";
import { ReportsDownloadsCard } from "@/features/budget/components/ReportsDownloadsCard";

export function RelatoriosPage() {
  return (
    <>
      <PageHeader
        eyebrow="Análise Gerencial"
        title="Relatórios"
        description="Visões consolidadas para diretoria e exportações compatíveis com SAP, TOTVS e BI corporativo."
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2">
          <BudgetTrendChart />
        </div>
        <DepartmentRealizadoChart />
      </div>

      <ReportsDownloadsCard />
    </>
  );
}
