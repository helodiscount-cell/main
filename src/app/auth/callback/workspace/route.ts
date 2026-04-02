/**
 * Workspace Session Callback
 * Bridges the gap where Server Components can't set cookies during render.
 * Receives an account ID, sets the active workspace cookie, and redirects
 */

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/server/db";
import { setActiveWorkspaceCookie } from "@/server/utils/workspace-cookie";
import { DASHBOARD_ROUTE } from "@/configs/routes.config";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const accountId = searchParams.get("id");
  let next = searchParams.get("next") || DASHBOARD_ROUTE;

  // Security: Ensure 'next' is a valid internal relative path to prevent open-redirects
  if (!next.startsWith("/") || next.startsWith("//") || next.includes("://")) {
    next = DASHBOARD_ROUTE;
  }

  const { userId } = await auth();

  // Helper to construct absolute URLs from a trusted origin (prevents Host Header Injection)
  const constructUrl = (path: string) => {
    const origin = process.env.APP_ORIGIN || "http://localhost:3000";
    const safePath = `/${path.replace(/^\//, "")}`;
    return new URL(safePath, origin);
  };

  if (!userId || !accountId) {
    return NextResponse.redirect(constructUrl("/auth/signin"));
  }

  // Double-verify ownership before setting the cookie (Defense in Depth)
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

  return setActiveWorkspaceCookie(response, account.id);
}
