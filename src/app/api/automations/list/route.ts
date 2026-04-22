/**
 * List Automations Endpoint
 * Retrieves all automations for the current user
 */

import { NextRequest } from "next/server";
import { z } from "zod";
import { getUserAutomations } from "@/server/services/automations/automation.service";
import { runWithErrorHandling } from "@/server/middleware/errors";
import { ApiRouteError } from "@/server/middleware/errors/classes";

const AutomationListQuerySchema = z.object({
  status: z.enum(["ACTIVE", "STOPPED", "EXPIRED"]).optional(),
});

export async function POST(request: NextRequest) {
  return runWithErrorHandling(
    async ({ instaAccountId }) => {
      // Extract filters from the request body as confirmed by frontend implementation
      let body: any = {};
      const rawText = await request.text();

      if (rawText.trim()) {
        try {
          body = JSON.parse(rawText);
        } catch (error) {
          throw new ApiRouteError(
            "Malformed JSON in request body",
            "MALFORMED_JSON",
            400,
          );
        }
      }

      const validation = AutomationListQuerySchema.safeParse(body);

      if (!validation.success) {
        throw new ApiRouteError(
          "Invalid status filter. Recommended: ACTIVE, STOPPED, EXPIRED",
          "INVALID_INPUT",
          400,
        );
      }

      if (!instaAccountId) {
        throw new ApiRouteError(
          "No active workspace session found",
          "NO_ACTIVE_WORKSPACE",
          400,
        );
      }

      const automations = await getUserAutomations(
        instaAccountId,
        validation.data,
      );

      return { automations };
    },
    { requireWorkspace: true },
  );
}
