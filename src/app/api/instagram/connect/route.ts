import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { z } from "zod";
import {
  BeErrorResponse,
  InstagramConnectRequestBody,
  InstagramConnectSuccessResponse,
} from "@/types";
import { InstagramConnectRequestSchema } from "@/types/zod";

// Defines the response structure for an error

type InstagramConnectResponse =
  | InstagramConnectSuccessResponse
  | BeErrorResponse;

export async function POST(
  request: Request
): Promise<NextResponse<InstagramConnectResponse>> {
  try {
    const { userId: clerkId } = await auth();

    // Checks authentication
    if (!clerkId) {
      // Returns error if user is not logged in
      const cantConnect: BeErrorResponse = {
        success: false,
        error: "You must be logged in to connect Instagram.",
      };
      return NextResponse.json(cantConnect, { status: 401 });
    }

    let body: InstagramConnectRequestBody = {};
    try {
      // Tries to parse and validate request body
      const json = await request.json();
      body = InstagramConnectRequestSchema.parse(json);
    } catch (err) {
      // Handles invalid JSON or validation error
      const cantConnect: BeErrorResponse = {
        success: false,
        error: "Invalid request body. Please retry.",
        // Handles Zod validation errors and extracts messages if present
        details:
          err instanceof z.ZodError
            ? (err as z.ZodError).issues.map((e) => e.message).join("; ")
            : undefined,
      };
      return NextResponse.json(cantConnect, { status: 400 });
    }

    // Gets the Instagram access token from environment
    const accessToken = process.env.INSTAGRAM_ACCESS_TOKEN;
    if (!accessToken) {
      const cantConnect: BeErrorResponse = {
        success: false,
        error: "Instagram connection is not configured. Try again later.",
      };
      return NextResponse.json(cantConnect, { status: 500 });
    }

    // Fetches Instagram user info from API
    const userInfoUrl = `https://graph.instagram.com/me?fields=id,username,account_type&access_token=${accessToken}`;
    let instagramRes: Response;
    try {
      instagramRes = await fetch(userInfoUrl);
    } catch (fetchErr: any) {
      const cantConnect: BeErrorResponse = {
        success: false,
        error: "Failed to connect to Instagram API.",
        details:
          process.env.NODE_ENV === "development"
            ? fetchErr?.message ?? "Unknown error"
            : undefined,
      };
      return NextResponse.json(cantConnect, { status: 502 });
    }

    // Checks Instagram API response HTTP status
    if (!instagramRes.ok) {
      const cantConnect: BeErrorResponse = {
        success: false,
        error: "Failed to connect to Instagram. Please try again.",
        details: `Instagram API responded with status ${instagramRes.status}`,
      };
      return NextResponse.json(cantConnect, {
        status: 500,
      });
    }

    let instagramData: any;
    try {
      instagramData = await instagramRes.json();
    } catch {
      // Handles unexpected API data
      const cantConnect: BeErrorResponse = {
        success: false,
        error: "Failed to parse Instagram API response.",
      };
      return NextResponse.json(cantConnect, { status: 500 });
    }

    // Checks if Instagram API returned an error object
    if (instagramData.error) {
      console.error("Instagram API error:", instagramData.error);
      // Maps Instagram error to clear client error
      const cantConnect: BeErrorResponse = {
        success: false,
        error:
          instagramData.error?.type === "OAuthException"
            ? "Instagram authentication failed. Please check your token or reconnect your account."
            : "Unable to fetch Instagram data at this time.",
        details: instagramData.error?.message || undefined,
      };
      return NextResponse.json(cantConnect, { status: 400 });
    }

    if (!instagramData.id || typeof instagramData.username !== "string") {
      // Handles missing or invalid user data from Instagram
      const cantConnect: BeErrorResponse = {
        success: false,
        error: "Instagram account data is incomplete or missing.",
      };
      return NextResponse.json(cantConnect, { status: 502 });
    }

    // Finds or creates user in the database by Clerk ID
    let user = await prisma.user.findUnique({ where: { clerkId } });
    if (!user) {
      user = await prisma.user.create({
        data: {
          clerkId,
          fullName: body.fullName ?? "",
          email: body.email ?? "",
          imageUrl: body.imageUrl ?? null,
          createdAt: new Date(),
        },
      });
    }

    // Looks up existing Instagram account for this user and handles upserts
    let instaAccount = await prisma.instaAccount.findUnique({
      where: { userId: user.id },
    });

    // If Instagram account exists, updates username and connection info
    if (instaAccount) {
      instaAccount = await prisma.instaAccount.update({
        where: { userId: user.id },
        data: {
          instagramUserId: String(instagramData.id),
          username: instagramData.username,
          connectedAt: new Date(),
        },
      });
    } else {
      // If no Instagram account exists, creates a new record
      instaAccount = await prisma.instaAccount.create({
        data: {
          userId: user.id,
          instagramUserId: String(instagramData.id),
          username: instagramData.username,
          connectedAt: new Date(),
        },
      });
    }

    // Returns success with Instagram details
    const success: InstagramConnectSuccessResponse = {
      success: true,
      data: {
        username: instaAccount.username,
        connectedAt: instaAccount.connectedAt,
      },
    };
    return NextResponse.json(success, { status: 200 });
  } catch (err: any) {
    // Logs error and returns friendly + informative message (development-safe)
    console.error("Instagram connect error:", err);
    const errorResponse: BeErrorResponse = {
      success: false,
      error: "Something went wrong. Please try again later.",
      details:
        process.env.NODE_ENV === "development"
          ? err?.message ?? "Unknown error"
          : undefined,
    };
    return NextResponse.json(errorResponse, { status: 500 });
  }
}
