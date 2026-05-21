import { erpIntegrations } from "@/features/budget/data";
import { CheckCircle2, Plug, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

function isInitiallyConnected(i) {
  return i.status === "Conectado";
}

export function IntegrationsGrid() {
  const [connectedNames, setConnectedNames] = useState(() => {
    const s = new Set();
    for (const i of erpIntegrations) {
      if (isInitiallyConnected(i)) s.add(i.nome);
    }
    return s;
  });
  const [lastSyncByNome, setLastSyncByNome] = useState({});
  const [configTarget, setConfigTarget] = useState(null);
  const [endpoint, setEndpoint] = useState("");

  const handleConnect = (nome) => {
    toast.promise(
      new Promise((resolve) => {
        setTimeout(() => {
          setConnectedNames((prev) => {
            const next = new Set(prev);
            next.add(nome);
            return next;
          });
          setLastSyncByNome((prev) => ({ ...prev, [nome]: "agora" }));
          resolve();
        }, 1500);
      }),
      {
        loading: `Conectando ao ${nome}...`,
        success: `${nome} conectado com sucesso!`,
        error: `Falha ao conectar com ${nome}.`,
      }
    );
  };

  const openConfig = (i) => {
    setConfigTarget(i);
    setEndpoint(`https://erp.${i.nome.toLowerCase().replace(/\s+/g, "-")}.internal/api`);
  };

  const saveConfig = () => {
    if (!configTarget) return;
    toast.success(`Preferências de ${configTarget.nome} guardadas (demonstração).`);
    setConfigTarget(null);
  };

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {erpIntegrations.map((i) => {
          const connected = connectedNames.has(i.nome);
          const lastSync = lastSyncByNome[i.nome] ?? i.lastSync;
          return (
            <div key={i.nome} className="bg-card p-5 rounded-xl border border-border shadow-sm">
              <div className="flex items-start gap-4">
                <div
                  className={`size-10 rounded-md grid place-items-center shrink-0 ${
                    connected ? "bg-success/15 text-success" : "bg-muted text-muted-foreground"
                  }`}
                >
                  <Plug className="h-4 w-4" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <h3 className="font-bold text-foreground">{i.nome}</h3>
                    {connected ? (
                      <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-success/15 text-success flex items-center gap-1">
                        <CheckCircle2 className="h-3 w-3" /> Conectado
                      </span>
                    ) : (
                      <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-muted text-muted-foreground">
                        Disponível
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground mb-3">{i.desc}</p>
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    {lastSync ? (
                      <span className="text-[11px] text-muted-foreground flex items-center gap-1.5">
                        <RefreshCw className="h-3 w-3" /> Sincronizado {lastSync}
                      </span>
                    ) : (
                      <span />
                    )}
                    <button
                      type="button"
                      onClick={() => (connected ? openConfig(i) : handleConnect(i.nome))}
                      className={`h-8 px-3 text-xs font-semibold rounded-md transition-colors shrink-0 ${
                        connected
                          ? "border border-border hover:bg-muted"
                          : "bg-primary text-primary-foreground hover:bg-primary/90"
                      }`}
                    >
                      {connected ? "Configurar" : "Conectar"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <Dialog open={!!configTarget} onOpenChange={(o) => !o && setConfigTarget(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Configurar {configTarget?.nome}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-3 py-2">
            <div className="grid gap-2">
              <Label htmlFor="erp-endpoint">URL do conector / webhook</Label>
              <Input
                id="erp-endpoint"
                value={endpoint}
                onChange={(e) => setEndpoint(e.target.value)}
                placeholder="https://..."
              />
            </div>
            <p className="text-xs text-muted-foreground">
              Em produção, estes dados seriam guardados no servidor. Aqui apenas simulamos o fluxo.
            </p>
          </div>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button type="button" variant="outline" onClick={() => setConfigTarget(null)}>
              Cancelar
            </Button>
            <Button type="button" onClick={saveConfig}>
              Guardar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
