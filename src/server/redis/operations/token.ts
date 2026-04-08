import { getRedisClient } from "../client";
import { KEYS, TTL } from "../keys";
import { logger } from "../../utils/pino";
import { encrypt, decrypt } from "../../utils/encryption";

/**
 * Domain: Tokens
 * Long-Lived Instagram Access Tokens. They are updated frequently natively
 * by the worker whenever handling story replies and valid for several hours contextually.
 */

/**
 * Fetches the user Access Token securely. Needs MongoDB fallback.
 *
 * @param clerkId Clerk User ID
 * @param webhookUserId Instagram/Webhook User ID
 * @param dbFallback Database fallback query returning a guaranteed valid token
 */
export async function getAccessTokenR(
  clerkId: string,
  webhookUserId: string,
  dbFallback: () => Promise<string>,
): Promise<string> {
  const redis = getRedisClient();
  const key = KEYS.ACCESS_TOKEN(clerkId, webhookUserId);

  if (!redis) {
    logger.debug(
      { clerkId, webhookUserId },
      "[Redis:Token] Client down, falling back",
    );
    return dbFallback();
  }

  try {
    const cachedEncrypted = await redis.get(key);

    // Cache Hit
    if (cachedEncrypted) {
      try {
        const decrypted = decrypt(cachedEncrypted);
        logger.debug(
          { clerkId, webhookUserId, hit: true },
          "[Redis:Token] Token retrieved and decrypted",
        );
        return decrypted;
      } catch (err: any) {
        logger.warn(
          { clerkId, webhookUserId, error: err.message },
          "[Redis:Token] Failed to decrypt cached token. Falling back to DB.",
        );
      }
    }

    // Cache Miss -> Fallback -> Repopulate
    logger.debug(
      { clerkId, webhookUserId, hit: false },
      "[Redis:Token] Token missing or invalid, fetching via fallback",
    );
    const validToken = await dbFallback();

    const encrypted = encrypt(validToken);
    redis.set(key, encrypted, "EX", TTL.ACCESS_TOKEN).catch((e) => {
      logger.warn(
        { clerkId, webhookUserId, error: e.message },
        "[Redis:Token] Failed to cache token after fallback",
      );
    });

    return validToken;
  } catch (error: any) {
    logger.error(
      { clerkId, webhookUserId, error: error.message },
      "[Redis:Token] Cache fetch failed, fetching natively via DB fallback",
    );
    return dbFallback();
  }
}

/**
 * Forces a token into Redis cache (typically right after the backend refreshes and stores it)
 */
export async function cacheAccessTokenR(
  clerkId: string,
  webhookUserId: string,
  token: string,
): Promise<void> {
  const redis = getRedisClient();
  if (!redis) return;

  try {
    const encrypted = encrypt(token);
    await redis.set(
      KEYS.ACCESS_TOKEN(clerkId, webhookUserId),
      encrypted,
      "EX",
      TTL.ACCESS_TOKEN,
    );
    logger.info(
      { clerkId, webhookUserId },
      "[Redis:Token] Token forcibly refreshed in cache (encrypted)",
    );
  } catch (error: any) {
    // Fire and forget
    logger.error(
      { clerkId, webhookUserId, error: error.message },
      "[Redis:Token] Failed to manually cache token",
    );
  }
}
