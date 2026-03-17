/**
 * Redis Key Registry
 * Centralized registry for all Redis keys and their strict Time-To-Live (TTL) configs.
 *
 * Rules:
 * 1. EVERY key must have a TTL.
 * 2. NO raw string interpolation outside this file.
 */

// TTL configurations in seconds
export const TTL = {
  // Connections and Auth
  USER_CONNECTED: 24 * 60 * 60, // 24 hours
  ACCESS_TOKEN: 2 * 60 * 60, // 2 hours

  // Meta API Rate Limits
  API_USAGE: 60 * 60, // 1 hour rolling window approximation
  INSTAGRAM_DATA: 15 * 60, // 15 minutes
};

// Key generation functions
export const KEYS = {
  // Domain: User
  USER_CONNECTION: (instagramUserId: string) =>
    `ig:user_connection:${instagramUserId}`,
  ACCOUNT_BY_IG: (instagramUserId: string) =>
    `ig:account_by_ig:${instagramUserId}`,

  // Domain: Tokens
  ACCESS_TOKEN: (accountId: string) => `ig:access_token:${accountId}`,

  // Domain: Meta API Rate Limits
  APP_USAGE: () => `ig:rate_limit:app_usage`,
  ACCOUNT_USAGE: (instagramUserId: string) =>
    `ig:rate_limit:account:${instagramUserId}`,

  // Domain: Automations
  AUTOMATIONS_BY_POST: (userId: string, mediaId: string) =>
    `ig:automations_post:${userId}:${mediaId}`,
  AUTOMATIONS_BY_STORY: (userId: string, storyId: string) =>
    `ig:automations_story:${userId}:${storyId}`,

  // Domain: Instagram Data
  INSTAGRAM_POSTS: (instagramUserId: string) => `ig:posts:${instagramUserId}`,
  INSTAGRAM_STORIES: (instagramUserId: string) =>
    `ig:stories:${instagramUserId}`,
};
