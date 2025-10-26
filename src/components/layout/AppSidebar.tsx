
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import {
  BarChart3,
  Bell,
  CalendarDays,
  ClipboardList,
  Cog,
  Factory,
  ShieldCheck,
  Smartphone,
  Users,
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import clsx from "clsx";
import type { ComponentType } from "react";

type MenuItem = {
  title: string;
  icon: ComponentType<{ className?: string }>;
  path: string;
  description?: string;
};

const menuSections: { label: string; items: MenuItem[] }[] = [
  {
    label: "Command Center",
    items: [
      { title: "Dashboard", icon: BarChart3, path: "/" },
      { title: "Guards", icon: ShieldCheck, path: "/guards" },
      { title: "Sites", icon: Factory, path: "/sites" },
      { title: "Schedule", icon: CalendarDays, path: "/schedule" },
      { title: "Incidents", icon: Bell, path: "/incidents" },
      { title: "Reports", icon: ClipboardList, path: "/reports" },
    ],
  },
  {
    label: "Stakeholders",
    items: [
      { title: "Clients", icon: Users, path: "/clients" },
      { title: "Field App", icon: Smartphone, path: "/field" },
      { title: "Settings", icon: Cog, path: "/settings" },
    ],
  },
];

export function AppSidebar() {
  const location = useLocation();

  return (
    <Sidebar>
      <SidebarHeader className="p-4">
        <h2 className="text-lg font-semibold text-guard-900">B6 Security</h2>
        <p className="text-sm text-guard-500">Operations Platform</p>
      </SidebarHeader>
      <SidebarContent>
        {menuSections.map((section) => (
          <SidebarGroup key={section.label}>
            <SidebarGroupLabel>{section.label}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {section.items.map((item) => {
                  const Icon = item.icon;
                  const isActive = location.pathname === item.path;
                  return (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton asChild>
                        <Link
                          to={item.path}
                          className={clsx(
                            "flex items-center gap-3 px-3 py-2 rounded-md",
                            isActive
                              ? "bg-guard-100 text-guard-900"
                              : "text-guard-700 hover:bg-guard-100 hover:text-guard-900"
                          )}
                        >
                          <Icon className="w-5 h-5" />
                          <span>{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
    </Sidebar>
  );
}
