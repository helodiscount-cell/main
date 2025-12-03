/**
 * Webhook Zod Schemas
 * Defines validation schemas for webhook-related API endpoints
 */

import { z } from "zod";

// Webhook verification query parameters (GET request from Instagram)
export const WebhookVerificationQuerySchema = z.object({
  "hub.mode": z.literal("subscribe"),
  "hub.verify_token": z.string(),
  "hub.challenge": z.string(),
});

// Webhook comment change value
export const WebhookCommentValueSchema = z.object({
  id: z.string(),
  text: z.string().optional(),
  media: z
    .object({
      id: z.string(),
    })
    .optional(),
  media_id: z.string().optional(),
  from: z
    .object({
      id: z.string(),
      username: z.string().optional(),
    })
    .optional(),
});

// Webhook change object
export const WebhookChangeSchema = z.object({
  field: z.string(),
  value: z.any(),
});

// Webhook messaging event
export const WebhookMessagingEventSchema = z.object({
  sender: z.object({ id: z.string() }),
  recipient: z.object({ id: z.string() }),
  timestamp: z.number(),
  message: z
    .object({
      mid: z.string(),
      text: z.string(),
    })
    .optional(),
});

// Webhook entry object
export const WebhookEntrySchema = z.object({
  id: z.string(),
  time: z.number(),
  changes: z.array(WebhookChangeSchema).optional(),
  messaging: z.array(WebhookMessagingEventSchema).optional(),
});

// Complete webhook payload
export const WebhookPayloadSchema = z.object({
  object: z.string(),
  entry: z.array(WebhookEntrySchema),
});

// Webhook verification success response
export const WebhookVerificationResponseSchema = z.string();

// Webhook processing success response
export const WebhookProcessingResponseSchema = z.object({
  success: z.literal(true),
});

// Error response schema (removed to avoid duplicates)
// export const ErrorResponseSchema = z.object({
//   error: z.string(),
// });
