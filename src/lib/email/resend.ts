/**
 * Resend client singleton that throws a clear error if the API key is missing.
 */
import { Resend } from "resend";

let cachedClient: Resend | null = null;

/**
 * Lazy-initializes and returns a cached Resend client.
 * Validates the API key only at call-time to prevent module evaluation errors.
 */
export function getResendClient(): Resend {
  if (cachedClient) return cachedClient;

  const resendApiKey = process.env.RESEND_API_KEY;

  if (!resendApiKey) {
    throw new Error(
      "EMAIL_SERVICE_INIT_FAILURE: Environment variable 'RESEND_API_KEY' is missing. " +
        "Please ensure it is set in your .env.local file.",
    );
  }

  cachedClient = new Resend(resendApiKey);
  return cachedClient;
}
