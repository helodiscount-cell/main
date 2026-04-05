import { Worker, Job } from "bullmq";
import { getQueueRedisClientR } from "@/server/redis/client";
import { KEYS } from "@/server/redis/keys";
import { prisma } from "@/server/db";
import { sendEmail } from "@/lib/email";
import { logger } from "@/server/utils/pino";
import { EMAIL_CONFIG } from "@/lib/email/config";

const redisConnection = getQueueRedisClientR();

let worker: Worker | null = null;

/**
 * Initializes and starts the BullMQ worker for notifications.
 * Processes alerts like quota-full, subscription events, etc.
 */
export function initNotificationsWorker() {
  if (worker) {
    logger.info("Notification worker already initialized, skipping.");
    return worker;
  }

  if (!redisConnection) {
    logger.warn("Notification worker skipped: No Queue Redis connection");
    return null;
  }

  worker = new Worker(
    KEYS.NOTIFICATIONS_QUEUE,
    async (job: Job) => {
      const { type, userId, usedAt } = job.data;

      try {
        if (type === "QUOTA_FULL") {
          await handleQuotaFullAlert(userId, usedAt);
        } else {
          throw new Error(
            `Unsupported notification job type: ${type} (Job ID: ${job.id})`,
          );
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

  const { quotaEmailSentAt, periodStart, quotaEmailSendingAt } =
    user.creditLedger;
  const usedAtDate = new Date(usedAt);

  // 1. Period Validation: Ensure job is from the current billing period
  if (usedAtDate < periodStart) {
    logger.info(
      { userId, usedAtDate, periodStart },
      "Quota alert skipped: Event is from a previous billing period",
    );
    return;
  }

  const now = new Date();
  const FIVE_MINUTES_AGO = new Date(now.getTime() - 5 * 60 * 1000);

  // 2. PROVISIONAL CLAIM: Attempt to claim the email send
  // We only claim if:
  // - No email sent this period (null or before periodStart)
  // - AND no claim in progress (null or older than 5 mins for recovery)
  const result = await prisma.creditLedger.updateMany({
    where: {
      userId: user.id,
      periodStart: periodStart, // HARD period match to avoid rollover races
      AND: [
        {
          OR: [
            { quotaEmailSentAt: null },
            { quotaEmailSentAt: { lt: periodStart } },
          ],
        },
        {
          OR: [
            { quotaEmailSendingAt: null },
            { quotaEmailSendingAt: { lt: FIVE_MINUTES_AGO } },
          ],
        },
      ],
    },
    data: { quotaEmailSendingAt: now },
  });

  if (result.count === 0) {
    logger.info(
      { userId, lastSent: quotaEmailSentAt, sendingAt: quotaEmailSendingAt },
      "Quota alert suppressed: Already sent or send in progress",
    );
    return;
  }

  // 3. ATTEMPT SEND
  try {
    const usedAtStr = usedAtDate.toISOString();
    await sendEmail({
      type: "quota-full",
      to: user.email,
      name: user.fullName || "there",
      usedAt: usedAtStr,
      upgradeUrl: `${EMAIL_CONFIG.APP.URL}/billing`,
    });

    // 4. CONFIRM CLAIM: Set permanent record and clear sending flag
    await prisma.creditLedger.updateMany({
      where: { userId: user.id, periodStart: periodStart },
      data: {
        quotaEmailSentAt: now,
        quotaEmailSendingAt: null,
      },
    });

    logger.info({ userId }, "Quota full alert email sent and recorded");
  } catch (err: any) {
    // 5. ROLLBACK CLAIM: Clear sending flag on failure to allow retry
    await prisma.creditLedger.updateMany({
      where: { userId: user.id, periodStart: periodStart },
      data: { quotaEmailSendingAt: null },
    });

    logger.error(
      { userId, err: err.message },
      "Quota alert send failure: Claim released for retry",
    );
    throw err; // Trigger job retry
  }
}
