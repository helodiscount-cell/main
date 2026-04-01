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
  status: z.enum(["ACTIVE", "PAUSED"]).optional(),
});

export async function POST(request: NextRequest) {
  return runWithErrorHandling(
    async ({ clerkId, instaAccountId }) => {
      // Extract filters from the request body as confirmed by frontend implementation
      let body: any = {};
      try {
        body = await request.json();
      } catch (error) {
        // Body can be empty for default "ALL" filters
        body = {};
      }

      console.log("Automation list request body:", JSON.stringify(body));

      const validation = AutomationListQuerySchema.safeParse(body);

      console.log("Validation result:", JSON.stringify(validation));

      if (!validation.success) {
        throw new ApiRouteError(
          "Invalid status filter. Recommended: ACTIVE, PAUSED",
          "INVALID_INPUT",
          400,
        );
      }

      const automations = await getUserAutomations(
        instaAccountId!,
        validation.data,
      );

      // console.log(automations);

      return { automations };
    },
    { requireWorkspace: true },
  );
}
