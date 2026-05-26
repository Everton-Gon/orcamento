import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { GuestRoute } from "@/components/auth/GuestRoute";
import { AppLayout } from "@/components/layout/AppLayout";
import { LoginPage } from "@/features/budget/pages/LoginPage";
import { DashboardPage } from "@/features/budget/pages/DashboardPage";
import { CentrosPage } from "@/features/budget/pages/CentrosPage";
import { AprovacoesPage } from "@/features/budget/pages/AprovacoesPage";
import { RelatoriosPage } from "@/features/budget/pages/RelatoriosPage";
import { IntegracoesPage } from "@/features/budget/pages/IntegracoesPage";
import { ConfiguracoesPage } from "@/features/budget/pages/ConfiguracoesPage";
import { RouteNotFound } from "@/components/root/RouteNotFound";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<GuestRoute />}>
            <Route path="/login" element={<LoginPage />} />
          </Route>

          <Route element={<ProtectedRoute />}>
            <Route element={<AppLayout />}>
              <Route path="/" element={<DashboardPage />} />
              <Route path="/centros" element={<CentrosPage />} />
              <Route path="/aprovacoes" element={<AprovacoesPage />} />
              <Route path="/relatorios" element={<RelatoriosPage />} />
              <Route path="/integracoes" element={<IntegracoesPage />} />
              <Route path="/configuracoes" element={<ConfiguracoesPage />} />
              <Route path="*" element={<RouteNotFound />} />
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
