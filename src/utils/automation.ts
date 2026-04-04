import { TriggerType } from "@/types/automation";

/**
 * Gets the canonical edit route for a given automation type.
 */
export function getAutomationRoute(
  triggerType: TriggerType,
  id: string,
): string | null {
  switch (triggerType) {
    case "RESPOND_TO_ALL_DMS":
      return `/dash/automations/respondtoalldms/edit/${id}`;
    case "STORY_REPLY":
      return `/dash/automations/dmforstories/edit/${id}`;
    case "COMMENT_ON_POST":
      return `/dash/automations/dmforcomments/edit/${id}`;
    default:
      console.error(
        `[Automation] Unknown triggerType encountered: ${triggerType}`,
      );
      return null;
  }
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
