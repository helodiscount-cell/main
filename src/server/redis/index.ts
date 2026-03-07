/**
 * Redis Module Export Barrel
 *
 * Rules:
 * - NO OTHER FILE IN THE WORKER may import from `ioredis` directly.
 * - ALL Redis interactions MUST flow through these typed domain operations.
 */

// Connection
export { getRedisClient } from "./client";
export { RedisError } from "./errors";

// User Connections
export {
  isUserConnectedR,
  setUserConnected,
  invalidateUser,
} from "./operations/user";

// Tokens
export { getAccessTokenR, cacheAccessTokenR } from "./operations/token";

// Idempotency Locks
export { isCommentProcessed } from "./operations/comment";

// User Cooldowns
export { isUserOnCooldown } from "./operations/cooldown";

// Meta API Rate Limits
export {
  updateRateLimitsFromHeadersR,
  checkRateLimits,
} from "./operations/rate-limit";
// Automations and DB Account Caching
export {
  getAccountByInstagramId,
  getAutomationsByPost,
  getAutomationsByStory,
  invalidateAutomations,
} from "./operations/automation";

// Instagram Global Data
export { getCachedPosts, getCachedStories } from "./operations/instagram";
