import { TriggerType } from "@/api/services/automations/types";

/**
 * Gets the canonical edit route for any automation — universally /dash/automations/[id].
 * The editor resolves the correct widgets from triggerType on the fetched data.
 */
export function getAutomationRoute(
  _triggerType: TriggerType,
  id: string,
): string {
  // All types now share a single unified editor route
  return `/dash/automations/${id}`;
}

/**
 * Gets the canonical display label for a given automation type.
 */
export function getAutomationLabel(triggerType: TriggerType): string | null {
  switch (triggerType) {
    case "RESPOND_TO_ALL_DMS":
      return "Inbox";
    case "STORY_REPLY":
      return "Story";
    case "COMMENT_ON_POST":
      return "Post";
    default:
      console.error(
        `[Automation] Unknown triggerType for label: ${triggerType}`,
      );
      return null;
  }
}
