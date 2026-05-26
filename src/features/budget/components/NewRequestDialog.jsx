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
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { costCenters } from "@/features/budget/data";
import { useBudgetSession } from "@/features/budget/BudgetSessionContext";
import { useAuth } from "@/contexts/AuthContext";
import {
  REQUEST_TYPES,
  REQUEST_TYPE_LABELS,
  MESES_ORCAMENTO,
} from "@/features/budget/lib/requestTypes";
import { toast } from "sonner";

const TYPE_OPTIONS = Object.entries(REQUEST_TYPE_LABELS);

export function NewRequestDialog({ open, onOpenChange }) {
  const { addRequest } = useBudgetSession();
  const { user } = useAuth();

  const [tipo, setTipo] = useState(REQUEST_TYPES.orcamento);
  const [titulo, setTitulo] = useState("");
  const [valorStr, setValorStr] = useState("");
  const [centro, setCentro] = useState(costCenters[0]?.departamento ?? "");
  const [centroOrigem, setCentroOrigem] = useState(costCenters[0]?.departamento ?? "");
  const [centroDestino, setCentroDestino] = useState(
    costCenters[1]?.departamento ?? costCenters[0]?.departamento ?? "",
  );
  const [mesOrigem, setMesOrigem] = useState("Maio");
  const [mesDestino, setMesDestino] = useState("Dezembro");
  const [mesmoSetor, setMesmoSetor] = useState(false);
  const [justificativa, setJustificativa] = useState("");

  const reset = () => {
    setTipo(REQUEST_TYPES.orcamento);
    setTitulo("");
    setValorStr("");
    setCentro(costCenters[0]?.departamento ?? "");
    setCentroOrigem(costCenters[0]?.departamento ?? "");
    setCentroDestino(costCenters[1]?.departamento ?? "");
    setMesOrigem("Maio");
    setMesDestino("Dezembro");
    setMesmoSetor(false);
    setJustificativa("");
  };

  const parseValor = () => {
    const v = Number(valorStr.replace(/\./g, "").replace(",", "."));
    return Number.isFinite(v) ? v : 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const valor = parseValor();

    if (tipo !== REQUEST_TYPES.adiantamento_mes && (!Number.isFinite(valor) || valor <= 0)) {
      toast.error("Informe um valor numérico válido.");
      return;
    }

    if (tipo === REQUEST_TYPES.transferencia_conta && centroOrigem === centroDestino) {
      toast.error("Centro de origem e destino devem ser diferentes.");
      return;
    }

    if (tipo === REQUEST_TYPES.adiantamento_mes && mesOrigem === mesDestino) {
      toast.error("Mês de origem e destino devem ser diferentes.");
      return;
    }

    const solicitante = user?.name ?? "Solicitante";
    const solicitanteEmail = user?.email ?? "solicitante@axiom.finance";

    addRequest({
      tipo,
      titulo,
      valor: tipo === REQUEST_TYPES.adiantamento_mes ? valor || 0 : valor,
      centro: tipo === REQUEST_TYPES.transferencia_conta ? centroOrigem : centro,
      centroOrigem,
      centroDestino,
      mesOrigem,
      mesDestino,
      mesmoSetor,
      justificativa,
      solicitante,
      solicitanteEmail,
    });

    toast.success("Solicitação criada. O analista foi notificado por e-mail.");
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
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Nova solicitação financeira</DialogTitle>
          </DialogHeader>

          <div className="grid gap-4 py-2">
            <div className="grid gap-2">
              <Label>Tipo de solicitação</Label>
              <Select value={tipo} onValueChange={setTipo}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {TYPE_OPTIONS.map(([key, label]) => (
                    <SelectItem key={key} value={key}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="nr-titulo">Título (opcional)</Label>
              <Input
                id="nr-titulo"
                value={titulo}
                onChange={(e) => setTitulo(e.target.value)}
                placeholder="Gerado automaticamente se vazio"
              />
            </div>

            {tipo === REQUEST_TYPES.orcamento && (
              <>
                <div className="grid gap-2">
                  <Label htmlFor="nr-valor">Valor (R$)</Label>
                  <Input
                    id="nr-valor"
                    inputMode="decimal"
                    value={valorStr}
                    onChange={(e) => setValorStr(e.target.value)}
                  />
                </div>
                <CentroSelect label="Centro de custo" value={centro} onChange={setCentro} />
              </>
            )}

            {tipo === REQUEST_TYPES.antecipacao_saldo && (
              <>
                <CentroSelect label="Centro de custo" value={centro} onChange={setCentro} />
                <div className="grid gap-2">
                  <Label htmlFor="nr-valor-ant">Valor a antecipar (R$)</Label>
                  <Input
                    id="nr-valor-ant"
                    inputMode="decimal"
                    value={valorStr}
                    onChange={(e) => setValorStr(e.target.value)}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="just">Justificativa</Label>
                  <Textarea
                    id="just"
                    value={justificativa}
                    onChange={(e) => setJustificativa(e.target.value)}
                    rows={3}
                    placeholder="Motivo da antecipação de saldo..."
                  />
                </div>
              </>
            )}

            {tipo === REQUEST_TYPES.adiantamento_mes && (
              <>
                <CentroSelect label="Centro de custo" value={centro} onChange={setCentro} />
                <div className="grid grid-cols-2 gap-3">
                  <div className="grid gap-2">
                    <Label>Mês origem (liberar)</Label>
                    <Select value={mesOrigem} onValueChange={setMesOrigem}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {MESES_ORCAMENTO.map((m) => (
                          <SelectItem key={m} value={m}>
                            {m}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label>Mês destino (adiantar)</Label>
                    <Select value={mesDestino} onValueChange={setMesDestino}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {MESES_ORCAMENTO.map((m) => (
                          <SelectItem key={m} value={m}>
                            {m}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <p className="text-[11px] text-muted-foreground -mt-1">
                  Ex.: adiantar verba de maio para utilização em dezembro (ou o inverso).
                </p>
                <div className="grid gap-2">
                  <Label htmlFor="nr-valor-ad">Valor estimado (R$, opcional)</Label>
                  <Input
                    id="nr-valor-ad"
                    inputMode="decimal"
                    value={valorStr}
                    onChange={(e) => setValorStr(e.target.value)}
                    placeholder="0 se não aplicável"
                  />
                </div>
              </>
            )}

            {tipo === REQUEST_TYPES.transferencia_conta && (
              <>
                <CentroSelect
                  label="Conta de origem"
                  value={centroOrigem}
                  onChange={setCentroOrigem}
                />
                <CentroSelect
                  label="Conta de destino"
                  value={centroDestino}
                  onChange={setCentroDestino}
                />
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="mesmo-setor"
                    checked={mesmoSetor}
                    onCheckedChange={(v) => setMesmoSetor(v === true)}
                  />
                  <Label htmlFor="mesmo-setor" className="text-sm font-normal cursor-pointer">
                    Transferência dentro do mesmo setor
                  </Label>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="nr-valor-tr">Valor (R$)</Label>
                  <Input
                    id="nr-valor-tr"
                    inputMode="decimal"
                    value={valorStr}
                    onChange={(e) => setValorStr(e.target.value)}
                  />
                </div>
              </>
            )}

            <div className="rounded-lg border border-border bg-muted/30 p-3 text-[11px] text-muted-foreground">
              <p className="font-semibold text-foreground mb-1">Fluxo de aprovação</p>
              <ol className="list-decimal list-inside space-y-0.5">
                <li>Analista · Controladoria (e-mail)</li>
                <li>Gestor da área solicitante (e-mail)</li>
                <li>Diretor corporativo (e-mail)</li>
              </ol>
            </div>
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit">Enviar solicitação</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function CentroSelect({ label, value, onChange }) {
  return (
    <div className="grid gap-2">
      <Label>{label}</Label>
      <Select value={value} onValueChange={onChange}>
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
  );
}
