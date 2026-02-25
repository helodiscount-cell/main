import { SidebarProvider } from "@/components/ui/sidebar";
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { AppSidebar } from "@/components/AppSidebar";
import { CreateAutomationDialog } from "@/components/CreateAutomation";
import { RefreshInstaDialog } from "@/components/auth/RefreshInstaDialog";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="bg-[#F1F1F1]">{children}</SidebarInset>
    </SidebarProvider>
  );
}
