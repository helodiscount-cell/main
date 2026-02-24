import * as React from "react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import { Button } from "./ui/button";
import Link from "next/link";
import UserSection from "./UserSection";
import { LogOut } from "lucide-react";

// This is sample data.
const data = {
  versions: ["1.0.1", "1.1.0-alpha", "2.0.0-beta1"],
  navMain: [
    {
      title: "",
      url: "#",
      items: [
        {
          title: "Dashboard",
          url: "/dashboard",
        },
        {
          title: "Automations",
          url: "/dashboard",
        },
        {
          title: "Forms",
          url: "/dashboard",
          isActive: true,
        },
        {
          title: "Contacts",
          url: "/dashboard",
        },
        {
          title: "Refer & Earn",
          url: "/dashboard",
        },
        {
          title: "Settings",
          url: "/dashboard",
        },
      ],
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <UserSection />
      </SidebarHeader>
      <SidebarContent>
        {/* We create a SidebarGroup for each parent. */}
        {data.navMain.map((item) => (
          <SidebarGroup key={item.title} className="h-full">
            {/* <SidebarGroupLabel>{item.title}</SidebarGroupLabel> */}
            <SidebarGroupContent className="h-full">
              <SidebarMenu className="h-full">
                <div className="flex flex-col h-full justify-between">
                  <div>
                    {item.items.map((item) => (
                      <SidebarMenuItem key={item.title}>
                        <SidebarMenuButton asChild isActive={item.isActive}>
                          <Link href={item.url} className="px-4 py-6">
                            {item.title}
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    ))}
                  </div>
                  <Button variant={"destructive"}>
                    <LogOut />
                    <Link href={"/auth/logout"}>Logout</Link>
                  </Button>
                </div>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}
