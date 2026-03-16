/**
 * BullMQ Queue Definitions
 * Defines queues for background job processing
 */

import { Queue } from "bullmq";
import { getQueueRedisClientR } from "@/server/redis";
import type { WebhookPayload } from "@dm-broo/common-types";

const redisConnection = getQueueRedisClientR();

if (!redisConnection) {
  throw new Error(
    "QUEUE_REDIS_HOST or QUEUE_REDIS_PASSWORD is missing. Webhook queue cannot be initialized.",
  );
}

/**
 * Webhook processing queue
 * Handles incoming webhook events from Instagram
 */
export const webhookQueue = new Queue<WebhookPayload>("webhook-processing", {
  connection: redisConnection,
  defaultJobOptions: {
    attempts: 5,
    backoff: {
      type: "exponential",
      delay: 2000,
    },
    removeOnComplete: {
      age: 3600, // Keeps completed jobs for 1 hour
      count: 1000,
    },
    removeOnFail: {
      age: 24 * 3600, // Keeps failed jobs for 24 hours
    },
  },
});
