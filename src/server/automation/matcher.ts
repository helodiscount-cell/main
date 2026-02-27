/**
 * Automation Matcher
 * Matches comments against automation triggers
 */

import {
  sanitizeCommentText,
  sanitizeUsername,
  sanitizeText,
} from "@/server/utils/sanitize";
import { safeRegexMatch } from "@/server/utils/safe-regex";
import { Automation } from "@prisma/client";

export interface CommentData {
  id: string;
  text: string;
  username: string;
  userId: string;
  timestamp: string;
}

export interface AutomationRule {
  id: string;
  triggers: string[];
  matchType: "CONTAINS" | "EXACT" | "REGEX";
  actionType: string;
  replyMessage: string;
  useVariables: boolean;
}

export interface MatchResult {
  matched: boolean;
  automation: Automation;
  matchedTrigger?: string;
}

/**
 * Checks if a comment matches an automation's triggers
 * Uses safe regex execution to prevent ReDoS attacks
 */
export async function matchComment(
  comment: CommentData,
  automation: Automation,
): Promise<MatchResult> {
  const commentText = comment.text.toLowerCase().trim();

  for (const trigger of automation.triggers) {
    const triggerLower = trigger.toLowerCase().trim();
    let isMatch = false;

    switch (automation.matchType) {
      case "CONTAINS":
        isMatch = commentText.includes(triggerLower);
        break;

      case "EXACT":
        isMatch = commentText === triggerLower;
        break;

      case "REGEX":
        // Uses safe regex execution with timeout and validation
        isMatch = await safeRegexMatch(trigger, comment.text, "i");
        break;

      default:
        isMatch = commentText.includes(triggerLower);
    }

    if (isMatch) {
      return {
        matched: true,
        automation,
        matchedTrigger: trigger,
      };
    }
  }

  return {
    matched: false,
    automation,
  };
}

/**
 * Finds all automations that match a comment
 * Uses safe regex execution to prevent ReDoS attacks
 */
export async function findMatchingAutomations(
  comment: CommentData,
  automations: Automation[],
): Promise<MatchResult[]> {
  const matchPromises = automations.map((automation) =>
    matchComment(comment, automation),
  );
  const results = await Promise.all(matchPromises);
  return results.filter((result) => result.matched);
}

/**
 * Checks if a comment was already processed by an automation
 * Uses caching to reduce DB load for already-processed comments
 */
export async function isCommentProcessed(
  commentId: string,
  automationId: string,
): Promise<boolean> {
  const { isCommentProcessed: checkProcessed } =
    await import("@/server/repository/automations/automation-execution.repository");
  const { isCommentProcessedCached } =
    await import("@/server/utils/automation-cache");

  return isCommentProcessedCached(commentId, automationId, () =>
    checkProcessed(commentId, automationId),
  );
}

/**
 * Replaces variables in the reply message
 * Sanitizes all user-generated content before insertion to prevent XSS
 */
export function replaceVariables(
  message: string,
  comment: CommentData,
): string {
  // Sanitizes comment data before variable replacement
  const sanitizedUsername = sanitizeUsername(comment.username);
  const sanitizedCommentText = sanitizeCommentText(comment.text);
  const sanitizedCommentId = sanitizeText(comment.id, 100); // Comment IDs are typically short

  // Replaces variables with sanitized values
  return message
    .replace(/{username}/g, sanitizedUsername)
    .replace(/{comment_text}/g, sanitizedCommentText)
    .replace(/{comment_id}/g, sanitizedCommentId);
}
