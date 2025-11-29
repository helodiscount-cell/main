import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { logger } from "@/lib/logger-backend";
import {
  GRAPH_API,
  GRAPH_API_FIELDS,
  buildGraphApiUrl,
  addQueryParams,
  getAccessToken,
  ERROR_MESSAGES,
} from "@/config/instagram.config";

// Defines zod schema for validating postId query parameter
const PostIdQuerySchema = z.object({
  postId: z.string().min(1, ERROR_MESSAGES.VALIDATION.INVALID_POST_ID),
});

export async function GET(request: NextRequest) {
  try {
    // Extracts postId from query parameters
    const { searchParams } = new URL(request.url);
    const postId = searchParams.get("postId");

    // Validates postId using zod schema
    const validationResult = PostIdQuerySchema.safeParse({ postId });

    if (!validationResult.success) {
      // Returns error if validation fails
      const errorMessage =
        validationResult.error.issues[0]?.message ||
        ERROR_MESSAGES.VALIDATION.INVALID_POST_ID;
      logger.apiRoute("GET", "/api/instagram/comments", {
        error: errorMessage,
        receivedPostId: postId,
      });
      return NextResponse.json(
        { success: false, error: errorMessage },
        { status: 400 }
      );
    }

    const validatedData = validationResult.data;

    // Gets access token from environment
    const accessToken = getAccessToken();
    if (!accessToken) {
      logger.apiRoute("GET", "/api/instagram/comments", {
        error: "Missing access token",
      });
      return NextResponse.json(
        {
          success: false,
          error: "Instagram integration is not configured properly",
        },
        { status: 500 }
      );
    }

    // Builds Graph API URL with proper configuration
    const endpoint = GRAPH_API.ENDPOINTS.POST_COMMENTS(validatedData.postId);
    const graphApiUrl = buildGraphApiUrl(endpoint);
    addQueryParams(graphApiUrl, {
      fields: GRAPH_API_FIELDS.COMMENTS.join(","),
      access_token: accessToken,
    });

    logger.apiRoute("GET", "/api/instagram/comments", {
      postId: validatedData.postId,
      requestUrl: graphApiUrl.toString().replace(accessToken, "***"),
    });

    // Fetches comments from Facebook Graph API
    const response = await fetch(graphApiUrl.toString(), {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    // Parses response
    const data = await response.json();

    // Checks for Graph API errors
    if (data.error) {
      logger.apiRoute("GET", "/api/instagram/comments", {
        error: "Graph API error",
        details: data.error,
      });
      return NextResponse.json(
        {
          success: false,
          error:
            data.error.message || "Failed to fetch comments from Instagram",
          details: data.error.type || data.error.code,
        },
        { status: response.status || 400 }
      );
    }

    // Logs successful response data
    logger.apiRoute("GET", "/api/instagram/comments", {
      postId: validatedData.postId,
      commentsCount: data.data?.length || 0,
      receivedData: data,
    });

    // Returns success response with the postId and comments
    return NextResponse.json(
      {
        success: true,
        postId: validatedData.postId,
        comments: data.data || [],
        paging: data.paging,
      },
      { status: 200 }
    );
  } catch (error) {
    // Logs unexpected errors
    console.error("Error in /api/instagram/comments:", error);
    logger.apiRoute("GET", "/api/instagram/comments", {
      error: "Internal server error",
      details: error instanceof Error ? error.message : "Unknown error",
    });
    return NextResponse.json(
      {
        success: false,
        error: "An unexpected error occurred while processing the request",
      },
      { status: 500 }
    );
  }
}
