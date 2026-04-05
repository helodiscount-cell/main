import * as crypto from "crypto";
import { SignatureVerificationError } from "./errors";

/**
 * Convert rupees to paise.
 */
export function toRazorpayAmount(rupees: number): number {
  return Math.round(rupees * 100);
}

/**
 * Convert paise back to rupees.
 */
export function fromRazorpayAmount(paise: number): number {
  return paise / 100;
}

/**
 * Verify Razorpay HMAC-SHA256 signature using Node's native crypto.
 * Throws SignatureVerificationError on mismatch.
 */
export function verifyHmacSignature(
  payload: string,
  expectedSignature: string,
  secret: string,
): void {
  const computed = crypto
    .createHmac("sha256", secret)
    .update(payload)
    .digest("hex");

  // Constant-time comparison to prevent timing attacks
  if (!timingSafeEqual(computed, expectedSignature)) {
    throw new SignatureVerificationError();
  }
}

/**
 * Timing-safe string comparison.
 * Requires buffers of same length.
 */
function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  return crypto.timingSafeEqual(Buffer.from(a), Buffer.from(b));
}

/**
 * Generate a short, unique receipt ID.
 * Razorpay enforces a 40-character max.
 */
export function generateReceipt(prefix = "rcpt"): string {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
}
