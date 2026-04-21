/**
 * Shared logic to calculate credit usage progress.
 */
export function calculateProgress(creditsUsed: number, creditLimit: number) {
  const isUnlimited = creditLimit === -1;
  if (isUnlimited) return 100;

  const percentage = (creditsUsed / creditLimit) * 100;
  return Math.min(Math.max(percentage, 0), 100);
}

/**
 * Shared date formatter for billing cycles.
 */
export function formatBillingDate(date: Date | string | undefined) {
  if (!date) return "--";
  return new Date(date).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

/**
 * Shared plan label formatter.
 */
export function getPlanLabel(planId: string) {
  if (!planId) return "Free";
  return planId.charAt(0).toUpperCase() + planId.slice(1).toLowerCase();
}
