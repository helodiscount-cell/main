import { prisma } from "@/server/db";
import { invalidateInstagramCache } from "@/server/redis";
import { runWithErrorHandling } from "@/server/middleware/errors";
import { ApiRouteError } from "@/server/middleware/errors/classes";

export async function DELETE() {
  return runWithErrorHandling(async ({ clerkId, instaAccountId }) => {
    if (!instaAccountId) {
      throw new ApiRouteError(
        "No active workspace",
        "NO_ACTIVE_WORKSPACE",
        400,
      );
    }

    const account = await prisma.instaAccount.findUnique({
      where: { id: instaAccountId, isActive: true },
      select: { instagramUserId: true },
    });

    if (!account) {
      throw new ApiRouteError(
        "No Instagram account linked",
        "NO_INSTAGRAM_ACCOUNT",
        404,
      );
    }

    await invalidateInstagramCache(account.instagramUserId);

    return { success: true };
  });
}
