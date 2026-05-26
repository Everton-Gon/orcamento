import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

/** Rotas públicas: redireciona para o painel se já estiver autenticado. */
export function GuestRoute() {
  const { user, ready } = useAuth();

  if (!ready) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <p className="text-sm text-muted-foreground">A carregar…</p>
      </div>
    );
  }

  if (user) return <Navigate to="/" replace />;

  return <Outlet />;
}
