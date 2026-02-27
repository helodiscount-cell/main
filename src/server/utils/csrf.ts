/**
 * CSRF Protection Utilities
 * Provides functions to validate requests and prevent cross-site request forgery
 */

/**
 * Gets the allowed origin for the application
 */
function getAllowedOrigin(): string {
  const origin =
    process.env.NEXT_PUBLIC_APP_URL ||
    process.env.NEXT_PUBLIC_VERCEL_URL ||
    "http://localhost:3000";

  // Removes protocol if present and normalizes
  return origin.replace(/^https?:\/\//, "").split("/")[0];
}

/**
 * Validates the Origin header against allowed origins
 * Returns true if origin is valid or missing (for same-origin requests)
 */
export function validateOrigin(origin: string | null): {
  valid: boolean;
  error?: string;
} {
  // Allows requests without Origin header (same-origin, GET requests, etc.)
  if (!origin) {
    return { valid: true };
  }

  const allowedOrigin = getAllowedOrigin();
  const originHost = origin.replace(/^https?:\/\//, "").split("/")[0];

  // Validates exact match or localhost variations
  if (
    originHost === allowedOrigin ||
    originHost === `localhost:3000` ||
    originHost === `127.0.0.1:3000` ||
    (allowedOrigin.includes("localhost") && originHost.includes("localhost"))
  ) {
    return { valid: true };
  }

  // Allows ngrok and similar development tunnels
  if (process.env.NODE_ENV === "development" && originHost.includes("ngrok")) {
    return { valid: true };
  }

  return {
    valid: false,
    error: "Invalid request origin",
  };
}

/**
 * Validates the Referer header against allowed origins
 * Used as a fallback when Origin header is not present
 */
export function validateReferer(referer: string | null): {
  valid: boolean;
  error?: string;
} {
  // Allows requests without Referer header
  if (!referer) {
    return { valid: true };
  }

  try {
    const refererUrl = new URL(referer);
    const allowedOrigin = getAllowedOrigin();
    const refererHost = refererUrl.host;

    // Validates host matches allowed origin
    if (
      refererHost === allowedOrigin ||
      refererHost === `localhost:3000` ||
      refererHost === `127.0.0.1:3000` ||
      (allowedOrigin.includes("localhost") && refererHost.includes("localhost"))
    ) {
      return { valid: true };
    }

    // Allows ngrok and similar development tunnels
    if (
      process.env.NODE_ENV === "development" &&
      refererHost.includes("ngrok")
    ) {
      return { valid: true };
    }

    return {
      valid: false,
      error: "Invalid request referer",
    };
  } catch (error) {
    // Invalid URL format
    return {
      valid: false,
      error: "Invalid referer format",
    };
  }
}

/**
 * Validates CSRF protection for state-changing requests
 * Checks Origin and Referer headers
 */
export function validateCsrfProtection(request: Request): {
  valid: boolean;
  error?: string;
} {
  const method = request.method;

  // Only validates state-changing methods
  if (!["POST", "PUT", "PATCH", "DELETE"].includes(method)) {
    return { valid: true };
  }

  // Skips validation for webhook endpoints (they have their own signature validation)
  const url = new URL(request.url);
  if (url.pathname.includes("/webhooks/")) {
    return { valid: true };
  }

  // Validates Origin header first (preferred)
  const origin = request.headers.get("origin");
  const originValidation = validateOrigin(origin);

  if (originValidation.valid) {
    return { valid: true };
  }

  // Falls back to Referer validation if Origin is missing
  if (!origin) {
    const referer = request.headers.get("referer");
    return validateReferer(referer);
  }

  // Origin is present but invalid
  return originValidation;
}
