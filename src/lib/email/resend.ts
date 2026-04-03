/**
 * Resend client singleton that throws a clear error if the API key is missing.
 */
import { Resend } from "resend";

// Ensure the API key exists before attempting to initialize the client
const resendApiKey = process.env.RESEND_API_KEY;

if (!resendApiKey) {
  // Use a typed error message for debugging issues with environment configuration
  throw new Error(
    "EMAIL_SERVICE_INIT_FAILURE: Environment variable 'RESEND_API_KEY' is missing. " +
      "Please ensure it is set in your .env.local file.",
  );
}

// Export the singleton instance for use throughout the application
export const resend = new Resend(resendApiKey);
