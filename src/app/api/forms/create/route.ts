// POST /api/forms/create — saves a form for the signed-in user
import { NextRequest } from "next/server";
import { CreateFormSchema } from "@dm-broo/common-types";
import { createForm } from "@/server/services/forms";
import { runWithErrorHandling } from "@/server/middleware/errors";
import { ApiRouteError } from "@/server/middleware/errors/classes";
import {
  parseRequestBodySafely,
  REQUEST_SIZE_LIMITS,
} from "@/server/utils/request-limits";

export async function POST(request: NextRequest) {
  return runWithErrorHandling(async ({ clerkId, instaAccountId }) => {
    const body = await parseRequestBodySafely(
      request,
      REQUEST_SIZE_LIMITS.API_DEFAULT,
    );

    const validation = CreateFormSchema.safeParse(body);

    if (!validation.success) {
      throw new ApiRouteError(
        validation.error.issues[0]?.message || "Invalid input",
        "INVALID_INPUT",
        400,
      );
    }

    return createForm(clerkId, instaAccountId!, validation.data);
  });
}
