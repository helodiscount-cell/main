import { prisma } from "@/server/db";
import { invalidateInstagramCache } from "@/server/redis";
import { runWithErrorHandling } from "@/server/middleware/errors";
import { ApiRouteError } from "@/server/middleware/errors/classes";

export async function DELETE() {
  return runWithErrorHandling(
    async ({ clerkId, instaAccountId }) => {
      // instaAccountId is guaranteed by requireWorkspace: true
      const account = await prisma.instaAccount.findFirst({
        where: {
          id: instaAccountId!,
          user: { clerkId: clerkId! },
          isActive: true,
        },
        select: { instagramUserId: true, webhookUserId: true },
      });

      if (!account) {
        throw new ApiRouteError(
          "No Instagram account linked",
          "NO_INSTAGRAM_ACCOUNT",
          404,
        );
      }

      const identifier = account.webhookUserId || account.instagramUserId;
      await invalidateInstagramCache(identifier);

      return { success: true };
    },
    { requireWorkspace: true },
  );
}
