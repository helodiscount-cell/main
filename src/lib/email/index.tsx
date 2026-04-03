import { render } from "@react-email/render";
import * as React from "react";
import { EMAIL_CONFIG } from "./config";
import { resend } from "./resend";
import { AccountExpiredEmail } from "./templates/account-expired";
import { InvoiceEmail } from "./templates/invoice";
import { OnboardingEmail } from "./templates/onboarding";
import { EmailPayload } from "./types";

/**
 * Sends an email based on the provided payload using Resend.
 * Each payload type is mapped to a high-quality React Email template.
 */
export async function sendEmail(payload: EmailPayload): Promise<void> {
  const { to, name } = payload;

  let html = "";
  let subject = "";

  // Use switch on the payload itself for proper TypeScript discriminated union narrowing
  switch (payload.type) {
    case "onboarding":
      html = await render(
        <OnboardingEmail
          name={name}
          company={payload.company}
          loginUrl={`${EMAIL_CONFIG.APP.URL}/login`}
        />,
      );
      subject = `Welcome to ${EMAIL_CONFIG.APP.NAME}, ${name}!`;
      break;

    case "account-expired":
      html = await render(
        <AccountExpiredEmail
          name={name}
          expirationDate={payload.expirationDate}
          reactivateUrl={payload.reactivateUrl}
        />,
      );
      subject = `Alert: Your ${EMAIL_CONFIG.APP.NAME} subscription has expired`;
      break;

    case "invoice":
      html = await render(
        <InvoiceEmail
          name={name}
          invoiceNumber={payload.invoiceNumber}
          amount={payload.amount}
          currency={payload.currency}
          dueDate={payload.dueDate}
          paymentUrl={payload.paymentUrl}
        />,
      );
      subject = `New Invoice ${payload.invoiceNumber} from ${EMAIL_CONFIG.APP.NAME}`;
      break;

    default:
      // Exhaustive type checking for safety
      throw new Error(
        `EMAIL_SERVICE_ERROR: Unsupported email type: ${(payload as any).type}`,
      );
  }

  try {
    // Attempt to send via the Resend singleton
    const { data, error } = await resend.emails.send({
      from: EMAIL_CONFIG.APP.FROM,
      to: [to],
      subject,
      html,
    });

    if (error) {
      // Structured error throwing for easier top-level handling
      throw new Error(
        `RESEND_API_ERROR: ${error.message} (Code: ${error.name})`,
      );
    }

    console.info(
      `[EMAIL_SENT] Type: ${payload.type}, Recipient: ${to}, JobID: ${data?.id}`,
    );
  } catch (err) {
    // Re-throw with clear context for upstream error handlers
    const message =
      err instanceof Error ? err.message : "Unknown error occurred";
    console.error(
      `[EMAIL_FAILURE] Type: ${payload.type}, Recipient: ${to}, Error: ${message}`,
    );
    throw new Error(`EMAIL_SEND_FAILED: ${message}`);
  }
}
