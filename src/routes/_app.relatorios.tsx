import { createFileRoute } from "@tanstack/react-router";
import { RelatoriosPage } from "@/features/budget/pages/RelatoriosPage";

export const Route = createFileRoute("/_app/relatorios")({
  component: RelatoriosPage,
  head: () => ({
    meta: [
      { title: "Relatórios · Axiom Budget" },
      {
        name: "description",
        content:
          "Relatórios gerenciais consolidados, drill-down por período e exportação para BI.",
      },
    ],
  }),
});
