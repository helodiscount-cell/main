import { runWithErrorHandling } from "@/server/middleware/errors";
import { getUserStories } from "@/server/services/instagram/instagram.service";

export async function GET() {
  return runWithErrorHandling(
    async ({ instaAccountId }) => {
      if (!instaAccountId) return { stories: [] };
      return await getUserStories(instaAccountId);
    },
    { requireWorkspace: true },
  );
}
