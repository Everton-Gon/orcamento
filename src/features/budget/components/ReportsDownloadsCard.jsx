import { reportsCatalog } from "@/features/budget/data";
import { downloadTextFile } from "@/features/budget/lib/downloadFile";
import { FileText, Download } from "lucide-react";
import { toast } from "sonner";

function slug(nome) {
  return nome
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_|_$/g, "")
    .slice(0, 48);
}

function buildReportFile(r) {
  const body = [
    `Relatório: ${r.nome}`,
    `Período: ${r.periodo}`,
    `Formato declarado: ${r.formato}`,
    "",
    "Este ficheiro foi gerado localmente (demonstração, sem ligação a ERP).",
    `Gerado em: ${new Date().toLocaleString("pt-BR")}`,
  ].join("\n");

  const ext = r.formato === "CSV" || r.formato === "XLSX" ? "csv" : "txt";
  const mime =
    ext === "csv" ? "text/csv;charset=utf-8" : "text/plain;charset=utf-8";
  return { filename: `relatorio_${slug(r.nome)}.${ext}`, body, mime };
}

export function ReportsDownloadsCard() {
  const handleDownload = (r) => {
    const { filename, body, mime } = buildReportFile(r);
    downloadTextFile(filename, body, mime);
    toast.success(`Download iniciado: ${filename}`);
  };

  return (
    <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
      <div className="p-5 border-b border-border">
        <h3 className="font-bold text-foreground">Relatórios Disponíveis</h3>
        <p className="text-xs text-muted-foreground mt-0.5">
          Pacotes pré-configurados pela controladoria
        </p>
      </div>

      <div className="divide-y divide-border">
        {reportsCatalog.map((r) => (
          <div
            key={r.nome}
            className="p-4 flex items-center gap-4 hover:bg-muted/40 transition-colors"
          >
            <div className="size-10 rounded-md bg-muted grid place-items-center shrink-0">
              <FileText className="h-4 w-4 text-muted-foreground" />
            </div>

            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-foreground">{r.nome}</p>
              <p className="text-xs text-muted-foreground">{r.periodo}</p>
            </div>

            <span className="text-[10px] font-mono px-1.5 py-0.5 bg-muted rounded text-muted-foreground shrink-0">
              {r.formato}
            </span>

            <button
              type="button"
              onClick={() => handleDownload(r)}
              className="h-8 px-3 text-xs font-semibold rounded-md border border-border hover:bg-muted transition-colors flex items-center gap-1.5 shrink-0"
            >
              <Download className="h-3.5 w-3.5" /> Baixar
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
