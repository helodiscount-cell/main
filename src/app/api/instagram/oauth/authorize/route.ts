// url from frontend: http://localhost:3000/api/instagram/oauth/authorize?returnUrl=/dashboard

/**
 * Instagram OAuth Authorization Endpoint
 * Initiates OAuth flow by redirecting to Instagram
 */

import { NextRequest, NextResponse } from "next/server";
import { initiateOAuth } from "@/server/services/instagram/oauth.service";
import { runWithErrorHandling } from "@/lib/middleware/errors";

export async function GET(request: NextRequest) {
  console.log("📢 API route hit /instagram/oauth/authorize");

  return runWithErrorHandling(async (clerkId: string) => {
    const returnUrl =
      request.nextUrl.searchParams.get("returnUrl") || "/dashboard";

    const authUrl = await initiateOAuth({ clerkId, returnUrl });

    // Redirects to Instagram OAuth
    return NextResponse.redirect(authUrl);
  });
}
