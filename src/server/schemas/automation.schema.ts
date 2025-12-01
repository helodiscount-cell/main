/**
 * Automation Zod Schemas
 * Defines validation schemas for automation-related API endpoints
 */

import { z } from "zod";

// Input schema for creating a new automation
export const CreateAutomationSchema = z.object({
  postId: z.string().min(1, "Post ID is required"),
  postCaption: z.string().optional(),
  triggers: z
    .array(z.string().min(1))
    .min(1, "At least one trigger is required"),
  matchType: z.enum(["CONTAINS", "EXACT", "REGEX"]).default("CONTAINS"),
  actionType: z.enum(["DM", "COMMENT_REPLY"]),
  replyMessage: z.string().min(1, "Reply message is required"),
  useVariables: z.boolean().default(true),
});

// Input schema for updating an existing automation
export const UpdateAutomationSchema = z.object({
  triggers: z.array(z.string().min(1)).optional(),
  matchType: z.enum(["CONTAINS", "EXACT", "REGEX"]).optional(),
  actionType: z.enum(["DM", "COMMENT_REPLY"]).optional(),
  replyMessage: z.string().min(1).optional(),
  status: z.enum(["ACTIVE", "PAUSED", "DELETED"]).optional(),
});

// Query parameters for listing automations
export const AutomationListQuerySchema = z.object({
  status: z.enum(["ACTIVE", "PAUSED", "DELETED"]).optional(),
  postId: z.string().optional(),
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
  automation: AutomationResponseSchema.extend({
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
    })
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
