"use strict";
/**
 * Webhook Zod Schemas
 * Defines validation schemas for webhook-related API endpoints
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.WebhookProcessingResponseSchema =
  exports.WebhookVerificationResponseSchema =
  exports.WebhookPayloadSchema =
  exports.WebhookEntrySchema =
  exports.WebhookPayloadOfStoriesSchema =
  exports.WebhookEntryOfStoriesSchema =
  exports.WebhookPayloadOfPostsSchema =
  exports.WebhookEntryOfPostsSchema =
  exports.WebhookMessagingEventSchema =
  exports.WebhookChangeSchema =
  exports.WebhookCommentValueSchema =
  exports.WebhookVerificationQuerySchema =
    void 0;
const zod_1 = require("zod");
// Webhook verification query parameters (GET request from Instagram)
exports.WebhookVerificationQuerySchema = zod_1.z.object({
  "hub.mode": zod_1.z.literal("subscribe"),
  "hub.verify_token": zod_1.z.string(),
  "hub.challenge": zod_1.z.string(),
});
// Webhook comment change value
exports.WebhookCommentValueSchema = zod_1.z.object({
  id: zod_1.z.string(),
  text: zod_1.z.string().optional(),
  media: zod_1.z
    .object({
      id: zod_1.z.string(),
    })
    .optional(),
  media_id: zod_1.z.string().optional(),
  from: zod_1.z
    .object({
      id: zod_1.z.string(),
      username: zod_1.z.string().optional(),
    })
    .optional(),
});
// Webhook change object
exports.WebhookChangeSchema = zod_1.z.object({
  field: zod_1.z.string(),
  value: zod_1.z.object(exports.WebhookCommentValueSchema),
});
// Webhook messaging event
exports.WebhookMessagingEventSchema = zod_1.z.object({
  sender: zod_1.z.object({ id: zod_1.z.string() }),
  recipient: zod_1.z.object({ id: zod_1.z.string() }),
  timestamp: zod_1.z.number(),
  message: zod_1.z
    .object({
      mid: zod_1.z.string(),
      text: zod_1.z.string(),
    })
    .optional(),
});
// Webhook entry object for posts/reels (comments)
exports.WebhookEntryOfPostsSchema = zod_1.z.object({
  id: zod_1.z.string().optional(),
  time: zod_1.z.number(),
  changes: zod_1.z.array(exports.WebhookChangeSchema),
});
// Complete webhook payload for posts/reels
exports.WebhookPayloadOfPostsSchema = zod_1.z.object({
  object: zod_1.z.string(),
  entry: zod_1.z.array(exports.WebhookEntryOfPostsSchema),
});
// Webhook entry object for stories (messaging)
exports.WebhookEntryOfStoriesSchema = zod_1.z.object({
  id: zod_1.z.string().optional(),
  time: zod_1.z.number(),
  messaging: zod_1.z.array(exports.WebhookMessagingEventSchema),
});
// Complete webhook payload for stories
exports.WebhookPayloadOfStoriesSchema = zod_1.z.object({
  object: zod_1.z.string(),
  entry: zod_1.z.array(exports.WebhookEntryOfStoriesSchema),
});
// For backward compatibility / generic processing
exports.WebhookEntrySchema = zod_1.z.union([
  exports.WebhookEntryOfPostsSchema,
  exports.WebhookEntryOfStoriesSchema,
]);
exports.WebhookPayloadSchema = zod_1.z.union([
  exports.WebhookPayloadOfPostsSchema,
  exports.WebhookPayloadOfStoriesSchema,
]);
// Webhook verification success response
exports.WebhookVerificationResponseSchema = zod_1.z.string();
// Webhook processing success response
exports.WebhookProcessingResponseSchema = zod_1.z.object({
  success: zod_1.z.literal(true),
});
// Error response schema (removed to avoid duplicates)
// export const ErrorResponseSchema = z.object({
//   error: z.string(),
// });
