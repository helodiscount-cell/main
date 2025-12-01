/**
 * Instagram Comments API
 * Handles comment replies via Instagram
 */

import {
  GRAPH_API,
  ERROR_MESSAGES,
  buildGraphApiUrl,
} from "@/config/instagram.config";

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
    const url = buildGraphApiUrl(
      GRAPH_API.ENDPOINTS.REPLY_COMMENT(options.commentId)
    );

    const response = await fetch(url.toString(), {
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

      return {
        success: false,
        error: error.error?.message || ERROR_MESSAGES.API.GENERIC_ERROR,
      };
    }

    const data = await response.json();

    return {
      success: true,
      replyId: data.id,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : ERROR_MESSAGES.SERVER.INTERNAL_ERROR,
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
    const url =
      process.env.NEXT_PUBLIC_FACEBOOK_API_BASE_URL +
      `/${commentId}?access_token=${accessToken}`;

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
      error: error instanceof Error ? error.message : ERROR_MESSAGES.SERVER.INTERNAL_ERROR,
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
    const url = process.env.NEXT_PUBLIC_FACEBOOK_API_BASE_URL + `/${commentId}`;

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
      error: error instanceof Error ? error.message : ERROR_MESSAGES.SERVER.INTERNAL_ERROR,
    };
  }
}
