import { z } from "zod";

export const AUTOMATION_CONFIGS = {
  COMMENT_REPLY: {
    triggerType: "COMMENT" as const,
    breadcrumb: "DM For Comment",
    matchType: "CONTAINS" as const,
    actionType: "DM" as const,
    successMessage: "Automation is now live! 🚀",
    stopMessage: "Automation stopped.",
  },
  STORY_REPLY: {
    triggerType: "STORY_REPLY" as const,
    breadcrumb: "DM For Story",
    matchType: "CONTAINS" as const,
    actionType: "DM" as const,
    successMessage: "Story automation is now live! 🚀",
    stopMessage: "Story automation stopped.",
  },
} as const;

export const FORM_VALIDATION_MESSAGES = {
  keywords: { min: 1, message: "Add at least one keyword to continue." },
  dmMessage: { min: 1, message: "Write a DM message before going live." },
} as const;

export const baseAutomationSchema = z.object({
  keywords: z
    .array(z.string())
    .min(
      FORM_VALIDATION_MESSAGES.keywords.min,
      FORM_VALIDATION_MESSAGES.keywords.message,
    ),
  dmMessage: z
    .string()
    .min(
      FORM_VALIDATION_MESSAGES.dmMessage.min,
      FORM_VALIDATION_MESSAGES.dmMessage.message,
    ),
});

export const commentsAutomationSchema = baseAutomationSchema.extend({
  publicReplyEnabled: z.boolean(),
  publicReplies: z.array(z.object({ id: z.string(), text: z.string() })),
});

export const storyAutomationSchema = baseAutomationSchema;

export type CommentsFormValues = z.infer<typeof commentsAutomationSchema>;
export type StoryFormValues = z.infer<typeof storyAutomationSchema>;
