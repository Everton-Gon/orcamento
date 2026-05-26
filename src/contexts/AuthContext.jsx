import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

const STORAGE_KEY = "axiom-auth-user";

/** Contas de demonstração por provedor SSO (e-mails fictícios). */
export const MOCK_ACCOUNTS = {
  microsoft: [
    {
      id: "ms-1",
      provider: "microsoft",
      name: "Carlos Mendes",
      email: "ti.admin@axiom.finance",
      avatar: "CM",
      role: "ti",
    },
    {
      id: "ms-2",
      provider: "microsoft",
      name: "Fernanda Lima",
      email: "controladoria@axiom.finance",
      avatar: "FL",
      role: "controladoria",
    },
    {
      id: "ms-3",
      provider: "microsoft",
      name: "Pedro Alves",
      email: "gestor.marketing@axiom.finance",
      avatar: "PA",
      role: "setor",
    },
  ],
  google: [
    {
      id: "go-1",
      provider: "google",
      name: "Ricardo Santos",
      email: "ricardo.santos@axiom.finance",
      avatar: "RS",
      role: "controladoria",
    },
    {
      id: "go-2",
      provider: "google",
      name: "Ana Oliveira",
      email: "ana.oliveira@axiom.finance",
      avatar: "AO",
      role: "setor",
    },
    {
      id: "go-3",
      provider: "google",
      name: "Marcos Paulo",
      email: "marcos.paulo@axiom.finance",
      avatar: "MP",
      role: "setor",
    },
  ],
};

export const ROLE_LABELS = {
  ti: "TI · Admin",
  controladoria: "Controladoria",
  setor: "Gestor de Setor",
};

export function roleToJobTitle(role) {
  switch (role) {
    case "ti":
      return "TI · Administrador";
    case "controladoria":
      return "CFO · Controladoria";
    case "setor":
      return "Gestor de Setor";
    default:
      return "Utilizador";
  }
}

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [ssoLoading, setSsoLoading] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setUser(JSON.parse(raw));
    } catch {
      localStorage.removeItem(STORAGE_KEY);
    }
    setReady(true);
  }, []);

  const loginWithSSO = useCallback(async (provider) => {
    setSsoLoading(true);
    await new Promise((r) => setTimeout(r, 900));
    const accounts = MOCK_ACCOUNTS[provider];
    setSsoLoading(false);
    if (!accounts?.length) {
      throw new Error("Nenhuma conta disponível para este provedor.");
    }
    return accounts;
  }, []);

  const selectAccount = useCallback((account) => {
    setUser(account);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(account));
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  const value = useMemo(
    () => ({
      user,
      ready,
      ssoLoading,
      loginWithSSO,
      selectAccount,
      logout,
      isAuthenticated: !!user,
    }),
    [user, ready, ssoLoading, loginWithSSO, selectAccount, logout],
  );

  return (
    <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth deve ser usado dentro de AuthProvider.");
  }
  return ctx;
}
