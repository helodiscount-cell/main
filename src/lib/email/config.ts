/**
 * Centralized email configuration for constants, visual identity, and environment vars.
 */

// Define branding colors and URLs to keep templates clean and consistent
export const EMAIL_CONFIG = {
  // Use professional colors for consistent branding across templates
  COLORS: {
    PRIMARY: "#2563eb", // Blue 600
    DANGER: "#dc2626", // Red 600
    SLATE: {
      50: "#f8fafc",
      200: "#e2e8f0",
      600: "#475569",
      800: "#1e293b",
      900: "#0f172a",
    },
  },

  // Application metadata for email context
  APP: {
    NAME: "Dmbroo",
    URL: process.env.APP_URL || "http://localhost:3000",
    FROM: process.env.RESEND_FROM_EMAIL || "Dmbroo <onboarding@dmbroo.com>",
  },

  // Metadata for emails (timeouts, limits etc)
  LIMITS: {
    MAX_ATTACHMENTS: 5,
    RETRY_COUNT: 3,
  },
} as const;
