import { runWithErrorHandling } from "@/server/middleware/errors";
import { getInstaUserProfile } from "@/server/services/instagram/instagram.service";
import { NextResponse } from "next/server";

export async function GET() {
  return runWithErrorHandling(async (clerkId) => {
    return await getInstaUserProfile(clerkId);
  });
}
