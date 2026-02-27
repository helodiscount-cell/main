/**
 * BullMQ Queue Definitions
 * Defines queues for background job processing
 */

import { Queue } from "bullmq";
import { getRedisConnectionOptions } from ".";
import type { WebhookPayload } from "@dm-broo/common-types";

/**
 * Webhook processing queue
 * Handles incoming webhook events from Instagram
 */
export const webhookQueue = new Queue<WebhookPayload>("webhook-processing", {
  connection: getRedisConnectionOptions(),
  defaultJobOptions: {
    attempts: 3,
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
