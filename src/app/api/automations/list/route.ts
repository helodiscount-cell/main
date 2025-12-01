/**
 * List Automations Endpoint
 * Retrieves all automations for the current user
 */

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/db";
import { AutomationListQuerySchema } from "@/server/schemas/automation.schema";
import { listAutomations } from "@/server/services/automation.service";

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
    const user = await prisma.user.findUnique({
      where: { clerkId },
    });

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
    });

    const filters = queryValidation.success ? queryValidation.data : undefined;

    // Calls service layer
    const automations = await listAutomations(user.id, filters);

    return NextResponse.json(
      {
        success: true,
        automations,
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

