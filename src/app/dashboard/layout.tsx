import { SidebarProvider } from "@/components/ui/sidebar";
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { AppSidebar } from "@/components/AppSidebar";
import RestartIcon from "@/assets/svgs/restart.svg";
import { CreateAutomationDialog } from "@/components/CreateAutomation";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="bg-[#F1F1F1]">
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator
            orientation="vertical"
            className="mr-2 data-[orientation=vertical]:h-4"
          />

          <div className="flex w-full gap-4">
            <div
              className="flex-1 bg-white rounded-xl pl-4 flex items-center"
              style={{ height: "inherit" }}
            >
              <p className="text-sm font-semibold">Dashboard</p>
            </div>
            <Button className="bg-[#6A06E4] border-none outline-none rounded-sm">
              <Image src={RestartIcon} alt="Restart" width={20} height={20} />
            </Button>
            <CreateAutomationDialog />
          </div>
        </header>
        {children}
      </SidebarInset>
    </SidebarProvider>
  );
}
