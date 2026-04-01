import { auth } from "@clerk/nextjs/server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { WORKSPACE_CONFIG } from "@/configs/workspace.config";
import { prisma } from "@/server/db";
import { CONNECT_ROUTE } from "@/configs/routes.config";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { userId } = await auth();
  if (!userId) {
    redirect("/auth/signin");
  }

  const cookieStore = await cookies();
  const activeWorkspaceCookie = cookieStore.get(
    WORKSPACE_CONFIG.ACTIVE_WORKSPACE_COOKIE,
  );

  // 1. Fetch user workspace status to verify current session
  const userWithAccounts = await prisma.user.findUnique({
    where: { clerkId: userId },
    select: {
      instaAccounts: {
        where: { isActive: true },
        select: { id: true },
      },
    },
  });

  const activeAccounts = userWithAccounts?.instaAccounts || [];

  // 2. No active accounts in DB: force user to connect page
  if (activeAccounts.length === 0) {
    // Also clear the stale cookie if it exists to be clean
    if (activeWorkspaceCookie) {
      // Note: can't clear cookies in Server Component during render,
      // but the redirect to /connect will effectively handle the UI state.
    }
    redirect(CONNECT_ROUTE);
  }

  // 3. Stale or Missing Session:
  // If we have accounts but the cookie is missing OR it refers to an account we no longer have
  const isValidSession =
    activeWorkspaceCookie &&
    activeAccounts.some((acc) => acc.id === activeWorkspaceCookie.value);

  if (!isValidSession) {
    // Auto-initialize to the first valid account
    const defaultAccount = activeAccounts[0];
    redirect(`/auth/callback/workspace?id=${defaultAccount.id}&next=/dash`);
  }

  // 4. Valid Session: Continue to dashboard
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="bg-[#F1F1F1]">{children}</SidebarInset>
    </SidebarProvider>
  );
}
