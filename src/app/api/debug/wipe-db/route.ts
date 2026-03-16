import { NextResponse } from "next/server";
import { prisma } from "@/server/db";

export async function GET() {
  try {
    if (process.env.NODE_ENV === "production") {
      // Optional: protect this in production or disable it entirely
      return NextResponse.json(
        { error: "Not allowed in production" },
        { status: 403 },
      );
    }

    // Delete all collections explicitly
    // deleteMany does NOT trigger cascades in Prisma/MongoDB
    await prisma.webhookEvent.deleteMany({});
    await prisma.automationExecution.deleteMany({});
    await prisma.automation.deleteMany({});
    await prisma.instaAccount.deleteMany({});
    await prisma.user.deleteMany({});

    // Clear Redis caches
    const { getRedisClient, getQueueRedisClientR } =
      await import("@/server/redis");

    // Clear Upstash Redis
    const upstashRedis = getRedisClient();
    if (upstashRedis) {
      await upstashRedis.flushdb();
    }

    // Clear Queue Redis (BullMQ)
    const queueRedis = getQueueRedisClientR();
    if (queueRedis) {
      await queueRedis.flushdb();
    }

    return NextResponse.json({
      success: true,
      message: "Database and Redis cache wiped successfully",
    });
  } catch (error) {
    console.error("Error wiping database:", error);
    return NextResponse.json(
      { error: "Failed to wipe database" },
      { status: 500 },
    );
  }
}
