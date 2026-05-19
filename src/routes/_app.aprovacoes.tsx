import { createFileRoute } from "@tanstack/react-router";
import { AprovacoesPage } from "@/features/budget/pages/AprovacoesPage";

export const Route = createFileRoute("/_app/aprovacoes")({
  validateSearch: (raw: Record<string, unknown>) => ({
    req:
      typeof raw.req === "string" && raw.req.trim().length > 0
        ? raw.req.trim()
        : undefined,
  }),
  component: AprovacoesPage,
  head: () => ({
    meta: [
      { title: "Aprovações · Axiom Budget" },
      {
        name: "description",
        content:
          "Fila de aprovações orçamentárias com fluxo multinível: gerente, diretor e comitê.",
      },
    ],
  }),
});
