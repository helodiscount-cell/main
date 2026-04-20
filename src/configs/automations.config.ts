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

export const WIDGET_MESSAGE_LIMIT = 500;
export const PUBLIC_REPLY_LIMIT = 200;

export const baseAutomationSchema = z.object({
  automationName: z.string().min(1, "Please define a name for this automation"),
  anyKeyword: z.boolean().default(false),
  keywords: z.array(z.string()),
  dmMessage: z
    .string()
    .min(
      FORM_VALIDATION_MESSAGES.dmMessage.min,
      FORM_VALIDATION_MESSAGES.dmMessage.message,
    )
    .max(1000),
  dmImage: z.string().optional(),
  openingMessageEnabled: z.boolean().default(false),
  openingMessage: z.string().max(WIDGET_MESSAGE_LIMIT).optional(),
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

export const askToFollowSchema = z.object({
  askToFollowEnabled: z.boolean(),
  askToFollowMessage: z.string().max(WIDGET_MESSAGE_LIMIT).optional(),
  askToFollowLink: z
    .string()
    .url("Invalid link URL")
    .startsWith("https://", "Only HTTPS links are allowed")
    .or(z.literal(""))
    .optional(),
});

export const commentsAutomationSchema = applyAutomationRefinements(
  baseAutomationSchema
    .extend({
      publicReplyEnabled: z.boolean(),
      publicReplies: z.array(
        z.object({ id: z.string(), text: z.string().max(PUBLIC_REPLY_LIMIT) }),
      ),
    })
    .extend(askToFollowSchema.shape),
);

export const storyAutomationSchema = applyAutomationRefinements(
  baseAutomationSchema.extend(askToFollowSchema.shape),
);

export const respondToAllDmsSchema = applyAutomationRefinements(
  baseAutomationSchema.extend(askToFollowSchema.shape),
);

/**
 * Common refinements for automation schemas to ensure consistency across different triggers.
 * Blocks submission if enabled features have empty content.
 */
function applyAutomationRefinements<T extends z.ZodRawShape>(
  schema: z.ZodObject<T>,
) {
  return schema
    .refine(
      (data: any) => {
        if (!data.anyKeyword) {
          return data.keywords && data.keywords.length > 0;
        }
        return true;
      },
      {
        message: "Add at least one keyword to continue.",
        path: ["keywords"],
      },
    )
    .refine(
      (data: any) => {
        if (data.openingMessageEnabled) {
          return !!data.openingMessage?.trim();
        }
        return true;
      },
      {
        message: "Opening message cannot be empty when enabled",
        path: ["openingMessage"],
      },
    )
    .refine(
      (data: any) => {
        if (data.openingMessageEnabled) {
          return !!data.openingButtonText?.trim();
        }
        return true;
      },
      {
        message: "Opening button text cannot be empty when enabled",
        path: ["openingButtonText"],
      },
    )
    .refine(
      (data: any) => {
        if (data.askToFollowEnabled) {
          return !!data.askToFollowMessage?.trim();
        }
        return true;
      },
      {
        message: "Follow message cannot be empty when enabled",
        path: ["askToFollowMessage"],
      },
    );
}

export type CommentsFormValues = z.infer<typeof commentsAutomationSchema>;
export type StoryFormValues = z.infer<typeof storyAutomationSchema>;
export type RespondToAllDMsFormValues = z.infer<typeof respondToAllDmsSchema>;
