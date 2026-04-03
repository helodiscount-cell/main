/**
 * Application Configuration
 * Centralized settings for the core application behavior
 */

const getAppOrigin = (): string => {
  // Priority: 1. Native APP_ORIGIN, 2. Public APP_URL, 3. Vercel URL
  const origin =
    process.env.APP_ORIGIN ||
    process.env.NEXT_PUBLIC_APP_URL ||
    (process.env.NEXT_PUBLIC_VERCEL_URL
      ? `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`
      : null) ||
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : null);

  // Fail-fast in non-dev environments if trust anchor is missing (prevents Host Header Injection)
  if (!origin && process.env.NODE_ENV !== "development") {
    throw new Error(
      "CRITICAL_SECURITY: Application origin (APP_ORIGIN or NEXT_PUBLIC_APP_URL) is missing in production/preview environment.",
    );
  }

  return origin || "http://localhost:3000";
};

export const APP_CONFIG = {
  ORIGIN: getAppOrigin(),
  ENV: process.env.NODE_ENV || "development",
  IS_PRODUCTION: process.env.NODE_ENV === "production",
  IS_DEVELOPMENT: process.env.NODE_ENV === "development",
} as const;
