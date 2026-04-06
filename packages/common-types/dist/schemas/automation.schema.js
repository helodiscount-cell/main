"use strict";
/**
 * Automation Zod Schemas
 * Defines validation schemas for automation-related API endpoints
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.ErrorResponseSchema =
  exports.DeleteAutomationResponseSchema =
  exports.UpdateAutomationResponseSchema =
  exports.CreateAutomationResponseSchema =
  exports.AutomationListResponseSchema =
  exports.AutomationDetailResponseSchema =
  exports.ExecutionRecordSchema =
  exports.AutomationResponseSchema =
  exports.AutomationListQuerySchema =
  exports.UpdateAutomationSchema =
  exports.CreateAutomationSchema =
  exports.DmLinkSchema =
    void 0;
const zod_1 = require("zod");
const sanitize_1 = require("../lib/utils/sanitize");
const validation_1 = require("../lib/utils/validation");
// Embedded story target for creation payload
const StoryTargetInputSchema = zod_1.z.object({
  id: zod_1.z.string().min(1).max(100),
  mediaUrl: zod_1.z.string().min(1).max(2048),
  mediaType: zod_1.z.enum(["IMAGE", "VIDEO"]),
  thumbnailUrl: zod_1.z.string().url().max(2048).optional().nullable(),
  caption: zod_1.z
    .string()
    .max(sanitize_1.MAX_LENGTHS.POST_CAPTION)
    .nullable()
    .optional(),
  permalink: zod_1.z.string().min(1).max(2048),
  timestamp: zod_1.z.string().min(1).max(100),
});
exports.DmLinkSchema = zod_1.z.object({
  title: zod_1.z
    .string()
    .transform((val) => (0, sanitize_1.sanitizeText)(val))
    .refine((s) => s.length >= 1, {
      message: "Title cannot be empty after sanitization",
    })
    .refine((s) => s.length <= 100, {
      message: "Title must be no more than 100 characters",
    }),
  url: zod_1.z.string().url("Invalid link URL").max(2048),
});
// Input schema for creating a new automation
exports.CreateAutomationSchema = zod_1.z
  .object({
    triggerType: zod_1.z
      .enum(["COMMENT_ON_POST", "STORY_REPLY", "RESPOND_TO_ALL_DMS"])
      .default("COMMENT_ON_POST"),
    automationName: zod_1.z
      .string()
      .transform((val) => (0, sanitize_1.sanitizeText)(val))
      .refine((s) => s.length >= 1, {
        message: "Please define a name for this automation",
      })
      .refine((s) => s.length <= 100, {
        message: "Automation name must be no more than 100 characters",
      }),
    // Array of public comment replies (optional, only used in DM flows)
    commentReplyWhenDm: zod_1.z
      .array(
        zod_1.z
          .string()
          .refine((s) => s.length <= sanitize_1.MAX_LENGTHS.REPLY_MESSAGE, {
            message: `Each comment reply must be no more than ${sanitize_1.MAX_LENGTHS.REPLY_MESSAGE} characters`,
          })
          .transform((val) => (0, sanitize_1.sanitizeReplyMessage)(val))
          .refine((s) => s.length >= 1, {
            message: "Comment reply cannot be empty after sanitization",
          }),
      )
      .max(10, "Maximum 10 comment replies allowed")
      .optional(),
    postId: zod_1.z
      .string()
      .min(1, "Post ID is required")
      .max(100, "Post ID must be no more than 100 characters")
      .transform((val) => (0, validation_1.sanitizeQueryParam)(val, 100))
      .optional(),
    postCaption: zod_1.z
      .string()
      .max(
        sanitize_1.MAX_LENGTHS.POST_CAPTION,
        `Post caption must be no more than ${sanitize_1.MAX_LENGTHS.POST_CAPTION} characters`,
      )
      .optional()
      .transform((val) =>
        val ? (0, sanitize_1.sanitizePostCaption)(val) : null,
      ),
    postMediaUrl: zod_1.z.string().url().max(2048).optional().nullable(),
    postMediaType: zod_1.z.string().max(100).optional().nullable(),
    postThumbnailUrl: zod_1.z.string().url().max(2048).optional().nullable(),
    postPermalink: zod_1.z.string().url().max(2048).optional().nullable(),
    postTimestamp: zod_1.z.string().max(100).optional().nullable(),
    story: StoryTargetInputSchema.optional(),
    triggers: zod_1.z
      .array(
        zod_1.z
          .string()
          .refine((s) => s.length <= sanitize_1.MAX_LENGTHS.TRIGGER, {
            message: `Trigger must be no more than ${sanitize_1.MAX_LENGTHS.TRIGGER} characters`,
          })
          .transform((val) => (0, sanitize_1.sanitizeTrigger)(val))
          .refine((s) => s.length >= 1, {
            message: "Trigger cannot be empty after sanitization",
          }),
      )
      .max(
        sanitize_1.MAX_LENGTHS.TRIGGERS_ARRAY,
        `Maximum ${sanitize_1.MAX_LENGTHS.TRIGGERS_ARRAY} triggers allowed`,
      )
      .transform((val) => (0, sanitize_1.sanitizeTriggers)(val)),
    matchType: zod_1.z.enum(["CONTAINS", "EXACT", "REGEX"]).default("CONTAINS"),
    actionType: zod_1.z.enum(["DM", "COMMENT_REPLY"]),
    // Single fixed DM message
    replyMessage: zod_1.z
      .string()
      .refine((s) => s.length <= sanitize_1.MAX_LENGTHS.REPLY_MESSAGE, {
        message: `Reply message must be no more than ${sanitize_1.MAX_LENGTHS.REPLY_MESSAGE} characters`,
      })
      .transform((val) => (0, sanitize_1.sanitizeReplyMessage)(val))
      .refine((s) => s.length >= 1, {
        message: "Reply message is required and cannot be just angle brackets",
      }),
    replyImage: zod_1.z
      .preprocess(
        (val) => (val === "" ? null : val),
        zod_1.z.string().url("Invalid image URL").nullable(),
      )
      .optional(),
    useVariables: zod_1.z.boolean().default(true),
    // Ask to Follow gate — optional
    askToFollowEnabled: zod_1.z.boolean().default(false),
    askToFollowMessage: zod_1.z
      .string()
      .max(1000)
      .optional()
      .nullable()
      .transform((val) =>
        val === undefined
          ? undefined
          : val
            ? (0, sanitize_1.sanitizeText)(val) || null
            : null,
      ),
    askToFollowLink: zod_1.z
      .string()
      .max(2048)
      .optional()
      .nullable()
      .transform((val) =>
        val === undefined
          ? undefined
          : val
            ? (0, sanitize_1.sanitizeText)(val) || null
            : null,
      ),
    // Opening Message
    openingMessageEnabled: zod_1.z.boolean().default(true),
    openingMessage: zod_1.z
      .string()
      .max(2000)
      .optional()
      .nullable()
      .transform((val) =>
        val === undefined
          ? undefined
          : val
            ? (0, sanitize_1.sanitizeText)(val) || null
            : null,
      ),
    openingButtonText: zod_1.z
      .string()
      .max(100)
      .optional()
      .nullable()
      .transform((val) =>
        val === undefined
          ? undefined
          : val
            ? (0, sanitize_1.sanitizeText)(val) || null
            : null,
      ),
    dmLinks: zod_1.z
      .array(exports.DmLinkSchema)
      .max(3, "Maximum 3 links allowed")
      .optional(),
  })
  .refine(
    (data) => {
      if (data.triggerType === "COMMENT_ON_POST") return !!data.postId;
      if (data.triggerType === "STORY_REPLY") return !!data.story;
      if (data.triggerType === "RESPOND_TO_ALL_DMS") return true;
      return true;
    },
    {
      message:
        "Post ID is required for comment automations; story data is required for story automations.",
      path: ["postId"],
    },
  );
// Input schema for updating an existing automation
exports.UpdateAutomationSchema = zod_1.z.object({
  automationName: zod_1.z
    .string()
    .transform((val) => (0, sanitize_1.sanitizeText)(val))
    .refine((s) => s.length >= 1, {
      message: "Please define a name for this automation",
    })
    .refine((s) => s.length <= 100, {
      message: "Automation name must be no more than 100 characters",
    })
    .optional(),
  triggers: zod_1.z
    .array(
      zod_1.z
        .string()
        .refine((s) => s.length <= sanitize_1.MAX_LENGTHS.TRIGGER, {
          message: `Trigger must be no more than ${sanitize_1.MAX_LENGTHS.TRIGGER} characters`,
        })
        .transform((val) => (0, sanitize_1.sanitizeTrigger)(val))
        .refine((s) => s.length >= 1, {
          message: "Trigger cannot be empty after sanitization",
        }),
    )
    .max(
      sanitize_1.MAX_LENGTHS.TRIGGERS_ARRAY,
      `Maximum ${sanitize_1.MAX_LENGTHS.TRIGGERS_ARRAY} triggers allowed`,
    )
    .transform((val) => (0, sanitize_1.sanitizeTriggers)(val))
    .optional(),
  matchType: zod_1.z.enum(["CONTAINS", "EXACT", "REGEX"]).optional(),
  actionType: zod_1.z.enum(["DM", "COMMENT_REPLY"]).optional(),
  // Single fixed DM message
  replyMessage: zod_1.z
    .string()
    .refine((s) => s.length <= sanitize_1.MAX_LENGTHS.REPLY_MESSAGE, {
      message: `Reply message must be no more than ${sanitize_1.MAX_LENGTHS.REPLY_MESSAGE} characters`,
    })
    .transform((val) => (0, sanitize_1.sanitizeReplyMessage)(val))
    .refine((s) => s.length >= 1, {
      message: "Reply message is required and cannot be just angle brackets",
    })
    .optional(),
  // Array of public comment replies (optional)
  commentReplyWhenDm: zod_1.z
    .array(
      zod_1.z
        .string()
        .refine((s) => s.length <= sanitize_1.MAX_LENGTHS.REPLY_MESSAGE, {
          message: `Each comment reply must be no more than ${sanitize_1.MAX_LENGTHS.REPLY_MESSAGE} characters`,
        })
        .transform((val) => (0, sanitize_1.sanitizeReplyMessage)(val))
        .refine((s) => s.length >= 1, {
          message: "Comment reply cannot be empty after sanitization",
        }),
    )
    .max(10, "Maximum 10 comment replies allowed")
    .optional(),
  replyImage: zod_1.z
    .preprocess(
      (val) => (val === "" ? null : val),
      zod_1.z.string().url("Invalid image URL").nullable(),
    )
    .optional(),
  askToFollowEnabled: zod_1.z.boolean().optional(),
  askToFollowMessage: zod_1.z
    .string()
    .max(1000)
    .optional()
    .nullable()
    .transform((val) =>
      val === undefined
        ? undefined
        : val
          ? (0, sanitize_1.sanitizeText)(val) || null
          : null,
    ),
  askToFollowLink: zod_1.z
    .string()
    .max(2048)
    .optional()
    .nullable()
    .transform((val) =>
      val === undefined
        ? undefined
        : val
          ? (0, sanitize_1.sanitizeText)(val) || null
          : null,
    ),
  openingMessageEnabled: zod_1.z.boolean().optional(),
  openingMessage: zod_1.z
    .string()
    .max(2000)
    .optional()
    .nullable()
    .transform((val) =>
      val === undefined
        ? undefined
        : val
          ? (0, sanitize_1.sanitizeText)(val) || null
          : null,
    ),
  openingButtonText: zod_1.z
    .string()
    .max(100)
    .optional()
    .nullable()
    .transform((val) =>
      val === undefined
        ? undefined
        : val
          ? (0, sanitize_1.sanitizeText)(val) || null
          : null,
    ),
  dmLinks: zod_1.z
    .array(exports.DmLinkSchema)
    .max(3, "Maximum 3 links allowed")
    .optional(),
  status: zod_1.z.enum(["ACTIVE", "PAUSED", "DELETED"]).optional(),
});
// Query parameters for listing automations
exports.AutomationListQuerySchema = zod_1.z.object({
  status: zod_1.z
    .enum(["ACTIVE", "PAUSED", "DELETED"])
    .optional()
    .transform((val) =>
      val ? (0, validation_1.sanitizeQueryParam)(val, 20) : undefined,
    ),
  postId: zod_1.z
    .string()
    .optional()
    .transform((val) =>
      val ? (0, validation_1.sanitizeQueryParam)(val, 100) : undefined,
    ),
  page: zod_1.z
    .string()
    .optional()
    .transform((val) => {
      const page = val ? parseInt(val, 10) : 1;
      return Math.max(1, isNaN(page) ? 1 : page);
    }),
  limit: zod_1.z
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
exports.AutomationResponseSchema = zod_1.z.object({
  id: zod_1.z.string(),
  automationName: zod_1.z.string().nullable(),
  postId: zod_1.z.string(),
  postCaption: zod_1.z.string().nullable(),
  triggers: zod_1.z.array(zod_1.z.string()),
  matchType: zod_1.z.enum(["CONTAINS", "EXACT", "REGEX"]),
  actionType: zod_1.z.enum(["DM", "COMMENT_REPLY"]),
  replyMessage: zod_1.z.string(),
  replyImage: zod_1.z.string().nullable().optional(),
  commentReplyWhenDm: zod_1.z.array(zod_1.z.string()).optional(),
  askToFollowEnabled: zod_1.z.boolean().optional(),
  askToFollowMessage: zod_1.z.string().max(1000).optional().nullable(),
  askToFollowLink: zod_1.z.string().optional().nullable(),
  openingMessageEnabled: zod_1.z.boolean().optional(),
  openingMessage: zod_1.z.string().nullable().optional(),
  openingButtonText: zod_1.z.string().nullable().optional(),
  dmLinks: zod_1.z.array(exports.DmLinkSchema).optional(),
  status: zod_1.z.enum(["ACTIVE", "PAUSED", "DELETED"]),
  timesTriggered: zod_1.z.number(),
  lastTriggeredAt: zod_1.z.date().nullable(),
  createdAt: zod_1.z.date(),
  updatedAt: zod_1.z.date(),
  useVariables: zod_1.z.boolean(),
});
// Execution record schema
exports.ExecutionRecordSchema = zod_1.z.object({
  id: zod_1.z.string(),
  automationId: zod_1.z.string(),
  commentId: zod_1.z.string(),
  commentText: zod_1.z.string(),
  commenterId: zod_1.z.string(),
  commenterUsername: zod_1.z.string(),
  actionType: zod_1.z.enum(["DM", "COMMENT_REPLY"]),
  replyText: zod_1.z.string(),
  success: zod_1.z.boolean(),
  error: zod_1.z.string().nullable(),
  executedAt: zod_1.z.date(),
});
// Automation detail response (includes executions)
exports.AutomationDetailResponseSchema = zod_1.z.object({
  success: zod_1.z.literal(true),
  data: exports.AutomationResponseSchema.extend({
    recentExecutions: zod_1.z.array(exports.ExecutionRecordSchema).optional(),
    totalExecutions: zod_1.z.number().optional(),
  }),
});
// Automation list response schema
exports.AutomationListResponseSchema = zod_1.z.object({
  success: zod_1.z.literal(true),
  automations: zod_1.z.array(
    exports.AutomationResponseSchema.extend({
      executionsCount: zod_1.z.number().optional(),
    }),
  ),
});
// Create automation success response
exports.CreateAutomationResponseSchema = zod_1.z.object({
  success: zod_1.z.literal(true),
  automation: zod_1.z.object({
    id: zod_1.z.string(),
    automationName: zod_1.z.string(),
    postId: zod_1.z.string(),
    actionType: zod_1.z.enum(["DM", "COMMENT_REPLY"]),
    triggers: zod_1.z.array(zod_1.z.string()),
    replyMessage: zod_1.z.string(),
    createdAt: zod_1.z.date(),
  }),
});
// Update automation success response
exports.UpdateAutomationResponseSchema = zod_1.z.object({
  success: zod_1.z.literal(true),
  automation: zod_1.z.object({
    id: zod_1.z.string(),
    automationName: zod_1.z.string().nullable(),
    postId: zod_1.z.string(),
    triggers: zod_1.z.array(zod_1.z.string()),
    matchType: zod_1.z.enum(["CONTAINS", "EXACT", "REGEX"]),
    actionType: zod_1.z.enum(["DM", "COMMENT_REPLY"]),
    replyMessage: zod_1.z.string(),
    commentReplyWhenDm: zod_1.z.array(zod_1.z.string()).optional(),
    askToFollowEnabled: zod_1.z.boolean().optional(),
    askToFollowMessage: zod_1.z.string().max(1000).optional().nullable(),
    askToFollowLink: zod_1.z.string().optional().nullable(),
    openingMessageEnabled: zod_1.z.boolean().optional(),
    openingMessage: zod_1.z.string().nullable().optional(),
    openingButtonText: zod_1.z.string().nullable().optional(),
    dmLinks: zod_1.z.array(exports.DmLinkSchema).optional(),
    status: zod_1.z.enum(["ACTIVE", "PAUSED", "DELETED"]),
    updatedAt: zod_1.z.date(),
  }),
});
// Delete automation success response
exports.DeleteAutomationResponseSchema = zod_1.z.object({
  success: zod_1.z.literal(true),
  message: zod_1.z.string(),
});
// Error response schema
exports.ErrorResponseSchema = zod_1.z.object({
  success: zod_1.z.literal(false),
  error: zod_1.z.string(),
  details: zod_1.z.string().optional(),
});
