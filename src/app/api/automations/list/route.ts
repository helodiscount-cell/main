/**
 * List Automations Endpoint
 * Retrieves all automations for the current user
 */

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/db";
import { logger } from "@/lib/logger-backend";

export async function GET(request: NextRequest) {
  try {
    // Gets current authenticated user
    const { userId: clerkId } = await auth();

    if (!clerkId) {
      logger.apiRoute("GET", "/api/automations/list", {
        error: "Unauthorized",
      });
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

    // Gets query parameters for filtering
    const searchParams = request.nextUrl.searchParams;
    const status = searchParams.get("status");
    const postId = searchParams.get("postId");

    // Builds filter conditions
    const where: any = {
      userId: user.id,
    };

    if (status && ["ACTIVE", "PAUSED", "DELETED"].includes(status)) {
      where.status = status;
    }

    if (postId) {
      where.postId = postId;
    }

    // Fetches automations
    const automations = await prisma.automation.findMany({
      where,
      include: {
        _count: {
          select: {
            executions: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    logger.apiRoute("GET", "/api/automations/list", {
      count: automations.length,
      filters: { status, postId },
    });

    return NextResponse.json(
      {
        success: true,
        automations: automations.map((automation) => ({
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
          executionsCount: automation._count.executions,
        })),
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error listing automations:", error);
    logger.apiRoute("GET", "/api/automations/list", {
      error: "Internal error",
      details: error instanceof Error ? error.message : "Unknown error",
    });

    return NextResponse.json(
      {
        success: false,
        error: "Failed to retrieve automations. Please try again.",
      },
      { status: 500 }
    );
  }
}

