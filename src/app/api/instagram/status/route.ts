import { runWithErrorHandling } from "@/lib/middleware/errors";
import { getConnectionStatus } from "@/server/services/instagram.service";

export async function GET() {
  return runWithErrorHandling(async (clerkId) => {
    const status = await getConnectionStatus(clerkId);
    return status;
  });
}