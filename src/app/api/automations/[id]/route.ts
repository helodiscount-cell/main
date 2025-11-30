/**
 * Automation Management Endpoint
 * Gets, updates, or deletes a specific automation
 */

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/db";
import { z } from "zod";
import { logger } from "@/lib/logger-backend";

// Defines zod schema for automation updates
const UpdateAutomationSchema = z.object({
  triggers: z.array(z.string().min(1)).optional(),
  matchType: z.enum(["CONTAINS", "EXACT", "REGEX"]).optional(),
  actionType: z.enum(["DM", "COMMENT_REPLY"]).optional(),
  replyMessage: z.string().min(1).optional(),
  status: z.enum(["ACTIVE", "PAUSED", "DELETED"]).optional(),
});

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

    // Fetches the automation
    const automation = await prisma.automation.findUnique({
      where: { id: automationId },
      include: {
        executions: {
          orderBy: {
            executedAt: "desc",
          },
          take: 10,
        },
        _count: {
          select: {
            executions: true,
          },
        },
      },
    });

    if (!automation) {
      return NextResponse.json(
        { success: false, error: "Automation not found" },
        { status: 404 }
      );
    }

    // Verifies ownership
    if (automation.userId !== user.id) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 403 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        automation: {
          id: automation.id,
          postId: automation.postId,
          postCaption: automation.postCaption,
          triggers: automation.triggers,
          matchType: automation.matchType,
          actionType: automation.actionType,
          replyMessage: automation.replyMessage,
          status: automation.status,
          timesTriggered: automation.timesTriggered,
          lastTriggeredAt: automation.lastTriggeredAt,
          createdAt: automation.createdAt,
          updatedAt: automation.updatedAt,
          recentExecutions: automation.executions,
          totalExecutions: automation._count.executions,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error getting automation:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to retrieve automation. Please try again.",
      },
      { status: 500 }
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

    // Verifies automation exists and user owns it
    const existingAutomation = await prisma.automation.findUnique({
      where: { id: automationId },
    });

    if (!existingAutomation) {
      return NextResponse.json(
        { success: false, error: "Automation not found" },
        { status: 404 }
      );
    }

    if (existingAutomation.userId !== user.id) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 403 }
      );
    }

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

    // Updates the automation
    const updatedAutomation = await prisma.automation.update({
      where: { id: automationId },
      data: validation.data,
    });

    logger.apiRoute("PATCH", "/api/automations/[id]", {
      automationId,
      updates: Object.keys(validation.data),
    });

    return NextResponse.json(
      {
        success: true,
        automation: {
          id: updatedAutomation.id,
          postId: updatedAutomation.postId,
          triggers: updatedAutomation.triggers,
          matchType: updatedAutomation.matchType,
          actionType: updatedAutomation.actionType,
          replyMessage: updatedAutomation.replyMessage,
          status: updatedAutomation.status,
          updatedAt: updatedAutomation.updatedAt,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating automation:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to update automation. Please try again.",
      },
      { status: 500 }
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

    // Verifies automation exists and user owns it
    const existingAutomation = await prisma.automation.findUnique({
      where: { id: automationId },
    });

    if (!existingAutomation) {
      return NextResponse.json(
        { success: false, error: "Automation not found" },
        { status: 404 }
      );
    }

    if (existingAutomation.userId !== user.id) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 403 }
      );
    }

    // Soft delete: mark as DELETED instead of actually deleting
    await prisma.automation.update({
      where: { id: automationId },
      data: { status: "DELETED" },
    });

    logger.apiRoute("DELETE", "/api/automations/[id]", {
      automationId,
    });

    return NextResponse.json(
      {
        success: true,
        message: "Automation deleted successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting automation:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to delete automation. Please try again.",
      },
      { status: 500 }
    );
  }
}

