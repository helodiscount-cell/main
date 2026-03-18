/**
 * Redis Module Export Barrel
 *
 * Rules:
 * - NO OTHER FILE IN THE WORKER may import from `ioredis` directly.
 * - ALL Redis interactions MUST flow through these typed domain operations.
 */

// Connection
export { getRedisClient, getQueueRedisClientR } from "./client";
export { RedisError } from "./errors";

// User Connections
export {
  isUserConnectedR,
  setUserConnected,
  invalidateUser,
} from "./operations/user";

// Tokens
export { getAccessTokenR, cacheAccessTokenR } from "./operations/token";

// Meta API Rate Limits
export { updateRateLimitsFromHeadersR } from "./operations/rate-limit";

// Automations and DB Account Caching
export {
  invalidateAutomations,
  invalidateAutomationCache,
  isCommentProcessedCached,
  markCommentProcessed,
  clearAllUserCache,
} from "./operations/automation";

// Instagram Global Data
export { getCachedPosts, getCachedStories } from "./operations/instagram";
