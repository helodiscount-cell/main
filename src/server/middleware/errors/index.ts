// make sure before handling to the frontend, the types are present in the common-types package

/**
 * Runs a handler function with error handling and returns a standardized response
 * @note Also handles Auth check
 * @param handler - The handler function to run
 * @param options - The options for the handler
 * @returns A standardized response
 */

import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { logger } from "../../utils/pino";
import { ApiRouteError } from "./classes";

export type ErrorResponse = {
  success: false;
  error: string;
  code?: string;
  details?: any;
};

type HandlerFunction<T> = (clerkId: string) => Promise<T>;

export async function runWithErrorHandling<T>(
  handler: HandlerFunction<T>,
  options?: {
    requireAuth?: boolean; // Default true
    successMessage?: string;
  },
) {
  const { requireAuth = true, successMessage } = options || {};

  try {
    // Checks authentication
    const { userId: clerkId } = await auth();

    if (requireAuth && !clerkId) {
      throw new ApiRouteError("You need to be signed in", "UNAUTHORIZED");
    }

    // Execute handler with clerkId
    const result = await handler(clerkId!);

    // Standardized success response
    return NextResponse.json(
      {
        success: true,
        result,
        ...(successMessage && { message: successMessage }),
      },
      { status: 200 },
    );
  } catch (error) {
    // Handles known ApiRouteErrors
    if (error instanceof ApiRouteError) {
      logger.warn(
        {
          code: error.code,
          statusCode: error.statusCode,
        },
        `Operational error: ${error.message}`,
      );

      return NextResponse.json<ErrorResponse>(
        {
          success: false,
          error: error.message,
          code: error.code,
        },
        { status: error.statusCode },
      );
    }

    // Logs and handles unexpected errors in API handler
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
