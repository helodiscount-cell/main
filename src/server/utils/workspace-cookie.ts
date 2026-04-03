import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { WORKSPACE_CONFIG } from "@/configs/workspace.config";

// Reads the active workspace ID from the request cookie store
export async function getActiveWorkspaceId(): Promise<string | null> {
  const cookieStore = await cookies();
  return (
    cookieStore.get(WORKSPACE_CONFIG.ACTIVE_WORKSPACE_COOKIE)?.value ?? null
  );
}

// Sets the active workspace cookie on a NextResponse
export function setActiveWorkspaceCookie(
  response: NextResponse,
  instaAccountId: string,
): NextResponse {
  response.cookies.set(
    WORKSPACE_CONFIG.ACTIVE_WORKSPACE_COOKIE,
    instaAccountId,
    {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: WORKSPACE_CONFIG.COOKIE_MAX_AGE_SECONDS,
      path: "/",
    },
  );
  return response;
}

// Clears the active workspace cookie on a NextResponse
export function clearActiveWorkspaceCookie(
  response: NextResponse,
): NextResponse {
  response.cookies.delete(WORKSPACE_CONFIG.ACTIVE_WORKSPACE_COOKIE);
  return response;
}
