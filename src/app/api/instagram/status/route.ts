import { runWithErrorHandling } from "@/lib/middleware/errors";
import { getInstaConnectionStatus } from "@/server/services/instagram/instagram.service";

export async function GET() {
  return runWithErrorHandling(async (clerkId) => {
    const status = await getInstaConnectionStatus(clerkId);
    return status;
  });
}
