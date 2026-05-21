import React from "react";
import { Outlet } from "react-router-dom";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { AppHeader } from "@/components/layout/AppHeader";
import { BudgetSessionProvider } from "@/features/budget/BudgetSessionContext";

export function AppLayout() {
  return (
    <BudgetSessionProvider>
      <SidebarProvider>
        <div className="min-h-screen flex w-full bg-background text-foreground transition-colors duration-300">
          <AppSidebar />

          <SidebarInset className="min-h-0 min-w-0 overflow-hidden">
            <AppHeader />
            <div className="flex flex-1 flex-col overflow-x-hidden">
              <div className="mx-auto w-full max-w-[1500px] flex-1 p-6 lg:p-8">
                <Outlet />
              </div>
            </div>
          </SidebarInset>
        </div>
      </SidebarProvider>
    </BudgetSessionProvider>
  );
}
