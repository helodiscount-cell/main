/**
 * Create Automation Endpoint
 * Creates a new automation rule for Instagram posts
 */

import { NextRequest } from "next/server";
import { CreateAutomationSchema } from "@dm-broo/common-types";
import { createAutomation } from "@/server/services/auto/automation.service";
import {
  parseRequestBodySafely,
  REQUEST_SIZE_LIMITS,
} from "@/lib/utils/request-limits";
import { runWithErrorHandling } from "@/lib/middleware/errors";
import { ApiRouteError } from "@/lib/middleware/errors/classes";

export async function POST(request: NextRequest) {
  return runWithErrorHandling(async (clerkId) => {
    // Parses and validates request body with size limits
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

    // Calls service layer to create automation
    const automation = await createAutomation(clerkId, validation.data);

    return automation;
  });
}
