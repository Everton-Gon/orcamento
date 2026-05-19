import { createFileRoute } from "@tanstack/react-router";
import { CentrosPage } from "@/features/budget/pages/CentrosPage";

export const Route = createFileRoute("/_app/centros")({
  validateSearch: (raw: Record<string, unknown>) => ({
    q:
      typeof raw.q === "string" && raw.q.trim().length > 0
        ? raw.q.trim()
        : undefined,
  }),
  component: CentrosPage,
  head: () => ({
    meta: [
      { title: "Centros de Custo · Axiom Budget" },
      {
        name: "description",
        content:
          "Visão consolidada dos centros de custo, gestores e utilização orçamentária.",
      },
    ],
  }),
});
