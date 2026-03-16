import { NextRequest } from "next/server";
import { SubmitFormSchema } from "@dm-broo/common-types";
import { submitForm } from "@/server/services/forms";
import { runWithErrorHandling } from "@/server/middleware/errors";
import { ApiRouteError } from "@/server/middleware/errors/classes";
import {
  parseRequestBodySafely,
  REQUEST_SIZE_LIMITS,
} from "@/server/utils/request-limits";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  return runWithErrorHandling(
    async () => {
      const { slug } = await params;
      const body = await parseRequestBodySafely(
        request,
        REQUEST_SIZE_LIMITS.API_DEFAULT,
      );

      const validation = SubmitFormSchema.safeParse(body);

      if (!validation.success) {
        throw new ApiRouteError(
          validation.error.issues[0]?.message || "Invalid submission",
          "INVALID_INPUT",
          400,
        );
      }

      // Pull client metadata for tracking
      const ipAddress = request.headers.get("x-forwarded-for") ?? undefined;
      const userAgent = request.headers.get("user-agent") ?? undefined;

      return submitForm(slug, validation.data, { ipAddress, userAgent });
    },
    { requireAuth: false },
  );
}
