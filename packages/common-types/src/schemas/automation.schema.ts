/**
 * Automation Zod Schemas
 * Defines validation schemas for automation-related API endpoints
 */

import { z } from "zod";
import {
  sanitizeReplyMessage,
  sanitizeTriggers,
  sanitizePostCaption,
  sanitizeTrigger,
  MAX_LENGTHS,
} from "../lib/utils/sanitize";
import { sanitizeQueryParam } from "../lib/utils/validation";

const DmLinkSchema = z.object({
  title: z.string().min(1).max(100),
  url: z.string().url("Invalid link URL").max(2048),
});

// Embedded story target for creation payload
const StoryTargetInputSchema = z.object({
  id: z.string().min(1).max(100),
  mediaUrl: z.string().min(1).max(2048),
  mediaType: z.enum(["IMAGE", "VIDEO"]),
  caption: z.string().max(MAX_LENGTHS.POST_CAPTION).nullable().optional(),
  permalink: z.string().min(1).max(2048),
  timestamp: z.string().min(1).max(100),
});

// Input schema for creating a new automation
export const CreateAutomationSchema = z
  .object({
    triggerType: z
      .enum(["COMMENT_ON_POST", "STORY_REPLY"])
      .default("COMMENT_ON_POST"),
    // Array of public comment replies (optional, only used in DM flows)
    commentReplyWhenDm: z
      .array(
        z
          .string()
          .min(1)
          .max(
            MAX_LENGTHS.REPLY_MESSAGE,
            `Each comment reply must be no more than ${MAX_LENGTHS.REPLY_MESSAGE} characters`,
          )
          .transform((val) => sanitizeReplyMessage(val)),
      )
      .max(10, "Maximum 10 comment replies allowed")
      .optional(),
    postId: z
      .string()
      .min(1, "Post ID is required")
      .max(100, "Post ID must be no more than 100 characters")
      .transform((val) => sanitizeQueryParam(val, 100))
      .optional(),
    postCaption: z
      .string()
      .max(
        MAX_LENGTHS.POST_CAPTION,
        `Post caption must be no more than ${MAX_LENGTHS.POST_CAPTION} characters`,
      )
      .optional()
      .transform((val) => (val ? sanitizePostCaption(val) : null)),
    postMediaUrl: z.string().url().max(2048).optional().nullable(),
    postPermalink: z.string().url().max(2048).optional().nullable(),
    postTimestamp: z.string().max(100).optional().nullable(),
    story: StoryTargetInputSchema.optional(),
    triggers: z
      .array(
        z
          .string()
          .min(1, "Trigger cannot be empty")
          .max(
            MAX_LENGTHS.TRIGGER,
            `Trigger must be no more than ${MAX_LENGTHS.TRIGGER} characters`,
          )
          .transform((val) => sanitizeTrigger(val)),
      )
      .min(1, "At least one trigger is required")
      .max(
        MAX_LENGTHS.TRIGGERS_ARRAY,
        `Maximum ${MAX_LENGTHS.TRIGGERS_ARRAY} triggers allowed`,
      )
      .transform((val) => sanitizeTriggers(val)),
    matchType: z.enum(["CONTAINS", "EXACT", "REGEX"]).default("CONTAINS"),
    actionType: z.enum(["DM", "COMMENT_REPLY"]),
    // Single fixed DM message
    replyMessage: z
      .string()
      .min(1, "Reply message is required")
      .max(
        MAX_LENGTHS.REPLY_MESSAGE,
        `Reply message must be no more than ${MAX_LENGTHS.REPLY_MESSAGE} characters`,
      )
      .transform((val) => sanitizeReplyMessage(val)),
    replyImage: z.string().url("Invalid image URL").nullable().optional(),
    useVariables: z.boolean().default(true),
    // Ask to Follow gate — optional
    askToFollowEnabled: z.boolean().default(false),
    askToFollowMessage: z.string().max(1000).optional().nullable(),
    askToFollowLink: z.string().max(2048).optional().nullable(),
    // Opening Message
    openingMessageEnabled: z.boolean().default(true),
    openingMessage: z.string().max(2000).optional().nullable(),
    openingButtonText: z.string().max(100).optional().nullable(),
    dmLinks: z.array(DmLinkSchema).max(3, "Maximum 3 links allowed").optional(),
  })
  .refine(
    (data) => {
      if (data.triggerType === "COMMENT_ON_POST") return !!data.postId;
      if (data.triggerType === "STORY_REPLY") return !!data.story;
      return true;
    },
    {
      message:
        "Post ID is required for comment automations; story data is required for story automations.",
      path: ["postId"],
    },
  );

// Input schema for updating an existing automation
export const UpdateAutomationSchema = z.object({
  triggers: z
    .array(
      z
        .string()
        .min(1, "Trigger cannot be empty")
        .max(
          MAX_LENGTHS.TRIGGER,
          `Trigger must be no more than ${MAX_LENGTHS.TRIGGER} characters`,
        )
        .transform((val) => sanitizeTrigger(val)),
    )
    .max(
      MAX_LENGTHS.TRIGGERS_ARRAY,
      `Maximum ${MAX_LENGTHS.TRIGGERS_ARRAY} triggers allowed`,
    )
    .transform((val) => sanitizeTriggers(val))
    .optional(),
  matchType: z.enum(["CONTAINS", "EXACT", "REGEX"]).optional(),
  actionType: z.enum(["DM", "COMMENT_REPLY"]).optional(),
  // Single fixed DM message
  replyMessage: z
    .string()
    .min(1, "Reply message cannot be empty")
    .max(
      MAX_LENGTHS.REPLY_MESSAGE,
      `Reply message must be no more than ${MAX_LENGTHS.REPLY_MESSAGE} characters`,
    )
    .transform((val) => sanitizeReplyMessage(val))
    .optional(),
  // Array of public comment replies (optional)
  commentReplyWhenDm: z
    .array(
      z
        .string()
        .min(1)
        .max(
          MAX_LENGTHS.REPLY_MESSAGE,
          `Each comment reply must be no more than ${MAX_LENGTHS.REPLY_MESSAGE} characters`,
        )
        .transform((val) => sanitizeReplyMessage(val)),
    )
    .max(10, "Maximum 10 comment replies allowed")
    .optional(),
  replyImage: z.string().url("Invalid image URL").nullable().optional(),
  askToFollowEnabled: z.boolean().optional(),
  askToFollowMessage: z.string().max(1000).optional().nullable(),
  askToFollowLink: z.string().max(2048).optional().nullable(),
  openingMessageEnabled: z.boolean().optional(),
  openingMessage: z.string().max(2000).optional().nullable(),
  openingButtonText: z.string().max(100).optional().nullable(),
  dmLinks: z.array(DmLinkSchema).max(3, "Maximum 3 links allowed").optional(),
  status: z.enum(["ACTIVE", "PAUSED", "DELETED"]).optional(),
});

// Query parameters for listing automations
export const AutomationListQuerySchema = z.object({
  status: z
    .enum(["ACTIVE", "PAUSED", "DELETED"])
    .optional()
    .transform((val) => (val ? sanitizeQueryParam(val, 20) : undefined)),
  postId: z
    .string()
    .optional()
    .transform((val) => (val ? sanitizeQueryParam(val, 100) : undefined)),
  page: z
    .string()
    .optional()
    .transform((val) => {
      const page = val ? parseInt(val, 10) : 1;
      return Math.max(1, isNaN(page) ? 1 : page);
    }),
  limit: z
    .string()
    .optional()
    .transform((val) => {
      const limit = val ? parseInt(val, 10) : 20;
      const parsed = isNaN(limit) ? 20 : limit;
      // Enforces maximum page size of 100
      return Math.min(100, Math.max(1, parsed));
    }),
});

// Single automation response schema
export const AutomationResponseSchema = z.object({
  id: z.string(),
  postId: z.string(),
  postCaption: z.string().nullable(),
  triggers: z.array(z.string()),
  matchType: z.enum(["CONTAINS", "EXACT", "REGEX"]),
  actionType: z.enum(["DM", "COMMENT_REPLY"]),
  replyMessage: z.string(),
  replyImage: z.string().nullable().optional(),
  commentReplyWhenDm: z.array(z.string()).optional(),
  askToFollowEnabled: z.boolean().optional(),
  askToFollowMessage: z.string().max(1000).optional().nullable(),
  askToFollowLink: z.string().max(2048).optional().nullable(),
  openingMessageEnabled: z.boolean().optional(),
  openingMessage: z.string().nullable().optional(),
  openingButtonText: z.string().nullable().optional(),
  dmLinks: z.array(DmLinkSchema).optional(),
  status: z.enum(["ACTIVE", "PAUSED", "DELETED"]),
  timesTriggered: z.number(),
  lastTriggeredAt: z.date().nullable(),
  createdAt: z.date(),
  updatedAt: z.date(),
  useVariables: z.boolean(),
});

// Execution record schema
export const ExecutionRecordSchema = z.object({
  id: z.string(),
  automationId: z.string(),
  commentId: z.string(),
  commentText: z.string(),
  commenterId: z.string(),
  commenterUsername: z.string(),
  actionType: z.enum(["DM", "COMMENT_REPLY"]),
  replyText: z.string(),
  success: z.boolean(),
  error: z.string().nullable(),
  executedAt: z.date(),
});

// Automation detail response (includes executions)
export const AutomationDetailResponseSchema = z.object({
  success: z.literal(true),
  data: AutomationResponseSchema.extend({
    recentExecutions: z.array(ExecutionRecordSchema).optional(),
    totalExecutions: z.number().optional(),
  }),
});

// Automation list response schema
export const AutomationListResponseSchema = z.object({
  success: z.literal(true),
  automations: z.array(
    AutomationResponseSchema.extend({
      executionsCount: z.number().optional(),
    }),
  ),
});

// Create automation success response
export const CreateAutomationResponseSchema = z.object({
  success: z.literal(true),
  automation: z.object({
    id: z.string(),
    postId: z.string(),
    actionType: z.enum(["DM", "COMMENT_REPLY"]),
    triggers: z.array(z.string()),
    replyMessage: z.string(),
    createdAt: z.date(),
  }),
});

// Update automation success response
export const UpdateAutomationResponseSchema = z.object({
  success: z.literal(true),
  automation: z.object({
    id: z.string(),
    postId: z.string(),
    triggers: z.array(z.string()),
    matchType: z.enum(["CONTAINS", "EXACT", "REGEX"]),
    actionType: z.enum(["DM", "COMMENT_REPLY"]),
    replyMessage: z.string(),
    commentReplyWhenDm: z.array(z.string()).optional(),
    askToFollowEnabled: z.boolean().optional(),
    askToFollowMessage: z.string().max(1000).optional().nullable(),
    askToFollowLink: z.string().max(2048).optional().nullable(),
    openingMessageEnabled: z.boolean().optional(),
    openingMessage: z.string().nullable().optional(),
    openingButtonText: z.string().nullable().optional(),
    dmLinks: z.array(DmLinkSchema).optional(),
    status: z.enum(["ACTIVE", "PAUSED", "DELETED"]),
    updatedAt: z.date(),
  }),
});

// Delete automation success response
export const DeleteAutomationResponseSchema = z.object({
  success: z.literal(true),
  message: z.string(),
});

// Error response schema
export const ErrorResponseSchema = z.object({
  success: z.literal(false),
  error: z.string(),
  details: z.string().optional(),
});
