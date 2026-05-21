import { PageHeader } from "@/components/common/PageHeader";
import { IntegrationsGrid } from "@/features/budget/components/IntegrationsGrid";

export function IntegracoesPage() {
  return (
    <>
      <PageHeader
        eyebrow="Conectores"
        title="Integrações ERP"
        description="Sincronize lançamentos, centros de custo e fluxo de aprovações com seu ERP corporativo."
      />
      <IntegrationsGrid />
    </>
  );
}
