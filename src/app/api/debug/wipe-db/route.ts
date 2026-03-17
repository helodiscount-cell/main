import { NextResponse } from "next/server";
import { prisma } from "@/server/db";

export async function GET() {
  try {
    if (process.env.NODE_ENV === "production") {
      return NextResponse.json(
        { error: "Not allowed in production" },
        { status: 403 },
      );
    }

    // --- 1. Wipe MongoDB (delete in dependency order to avoid FK issues) ---
    await prisma.formSubmission.deleteMany({});
    await prisma.form.deleteMany({});
    await prisma.webhookEvent.deleteMany({});
    await prisma.automationExecution.deleteMany({});
    await prisma.automation.deleteMany({});
    await prisma.instaFollowerSnapshot.deleteMany({});
    await prisma.instaAccount.deleteMany({});
    await prisma.user.deleteMany({});

    // --- 2. Wipe Clerk publicMetadata for all users ---
    // Without this, users still have isConnected: true and bypass /auth/connect
    try {
      const { createClerkClient } = await import("@clerk/nextjs/server");
      const clerkClient = createClerkClient({
        secretKey: process.env.CLERK_SECRET_KEY,
      });
      const { data: clerkUsers } = await clerkClient.users.getUserList({
        limit: 100,
      });
      await Promise.all(
        clerkUsers.map((u) =>
          clerkClient.users.updateUserMetadata(u.id, {
            publicMetadata: {
              isConnected: false,
              instaUsername: null! as string,
              instaProfilePictureUrl: null! as string,
              instaUserId: null! as string,
              instaAccountType: null! as string,
              lastSync: null! as string,
            },
          }),
        ),
      );
    } catch (clerkError) {
      console.warn("Clerk metadata wipe failed:", clerkError);
    }

    // --- 3. Wipe Upstash Redis ---
    const { getRedisClient, getQueueRedisClientR } =
      await import("@/server/redis");

    const upstashRedis = getRedisClient();
    if (upstashRedis) {
      await upstashRedis.flushdb();
    }

    // --- 4. Wipe Queue Redis (BullMQ) ---
    // Timeout guard: maxRetriesPerRequest: null (BullMQ requirement) means
    // commands hang forever if the connection stalls.
    const queueRedis = getQueueRedisClientR();
    if (queueRedis) {
      await Promise.race([
        queueRedis.flushdb(),
        new Promise((_, reject) =>
          setTimeout(
            () => reject(new Error("Queue Redis flush timed out")),
            5000,
          ),
        ),
      ]).catch((err) => {
        console.warn("Queue Redis flush skipped:", err.message);
      });
    }

    return NextResponse.json({
      success: true,
      message:
        "All data wiped: MongoDB, Clerk metadata, Upstash Redis, Queue Redis",
    });
  } catch (error) {
    console.error("Error wiping database:", error);
    return NextResponse.json(
      { error: "Failed to wipe database", detail: String(error) },
      { status: 500 },
    );
  }
}
