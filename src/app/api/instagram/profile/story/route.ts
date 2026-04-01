import { runWithErrorHandling } from "@/server/middleware/errors";
import { getUserStories } from "@/server/services/instagram/instagram.service";

export async function GET(request: Request) {
  return runWithErrorHandling(
    async ({ clerkId, instaAccountId }) => {
      return await getUserStories(instaAccountId!);
    },
    { requireWorkspace: true },
  );
}
