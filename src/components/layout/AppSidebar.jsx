import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Building2,
  CheckSquare,
  BarChart3,
  Plug,
  Settings,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
  SidebarHeader,
} from "@/components/ui/sidebar";
import { useBudgetSession } from "@/features/budget/BudgetSessionContext";
import { useAuth, ROLE_LABELS, roleToJobTitle } from "@/contexts/AuthContext";
import { LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const items = [
  { title: "Dashboard", url: "/", icon: LayoutDashboard },
  { title: "Centros de Custo", url: "/centros", icon: Building2 },
  { title: "Aprovações", url: "/aprovacoes", icon: CheckSquare, showBadge: true },
  { title: "Relatórios", url: "/relatorios", icon: BarChart3 },
  { title: "Integrações ERP", url: "/integracoes", icon: Plug },
  { title: "Configurações", url: "/configuracoes", icon: Settings },
];

export function AppSidebar() {
  const { approvals } = useBudgetSession();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    toast.message("Sessão terminada.");
    navigate("/login", { replace: true });
  };
  const currentPath = location.pathname;
  const isActive = (path) =>
    path === "/" ? currentPath === "/" : currentPath.startsWith(path);

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="border-b border-sidebar-border">
        <div className="flex items-center gap-2.5 px-2 py-3">
          <div className="size-8 rounded-md bg-accent text-accent-foreground grid place-items-center font-bold tracking-tight shrink-0">
            IS
          </div>
          <div className="flex flex-col leading-tight group-data-[collapsible=icon]:hidden">
            <span className="text-sm font-semibold text-sidebar-foreground">
              Insight System
            </span>
            <span className="text-[10px] uppercase tracking-wider text-sidebar-foreground/50">
              Budget Corporativo
            </span>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-sidebar-foreground/40 uppercase tracking-widest text-[10px] font-bold">
            Navegação
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={isActive(item.url)}
                    tooltip={item.title}
                  >
                    <Link to={item.url}>
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                      {item.showBadge ? (
                        <span className="ml-auto bg-accent text-accent-foreground text-[10px] px-1.5 py-0.5 rounded-full font-bold">
                          {approvals.length}
                        </span>
                      ) : null}
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border">
        <div className="flex items-center gap-3 px-2 py-2 group-data-[collapsible=icon]:justify-center">
          <div className="size-8 rounded-full bg-sidebar-accent grid place-items-center text-xs font-semibold text-sidebar-foreground shrink-0">
            {user?.avatar ?? "?"}
          </div>
          <div className="flex flex-col leading-tight min-w-0 flex-1 group-data-[collapsible=icon]:hidden">
            <span className="text-xs font-semibold text-sidebar-foreground truncate">
              {user?.name}
            </span>
            <span className="text-[10px] text-sidebar-foreground/50 truncate">
              {user ? roleToJobTitle(user.role) : ""}
            </span>
            <span className="text-[10px] text-sidebar-foreground/40 truncate">
              {user?.email}
            </span>
          </div>
          <button
            type="button"
            onClick={handleLogout}
            title="Terminar sessão"
            className="h-8 w-8 grid place-items-center rounded-md border border-sidebar-border text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground transition-colors shrink-0 group-data-[collapsible=icon]:hidden"
          >
            <LogOut className="h-3.5 w-3.5" />
          </button>
        </div>
        {user ? (
          <p className="px-2 pb-2 text-[9px] text-sidebar-foreground/40 group-data-[collapsible=icon]:hidden">
            {ROLE_LABELS[user.role]} · {user.provider === "microsoft" ? "Microsoft" : "Google"}
          </p>
        ) : null}
      </SidebarFooter>
    </Sidebar>
  );
}
