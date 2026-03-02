import { NextResponse } from "next/server";
import { prisma } from "@/server/db";

export async function GET() {
  try {
    if (process.env.NODE_ENV === "production") {
      // Optional: protect this in production or disable it entirely
      // return NextResponse.json({ error: "Not allowed in production" }, { status: 403 });
    }

    // Delete in order to respect potential constraints (though Cascades help)
    // Delete WebhookEvents (no relations)
    await prisma.webhookEvent.deleteMany({});

    // Deleting Users will cascade delete InstaAccounts and Automations (and their Executions)
    // But strictly speaking, in MongoDB with Prisma, relations are emulated.
    // Prisma handles the cascade deletions for us if configured in schema.
    await prisma.user.deleteMany({});

    // Clear Redis cache to prevent out-of-sync state
    const { getRedisClient } = await import("@/server/redis");
    const redis = getRedisClient();
    if (redis) {
      await redis.flushdb();
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
