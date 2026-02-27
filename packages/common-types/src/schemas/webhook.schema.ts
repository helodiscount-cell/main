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
  value: z.object(WebhookCommentValueSchema),
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

// Webhook entry object for posts/reels (comments)
export const WebhookEntryOfPostsSchema = z.object({
  id: z.string().optional(),
  time: z.number(),
  changes: z.array(WebhookChangeSchema),
});

// Complete webhook payload for posts/reels
export const WebhookPayloadOfPostsSchema = z.object({
  object: z.string(),
  entry: z.array(WebhookEntryOfPostsSchema),
});

// Webhook entry object for stories (messaging)
export const WebhookEntryOfStoriesSchema = z.object({
  id: z.string().optional(),
  time: z.number(),
  messaging: z.array(WebhookMessagingEventSchema),
});

// Complete webhook payload for stories
export const WebhookPayloadOfStoriesSchema = z.object({
  object: z.string(),
  entry: z.array(WebhookEntryOfStoriesSchema),
});

// For backward compatibility / generic processing
export const WebhookEntrySchema = z.union([
  WebhookEntryOfPostsSchema,
  WebhookEntryOfStoriesSchema,
]);

export const WebhookPayloadSchema = z.union([
  WebhookPayloadOfPostsSchema,
  WebhookPayloadOfStoriesSchema,
]);

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
