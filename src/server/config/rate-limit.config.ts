export const RATE_LIMIT_CONFIG = {
  IGNORED_ROUTES: ["/api/webhooks/instagram"], // Webhooks are skipped to prevent delivery failure

  // Strict for auth to prevent brute-force (10 attempts per 15 minutes)
  AUTH: {
    MATCHERS: ["/oauth", "/api/auth", "/sign-in", "/sign-up"],
    LIMIT: 10,
    WINDOW: "15 m",
  },

  // General API protection (100 requests per minute)
  API: {
    LIMIT: 100,
    WINDOW: "1 m",
  },
} as const;
