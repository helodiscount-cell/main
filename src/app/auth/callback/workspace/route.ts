/**
 * Workspace Session Callback
 * Bridges the gap where Server Components can't set cookies during render.
 * Receives an account ID, sets the active workspace cookie, and redirects
 */

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/server/db";
import { WORKSPACE_CONFIG } from "@/configs/workspace.config";
import { DASHBOARD_ROUTE } from "@/configs/routes.config";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const accountId = searchParams.get("id");
  const next = searchParams.get("next") || DASHBOARD_ROUTE;
  const { userId } = await auth();

  // Helper to construct absolute URLs that preserve the current host (ngrok support)
  const constructUrl = (path: string) => {
    // prioritize X-Forwarded-Host if behind ngrok/proxy
    const host =
      request.headers.get("x-forwarded-host") ||
      request.headers.get("host") ||
      "localhost:3000";
    const protocol = request.headers.get("x-forwarded-proto") || "http";
    return new URL(path, `${protocol}://${host}`);
  };

  if (!userId || !accountId) {
    return NextResponse.redirect(constructUrl("/auth/signin"));
  }

  // Double-verify ownership before setting the cookie
  const account = await prisma.instaAccount.findFirst({
    where: {
      id: accountId,
      user: { clerkId: userId },
      isActive: true,
    },
    select: { id: true },
  });

  if (!account) {
    return NextResponse.redirect(constructUrl("/auth/connect"));
  }

  const response = NextResponse.redirect(constructUrl(next));

  response.cookies.set(WORKSPACE_CONFIG.ACTIVE_WORKSPACE_COOKIE, account.id, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: WORKSPACE_CONFIG.COOKIE_MAX_AGE_SECONDS,
    path: "/",
  });

  return response;
}
