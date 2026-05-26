import { costCenters, brl } from "@/features/budget/data";
import { downloadTextFile } from "@/features/budget/lib/downloadFile";
import { useMemo, useState } from "react";
import { ArrowUpDown, Download, Filter } from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

function statusFor(pct) {
  if (pct >= 95)
    return { label: "Limite", className: "bg-destructive/10 text-destructive" };
  if (pct >= 80)
    return {
      label: "Atenção",
      className: "bg-warning/15 text-warning-foreground",
    };
  return { label: "Normal", className: "bg-success/15 text-success" };
}

function barColor(pct) {
  if (pct >= 95) return "bg-destructive";
  if (pct >= 80) return "bg-warning";
  return "bg-success";
}

function matchesSearch(row, q) {
  if (!q?.trim()) return true;
  const s = q.trim().toLowerCase();
  return [row.departamento, row.codigo, row.gestor].some((x) =>
    x.toLowerCase().includes(s)
  );
}

function matchesDepartments(row, allowed) {
  if (!allowed) return true;
  if (allowed.length === 0) return false;
  return allowed.includes(row.departamento);
}

export function CostCentersTable({
  data: initialData = costCenters,
  searchText,
}) {
  const allDepartments = useMemo(
    () => [...new Set(initialData.map((c) => c.departamento))].sort(),
    [initialData]
  );

  const [sortConfig, setSortConfig] = useState(null);
  const [filterOpen, setFilterOpen] = useState(false);
  const [allowedDepartments, setAllowedDepartments] = useState(null);
  const [draftAllowed, setDraftAllowed] = useState({});

  const openFilterDialog = () => {
    const next = {};
    for (const d of allDepartments) {
      next[d] = allowedDepartments ? allowedDepartments.includes(d) : true;
    }
    setDraftAllowed(next);
    setFilterOpen(true);
  };

  const applyFilters = () => {
    const picked = allDepartments.filter((d) => draftAllowed[d]);
    if (picked.length === 0) {
      toast.error("Selecione pelo menos um departamento.");
      return;
    }
    setAllowedDepartments(picked.length === allDepartments.length ? null : picked);
    setSortConfig(null);
    setFilterOpen(false);
    toast.success("Filtros aplicados à tabela.");
  };

  const filtered = useMemo(() => {
    return initialData.filter(
      (r) => matchesSearch(r, searchText) && matchesDepartments(r, allowedDepartments)
    );
  }, [initialData, searchText, allowedDepartments]);

  const sortedRows = useMemo(() => {
    if (!sortConfig) return filtered;
    const { key, direction } = sortConfig;
    return [...filtered].sort((a, b) => {
      let valA;
      let valB;
      if (key === "utilizacao") {
        valA = a.realizado / a.orcamento;
        valB = b.realizado / b.orcamento;
      } else {
        valA = a[key];
        valB = b[key];
      }
      if (valA < valB) return direction === "asc" ? -1 : 1;
      if (valA > valB) return direction === "asc" ? 1 : -1;
      return 0;
    });
  }, [filtered, sortConfig]);

  const requestSort = (key) => {
    setSortConfig((prev) => {
      let direction = "asc";
      if (prev && prev.key === key && prev.direction === "asc") {
        direction = "desc";
      }
      return { key, direction };
    });
  };

  const exportToCsv = () => {
    const headers = [
      "Departamento",
      "Código",
      "Gestor",
      "Orçamento",
      "Realizado",
      "Utilização %",
    ];
    const rows = sortedRows.map((c) => [
      c.departamento,
      c.codigo,
      c.gestor,
      c.orcamento,
      c.realizado,
      Math.round((c.realizado / c.orcamento) * 100),
    ]);
    const csvContent = [headers, ...rows].map((e) => e.join(",")).join("\n");
    downloadTextFile(
      `centros_de_custo_${new Date().toISOString().split("T")[0]}.csv`,
      csvContent,
      "text/csv;charset=utf-8"
    );
    toast.success("Exportação concluída com sucesso!");
  };

  return (
    <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
      <div className="p-5 border-b border-border flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h3 className="font-bold text-foreground">Performance por Centro de Custo</h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            Drill-down por departamento · exercício 2026
            {searchText ? (
              <span className="block mt-1 text-foreground/80">
                Pesquisa active: &quot;{searchText}&quot; · {sortedRows.length} resultado(s)
              </span>
            ) : null}
            {allowedDepartments && allowedDepartments.length < allDepartments.length ? (
              <span className="block mt-1 text-foreground/80">
                Filtro: {allowedDepartments.length} departamento(s)
              </span>
            ) : null}
          </p>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={exportToCsv}
            className="px-3 py-1.5 text-xs font-semibold border border-border rounded-md hover:bg-muted transition-colors flex items-center gap-1.5"
          >
            <Download className="h-3.5 w-3.5" /> Exportar CSV
          </button>
          <button
            type="button"
            onClick={openFilterDialog}
            className="px-3 py-1.5 text-xs font-semibold bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors flex items-center gap-1.5"
          >
            <Filter className="h-3.5 w-3.5" /> Filtros avançados
          </button>
        </div>
      </div>

      <Dialog open={filterOpen} onOpenChange={setFilterOpen}>
        <DialogContent className="sm:max-w-md max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Filtrar por departamento</DialogTitle>
          </DialogHeader>
          <div className="grid gap-3 py-2">
            {allDepartments.map((d) => (
              <div key={d} className="flex items-center gap-3">
                <Checkbox
                  id={`flt-${d}`}
                  checked={draftAllowed[d] === true}
                  onCheckedChange={(v) =>
                    setDraftAllowed((prev) => ({ ...prev, [d]: v === true }))
                  }
                />
                <Label htmlFor={`flt-${d}`} className="text-sm font-normal cursor-pointer">
                  {d}
                </Label>
              </div>
            ))}
          </div>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setAllowedDepartments(null);
                setSortConfig(null);
                setFilterOpen(false);
                toast.message("Filtros de departamento limpos.");
              }}
            >
              Limpar
            </Button>
            <Button type="button" onClick={applyFilters}>
              Aplicar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest border-b border-border bg-muted/30">
              <th
                className="px-5 py-3 cursor-pointer hover:text-foreground transition-colors"
                onClick={() => requestSort("departamento")}
              >
                <div className="flex items-center gap-1">
                  Departamento <ArrowUpDown className="h-3 w-3" />
                </div>
              </th>
              <th className="px-5 py-3">Código</th>
              <th className="px-5 py-3">Gestor</th>
              <th
                className="px-5 py-3 text-right cursor-pointer hover:text-foreground transition-colors"
                onClick={() => requestSort("orcamento")}
              >
                <div className="flex items-center justify-end gap-1">
                  Orçamento <ArrowUpDown className="h-3 w-3" />
                </div>
              </th>
              <th
                className="px-5 py-3 text-right cursor-pointer hover:text-foreground transition-colors"
                onClick={() => requestSort("realizado")}
              >
                <div className="flex items-center justify-end gap-1">
                  Realizado <ArrowUpDown className="h-3 w-3" />
                </div>
              </th>
              <th
                className="px-5 py-3 w-56 cursor-pointer hover:text-foreground transition-colors"
                onClick={() => requestSort("utilizacao")}
              >
                <div className="flex items-center gap-1">
                  Utilização <ArrowUpDown className="h-3 w-3" />
                </div>
              </th>
              <th className="px-5 py-3">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border text-sm">
            {sortedRows.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-5 py-12 text-center text-muted-foreground">
                  Nenhum centro de custo corresponde aos filtros atuais.
                </td>
              </tr>
            ) : (
              sortedRows.map((c) => {
                const pct = Math.round((c.realizado / c.orcamento) * 100);
                const s = statusFor(pct);
                return (
                  <tr key={c.codigo} className="hover:bg-muted/40 transition-colors">
                    <td className="px-5 py-4 font-semibold text-foreground">{c.departamento}</td>
                    <td className="px-5 py-4 font-mono text-xs text-muted-foreground">
                      {c.codigo}
                    </td>
                    <td className="px-5 py-4 text-muted-foreground">{c.gestor}</td>
                    <td className="px-5 py-4 text-right tabular-nums">{brl(c.orcamento)}</td>
                    <td className="px-5 py-4 text-right tabular-nums">{brl(c.realizado)}</td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${barColor(pct)}`}
                            style={{ width: `${Math.min(pct, 100)}%` }}
                          />
                        </div>
                        <span className="text-xs tabular-nums font-semibold w-8 text-right">
                          {pct}%
                        </span>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <span
                        className={`px-2 py-1 text-[10px] rounded uppercase font-bold tracking-wider ${s.className}`}
                      >
                        {s.label}
                      </span>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
