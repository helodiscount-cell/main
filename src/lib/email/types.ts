/**
 * Typed payload definitions for the email service using discriminated unions.
 */

// Common fields across all email types
interface BaseEmailPayload {
  to: string; // Recipient email address
  name: string; // Recipient name for personalized greeting
}

// Variation for user onboarding
export interface OnboardingPayload extends BaseEmailPayload {
  type: "onboarding";
  company?: string; // Optional company name
}

// Variation for when a subscription expires
export interface AccountExpiredPayload extends BaseEmailPayload {
  type: "account-expired";
  expirationDate: string; // Formatted date string for email
  reactivateUrl: string; // URL to the billing page
}

// Variation for sending invoices
export interface InvoicePayload extends BaseEmailPayload {
  type: "invoice";
  invoiceNumber: string; // Unique invoice ID
  amount: number; // Final amount as a number
  currency: string; // e.g. "USD", "EUR"
  dueDate: string; // Formatted date string for email
  paymentUrl: string; // Direct link to pay
}

// Discriminated union for type safety across the email service
export type EmailPayload =
  | OnboardingPayload
  | AccountExpiredPayload
  | InvoicePayload;
