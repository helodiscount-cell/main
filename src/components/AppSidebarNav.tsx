"use client";

import { SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChart2,
  MessageSquare,
  ClipboardList,
  Users,
  Database,
  Settings,
} from "lucide-react";

const navItems = [
  { title: "Dashboard", url: "/dash", exact: true, Icon: BarChart2 },
  { title: "Automations", url: "/dash/automations", Icon: MessageSquare },
  { title: "Forms", url: "/dash/forms", Icon: ClipboardList },
  { title: "Contacts", url: "/dash/contacts", Icon: Users },
  { title: "Refer & Earn", url: "/dash/refer", Icon: Database },
  { title: "Settings", url: "/dash/settings", Icon: Settings },
];

export function AppSidebarNav() {
  const pathname = usePathname();

  return (
    <div className="flex flex-col gap-4">
      {navItems.map((item) => {
        const isActive = item.exact
          ? pathname === item.url
          : pathname.startsWith(item.url);
        return (
          <SidebarMenuItem key={item.title}>
            <SidebarMenuButton
              asChild
              isActive={isActive}
              className={
                isActive
                  ? "bg-purple-600 text-white hover:bg-purple-700 hover:text-white"
                  : "bg-[#F9F9F9] hover:bg-[#F9F9F9]/80"
              }
            >
              <Link
                href={item.url}
                className="px-4 py-6 flex items-center gap-3"
              >
                <item.Icon
                  className={isActive ? "text-purple-600" : "text-slate-500"}
                  size={18}
                />
                {item.title}
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        );
      })}
    </div>
  );
}
