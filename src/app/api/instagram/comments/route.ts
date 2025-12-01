/**
 * Instagram Comments Endpoint
 * Retrieves comments for a specific Instagram post
 */

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { CommentsQuerySchema } from "@/server/schemas/instagram.schema";
import { getPostComments } from "@/server/services/instagram.service";

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

    // Extracts and validates postId from query parameters
    const { searchParams } = new URL(request.url);
    const validationResult = CommentsQuerySchema.safeParse({
      postId: searchParams.get("postId"),
    });

    if (!validationResult.success) {
      const errorMessage =
        validationResult.error.issues[0]?.message || "Post ID is required";
      return NextResponse.json(
        { success: false, error: errorMessage },
        { status: 400 }
      );
    }

    const { postId } = validationResult.data;

    // Calls service layer
    const result = await getPostComments(clerkId, postId);

    return NextResponse.json(
      {
        success: true,
        ...result,
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "An unexpected error occurred while processing the request",
      },
      { status: 500 }
    );
  }
}
