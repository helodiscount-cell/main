import { Redis } from "ioredis";
import { logger } from "../utils/pino";

// Lazy-initialize Redis only if needed to avoid startup crashes if env is missing
let redisClient: Redis | null = null;

/**
 * Returns the Upstash Redis singleton instance.
 * If the connection cannot be established or strict env vars are missing,
 * it returns null. The entire Redis module is designed to fall back gracefully to MongoDB
 * if this returns null.
 */
export function getRedisClient(): Redis | null {
  if (!redisClient) {
    if (process.env.UPSTASH_REDIS_HOST && process.env.UPSTASH_REDIS_PASSWORD) {
      redisClient = new Redis({
        host: process.env.UPSTASH_REDIS_HOST,
        port: Number(process.env.UPSTASH_REDIS_PORT) || 6379,
        username: process.env.UPSTASH_REDIS_USERNAME || "default",
        password: process.env.UPSTASH_REDIS_PASSWORD,
        tls: {},
        // If Redis goes down, fail fast rather than hanging the worker processes
        maxRetriesPerRequest: 1,
        enableReadyCheck: true,
        retryStrategy(times) {
          // Reconnect strategy. Stop retrying after 3 attempts so it falls back to DB
          if (times > 3) {
            logger.error(
              "Redis connection failed. Halting retries and falling back to MongoDB.",
            );
            return null; // Stop retrying
          }
          return Math.min(times * 100, 2000); // Backoff: 100ms, 200ms, 300ms... max 2s
        },
      });

      redisClient.on("error", (err) => {
        logger.error({ err }, "Redis Client Error");
      });
    } else {
      logger.warn(
        "Redis disabled: Missing UPSTASH_REDIS_HOST or UPSTASH_REDIS_PASSWORD",
      );
    }
  }
  return redisClient;
}

let queueRedisClient: Redis | null = null;

/**
 * Returns the Redis instance specifically dedicated to BullMQ.
 * Uses QUEUE_REDIS_* env vars, falls back to UPSTASH_REDIS_* if not provided.
 */
export function getQueueRedisClientR(): Redis | null {
  if (!queueRedisClient) {
    const host = process.env.QUEUE_REDIS_HOST || process.env.UPSTASH_REDIS_HOST;
    const port =
      Number(process.env.QUEUE_REDIS_PORT) ||
      Number(process.env.UPSTASH_REDIS_PORT) ||
      6379;
    const username =
      process.env.QUEUE_REDIS_USERNAME ||
      process.env.UPSTASH_REDIS_USERNAME ||
      "default";
    const password =
      process.env.QUEUE_REDIS_PASSWORD || process.env.UPSTASH_REDIS_PASSWORD;

    if (host && password) {
      const isUpstash = host.includes("upstash");
      const isRedisLabs = host.includes("redislabs");

      queueRedisClient = new Redis({
        host,
        port,
        // For some providers, 'default' username is required; for others, it must be omitted.
        // We favor provided username but fall back to 'default' if it's Upstash.
        username: username || "default",
        password,
        tls: isUpstash ? {} : undefined,
        maxRetriesPerRequest: null, // BullMQ needs this to be null
        enableReadyCheck: true,
        retryStrategy(times) {
          if (times > 10) {
            logger.error("Queue Redis connection failed. Retrying slowly.");
            return 5000;
          }
          return Math.min(times * 100, 2000);
        },
      });

      queueRedisClient.on("error", (err) => {
        logger.error({ err }, "Queue Redis Client Error");
      });
    } else {
      logger.warn("Queue Redis disabled: Missing host or password");
    }
  }
  return queueRedisClient;
}
