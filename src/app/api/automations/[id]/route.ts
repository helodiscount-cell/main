/**
 * Automation Management Endpoint
 * Gets, updates, or deletes a specific automation
 */

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/db";
import { UpdateAutomationSchema } from "@/server/schemas/automation.schema";
import {
  getAutomation,
  updateAutomation,
  deleteAutomation,
} from "@/server/services/automation.service";

/**
 * GET - Retrieves a specific automation
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId: clerkId } = await auth();

    if (!clerkId) {
      return NextResponse.json(
        { success: false, error: "You must be logged in" },
        { status: 401 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { clerkId },
    });

    if (!user) {
      return NextResponse.json(
        { success: false, error: "User not found" },
        { status: 404 }
      );
    }

    const resolvedParams = await params;
    const automationId = resolvedParams.id;

    // Calls service layer
    const automation = await getAutomation(user.id, automationId);

    return NextResponse.json(
      {
        success: true,
        automation,
      },
      { status: 200 }
    );
  } catch (error) {
    const statusCode =
      error instanceof Error && error.message === "Automation not found"
        ? 404
        : error instanceof Error && error.message === "Unauthorized"
          ? 403
          : 500;
    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Failed to retrieve automation. Please try again.",
      },
      { status: statusCode }
    );
  }
}

/**
 * PATCH - Updates an automation
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId: clerkId } = await auth();

    if (!clerkId) {
      return NextResponse.json(
        { success: false, error: "You must be logged in" },
        { status: 401 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { clerkId },
    });

    if (!user) {
      return NextResponse.json(
        { success: false, error: "User not found" },
        { status: 404 }
      );
    }

    const resolvedParams = await params;
    const automationId = resolvedParams.id;

    // Parses and validates request body
    const body = await request.json();
    const validation = UpdateAutomationSchema.safeParse(body);

    if (!validation.success) {
      const errorMessage =
        validation.error.issues[0]?.message || "Invalid input";
      return NextResponse.json(
        { success: false, error: errorMessage },
        { status: 400 }
      );
    }

    // Calls service layer
    const automation = await updateAutomation(
      user.id,
      automationId,
      validation.data
    );

    return NextResponse.json(
      {
        success: true,
        automation,
      },
      { status: 200 }
    );
  } catch (error) {
    const statusCode =
      error instanceof Error && error.message === "Automation not found"
        ? 404
        : error instanceof Error && error.message === "Unauthorized"
          ? 403
          : 500;
    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Failed to update automation. Please try again.",
      },
      { status: statusCode }
    );
  }
}

/**
 * DELETE - Deletes an automation
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId: clerkId } = await auth();

    if (!clerkId) {
      return NextResponse.json(
        { success: false, error: "You must be logged in" },
        { status: 401 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { clerkId },
    });

    if (!user) {
      return NextResponse.json(
        { success: false, error: "User not found" },
        { status: 404 }
      );
    }

    const resolvedParams = await params;
    const automationId = resolvedParams.id;

    // Calls service layer
    const result = await deleteAutomation(user.id, automationId);

    return NextResponse.json(
      {
        success: true,
        message: result.message,
      },
      { status: 200 }
    );
  } catch (error) {
    const statusCode =
      error instanceof Error && error.message === "Automation not found"
        ? 404
        : error instanceof Error && error.message === "Unauthorized"
          ? 403
          : 500;
    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Failed to delete automation. Please try again.",
      },
      { status: statusCode }
    );
  }
}
