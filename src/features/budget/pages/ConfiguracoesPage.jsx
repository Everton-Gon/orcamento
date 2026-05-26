import { useEffect, useState } from "react";
import { PageHeader } from "@/components/common/PageHeader";
import { User, ShieldCheck, Bell, Save } from "lucide-react";
import { toast } from "sonner";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useAuth, ROLE_LABELS, roleToJobTitle } from "@/contexts/AuthContext";

const LS_KEY = "axiom-budget-settings-v1";

const defaultSettings = {
  name: "Ricardo Santos",
  role: "CFO · Controladoria",
  email: "ricardo.santos@axiom.finance",
  notifReq: true,
  notifReport: false,
};

function loadSettings() {
  if (typeof window === "undefined") return defaultSettings;
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (!raw) return defaultSettings;
    const parsed = JSON.parse(raw);
    return { ...defaultSettings, ...parsed };
  } catch {
    return defaultSettings;
  }
}

export function ConfiguracoesPage() {
  const { user } = useAuth();
  const [name, setName] = useState(defaultSettings.name);
  const [role, setRole] = useState(defaultSettings.role);
  const [email, setEmail] = useState(defaultSettings.email);
  const [notifReq, setNotifReq] = useState(defaultSettings.notifReq);
  const [notifReport, setNotifReport] = useState(defaultSettings.notifReport);

  useEffect(() => {
    const s = loadSettings();
    setNotifReq(s.notifReq);
    setNotifReport(s.notifReport);
    if (user) {
      setName(user.name);
      setEmail(user.email);
      setRole(roleToJobTitle(user.role));
    } else {
      setName(s.name);
      setRole(s.role);
      setEmail(s.email);
    }
  }, [user]);

  const handleSave = () => {
    const payload = {
      name: name.trim() || defaultSettings.name,
      role: role.trim() || defaultSettings.role,
      email: email.trim() || defaultSettings.email,
      notifReq,
      notifReport,
    };
    localStorage.setItem(LS_KEY, JSON.stringify(payload));
    toast.success("Configurações salvas neste navegador.");
  };

  return (
    <>
      <PageHeader
        eyebrow="Administração"
        title="Configurações"
        description={
          user
            ? `Sessão ativa como ${user.email} (${ROLE_LABELS[user.role]}). Dados sincronizados com o login.`
            : "Parâmetros gerais, matriz de aprovações e políticas de governança."
        }
        actions={
          <button
            type="button"
            onClick={handleSave}
            className="px-3 h-9 text-xs font-semibold bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors flex items-center gap-1.5"
          >
            <Save className="h-3.5 w-3.5" /> Salvar alterações
          </button>
        }
      />

      <div className="space-y-6">
        <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
          <div className="p-5 border-b border-border flex items-center gap-2">
            <User className="h-4 w-4 text-muted-foreground" />
            <h3 className="font-bold text-foreground">Perfil do Usuário</h3>
          </div>
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="cfg-name">Nome Completo</Label>
              <input
                id="cfg-name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full h-10 px-3 rounded-md border border-border bg-background text-sm focus:ring-1 focus:ring-ring outline-none"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="cfg-role">Cargo</Label>
              <input
                id="cfg-role"
                type="text"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full h-10 px-3 rounded-md border border-border bg-background text-sm focus:ring-1 focus:ring-ring outline-none"
              />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="cfg-email">E-mail Corporativo</Label>
              <input
                id="cfg-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full h-10 px-3 rounded-md border border-border bg-background text-sm focus:ring-1 focus:ring-ring outline-none"
              />
            </div>
          </div>
        </div>

        <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
          <div className="p-5 border-b border-border flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-muted-foreground" />
            <h3 className="font-bold text-foreground">Matriz de Governança</h3>
          </div>
          <div className="p-0 overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-muted/30 text-[10px] uppercase font-bold text-muted-foreground tracking-widest border-b border-border">
                <tr>
                  <th className="px-5 py-3">Nível</th>
                  <th className="px-5 py-3">Alçada Máxima</th>
                  <th className="px-5 py-3">Papel Responsável</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                <tr>
                  <td className="px-5 py-4 font-semibold">N1 Gerente</td>
                  <td className="px-5 py-4">Até R$ 50.000</td>
                  <td className="px-5 py-4 text-muted-foreground">Gestor Direto do CC</td>
                </tr>
                <tr>
                  <td className="px-5 py-4 font-semibold">N2 Diretor</td>
                  <td className="px-5 py-4">Até R$ 250.000</td>
                  <td className="px-5 py-4 text-muted-foreground">Diretoria da Área</td>
                </tr>
                <tr>
                  <td className="px-5 py-4 font-semibold">N3 Comitê</td>
                  <td className="px-5 py-4">Acima de R$ 250.000</td>
                  <td className="px-5 py-4 text-muted-foreground">Conselho Fiscal / CFO</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
          <div className="p-5 border-b border-border flex items-center gap-2">
            <Bell className="h-4 w-4 text-muted-foreground" />
            <h3 className="font-bold text-foreground">Preferências de Notificação</h3>
          </div>
          <div className="p-6 space-y-4">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-medium">Novas Requisições</p>
                <p className="text-xs text-muted-foreground">
                  Receba alertas quando uma nova aprovação for solicitada.
                </p>
              </div>
              <Switch checked={notifReq} onCheckedChange={setNotifReq} aria-label="Alertas de novas requisições" />
            </div>
            <div className="flex items-center justify-between gap-4 border-t border-border pt-4">
              <div>
                <p className="text-sm font-medium">Relatórios Mensais</p>
                <p className="text-xs text-muted-foreground">
                  Receba o fechamento orçamentário por e-mail.
                </p>
              </div>
              <Switch
                checked={notifReport}
                onCheckedChange={setNotifReport}
                aria-label="Relatórios mensais por e-mail"
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
