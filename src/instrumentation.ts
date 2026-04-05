/**
 * Next.js Instrumentation
 * Used to run startup logic (booting background workers, etc.)
 */
export async function register() {
  // Only start background workers in the Node.js runtime (not Edge)
  if (process.env.NEXT_RUNTIME === "nodejs") {
    try {
      const { initNotificationsWorker } =
        await import("./server/queues/notifications.worker");
      initNotificationsWorker();
    } catch (err) {
      console.error("Failed to initialize background workers:", err);
    }
  }
}
