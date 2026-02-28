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
  return runWithErrorHandling(async (clerkId) => {
    const { searchParams } = new URL(request.url);
    const queryData = {
      status: searchParams.get("status") || undefined,
    };

    const validation = AutomationListQuerySchema.safeParse(queryData);

    if (!validation.success) {
      throw new ApiRouteError("Invalid status filter", "INVALID_INPUT", 400);
    }

    const automations = await getUserAutomations(clerkId, validation.data);

    return { automations };
  });
}
