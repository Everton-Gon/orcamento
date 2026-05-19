import { createFileRoute } from "@tanstack/react-router";
import { DashboardPage } from "@/features/budget/pages/DashboardPage";

export const Route = createFileRoute("/_app/")({
  component: DashboardPage,
  head: () => ({
    meta: [
      { title: "Dashboard · Axiom Budget Corporativo" },
      {
        name: "description",
        content:
          "Painel executivo de controle orçamentário com centros de custo, aprovações multinível e KPIs financeiros.",
      },
    ],
  }),
});
