/**
 * Application Configuration
 * Centralized settings for the core application behavior
 */

const getAppOrigin = (): string => {
  // strictly .env driven configuration
  const rawOrigin =
    process.env.APP_ORIGIN || process.env.NEXT_PUBLIC_APP_URL || "";
  const origin = rawOrigin.trim();

  if (!origin) {
    throw new Error(
      "CRITICAL_SECURITY: Application origin (APP_ORIGIN or NEXT_PUBLIC_APP_URL) is missing in environment.",
    );
  }

  try {
    const url = new URL(origin);

    // Security check: Only allow web schemes for origin
    if (url.protocol !== "http:" && url.protocol !== "https:") {
      throw new Error(
        `CRITICAL_SECURITY: Invalid protocol "${url.protocol}". Application origin must use http: or https:.`,
      );
    }

    // Canonicalize: lowercase scheme/host, handles default ports, removes trailing slash
    return url.origin;
  } catch (err) {
    if (err instanceof Error && err.message.startsWith("CRITICAL_SECURITY")) {
      throw err;
    }
    throw new Error(
      `CRITICAL_SECURITY: Invalid Application origin configured: "${origin}". Must be a valid absolute URL (e.g., https://example.com)`,
    );
  }
};

export const APP_CONFIG = {
  ORIGIN: getAppOrigin(),
  ENV: process.env.NODE_ENV || "development",
  IS_PRODUCTION: process.env.NODE_ENV === "production",
  IS_DEVELOPMENT: process.env.NODE_ENV === "development",
} as const;
