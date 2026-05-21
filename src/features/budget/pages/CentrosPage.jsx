import { useSearchParams } from "react-router-dom";
import { PageHeader } from "@/components/common/PageHeader";
import { CostCentersTable } from "@/features/budget/components/CostCentersTable";
import { KpiCard } from "@/features/budget/components/KpiCard";
import { costCenters } from "@/features/budget/data";
import { Building2, AlertTriangle } from "lucide-react";
import { useMemo } from "react";

export function CentrosPage() {
  const [searchParams] = useSearchParams();
  const q = searchParams.get("q") || "";

  const filteredForKpis = useMemo(() => {
    if (!q?.trim()) return costCenters;
    const s = q.trim().toLowerCase();
    return costCenters.filter((c) =>
      [c.departamento, c.codigo, c.gestor].some((x) => x.toLowerCase().includes(s))
    );
  }, [q]);

  const total = filteredForKpis.reduce((acc, c) => acc + c.orcamento, 0);
  const realizado = filteredForKpis.reduce((acc, c) => acc + c.realizado, 0);
  const emAlerta = filteredForKpis.filter((c) => c.realizado / c.orcamento >= 0.95).length;
  const onTrack = filteredForKpis.filter((c) => c.realizado / c.orcamento < 0.8).length;

  return (
    <>
      <PageHeader
        eyebrow="Estrutura · Controladoria"
        title="Centros de Custo"
        description="Hierarquia de centros de custo da organização com orçamento aprovado, gestor responsável e desempenho atual."
      />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <KpiCard
          label="Centros Ativos"
          value={String(filteredForKpis.length)}
          icon={Building2}
          hint={q ? `Filtrados pela busca · total global ${costCenters.length}` : "Distribuídos em 7 áreas"}
        />
        <KpiCard
          label="Orçamento Consolidado"
          value={total}
          formatAsCurrency
          icon={Building2}
        />
        <KpiCard
          label="Realizado"
          value={realizado}
          formatAsCurrency
          progress={total > 0 ? (realizado / total) * 100 : 0}
        />
        <KpiCard
          label="No Limite"
          value={String(emAlerta)}
          tone={emAlerta > 0 ? "negative" : "neutral"}
          icon={AlertTriangle}
          hint={`${onTrack} dentro do previsto`}
        />
      </div>
      <CostCentersTable searchText={q} />
    </>
  );
}
