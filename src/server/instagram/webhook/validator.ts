/**
 * Instagram Webhook Signature Validation
 * Verifies that webhook requests are authentic
 */

import crypto from "crypto";

/**
 * Verifies webhook signature using HMAC SHA-256
 */
export function verifyWebhookSignature(
  payload: string,
  signature: string,
  secret: string,
): boolean {
  try {
    // Removes 'sha256=' prefix if present
    const cleanSignature = signature.startsWith("sha256=")
      ? signature.substring(7)
      : signature;

    // Calculates expected signature
    const expectedSignature = crypto
      .createHmac("sha256", secret)
      .update(payload)
      .digest("hex");

    // Uses timing-safe comparison to prevent timing attacks
    return crypto.timingSafeEqual(
      Buffer.from(cleanSignature, "utf8"),
      Buffer.from(expectedSignature, "utf8"),
    );
  } catch (error) {
    return false;
  }
}

/**
 * Gets webhook verify token from environment
 */
export function getWebhookVerifyToken(): string | null {
  const token = process.env.INSTAGRAM_WEBHOOK_VERIFY_TOKEN;
  return token || null;
}

/**
 * Gets webhook app secret from environment
 */
export function getWebhookSecret(): string | null {
  return process.env.INSTAGRAM_APP_SECRET || process.env.APP_SECRET || null;
}
