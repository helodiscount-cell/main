import { auth, clerkClient } from "@clerk/nextjs/server";
import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST() {
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

  try {
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

    return NextResponse.json({ id: user.id }, { status: 200 });
  } catch (e) {
    return new NextResponse("DB error", { status: 500 });
  }
}
