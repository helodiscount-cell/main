// Workspace configuration — controls multi-account limits
export const WORKSPACE_CONFIG = {
  MAX_ACCOUNTS: parseInt(process.env.MAX_INSTA_ACCOUNTS ?? "2", 10),
  ACTIVE_WORKSPACE_COOKIE: "active_ig_id",
  COOKIE_MAX_AGE_SECONDS: 60 * 60 * 24 * 30, // 30 days
} as const;
