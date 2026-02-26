/**
 * List Automations Endpoint
 * Retrieves all automations for the current user
 */

import { NextRequest } from "next/server";
import { z } from "zod";
import { getUserAutomations } from "@/server/services/automations/automation.service";
import { runWithErrorHandling } from "@/server/middleware/errors";
import { ApiRouteError } from "@/server/middleware/errors/classes";
import { sanitizeQueryParam } from "@/server/utils/validation";
import {
  parseRequestBodySafely,
  REQUEST_SIZE_LIMITS,
} from "@/server/utils/request-limits";

const AutomationListBodySchema = z.object({
  status: z.enum(["ACTIVE", "PAUSED", "DELETED"]).optional(),
  postId: z
    .string()
    .optional()
    .transform((val) => (val ? sanitizeQueryParam(val, 100) : undefined)),
});

export async function POST(request: NextRequest) {
  return runWithErrorHandling(async (clerkId) => {
    const body = await parseRequestBodySafely(
      request,
      REQUEST_SIZE_LIMITS.API_DEFAULT,
    );

    const validation = AutomationListBodySchema.safeParse(body);

    if (!validation.success) {
      const errorMessage =
        validation.error.issues[0]?.message || "Invalid request body";
      throw new ApiRouteError(errorMessage, "INVALID_INPUT", 400);
    }

    const automations = await getUserAutomations(clerkId, validation.data);

    return { automations };
  });
}
