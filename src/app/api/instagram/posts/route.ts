import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/db";
import {
  BeErrorResponse,
  InstagramPost,
  InstagramPostsSuccessResponse,
} from "@/types";
import { getValidAccessToken } from "@/lib/instagram/token-manager";

export async function GET() {
  try {
    // Gets current authenticated user
    const { userId: clerkId } = await auth();

    if (!clerkId) {
      // Returns error if authentication fails
      const res: BeErrorResponse = {
        success: false,
        error:
          "You need to be signed in to view your Instagram posts. Please login and try again.",
      };
      return NextResponse.json(res, { status: 401 });
    }

    // Gets the user record with possible Instagram account
    const user = await prisma.user.findUnique({
      where: { clerkId },
      include: { instaAccount: true },
    });

    if (!user || !user.instaAccount) {
      // Returns error if Instagram is not connected
      const res: BeErrorResponse = {
        success: false,
        error:
          "Instagram is not connected for your account. Please connect Instagram and try again.",
      };
      return NextResponse.json(res, { status: 400 });
    }

    const { instagramUserId, username } = user.instaAccount;

    // Gets valid access token (refreshes if needed)
    let accessToken: string;
    try {
      accessToken = await getValidAccessToken(user.instaAccount.id);
    } catch (error) {
      // Returns error if token refresh fails
      const res: BeErrorResponse = {
        success: false,
        error:
          "Failed to refresh Instagram access token. Please reconnect your account.",
      };
      return NextResponse.json(res, { status: 401 });
    }

    // Prepares fields to fetch from Instagram Graph API
    const fields = [
      "id",
      "caption",
      "media_type",
      "media_url",
      "permalink",
      "timestamp",
      "like_count",
      "comments_count",
    ].join(",");

    // Uses Facebook Graph API for Instagram Business accounts
    const postsUrl = `https://graph.facebook.com/v24.0/${instagramUserId}/media?fields=${fields}&limit=25&access_token=${accessToken}`;

    let response: Response;
    try {
      // Fetches posts from Instagram Graph API
      response = await fetch(postsUrl);
    } catch (networkErr) {
      // Returns error if network error occurs
      const res: BeErrorResponse = {
        success: false,
        error:
          "Could not connect to Instagram. Please check your network connection and try again.",
      };
      return NextResponse.json(res, { status: 502 });
    }

    // Handles possible invalid JSON or non-200 status
    if (!response.ok) {
      // Reads error body if provided
      let instagramError: any;
      try {
        instagramError = await response.json();
      } catch {
        instagramError = {};
      }

      // Logs the full error for debugging
      console.error("Instagram API error (posts):", {
        status: response.status,
        statusText: response.statusText,
        error: instagramError,
      });

      const mainError =
        instagramError.error?.message ||
        "Instagram returned an unexpected error while fetching your posts.";
      const res: BeErrorResponse = {
        success: false,
        error: mainError,
      };
      return NextResponse.json(res, { status: 400 });
    }

    let data: any;
    try {
      data = await response.json();
    } catch {
      // Handles non-JSON response
      const res: BeErrorResponse = {
        success: false,
        error:
          "Unexpected response from Instagram. Please try again later or contact support.",
      };
      return NextResponse.json(res, { status: 502 });
    }

    // Handles Instagram API error object
    if (data.error) {
      // Logs Instagram error for diagnostics
      console.error("Instagram API error:", data.error);
      // Maps some known codes to user-readable messages
      let readableError =
        "Instagram failed to return your posts. Please try reconnecting your account.";
      if (
        typeof data.error.message === "string" &&
        data.error.message.length > 0
      ) {
        readableError = data.error.message;
      }
      const res: BeErrorResponse = {
        success: false,
        error: readableError,
        details: `Instagram error: ${
          data.error.type || data.error.code || ""
        }`.trim(),
      };
      return NextResponse.json(res, { status: 400 });
    }

    // Checks for missing data
    if (!Array.isArray(data.data)) {
      const res: BeErrorResponse = {
        success: false,
        error:
          "Instagram returned data in an unexpected format. Please refresh or try again later.",
      };
      return NextResponse.json(res, { status: 502 });
    }

    // Returns posts with success
    const res: InstagramPostsSuccessResponse = {
      success: true,
      posts: data.data as InstagramPost[],
      username: username,
      paging: data.paging,
    };
    return NextResponse.json(res, { status: 200 });
  } catch (error) {
    // Logs unknown errors and sends user-friendly error
    console.error("Error fetching posts:", error);
    const res: BeErrorResponse = {
      success: false,
      error:
        "An unexpected server error occurred while fetching your Instagram posts. Please try again.",
    };
    return NextResponse.json(res, { status: 500 });
  }
}
