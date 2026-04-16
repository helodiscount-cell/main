"use client";

import { SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar";
import Link from "next/link";
import { usePathname } from "next/navigation";
import DashboardIcon from "@/assets/svgs/sidebar/dashboard.svg";
import AutomationsIcon from "@/assets/svgs/sidebar/bx-message-detail.svg";
import FormsIcon from "@/assets/svgs/sidebar/bx-copy-alt.svg";
import ContactsIcon from "@/assets/svgs/sidebar/users-more_curved.svg";
import BillingIcon from "@/assets/svgs/sidebar/bx-coin-stack.svg";
import SettingsIcon from "@/assets/svgs/sidebar/Group 58.svg";
import Image from "next/image";

const navItems = [
  { title: "Dashboard", url: "/dash", exact: true, Icon: DashboardIcon },
  { title: "Automations", url: "/dash/automations", Icon: AutomationsIcon },
  { title: "Forms", url: "/dash/forms", Icon: FormsIcon },
  { title: "Contacts", url: "/dash/contacts", Icon: ContactsIcon },
  { title: "Billing", url: "/dash/billing", Icon: BillingIcon },
  { title: "Settings", url: "/dash/settings", Icon: SettingsIcon },
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
                  ? "bg-[#F3E8FF] text-[#8B5CF6] hover:bg-[#F3E8FF] hover:text-[#8B5CF6]"
                  : "bg-white text-[#1A1D1F] hover:bg-slate-50 border-transparent"
              }
              size="lg"
            >
              <Link
                href={item.url}
                className="flex items-center gap-3 w-full px-4 h-12"
              >
                <Image
                  src={item.Icon}
                  alt={item.title}
                  width={20}
                  height={20}
                />
                <span className="font-medium text-[16px]">{item.title}</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        );
      })}
    </div>
  );
}
