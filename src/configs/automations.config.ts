import { z } from "zod";
import { ASK_TO_FOLLOW_CONFIG, OPENING_MESSAGE_CONFIG } from "./widgets.config";
import { AutomationListItem } from "@/api/services/automations/types";

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

export const UPDATE_SUCCESS_MESSAGE = "Automation updated successfully!";

// Default reply seed used in comments automation, shared across create + edit
export const DEFAULT_REPLY_ID = "default-reply-1";
export const DEFAULT_REPLY_TEXT = "Open your DMs, it's there!";

// Send DM widget limits
export const SEND_DM_CONFIG = {
  MAX_CHARS_WITHOUT_IMAGE: 1000,
  MAX_CHARS_WITH_IMAGE: 500,
  MAX_LINKS: 3,
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
// Minimal type covering the shared fields validated across all automation schemas
interface BaseRefinementData {
  anyKeyword?: boolean;
  keywords?: string[];
  openingMessageEnabled?: boolean;
  openingMessage?: string;
  openingButtonText?: string;
  askToFollowEnabled?: boolean;
  askToFollowMessage?: string;
}

function applyAutomationRefinements<T extends z.ZodRawShape>(
  schema: z.ZodObject<T>,
) {
  return schema
    .refine(
      (data: BaseRefinementData) => {
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
      (data: BaseRefinementData) => {
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
      (data: BaseRefinementData) => {
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
      (data: BaseRefinementData) => {
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

// Base default values shared by all automation types
const BASE_DEFAULT_VALUES = {
  automationName: "",
  anyKeyword: false,
  keywords: [] as string[],
  dmMessage: "",
  askToFollowEnabled: false,
  askToFollowMessage: ASK_TO_FOLLOW_CONFIG.DEFAULT_MESSAGE,
  askToFollowLink: "",
  openingMessageEnabled: false,
  openingMessage: OPENING_MESSAGE_CONFIG.DEFAULT_MESSAGE,
  openingButtonText: OPENING_MESSAGE_CONFIG.DEFAULT_BUTTON_TEXT,
  dmLinks: [] as { title: string; url: string }[],
};

export const COMMENTS_DEFAULT_VALUES: CommentsFormValues = {
  ...BASE_DEFAULT_VALUES,
  publicReplyEnabled: false,
  publicReplies: [{ id: DEFAULT_REPLY_ID, text: DEFAULT_REPLY_TEXT }],
};

export const STORY_DEFAULT_VALUES: StoryFormValues = { ...BASE_DEFAULT_VALUES };

export const DMS_DEFAULT_VALUES: RespondToAllDMsFormValues = {
  ...BASE_DEFAULT_VALUES,
};

// Populates base form fields from a fetched automation (shared across story + DMs edit)
export function populateBaseForm(
  automation: AutomationListItem,
): Omit<RespondToAllDMsFormValues, never> {
  return {
    automationName: automation.automationName ?? "",
    anyKeyword:
      ((automation as unknown as Record<string, unknown>)
        .anyKeyword as boolean) ?? automation.triggers?.length === 0,
    keywords: automation.triggers ?? [],
    dmMessage: automation.replyMessage ?? "",
    dmImage: automation.replyImage ?? undefined,
    dmLinks:
      ((automation as unknown as Record<string, unknown>).dmLinks as {
        title: string;
        url: string;
      }[]) ?? [],
    askToFollowEnabled: automation.askToFollowEnabled ?? false,
    askToFollowMessage:
      automation.askToFollowMessage ?? ASK_TO_FOLLOW_CONFIG.DEFAULT_MESSAGE,
    askToFollowLink: automation.askToFollowLink ?? "",
    openingMessageEnabled: automation.openingMessageEnabled ?? false,
    openingMessage:
      automation.openingMessage ?? OPENING_MESSAGE_CONFIG.DEFAULT_MESSAGE,
    openingButtonText:
      automation.openingButtonText ??
      OPENING_MESSAGE_CONFIG.DEFAULT_BUTTON_TEXT,
  };
}

// Extends base populate with comments-specific publicReplies fields
export function populateCommentsForm(
  automation: AutomationListItem,
): CommentsFormValues {
  const hasPublicReplies =
    !!automation.commentReplyWhenDm && automation.commentReplyWhenDm.length > 0;
  return {
    ...populateBaseForm(automation),
    publicReplyEnabled: hasPublicReplies,
    publicReplies: hasPublicReplies
      ? (automation.commentReplyWhenDm as string[]).map((text) => ({
          id: crypto.randomUUID(),
          text,
        }))
      : [{ id: DEFAULT_REPLY_ID, text: DEFAULT_REPLY_TEXT }],
  };
}
