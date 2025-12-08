/**
 * Create Automation Endpoint
 * Creates a new automation rule for Instagram posts
 */

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { CreateAutomationSchema } from "@dm-broo/common-types";
import { createAutomation } from "@/server/services/automation.service";
import {
  parseRequestBodySafely,
  REQUEST_SIZE_LIMITS,
} from "@/lib/utils/request-limits";
import { findUserByClerkId } from "@/server/repositories/user.repository";

export async function POST(request: NextRequest) {
  try {
    // Gets current authenticated user
    const { userId: clerkId } = await auth();

    if (!clerkId) {
      return NextResponse.json(
        { success: false, error: "You must be logged in" },
        { status: 401 }
      );
    }

    // Gets the user record
    const user = await findUserByClerkId(clerkId);

    if (!user) {
      return NextResponse.json(
        { success: false, error: "User not found" },
        { status: 404 }
      );
    }

    // Parses and validates request body with size limits
    const body = await parseRequestBodySafely(
      request,
      REQUEST_SIZE_LIMITS.API_DEFAULT
    );
    const validation = CreateAutomationSchema.safeParse(body);

    if (!validation.success) {
      const errorMessage =
        validation.error.issues[0]?.message || "Invalid input";
      return NextResponse.json(
        { success: false, error: errorMessage },
        { status: 400 }
      );
    }

    // Calls service layer
    const automation = await createAutomation(user.id, validation.data);

    return NextResponse.json(
      {
        success: true,
        automation,
      },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Failed to create automation. Please try again.",
      },
      { status: 500 }
    );
  }
}
