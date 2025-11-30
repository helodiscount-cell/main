/**
 * Create Automation Endpoint
 * Creates a new automation rule for Instagram posts
 */

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/db";
import { z } from "zod";
import { logger } from "@/lib/logger-backend";

// Defines zod schema for automation creation
const CreateAutomationSchema = z.object({
  postId: z.string().min(1, "Post ID is required"),
  postCaption: z.string().optional(),
  triggers: z
    .array(z.string().min(1))
    .min(1, "At least one trigger is required"),
  matchType: z.enum(["CONTAINS", "EXACT", "REGEX"]).default("CONTAINS"),
  actionType: z.enum(["DM", "COMMENT_REPLY"]),
  replyMessage: z.string().min(1, "Reply message is required"),
  useVariables: z.boolean().default(true),
});

export async function POST(request: NextRequest) {
  try {
    // Gets current authenticated user
    const { userId: clerkId } = await auth();

    if (!clerkId) {
      logger.apiRoute("POST", "/api/automations/create", {
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
      include: { instaAccount: true },
    });

    if (!user) {
      return NextResponse.json(
        { success: false, error: "User not found" },
        { status: 404 }
      );
    }

    if (!user.instaAccount) {
      return NextResponse.json(
        {
          success: false,
          error: "Please connect your Instagram account first",
        },
        { status: 400 }
      );
    }

    // Parses and validates request body
    const body = await request.json();
    const validation = CreateAutomationSchema.safeParse(body);

    if (!validation.success) {
      const errorMessage =
        validation.error.issues[0]?.message || "Invalid input";
      logger.apiRoute("POST", "/api/automations/create", {
        error: "Validation failed",
        details: errorMessage,
      });
      return NextResponse.json(
        { success: false, error: errorMessage },
        { status: 400 }
      );
    }

    const data = validation.data;

    // Checks if automation already exists for this post with same triggers
    const existingAutomation = await prisma.automation.findFirst({
      where: {
        userId: user.id,
        postId: data.postId,
        status: "ACTIVE",
      },
    });

    if (existingAutomation) {
      logger.apiRoute("POST", "/api/automations/create", {
        warning: "Automation already exists",
        automationId: existingAutomation.id,
      });
      // Allow multiple automations per post but log it
    }

    // Creates the automation
    const automation = await prisma.automation.create({
      data: {
        userId: user.id,
        postId: data.postId,
        postCaption: data.postCaption,
        triggers: data.triggers,
        matchType: data.matchType,
        actionType: data.actionType,
        replyMessage: data.replyMessage,
        useVariables: data.useVariables,
        status: "ACTIVE",
      },
    });

    logger.apiRoute("POST", "/api/automations/create", {
      automationId: automation.id,
      postId: data.postId,
      actionType: data.actionType,
      triggersCount: data.triggers.length,
    });

    return NextResponse.json(
      {
        success: true,
        automation: {
          id: automation.id,
          postId: automation.postId,
          actionType: automation.actionType,
          triggers: automation.triggers,
          replyMessage: automation.replyMessage,
          createdAt: automation.createdAt,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating automation:", error);
    logger.apiRoute("POST", "/api/automations/create", {
      error: "Internal error",
      details: error instanceof Error ? error.message : "Unknown error",
    });

    return NextResponse.json(
      {
        success: false,
        error: "Failed to create automation. Please try again.",
      },
      { status: 500 }
    );
  }
}

