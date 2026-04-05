import { Worker, Job } from "bullmq";
import { getQueueRedisClientR } from "@/server/redis/client";
import { KEYS } from "@/server/redis/keys";
import { prisma } from "@/server/db";
import { sendEmail } from "@/lib/email";
import { logger } from "@/server/utils/pino";
import { EMAIL_CONFIG } from "@/lib/email/config";

const redisConnection = getQueueRedisClientR();

/**
 * Initializes and starts the BullMQ worker for notifications.
 * Processes alerts like quota-full, subscription events, etc.
 */
export function initNotificationsWorker() {
  if (!redisConnection) {
    logger.warn("Notification worker skipped: No Queue Redis connection");
    return;
  }

  const worker = new Worker(
    KEYS.NOTIFICATIONS_QUEUE,
    async (job: Job) => {
      const { type, userId, usedAt } = job.data;

      try {
        if (type === "QUOTA_FULL") {
          await handleQuotaFullAlert(userId, usedAt);
        }
      } catch (err: any) {
        logger.error(
          { jobId: job.id, type, userId, error: err.message },
          "Notification job handler failed",
        );
        throw err; // Allow BullMQ retry
      }
    },
    {
      connection: redisConnection,
      concurrency: 5,
    },
  );

  worker.on("failed", (job, err) => {
    logger.error(
      { jobId: job?.id, error: err.message },
      "Notification job failed ultimately",
    );
  });

  logger.info("Notification worker initialized and listening...");
  return worker;
}

/**
 * Business logic for quota alerts.
 * Implements grace-period and idempotency check against the database.
 */
async function handleQuotaFullAlert(userId: string, usedAt: number) {
  const user = await prisma.user.findUnique({
    where: { clerkId: userId },
    include: { creditLedger: true },
  });

  if (!user || !user.creditLedger) {
    logger.warn({ userId }, "Quota alert skipped: User or ledger not found");
    return;
  }

  const { quotaEmailSentAt, periodStart } = user.creditLedger;

  // PERIOD CHECK: Ensure we only send ONE alert per billing period
  if (!quotaEmailSentAt || quotaEmailSentAt < periodStart) {
    const usedAtDate = new Date(usedAt).toLocaleString();

    await sendEmail({
      type: "quota-full",
      to: user.email,
      name: user.fullName,
      usedAt: usedAtDate,
      upgradeUrl: `${EMAIL_CONFIG.APP.URL}/billing`, // Redirect to billing page
    });

    // Mark as sent to prevent re-alerts in the same window
    await prisma.creditLedger.update({
      where: { userId: user.id },
      data: { quotaEmailSentAt: new Date() },
    });

    logger.info({ userId }, "Quota full alert email sent and recorded");
  } else {
    logger.info(
      { userId, lastSent: quotaEmailSentAt },
      "Quota alert suppressed: Already sent for this period",
    );
  }
}
