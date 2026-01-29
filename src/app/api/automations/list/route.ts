/**
 * List Automations Endpoint
 * Retrieves all automations for the current user
 */

import { NextRequest } from "next/server";
import { z } from "zod";
import { getUserAutomations } from "@/server/services/automation.service";
import { runWithErrorHandling } from "@/lib/middleware/errors";
import { ApiRouteError } from "@/lib/middleware/errors/classes";
import { sanitizeQueryParam } from "@/lib/utils/validation";

// Validates query parameters (status and postId only, no pagination)
const AutomationListQuerySchema = z.object({
  status: z.enum(["ACTIVE", "PAUSED", "DELETED"]).optional(),
  postId: z
    .string()
    .optional()
    .transform((val) => (val ? sanitizeQueryParam(val, 100) : undefined)),
});

export async function GET(request: NextRequest) {
  return runWithErrorHandling(async (clerkId) => {
    // Gets and validates query parameters
    const searchParams = request.nextUrl.searchParams;
    const queryValidation = AutomationListQuerySchema.safeParse({
      status: searchParams.get("status") || undefined,
      postId: searchParams.get("postId") || undefined,
    });

    if (!queryValidation.success) {
      const errorMessage =
        queryValidation.error.issues[0]?.message || "Invalid query parameters";
      throw new ApiRouteError(errorMessage, "INVALID_QUERY_PARAMETERS");
    }

    const filters = queryValidation.data;

    // Calls service layer to get all automations
    const automations = await getUserAutomations(clerkId, filters);

    return {
      automations,
    };
  });
}
