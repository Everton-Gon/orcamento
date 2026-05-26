import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "sonner";

const ROLE_LABELS = {
  ti: 'TI · Admin',
  controladoria: 'Controladoria',
  setor: 'Gestor de Setor',
}

const ROLE_COLORS = {
  ti: 'bg-blue-500/15 text-blue-700 dark:text-blue-300',
  controladoria: 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300',
  setor: 'bg-slate-500/15 text-slate-600 dark:text-slate-300',
}

export function LoginPage() {
  const { loginWithSSO, selectAccount, ssoLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from || "/";
  const [step, setStep] = useState('choose') // 'choose' | 'picker'
  const [accounts, setAccounts] = useState([])
  const [provider, setProvider] = useState(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSSO = async (prov) => {
    setError('')
    setProvider(prov)
    setLoading(true)
    try {
      const available = await loginWithSSO(prov)
      setAccounts(available)
      setStep('picker')
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  const handleSelectAccount = (account) => {
    selectAccount(account);
    toast.success(`Bem-vindo, ${account.name}`);
    navigate(from, { replace: true });
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute -top-40 -right-40 w-96 h-96 rounded-full opacity-5"
          style={{ background: 'var(--accent)' }}
        />
        <div
          className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full opacity-5"
          style={{ background: 'var(--primary)' }}
        />
      </div>

      <div className="relative w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-3 mb-4">
            <div
              className="size-12 rounded-xl grid place-items-center font-bold text-xl"
              style={{ background: 'var(--accent)', color: 'var(--accent-foreground)' }}
            >
              IS
            </div>
            <div className="text-left">
              <p className="text-xl font-bold tracking-tight text-foreground">Insight System</p>
              <p className="text-xs text-muted-foreground uppercase tracking-widest">Budget Corporativo</p>
            </div>
          </div>
          <h1 className="text-2xl font-bold text-foreground">Bem-vindo de volta</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {step === 'choose'
              ? 'Escolha como deseja entrar'
              : `Selecione sua conta ${provider === 'microsoft' ? 'Microsoft' : 'Google'}`}
          </p>
        </div>

        <div className="bg-card border border-border rounded-2xl shadow-lg overflow-hidden">
          {/* ─── Step 1: Choose provider ─────────────────────────────────── */}
          {step === 'choose' && (
            <div className="p-8 space-y-3">
              <button
                type="button"
                onClick={() => handleSSO('microsoft')}
                disabled={loading || ssoLoading}
                className="w-full flex items-center gap-4 px-5 py-4 rounded-xl border border-border bg-background hover:bg-muted transition-colors disabled:opacity-50 disabled:cursor-not-allowed group"
              >
                {/* Microsoft logo */}
                <svg width="20" height="20" viewBox="0 0 21 21" fill="none">
                  <rect x="1" y="1" width="9" height="9" fill="#F25022"/>
                  <rect x="11" y="1" width="9" height="9" fill="#7FBA00"/>
                  <rect x="1" y="11" width="9" height="9" fill="#00A4EF"/>
                  <rect x="11" y="11" width="9" height="9" fill="#FFB900"/>
                </svg>
                <span className="text-sm font-semibold text-foreground">
                  {loading && provider === 'microsoft' ? 'Conectando…' : 'Entrar com Microsoft'}
                </span>
                {loading && provider === 'microsoft' && (
                  <span className="ml-auto h-4 w-4 rounded-full border-2 border-muted-foreground border-t-foreground animate-spin" />
                )}
              </button>

              <button
                type="button"
                onClick={() => handleSSO('google')}
                disabled={loading || ssoLoading}
                className="w-full flex items-center gap-4 px-5 py-4 rounded-xl border border-border bg-background hover:bg-muted transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {/* Google logo */}
                <svg width="20" height="20" viewBox="0 0 24 24">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
                <span className="text-sm font-semibold text-foreground">
                  {loading && provider === 'google' ? 'Conectando…' : 'Entrar com Google'}
                </span>
                {loading && provider === 'google' && (
                  <span className="ml-auto h-4 w-4 rounded-full border-2 border-muted-foreground border-t-foreground animate-spin" />
                )}
              </button>

              {error && (
                <p className="text-xs text-destructive text-center pt-2">{error}</p>
              )}

              <div className="pt-4 border-t border-border space-y-3">
                <p className="text-[11px] font-semibold text-foreground text-center">
                  Contas de demonstração
                </p>
                <div className="text-[10px] text-muted-foreground space-y-2">
                  <p>
                    <span className="font-medium text-foreground">Microsoft:</span>{" "}
                    ti.admin@axiom.finance, controladoria@axiom.finance,
                    gestor.marketing@axiom.finance
                  </p>
                  <p>
                    <span className="font-medium text-foreground">Google:</span>{" "}
                    ricardo.santos@axiom.finance, ana.oliveira@axiom.finance,
                    marcos.paulo@axiom.finance
                  </p>
                </div>
                <p className="text-[11px] text-muted-foreground text-center leading-relaxed">
                  O acesso é controlado pelo administrador de TI. Em caso de problemas,
                  contate{" "}
                  <span className="text-foreground font-medium">egoncalves@email.com</span>
                </p>
              </div>
            </div>
          )}

          {/* ─── Step 2: Account picker ──────────────────────────────────── */}
          {step === 'picker' && (
            <div className="divide-y divide-border">
              <div className="px-6 pt-5 pb-4">
                <button
                  type="button"
                  onClick={() => { setStep('choose'); setAccounts([]) }}
                  className="flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground transition-colors mb-1"
                >
                  ← Voltar
                </button>
                <p className="text-xs text-muted-foreground">
                  {accounts.length} conta{accounts.length !== 1 ? 's' : ''} disponível{accounts.length !== 1 ? 'is' : ''}
                </p>
              </div>

              {accounts.map(user => (
                <button
                  key={user.id}
                  type="button"
                  onClick={() => handleSelectAccount(user)}
                  className="w-full flex items-center gap-4 px-6 py-4 hover:bg-muted/50 transition-colors text-left"
                >
                  <div
                    className="size-10 rounded-full grid place-items-center text-sm font-bold shrink-0"
                    style={{ background: 'var(--sidebar-accent)', color: 'var(--sidebar-foreground)' }}
                  >
                    {user.avatar}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-foreground">{user.name}</p>
                    <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                  </div>
                  <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full shrink-0 ${ROLE_COLORS[user.role]}`}>
                    {ROLE_LABELS[user.role]}
                  </span>
                </button>
              ))}

              <div className="px-6 py-4">
                <p className="text-[11px] text-muted-foreground text-center">
                  Não encontrou sua conta?{' '}
                  <span className="text-foreground font-medium">Contate o administrador de TI.</span>
                </p>
              </div>
            </div>
          )}
        </div>

        <p className="text-center text-[11px] text-muted-foreground mt-6">
          Everton Gonçalves © {new Date().getFullYear()} · Tech System Corporativo v2.0
        </p>
      </div>
    </div>
  )
}