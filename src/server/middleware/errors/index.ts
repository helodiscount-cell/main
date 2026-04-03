import { auth } from "@clerk/nextjs/server";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { logger } from "../../utils/pino";
import { ApiRouteError } from "./classes";
import { WORKSPACE_CONFIG } from "@/configs/workspace.config";
import { workspaceService } from "@/server/workspace";
import { ErrorResponse } from "@/types/error";

type RouteContext = {
  clerkId: string | null;
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

    // Consistency: Enforce authentication if explicitly required OR if workspace validation is needed
    if ((requireAuth || requireWorkspace) && !clerkId) {
      throw new ApiRouteError("You need to be signed in", "UNAUTHORIZED", 401);
    }

    // Read active workspace cookie
    const cookieStore = await cookies();
    const cookieId =
      cookieStore.get(WORKSPACE_CONFIG.ACTIVE_WORKSPACE_COOKIE)?.value ?? null;

    let instaAccountId: string | null = null;

    // Validate ownership before trusting the cookie value
    if (cookieId && clerkId) {
      const workspace = await workspaceService.verifyOwnership(
        cookieId,
        clerkId,
      );
      if (workspace) {
        instaAccountId = cookieId;
      } else {
        // If cookie is present but invalid/unauthorized
        if (requireWorkspace) {
          throw new ApiRouteError(
            "Access denied to this workspace.",
            "UNAUTHORIZED_WORKSPACE",
            403,
          );
        }
      }
    }

    if (requireWorkspace && !instaAccountId) {
      throw new ApiRouteError(
        "No active workspace selected. Please choose an Instagram account.",
        "NO_ACTIVE_WORKSPACE",
        400,
      );
    }

    const result = await handler({ clerkId, instaAccountId });

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
