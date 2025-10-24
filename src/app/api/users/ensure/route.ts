import { auth, clerkClient } from "@clerk/nextjs/server";
import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";
import { logger } from "@/lib/logger-backend";

export async function POST() {
  try {
    const { userId } = await auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Fetch user info from Clerk using server SDK
    const clerkUser = await (await clerkClient()).users.getUser(userId);

    const email = clerkUser.emailAddresses?.[0]?.emailAddress ?? "";
    const fullName = `${clerkUser.firstName ?? ""} ${
      clerkUser.lastName ?? ""
    }`.trim();

    // Perform database operation with logging
    const user = await prisma.user.upsert({
      where: { clerkId: clerkUser.id },
      update: {
        fullName,
        email,
        imageUrl: clerkUser.imageUrl ?? null,
      },
      create: {
        clerkId: clerkUser.id,
        fullName,
        email,
        imageUrl: clerkUser.imageUrl ?? null,
      },
    });

    // Log database changes
    logger.dbChange("UPSERT", "User", {
      clerkId: clerkUser.id,
      email,
      fullName,
      imageUrl: clerkUser.imageUrl,
    });

    return NextResponse.json({ id: user.id }, { status: 200 });
  } catch (error) {
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
