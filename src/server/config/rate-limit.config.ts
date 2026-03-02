export const RATE_LIMIT_TIERS = {
  FREE: "FREE",
  PRO: "PRO",
} as const;

export type UserTier = (typeof RATE_LIMIT_TIERS)[keyof typeof RATE_LIMIT_TIERS];

export const RATE_LIMIT_CONFIG = {
  IGNORED_ROUTES: ["/api/webhooks/instagram"], // Explicitly ignored routes

  // Authentication routes: strict to prevent brute-force
  AUTH: {
    MATCHERS: ["/oauth", "/api/auth", "/sign-in", "/sign-up"],
    LIMITS: {
      [RATE_LIMIT_TIERS.FREE]: { limit: 10, windowMs: "15 m" },
      [RATE_LIMIT_TIERS.PRO]: { limit: 10, windowMs: "15 m" },
    },
  },

  // State-changing routes
  MUTATION: {
    MATCHERS: ["/create", "/update", "/delete", "/api/automations/create"],
    LIMITS: {
      [RATE_LIMIT_TIERS.FREE]: { limit: 20, windowMs: "1 h" },
      [RATE_LIMIT_TIERS.PRO]: { limit: 100, windowMs: "1 h" },
    },
  },

  // Read-only / Query routes
  QUERY: {
    MATCHERS: ["/api/automations/list", "/api/user", "/api/instagram"],
    LIMITS: {
      [RATE_LIMIT_TIERS.FREE]: { limit: 3, windowMs: "1 m" },
      [RATE_LIMIT_TIERS.PRO]: { limit: 500, windowMs: "1 m" },
    },
  },

  // Fallback default policy for unclassified /api routes
  DEFAULT: {
    LIMITS: {
      [RATE_LIMIT_TIERS.FREE]: { limit: 100, windowMs: "15 m" },
      [RATE_LIMIT_TIERS.PRO]: { limit: 300, windowMs: "15 m" },
    },
  },
} as const;
