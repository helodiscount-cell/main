import { logger } from "./server/utils/pino";

/**
 * Next.js Instrumentation
 * Used to run startup logic (booting background workers, etc.)
 */
export async function register() {
  // Only start background workers in the Node.js runtime (not Edge)
  if (process.env.NEXT_RUNTIME === "nodejs") {
    try {
      logger.info("Initializing background workers for Node.js runtime...");
      const { initNotificationsWorker } =
        await import("./server/queues/notifications.worker");
      initNotificationsWorker();
    } catch (err) {
      logger.error("Failed to initialize background workers:", err);
    }
  }
}
