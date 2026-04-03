/**
 * Create Automation Endpoint
 * Creates a new automation rule for Instagram posts
 */

import { NextRequest } from "next/server";
import { CreateAutomationSchema } from "@dm-broo/common-types";
import { createAutomation } from "@/server/services/automations/automation.service";
import {
  parseRequestBodySafely,
  REQUEST_SIZE_LIMITS,
} from "@/server/utils/request-limits";
import { runWithErrorHandling } from "@/server/middleware/errors";
import { ApiRouteError } from "@/server/middleware/errors/classes";

export async function POST(request: NextRequest) {
  return runWithErrorHandling(
    async ({ clerkId, instaAccountId }) => {
      const body = await parseRequestBodySafely(
        request,
        REQUEST_SIZE_LIMITS.API_DEFAULT,
      );

      const validation = CreateAutomationSchema.safeParse(body);

      if (!validation.success) {
        throw new ApiRouteError(
          validation.error.issues[0]?.message || "Invalid input",
          "INVALID_INPUT",
          400,
        );
      }

      // Calls service layer to create automation in the active workspace
      const automation = await createAutomation(
        clerkId!,
        instaAccountId!,
        validation.data,
      );

      return automation;
    },
    { requireWorkspace: true },
  );
}
