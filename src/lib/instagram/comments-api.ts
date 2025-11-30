/**
 * Instagram Comments API
 * Handles comment replies via Instagram
 */

import { logger } from "@/lib/logger-backend";

export interface ReplyToCommentOptions {
  commentId: string;
  message: string;
  accessToken: string;
}

export interface ReplyToCommentResult {
  success: boolean;
  replyId?: string;
  error?: string;
}

/**
 * Replies to a comment on Instagram
 */
export async function replyToComment(
  options: ReplyToCommentOptions
): Promise<ReplyToCommentResult> {
  try {
    const url = `https://graph.facebook.com/v24.0/${options.commentId}/replies`;

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message: options.message,
        access_token: options.accessToken,
      }),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));

      logger.apiRoute("COMMENTS", "reply_failed", {
        commentId: options.commentId,
        error: error.error?.message,
        code: error.error?.code,
      });

      return {
        success: false,
        error: error.error?.message || "Failed to reply to comment",
      };
    }

    const data = await response.json();

    logger.apiRoute("COMMENTS", "reply_success", {
      commentId: options.commentId,
      replyId: data.id,
    });

    return {
      success: true,
      replyId: data.id,
    };
  } catch (error) {
    console.error("Error replying to comment:", error);
    logger.apiRoute("COMMENTS", "reply_error", {
      commentId: options.commentId,
      error: error instanceof Error ? error.message : "Unknown error",
    });

    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

/**
 * Replies to a comment with retry logic
 */
export async function replyToCommentWithRetry(
  options: ReplyToCommentOptions,
  maxRetries: number = 3
): Promise<ReplyToCommentResult> {
  let lastError: string = "";

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    const result = await replyToComment(options);

    if (result.success) {
      return result;
    }

    lastError = result.error || "Unknown error";

    // Don't retry for certain errors
    if (
      lastError.includes("permission") ||
      lastError.includes("not found") ||
      lastError.includes("deleted")
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

/**
 * Deletes a comment or reply
 */
export async function deleteComment(
  commentId: string,
  accessToken: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const url = `https://graph.facebook.com/v24.0/${commentId}?access_token=${accessToken}`;

    const response = await fetch(url, {
      method: "DELETE",
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      return {
        success: false,
        error: error.error?.message || "Failed to delete comment",
      };
    }

    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

/**
 * Hides a comment
 */
export async function hideComment(
  commentId: string,
  accessToken: string,
  hide: boolean = true
): Promise<{ success: boolean; error?: string }> {
  try {
    const url = `https://graph.facebook.com/v24.0/${commentId}`;

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        hide,
        access_token: accessToken,
      }),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      return {
        success: false,
        error: error.error?.message || "Failed to hide comment",
      };
    }

    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

