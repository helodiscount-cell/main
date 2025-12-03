/**
 * List Automations Endpoint
 * Retrieves all automations for the current user
 */

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { AutomationListQuerySchema } from "@insta-auto/common-types";
import { listAutomations } from "@/server/services/automation.service";
import { findUserByClerkId } from "@/server/repositories/user.repository";

export async function GET(request: NextRequest) {
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

    // Gets and validates query parameters
    const searchParams = request.nextUrl.searchParams;
    const queryValidation = AutomationListQuerySchema.safeParse({
      status: searchParams.get("status"),
      postId: searchParams.get("postId"),
      page: searchParams.get("page"),
      limit: searchParams.get("limit"),
    });

    if (!queryValidation.success) {
      const errorMessage =
        queryValidation.error.issues[0]?.message || "Invalid query parameters";
      return NextResponse.json(
        { success: false, error: errorMessage },
        { status: 400 }
      );
    }

    const filters = queryValidation.data;

    // Calls service layer
    const result = await listAutomations(user.id, filters);

    return NextResponse.json(
      {
        success: true,
        automations: result.data,
        pagination: result.pagination,
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: "Failed to retrieve automations. Please try again.",
      },
      { status: 500 }
    );
  }
}

