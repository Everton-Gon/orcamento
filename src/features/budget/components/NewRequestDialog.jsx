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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { costCenters } from "@/features/budget/data";
import { useBudgetSession } from "@/features/budget/BudgetSessionContext";
import { toast } from "sonner";

export function NewRequestDialog({ open, onOpenChange }) {
  const { addApproval } = useBudgetSession();
  const [titulo, setTitulo] = useState("");
  const [valorStr, setValorStr] = useState("");
  const [centro, setCentro] = useState(costCenters[0]?.departamento ?? "");
  const [solicitante, setSolicitante] = useState("Ricardo Santos");

  const reset = () => {
    setTitulo("");
    setValorStr("");
    setCentro(costCenters[0]?.departamento ?? "");
    setSolicitante("Ricardo Santos");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const valor = Number(valorStr.replace(/\./g, "").replace(",", "."));
    if (!titulo.trim()) {
      toast.error("Informe o título da requisição.");
      return;
    }
    if (!Number.isFinite(valor) || valor <= 0) {
      toast.error("Informe um valor numérico válido.");
      return;
    }
    addApproval({ titulo: titulo.trim(), centro, valor, solicitante: solicitante.trim() });
    toast.success("Requisição criada e enviada para a fila de aprovação.");
    reset();
    onOpenChange(false);
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        if (!v) reset();
        onOpenChange(v);
      }}
    >
      <DialogContent className="sm:max-w-md">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Nova requisição orçamentária</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-2">
            <div className="grid gap-2">
              <Label htmlFor="nr-titulo">Título</Label>
              <Input
                id="nr-titulo"
                value={titulo}
                onChange={(e) => setTitulo(e.target.value)}
                placeholder="Ex.: Licenças de software Q1"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="nr-valor">Valor (R$)</Label>
              <Input
                id="nr-valor"
                inputMode="decimal"
                value={valorStr}
                onChange={(e) => setValorStr(e.target.value)}
                placeholder="Ex.: 15000 ou 15.000"
              />
            </div>
            <div className="grid gap-2">
              <Label>Centro de custo</Label>
              <Select value={centro} onValueChange={setCentro}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {costCenters.map((c) => (
                    <SelectItem key={c.codigo} value={c.departamento}>
                      {c.departamento}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="nr-sol">Solicitante</Label>
              <Input
                id="nr-sol"
                value={solicitante}
                onChange={(e) => setSolicitante(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit">Criar requisição</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
