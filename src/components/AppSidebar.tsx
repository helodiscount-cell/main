import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarRail,
} from "@/components/ui/sidebar";
import { Button } from "./ui/button";
import Link from "next/link";
import UserSection from "./UserSection";
import { LogOut } from "lucide-react";
import { AppSidebarNav } from "./AppSidebarNav";
import React from "react";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <UserSection />
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup className="h-full">
          <SidebarGroupContent className="h-full">
            <SidebarMenu className="h-full">
              <div className="p-4 flex flex-col h-full justify-between">
                <AppSidebarNav />
                <Button variant={"destructive"} size="lg">
                  <LogOut className="text-red-600" />
                  <Link href={"/auth/logout"} className="text-primary">
                    Log out
                  </Link>
                </Button>
              </div>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}
