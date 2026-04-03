import { z } from "zod";

export const AUTOMATION_CONFIGS = {
  COMMENT_REPLY: {
    triggerType: "COMMENT_ON_POST" as const,
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
  RESPOND_TO_ALL_DMS: {
    triggerType: "RESPOND_TO_ALL_DMS" as const,
    breadcrumb: "Respond to All DMs",
    matchType: "CONTAINS" as const,
    actionType: "DM" as const,
    successMessage: "Account DM automation is now live! 🚀",
    stopMessage: "Account DM automation stopped.",
  },
} as const;

export const FORM_VALIDATION_MESSAGES = {
  keywords: { min: 1, message: "Add at least one keyword to continue." },
  dmMessage: { min: 1, message: "Write a DM message before going live." },
} as const;

export const baseAutomationSchema = z.object({
  automationName: z.string().min(1, "Please define a name for this automation"),
  keywords: z.array(z.string()),
  dmMessage: z
    .string()
    .min(
      FORM_VALIDATION_MESSAGES.dmMessage.min,
      FORM_VALIDATION_MESSAGES.dmMessage.message,
    ),
  dmImage: z.string().optional(),
  openingMessageEnabled: z.boolean().default(true),
  openingMessage: z.string().optional(),
  openingButtonText: z.string().optional(),
  dmLinks: z
    .array(
      z.object({
        title: z.string().min(1).max(100),
        url: z
          .string()
          .url("Invalid link URL")
          .startsWith("https://", "Only HTTPS links are allowed")
          .max(2048),
      }),
    )
    .max(3, "Maximum 3 links allowed")
    .optional(),
});

export const commentsAutomationSchema = baseAutomationSchema.extend({
  publicReplyEnabled: z.boolean(),
  publicReplies: z.array(z.object({ id: z.string(), text: z.string() })),
  askToFollowEnabled: z.boolean(),
  askToFollowMessage: z.string().max(1000).optional(),
  askToFollowLink: z
    .string()
    .url("Invalid link URL")
    .startsWith("https://", "Only HTTPS links are allowed")
    .or(z.literal(""))
    .optional(),
});

export const storyAutomationSchema = baseAutomationSchema.extend({
  askToFollowEnabled: z.boolean(),
  askToFollowMessage: z.string().max(1000).optional(),
  askToFollowLink: z
    .string()
    .url("Invalid link URL")
    .startsWith("https://", "Only HTTPS links are allowed")
    .or(z.literal(""))
    .optional(),
});

export const respondToAllDmsSchema = baseAutomationSchema.extend({
  askToFollowEnabled: z.boolean(),
  askToFollowMessage: z.string().max(1000).optional(),
  askToFollowLink: z
    .string()
    .url("Invalid link URL")
    .startsWith("https://", "Only HTTPS links are allowed")
    .or(z.literal(""))
    .optional(),
});

export type CommentsFormValues = z.infer<typeof commentsAutomationSchema>;
export type StoryFormValues = z.infer<typeof storyAutomationSchema>;
export type RespondToAllDMsFormValues = z.infer<typeof respondToAllDmsSchema>;
