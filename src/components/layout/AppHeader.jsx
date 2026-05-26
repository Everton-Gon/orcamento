import React, { useState, useEffect } from "react";
import { Search, Bell, Sun, Moon } from "lucide-react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useNavigate } from "react-router-dom";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const MOCK_NOTIFICATIONS = [
  {
    id: "1",
    title: "REQ-2841 aguarda sua aprovação",
    body: "Campanha Performance Q4 · Marketing & Growth",
    time: "há 15 min",
  },
  {
    id: "2",
    title: "Sincronização SAP concluída",
    body: "Novos lançamentos importados para o exercício 2024.",
    time: "há 1 h",
  },
  {
    id: "3",
    title: "Relatório mensal disponível",
    body: "Consolidado por centro de custo (YTD) está pronto para download.",
    time: "há 3 h",
  },
];

export function AppHeader() {
  const navigate = useNavigate();
  const [isDark, setIsDark] = useState(false);
  const [search, setSearch] = useState("");
  const [notifOpen, setNotifOpen] = useState(false);

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDark]);

  const handleSearch = (e) => {
    e.preventDefault();
    const q = search.trim();
    if (!q) {
      toast.message("Digite um termo para buscar centros de custo.");
      return;
    }
    navigate(`/centros?q=${encodeURIComponent(q)}`);
    toast.success(`Mostrando resultados para “${q}” em Centros de Custo.`);
  };

  return (
    <>
      <header className="h-14 flex items-center justify-between border-b border-border bg-card/80 backdrop-blur-sm px-4 sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <SidebarTrigger />
          <div className="hidden md:flex items-center gap-2 text-xs">
            <span className="text-muted-foreground">Controladoria</span>
            <span className="text-border">/</span>
            <span className="font-semibold text-foreground tracking-tight">
              EXERCÍCIO 2026
            </span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <form
            onSubmit={handleSearch}
            className="hidden md:flex items-center gap-2 px-3 h-9 rounded-md border border-border bg-background text-xs text-muted-foreground w-72 focus-within:ring-1 focus-within:ring-ring"
          >
            <Search className="h-3.5 w-3.5 shrink-0" />
            <input
              type="search"
              placeholder="Buscar centros de custo, requisições..."
              className="bg-transparent border-none outline-none w-full text-foreground placeholder:text-muted-foreground"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </form>
          <button
            type="button"
            onClick={() => setIsDark(!isDark)}
            className="h-9 w-9 grid place-items-center rounded-md border border-border hover:bg-muted transition-colors"
            title={isDark ? "Mudar para tema claro" : "Mudar para tema escuro"}
          >
            {isDark ? (
              <Sun className="h-4 w-4 text-warning" />
            ) : (
              <Moon className="h-4 w-4 text-muted-foreground" />
            )}
          </button>
          <button
            type="button"
            onClick={() => setNotifOpen(true)}
            className="relative h-9 w-9 grid place-items-center rounded-md border border-border hover:bg-muted transition-colors"
            aria-label="Notificações"
          >
            <Bell className="h-4 w-4 text-muted-foreground" />
            <span className="absolute top-1.5 right-1.5 size-1.5 rounded-full bg-destructive" />
          </button>
        </div>
      </header>

      <Sheet open={notifOpen} onOpenChange={setNotifOpen}>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Notificações</SheetTitle>
            <SheetDescription>Alertas recentes da controladoria (dados de demonstração).</SheetDescription>
          </SheetHeader>
          <div className="mt-6 flex flex-col gap-3">
            {MOCK_NOTIFICATIONS.map((n) => (
              <div
                key={n.id}
                className="rounded-lg border border-border p-3 text-left hover:bg-muted/50 transition-colors"
              >
                <p className="text-sm font-semibold text-foreground">{n.title}</p>
                <p className="text-xs text-muted-foreground mt-1">{n.body}</p>
                <p className="text-[11px] text-muted-foreground mt-2">{n.time}</p>
              </div>
            ))}
          </div>
          <div className="mt-6">
            <Button type="button" variant="outline" className="w-full" onClick={() => setNotifOpen(false)}>
              Fechar
            </Button>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}
