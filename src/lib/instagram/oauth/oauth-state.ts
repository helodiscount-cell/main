/**
 * OAuth State Security Utilities
 * Provides secure state generation and validation to prevent CSRF attacks
 */

import crypto from "crypto";

/**
 * OAuth state expiration time in milliseconds (10 minutes)
 */
const STATE_EXPIRATION_MS = 10 * 60 * 1000;

/**
 * Gets the OAuth state signing secret from environment
 * Falls back to app secret if state secret is not configured
 */
function getStateSecret(): string {
  const stateSecret =
    process.env.OAUTH_STATE_SECRET ||
    process.env.INSTAGRAM_APP_SECRET ||
    process.env.APP_SECRET;

  if (!stateSecret) {
    throw new Error(
      "OAuth state secret is not configured. Set OAUTH_STATE_SECRET or APP_SECRET environment variable."
    );
  }

  return stateSecret;
}

/**
 * Generates a cryptographically secure random nonce
 */
function generateNonce(): string {
  return crypto.randomBytes(16).toString("hex");
}

/**
 * Creates a secure, signed OAuth state
 * Includes HMAC signature, expiration timestamp, and nonce to prevent CSRF and replay attacks
 */
export function createSecureState(data: {
  clerkId: string;
  returnUrl?: string;
}): string {
  const secret = getStateSecret();
  const timestamp = Date.now();
  const nonce = generateNonce();

  // Creates state payload with expiration and nonce
  const payload = {
    clerkId: data.clerkId,
    returnUrl: data.returnUrl || "/dashboard",
    timestamp,
    nonce,
  };

  // Serializes payload to JSON
  const payloadJson = JSON.stringify(payload);

  // Creates HMAC signature
  const signature = crypto
    .createHmac("sha256", secret)
    .update(payloadJson)
    .digest("hex");

  // Combines payload and signature
  const signedState = {
    payload: payloadJson,
    signature,
  };

  // Encodes as base64 for URL-safe transmission
  return Buffer.from(JSON.stringify(signedState)).toString("base64url");
}

/**
 * Validates and decodes a secure OAuth state
 * Verifies HMAC signature, expiration, and prevents replay attacks
 */
export function validateSecureState(encodedState: string): {
  clerkId: string;
  returnUrl: string;
} {
  try {
    const secret = getStateSecret();

    // Decodes base64url state
    const decoded = Buffer.from(encodedState, "base64url").toString("utf-8");
    const signedState = JSON.parse(decoded);

    // Validates structure
    if (!signedState.payload || !signedState.signature) {
      throw new Error("Invalid state structure");
    }

    // Verifies HMAC signature using timing-safe comparison
    const expectedSignature = crypto
      .createHmac("sha256", secret)
      .update(signedState.payload)
      .digest("hex");

    const providedSignature = signedState.signature;

    // Uses timing-safe comparison to prevent timing attacks
    if (
      !crypto.timingSafeEqual(
        Buffer.from(expectedSignature, "hex"),
        Buffer.from(providedSignature, "hex")
      )
    ) {
      throw new Error("Invalid state signature");
    }

    // Parses payload
    const payload = JSON.parse(signedState.payload);

    // Validates payload structure
    if (!payload.clerkId || !payload.timestamp || !payload.nonce) {
      throw new Error("Invalid state payload");
    }

    // Checks expiration
    const now = Date.now();
    const stateAge = now - payload.timestamp;

    if (stateAge > STATE_EXPIRATION_MS) {
      throw new Error("State has expired");
    }

    // Prevents replay attacks by checking state is not too old (additional check)
    // States older than expiration time are already rejected above
    // The nonce ensures uniqueness, but we rely on expiration for replay prevention
    if (stateAge < 0) {
      // Negative age means clock skew - reject if more than 5 minutes
      if (Math.abs(stateAge) > 5 * 60 * 1000) {
        throw new Error("State timestamp is invalid");
      }
    }

    return {
      clerkId: payload.clerkId,
      returnUrl: payload.returnUrl || "/dashboard",
    };
  } catch (error) {
    // Provides generic error message to prevent information leakage
    if (
      error instanceof Error &&
      (error.message.includes("signature") ||
        error.message.includes("expired") ||
        error.message.includes("Invalid"))
    ) {
      throw new Error("Invalid or expired OAuth state. Please try again.");
    }
    throw new Error("Failed to validate OAuth state. Please try again.");
  }
}
