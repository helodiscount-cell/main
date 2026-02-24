import { runWithErrorHandling } from "@/server/middleware/errors";
import { getInstaUserProfile } from "@/server/services/instagram/instagram.service";

export async function GET() {
  return runWithErrorHandling(async (clerkId) => {
    return await getInstaUserProfile(clerkId);
  });
}
