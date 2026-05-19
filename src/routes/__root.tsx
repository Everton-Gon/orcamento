import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "sonner";
import {
  Outlet,
  createRootRouteWithContext,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";

import appCss from "../styles.css?url";
import { RouteErrorFallback } from "@/components/root/RouteErrorFallback";
import { RouteNotFound } from "@/components/root/RouteNotFound";

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()(
  {
    head: () => ({
      meta: [
        { charSet: "utf-8" },
        { name: "viewport", content: "width=device-width, initial-scale=1" },
        { title: "Axiom · Budget Corporativo" },
        {
          name: "description",
          content:
            "Plataforma de controle orçamentário corporativo: centros de custo, aprovações multinível, KPIs financeiros e integração com ERP.",
        },
        { name: "author", content: "Axiom Finance" },
        { property: "og:title", content: "Axiom · Budget Corporativo" },
        {
          property: "og:description",
          content:
            "Gestão centralizada de orçamento empresarial com aprovações multinível e integração ERP.",
        },
        { property: "og:type", content: "website" },
        { name: "twitter:card", content: "summary" },
      ],
      links: [
        {
          rel: "stylesheet",
          href: appCss,
        },
      ],
    }),
    shellComponent: RootShell,
    component: RootComponent,
    notFoundComponent: RouteNotFound,
    errorComponent: RouteErrorFallback,
  },
);

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  return (
    <QueryClientProvider client={queryClient}>
      <Outlet />
      {/* Mesmo subárvore que as páginas: evita toasts “silenciosos” e problemas de hidratação */}
      <Toaster position="top-right" closeButton richColors />
    </QueryClientProvider>
  );
}
