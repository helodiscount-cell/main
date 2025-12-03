"use strict";
/**
 * Webhook Zod Schemas
 * Defines validation schemas for webhook-related API endpoints
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.WebhookProcessingResponseSchema = exports.WebhookVerificationResponseSchema = exports.WebhookPayloadSchema = exports.WebhookEntrySchema = exports.WebhookMessagingEventSchema = exports.WebhookChangeSchema = exports.WebhookCommentValueSchema = exports.WebhookVerificationQuerySchema = void 0;
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
    value: zod_1.z.any(),
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
// Webhook entry object
exports.WebhookEntrySchema = zod_1.z.object({
    id: zod_1.z.string(),
    time: zod_1.z.number(),
    changes: zod_1.z.array(exports.WebhookChangeSchema).optional(),
    messaging: zod_1.z.array(exports.WebhookMessagingEventSchema).optional(),
});
// Complete webhook payload
exports.WebhookPayloadSchema = zod_1.z.object({
    object: zod_1.z.string(),
    entry: zod_1.z.array(exports.WebhookEntrySchema),
});
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
