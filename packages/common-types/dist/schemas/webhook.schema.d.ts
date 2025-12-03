/**
 * Webhook Zod Schemas
 * Defines validation schemas for webhook-related API endpoints
 */
import { z } from "zod";
export declare const WebhookVerificationQuerySchema: z.ZodObject<{
    "hub.mode": z.ZodLiteral<"subscribe">;
    "hub.verify_token": z.ZodString;
    "hub.challenge": z.ZodString;
}, z.core.$strip>;
export declare const WebhookCommentValueSchema: z.ZodObject<{
    id: z.ZodString;
    text: z.ZodOptional<z.ZodString>;
    media: z.ZodOptional<z.ZodObject<{
        id: z.ZodString;
    }, z.core.$strip>>;
    media_id: z.ZodOptional<z.ZodString>;
    from: z.ZodOptional<z.ZodObject<{
        id: z.ZodString;
        username: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>>;
}, z.core.$strip>;
export declare const WebhookChangeSchema: z.ZodObject<{
    field: z.ZodString;
    value: z.ZodAny;
}, z.core.$strip>;
export declare const WebhookMessagingEventSchema: z.ZodObject<{
    sender: z.ZodObject<{
        id: z.ZodString;
    }, z.core.$strip>;
    recipient: z.ZodObject<{
        id: z.ZodString;
    }, z.core.$strip>;
    timestamp: z.ZodNumber;
    message: z.ZodOptional<z.ZodObject<{
        mid: z.ZodString;
        text: z.ZodString;
    }, z.core.$strip>>;
}, z.core.$strip>;
export declare const WebhookEntrySchema: z.ZodObject<{
    id: z.ZodString;
    time: z.ZodNumber;
    changes: z.ZodOptional<z.ZodArray<z.ZodObject<{
        field: z.ZodString;
        value: z.ZodAny;
    }, z.core.$strip>>>;
    messaging: z.ZodOptional<z.ZodArray<z.ZodObject<{
        sender: z.ZodObject<{
            id: z.ZodString;
        }, z.core.$strip>;
        recipient: z.ZodObject<{
            id: z.ZodString;
        }, z.core.$strip>;
        timestamp: z.ZodNumber;
        message: z.ZodOptional<z.ZodObject<{
            mid: z.ZodString;
            text: z.ZodString;
        }, z.core.$strip>>;
    }, z.core.$strip>>>;
}, z.core.$strip>;
export declare const WebhookPayloadSchema: z.ZodObject<{
    object: z.ZodString;
    entry: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        time: z.ZodNumber;
        changes: z.ZodOptional<z.ZodArray<z.ZodObject<{
            field: z.ZodString;
            value: z.ZodAny;
        }, z.core.$strip>>>;
        messaging: z.ZodOptional<z.ZodArray<z.ZodObject<{
            sender: z.ZodObject<{
                id: z.ZodString;
            }, z.core.$strip>;
            recipient: z.ZodObject<{
                id: z.ZodString;
            }, z.core.$strip>;
            timestamp: z.ZodNumber;
            message: z.ZodOptional<z.ZodObject<{
                mid: z.ZodString;
                text: z.ZodString;
            }, z.core.$strip>>;
        }, z.core.$strip>>>;
    }, z.core.$strip>>;
}, z.core.$strip>;
export declare const WebhookVerificationResponseSchema: z.ZodString;
export declare const WebhookProcessingResponseSchema: z.ZodObject<{
    success: z.ZodLiteral<true>;
}, z.core.$strip>;
