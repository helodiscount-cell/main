import { auth } from "@clerk/nextjs/server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { prisma } from "@/server/db";
import { WORKSPACE_CONFIG } from "@/configs/workspace.config";
import { CONNECT_ROUTE } from "@/configs/routes.config";
import { disconnectAccount } from "@/server/services/instagram/oauth.service";

/**
 * Workspace Service
 * Centralized logic for multi-workspace management.
 */
export const workspaceService = {
  /**
   * Retrieves the current workspace ID from cookies
   */
  async getActiveId(): Promise<string | undefined> {
    const cookieStore = await cookies();
    return cookieStore.get(WORKSPACE_CONFIG.ACTIVE_WORKSPACE_COOKIE)?.value;
  },

  /**
   * Verifies if a workspace belongs to the user and is active
   */
  async verifyOwnership(instaAccountId: string, clerkId: string) {
    return prisma.instaAccount.findFirst({
      where: {
        id: instaAccountId,
        user: { clerkId },
        isActive: true,
      },
      select: { id: true, username: true },
    });
  },

  /**
   * Gets the verified active workspace for the current session.
   * Redirects to /connect if no accounts or invalid session.
   */
  async getVerifiedActiveWorkspace() {
    const { userId } = await auth();
    if (!userId) {
      // Middleware should handle this, but for extra safety in services:
      return null;
    }

    const activeId = await this.getActiveId();

    const userWithAccounts = await prisma.user.findUnique({
      where: { clerkId: userId },
      select: {
        instaAccounts: {
          where: { isActive: true },
          select: { id: true, username: true, profilePictureUrl: true },
        },
      },
    });

    const activeAccounts = userWithAccounts?.instaAccounts || [];

    // 1. Force connect if no accounts
    if (activeAccounts.length === 0) {
      redirect(CONNECT_ROUTE);
    }

    // 2. Validate current cookie session
    const currentAccount = activeAccounts.find((acc) => acc.id === activeId);

    if (currentAccount) {
      return {
        id: currentAccount.id,
        username: currentAccount.username,
        allAccounts: activeAccounts,
      };
    }

    // 3. Stale or Missing Session: Auto-initialize to first valid account
    const defaultAccount = activeAccounts[0];
    redirect(`/auth/callback/workspace?id=${defaultAccount.id}&next=/dash`);
  },

  /**
   * Sets the active workspace cookie and revalidates
   */
  async setActive(id: string) {
    const { userId } = await auth();
    if (!userId) redirect("/auth");

    const account = await this.verifyOwnership(id, userId);
    if (!account) throw new Error("Invalid workspace or access denied");

    const cookieStore = await cookies();
    cookieStore.set(WORKSPACE_CONFIG.ACTIVE_WORKSPACE_COOKIE, id, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: WORKSPACE_CONFIG.COOKIE_MAX_AGE_SECONDS,
      path: "/",
    });

    const { revalidatePath } = await import("next/cache");
    revalidatePath("/", "layout");

    return id;
  },

  /**
   * Performs soft-disconnection of a workspace
   */
  async disconnectActive() {
    const { userId } = await auth();
    if (!userId) redirect("/auth");

    const activeId = await this.getActiveId();
    if (!activeId) redirect(CONNECT_ROUTE);

    const account = await this.verifyOwnership(activeId, userId);
    if (!account) {
      const cookieStore = await cookies();
      cookieStore.delete(WORKSPACE_CONFIG.ACTIVE_WORKSPACE_COOKIE);
      redirect(CONNECT_ROUTE);
    }

    await disconnectAccount(activeId);

    const cookieStore = await cookies();
    cookieStore.delete(WORKSPACE_CONFIG.ACTIVE_WORKSPACE_COOKIE);

    redirect(CONNECT_ROUTE);
  },

  /**
   * Fetches all Instagram accounts for the current user
   */
  async getUserWorkspaces() {
    const { userId: clerkId } = await auth();
    if (!clerkId) return [];

    const user = await prisma.user.findUnique({
      where: { clerkId },
      select: {
        instaAccounts: {
          orderBy: { connectedAt: "asc" },
          select: {
            id: true,
            username: true,
            profilePictureUrl: true,
            isActive: true,
            tokenExpiresAt: true,
          },
        },
      },
    });

    return user?.instaAccounts ?? [];
  },
};
