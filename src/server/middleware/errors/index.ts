import { auth } from "@clerk/nextjs/server";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { logger } from "../../utils/pino";
import { ApiRouteError } from "./classes";
import { WORKSPACE_CONFIG } from "@/configs/workspace.config";
import { ErrorResponse } from "@/types/error";

type RouteContext = {
  clerkId: string;
  instaAccountId: string | null;
};

type HandlerFunction<T> = (ctx: RouteContext) => Promise<T>;

export async function runWithErrorHandling<T>(
  handler: HandlerFunction<T>,
  options?: {
    requireAuth?: boolean;
    requireWorkspace?: boolean;
    successMessage?: string;
  },
) {
  const {
    requireAuth = true,
    requireWorkspace = false,
    successMessage,
  } = options || {};

  try {
    const { userId: clerkId } = await auth();

    if (requireAuth && !clerkId) {
      throw new ApiRouteError("You need to be signed in", "UNAUTHORIZED", 401);
    }

    // Read active workspace cookie so every handler has workspace context
    const cookieStore = await cookies();
    const instaAccountId =
      cookieStore.get(WORKSPACE_CONFIG.ACTIVE_WORKSPACE_COOKIE)?.value ?? null;

    if (requireWorkspace && !instaAccountId) {
      throw new ApiRouteError(
        "No active workspace selected. Please choose an Instagram account.",
        "NO_ACTIVE_WORKSPACE",
        400,
      );
    }

    const result = await handler({ clerkId: clerkId!, instaAccountId });

    return NextResponse.json(
      {
        success: true,
        result,
        ...(successMessage && { message: successMessage }),
      },
      { status: 200 },
    );
  } catch (error) {
    if (error instanceof ApiRouteError) {
      logger.warn(
        { code: error.code, statusCode: error.statusCode },
        `Operational error: ${error.message}`,
      );

      return NextResponse.json<ErrorResponse>(
        { success: false, error: error.message, code: error.code },
        { status: error.statusCode },
      );
    }

    if (error instanceof Error) {
      console.log(error.message);
    }

    return NextResponse.json<ErrorResponse>(
      {
        success: false,
        error: "An unexpected error occurred. Please try again later.",
        code: "INTERNAL_SERVER_ERROR",
      },
      { status: 500 },
    );
  }
}
