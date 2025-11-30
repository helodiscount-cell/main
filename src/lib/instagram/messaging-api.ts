/**
 * Instagram Messaging API
 * Handles direct message sending via Instagram
 */

import { MESSAGING_CONSTRAINTS } from "@/config/instagram.config";
import { logger } from "@/lib/logger-backend";

export interface SendMessageOptions {
  recipientId: string;
  message: string;
  accessToken: string;
  messagingType?: "RESPONSE" | "UPDATE" | "MESSAGE_TAG";
  tag?: string;
}

export interface SendMessageResult {
  success: boolean;
  messageId?: string;
  error?: string;
}

/**
 * Sends a direct message on Instagram
 */
export async function sendDirectMessage(
  options: SendMessageOptions
): Promise<SendMessageResult> {
  try {
    // Validates message length
    if (options.message.length > MESSAGING_CONSTRAINTS.MESSAGE_MAX_LENGTH) {
      return {
        success: false,
        error: `Message exceeds maximum length of ${MESSAGING_CONSTRAINTS.MESSAGE_MAX_LENGTH} characters`,
      };
    }

    const url = `https://graph.facebook.com/v24.0/me/messages`;

    const requestBody: any = {
      recipient: { id: options.recipientId },
      message: { text: options.message },
      messaging_type: options.messagingType || "RESPONSE",
      access_token: options.accessToken,
    };

    // Adds tag if using MESSAGE_TAG
    if (options.messagingType === "MESSAGE_TAG" && options.tag) {
      requestBody.tag = options.tag;
    }

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));

      logger.apiRoute("MESSAGING", "send_dm_failed", {
        recipientId: options.recipientId,
        error: error.error?.message,
        code: error.error?.code,
      });

      // Checks for 24-hour window error
      if (
        error.error?.code === 10 ||
        error.error?.message?.includes("window")
      ) {
        return {
          success: false,
          error: "Cannot send message: 24-hour messaging window has expired.",
        };
      }

      return {
        success: false,
        error: error.error?.message || "Failed to send direct message",
      };
    }

    const data = await response.json();

    logger.apiRoute("MESSAGING", "send_dm_success", {
      recipientId: options.recipientId,
      messageId: data.message_id,
    });

    return {
      success: true,
      messageId: data.message_id,
    };
  } catch (error) {
    console.error("Error sending direct message:", error);
    logger.apiRoute("MESSAGING", "send_dm_error", {
      recipientId: options.recipientId,
      error: error instanceof Error ? error.message : "Unknown error",
    });

    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

/**
 * Checks if messaging is allowed (within 24-hour window)
 */
export async function checkMessagingWindow(
  recipientId: string,
  accessToken: string
): Promise<boolean> {
  try {
    // Gets conversation info
    const url = `https://graph.facebook.com/v24.0/${recipientId}?fields=last_message_time&access_token=${accessToken}`;

    const response = await fetch(url);

    if (!response.ok) {
      return false;
    }

    const data = await response.json();

    if (!data.last_message_time) {
      return false;
    }

    // Checks if within 24 hours
    const lastMessageTime = new Date(data.last_message_time);
    const now = new Date();
    const hoursDiff =
      (now.getTime() - lastMessageTime.getTime()) / (1000 * 60 * 60);

    return hoursDiff <= MESSAGING_CONSTRAINTS.WINDOW_HOURS;
  } catch (error) {
    console.error("Error checking messaging window:", error);
    return false;
  }
}

/**
 * Sends a message with retry logic
 */
export async function sendDirectMessageWithRetry(
  options: SendMessageOptions,
  maxRetries: number = 3
): Promise<SendMessageResult> {
  let lastError: string = "";

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    const result = await sendDirectMessage(options);

    if (result.success) {
      return result;
    }

    lastError = result.error || "Unknown error";

    // Don't retry for certain errors
    if (
      lastError.includes("24-hour") ||
      lastError.includes("window") ||
      lastError.includes("permission")
    ) {
      return result;
    }

    // Waits before retrying (exponential backoff)
    if (attempt < maxRetries) {
      const delay = Math.pow(2, attempt) * 1000; // 2s, 4s, 8s
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }

  return {
    success: false,
    error: `Failed after ${maxRetries} attempts: ${lastError}`,
  };
}

