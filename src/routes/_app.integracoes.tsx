import { createFileRoute } from "@tanstack/react-router";
import { IntegracoesPage } from "@/features/budget/pages/IntegracoesPage";

export const Route = createFileRoute("/_app/integracoes")({
  component: IntegracoesPage,
  head: () => ({
    meta: [
      { title: "Integrações ERP · Axiom Budget" },
      {
        name: "description",
        content:
          "Conectores nativos para SAP, TOTVS Protheus, Oracle e Senior.",
      },
    ],
  }),
});
