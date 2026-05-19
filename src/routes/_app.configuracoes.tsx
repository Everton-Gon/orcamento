import { createFileRoute } from "@tanstack/react-router";
import { ConfiguracoesPage } from "@/features/budget/pages/ConfiguracoesPage";

export const Route = createFileRoute("/_app/configuracoes")({
  component: ConfiguracoesPage,
  head: () => ({
    meta: [{ title: "Configurações · Axiom Budget" }],
  }),
});
