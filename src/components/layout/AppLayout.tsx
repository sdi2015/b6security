
import React from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "./AppSidebar";

export function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-guard-50">
        <AppSidebar />
        <main className="flex-1 overflow-y-auto">
          <div className="container py-6 space-y-6 animate-fade-up">
            {children}
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}
