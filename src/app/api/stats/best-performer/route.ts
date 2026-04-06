import { NextRequest } from "next/server";
import {
  runWithErrorHandling,
  ApiRouteError,
} from "@/server/middleware/errors";
import { getBestPerformerStats } from "@/server/services/stats/best-performer.service";
import { getFeatureGates } from "@/server/services/billing/feature-gates";

/**
 * GET /api/stats/best-performer
 *
 * Fetches the user's top three performing posts based on internal automation execution stats.
 * Properly gated for Black plan users.
 */
export async function GET(req: NextRequest) {
  return runWithErrorHandling(
    async ({ clerkId, instaAccountId }) => {
      // clerkId is guaranteed by runWithErrorHandling when requireWorkspace is true
      const gates = await getFeatureGates(clerkId!);

      if (!gates.access.hasBestPerformer) {
        throw new ApiRouteError(
          "This feature requires a BLACK plan subscription.",
          "FEATURE_LOCKED",
          403,
        );
      }

      const { searchParams } = new URL(req.url);
      const rangeLabel = searchParams.get("range") || "Last 7 days";

      const stats = await getBestPerformerStats(instaAccountId!, rangeLabel);

      return stats;
    },
    { requireWorkspace: true },
  );
}
