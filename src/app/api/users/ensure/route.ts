/**
 * Ensure User Endpoint
 * Creates or updates user in database from Clerk data
 */

import { auth, clerkClient } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { ensureUser } from "@/server/services/user.service";

export async function POST() {
  try {
    const { userId } = await auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Fetches user info from Clerk using server SDK
    const clerkUser = await (await clerkClient()).users.getUser(userId);

    const email = clerkUser.emailAddresses?.[0]?.emailAddress ?? "";
    const fullName = `${clerkUser.firstName ?? ""} ${
      clerkUser.lastName ?? ""
    }`.trim();

    // Calls service layer
    const user = await ensureUser(clerkUser.id, {
      email,
      fullName,
      imageUrl: clerkUser.imageUrl ?? null,
    });

    return NextResponse.json({ id: user.id }, { status: 200 });
  } catch (error) {
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
