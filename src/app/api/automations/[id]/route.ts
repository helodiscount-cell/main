/**
 * Automation Management Endpoint
 * Gets, updates, or deletes a specific automation
 */

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { UpdateAutomationSchema } from "@dm-broo/common-types";
import {
  getAutomation,
  updateAutomation,
  deleteAutomation,
} from "@/server/services/auto/automation.service";
import { findUserByClerkId } from "@/server/repository/user-profile/user.repository";
import { isValidObjectId, sanitizeQueryParam } from "@/server/utils/validation";

/**
 * GET - Retrieves a specific automation
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { userId: clerkId } = await auth();

    if (!clerkId) {
      return NextResponse.json(
        { success: false, error: "You must be logged in" },
        { status: 401 },
      );
    }

    const user = await findUserByClerkId(clerkId);

    if (!user) {
      return NextResponse.json(
        { success: false, error: "User not found" },
        { status: 404 },
      );
    }

    const resolvedParams = await params;
    let automationId = resolvedParams.id;

    // Validates and sanitizes automation ID
    automationId = sanitizeQueryParam(automationId, 24);
    if (!isValidObjectId(automationId)) {
      return NextResponse.json(
        { success: false, error: "Invalid automation ID format" },
        { status: 400 },
      );
    }

    // Calls service layer
    const automation = await getAutomation(user.id, automationId);

    return NextResponse.json(
      {
        success: true,
        automation,
      },
      { status: 200 },
    );
  } catch (error) {
    // Uses generic error message to prevent information disclosure
    // Returns 404 for both "not found" and "unauthorized" cases
    const statusCode =
      error instanceof Error &&
      error.message === "Automation not found or access denied"
        ? 404
        : 500;
    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Failed to retrieve automation. Please try again.",
      },
      { status: statusCode },
    );
  }
}

/**
 * PATCH - Updates an automation
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { userId: clerkId } = await auth();

    if (!clerkId) {
      return NextResponse.json(
        { success: false, error: "You must be logged in" },
        { status: 401 },
      );
    }

    const user = await findUserByClerkId(clerkId);

    if (!user) {
      return NextResponse.json(
        { success: false, error: "User not found" },
        { status: 404 },
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
        { status: 400 },
      );
    }

    // Calls service layer
    const automation = await updateAutomation(
      user.id,
      automationId,
      validation.data,
    );

    return NextResponse.json(
      {
        success: true,
        automation,
      },
      { status: 200 },
    );
  } catch (error) {
    // Uses generic error message to prevent information disclosure
    // Returns 404 for both "not found" and "unauthorized" cases
    const statusCode =
      error instanceof Error &&
      error.message === "Automation not found or access denied"
        ? 404
        : 500;
    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Failed to update automation. Please try again.",
      },
      { status: statusCode },
    );
  }
}

/**
 * DELETE - Deletes an automation
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { userId: clerkId } = await auth();

    if (!clerkId) {
      return NextResponse.json(
        { success: false, error: "You must be logged in" },
        { status: 401 },
      );
    }

    const user = await findUserByClerkId(clerkId);

    if (!user) {
      return NextResponse.json(
        { success: false, error: "User not found" },
        { status: 404 },
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
      { status: 200 },
    );
  } catch (error) {
    // Uses generic error message to prevent information disclosure
    // Returns 404 for both "not found" and "unauthorized" cases
    const statusCode =
      error instanceof Error &&
      error.message === "Automation not found or access denied"
        ? 404
        : 500;
    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Failed to delete automation. Please try again.",
      },
      { status: statusCode },
    );
  }
}
