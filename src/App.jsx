import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppLayout } from "./components/layout/AppLayout";
import { DashboardPage } from "./features/budget/pages/DashboardPage";
import { CentrosPage } from "./features/budget/pages/CentrosPage";
import { AprovacoesPage } from "./features/budget/pages/AprovacoesPage";
import { RelatoriosPage } from "./features/budget/pages/RelatoriosPage";
import { IntegracoesPage } from "./features/budget/pages/IntegracoesPage";
import { ConfiguracoesPage } from "./features/budget/pages/ConfiguracoesPage";
import { RouteNotFound } from "./components/root/RouteNotFound";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppLayout />}>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/centros" element={<CentrosPage />} />
          <Route path="/aprovacoes" element={<AprovacoesPage />} />
          <Route path="/relatorios" element={<RelatoriosPage />} />
          <Route path="/integracoes" element={<IntegracoesPage />} />
          <Route path="/configuracoes" element={<ConfiguracoesPage />} />
          <Route path="*" element={<RouteNotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
