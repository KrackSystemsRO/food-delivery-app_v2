import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/site-header";
import { Outlet } from "react-router-dom";
import React, { useMemo } from "react";
import { AuthProvider } from "@/context/authContext";

interface AuthenticatedLayoutProps {
  children?: React.ReactNode;
}

export const AuthenticatedLayout: React.FC<AuthenticatedLayoutProps> =
  React.memo(({ children }) => {
    const sidebarStyles = useMemo(
      () =>
        ({
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties),
      []
    );

    return (
      <AuthProvider>
        <SidebarProvider style={sidebarStyles}>
          <AppSidebar variant="inset" />
          <SidebarInset>
            <SiteHeader />
            <main className="flex flex-1 flex-col @container/main gap-2 py-4 md:gap-6 md:py-6">
              {children ?? <Outlet />}
            </main>
          </SidebarInset>
        </SidebarProvider>
      </AuthProvider>
    );
  });
