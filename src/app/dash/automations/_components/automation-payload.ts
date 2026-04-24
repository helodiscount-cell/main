import {
  CommentsFormValues,
  StoryFormValues,
  RespondToAllDMsFormValues,
} from "@/configs/automations.config";

type SupportedFormValues =
  | CommentsFormValues
  | StoryFormValues
  | RespondToAllDMsFormValues;

/**
 * Builds the standard payload fields shared across all automation types.
 * This includes core fields like name, triggers, DM content, and feature toggles.
 */
export function buildAutomationPayload(form: SupportedFormValues) {
  const payload: Record<string, any> = {
    automationName: form.automationName,
    anyKeyword: form.anyKeyword,
    triggers: form.keywords,
    replyMessage: form.dmMessage,
    replyImage: form.dmImage || null,
    dmLinks: form.dmLinks || [],
    useVariables: true,
    askToFollowEnabled: form.askToFollowEnabled,
    askToFollowMessage: form.askToFollowMessage || null,
    askToFollowLink: form.askToFollowLink || null,
    openingMessageEnabled: form.openingMessageEnabled,
    openingMessage: form.openingMessage || null,
    openingButtonText: form.openingButtonText || null,
  };

  // Include public replies (comments only) if the property exists on this form type
  if ("publicReplies" in form) {
    payload.commentReplyWhenDm =
      form.publicReplyEnabled && form.publicReplies.length > 0
        ? form.publicReplies.map((r) => r.text)
        : [];
  }

  return payload;
}
