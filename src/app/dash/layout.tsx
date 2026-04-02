import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { workspaceService } from "@/server/workspace";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Centralized verification: handles auth, account existence, and session validity.
  // Redirects automatically to /connect or /auth/callback if needed.
  const workspace = await workspaceService.getVerifiedActiveWorkspace();
  if (!workspace) return null;

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="bg-[#F1F1F1]">{children}</SidebarInset>
    </SidebarProvider>
  );
}
