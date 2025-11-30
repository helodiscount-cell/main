/**
 * Automation Matcher
 * Matches comments against automation triggers
 */

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
  automation: AutomationRule;
  matchedTrigger?: string;
}

/**
 * Checks if a comment matches an automation's triggers
 */
export function matchComment(
  comment: CommentData,
  automation: AutomationRule
): MatchResult {
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
        try {
          const regex = new RegExp(trigger, "i"); // Case insensitive
          isMatch = regex.test(comment.text);
        } catch (error) {
          console.error("Invalid regex pattern:", trigger, error);
          isMatch = false;
        }
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
 */
export function findMatchingAutomations(
  comment: CommentData,
  automations: AutomationRule[]
): MatchResult[] {
  return automations
    .map((automation) => matchComment(comment, automation))
    .filter((result) => result.matched);
}

/**
 * Checks if a comment was already processed by an automation
 */
export async function isCommentProcessed(
  commentId: string,
  automationId: string,
  prisma: any
): Promise<boolean> {
  const existing = await prisma.automationExecution.findFirst({
    where: {
      commentId,
      automationId,
    },
  });

  return !!existing;
}

/**
 * Replaces variables in the reply message
 */
export function replaceVariables(
  message: string,
  comment: CommentData
): string {
  return message
    .replace(/{username}/g, comment.username)
    .replace(/{comment_text}/g, comment.text)
    .replace(/{comment_id}/g, comment.id);
}

/**
 * Validates comment data
 */
export function validateCommentData(data: any): CommentData | null {
  if (!data.id || !data.text) {
    return null;
  }

  return {
    id: data.id,
    text: data.text,
    username: data.username || data.from?.username || "unknown",
    userId: data.from?.id || data.user?.id || "",
    timestamp: data.timestamp || new Date().toISOString(),
  };
}

