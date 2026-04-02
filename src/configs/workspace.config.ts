const parsedMaxAccounts = parseInt(process.env.MAX_INSTA_ACCOUNTS ?? "2", 10);
const validatedMaxAccounts =
  !Number.isNaN(parsedMaxAccounts) && parsedMaxAccounts > 0
    ? parsedMaxAccounts
    : 2;

// Workspace configuration — controls multi-account limits
export const WORKSPACE_CONFIG = {
  MAX_ACCOUNTS: validatedMaxAccounts,
  ACTIVE_WORKSPACE_COOKIE: "active_ig_id",
  COOKIE_MAX_AGE_SECONDS: 60 * 60 * 24 * 30, // 30 days
} as const;
