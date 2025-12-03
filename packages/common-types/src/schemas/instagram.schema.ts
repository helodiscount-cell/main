/**
 * Instagram Zod Schemas
 * Defines validation schemas for Instagram-related API endpoints
 */

import { z } from "zod";
import {
  isValidObjectId,
  sanitizeQueryParam,
} from "../lib/utils/validation";

// Instagram post schema
export const InstagramPostSchema = z.object({
  id: z.string(),
  caption: z.string().optional(),
  media_type: z.enum(["IMAGE", "VIDEO", "CAROUSEL_ALBUM"]),
  media_url: z.string(),
  permalink: z.string(),
  timestamp: z.string(),
  like_count: z.number().optional(),
  comments_count: z.number().optional(),
});

// Instagram posts success response
export const InstagramPostsResponseSchema = z.object({
  success: z.literal(true),
  posts: z.array(InstagramPostSchema),
  username: z.string(),
  paging: z.any().optional(),
});

// Instagram comment schema
export const InstagramCommentSchema = z.object({
  id: z.string(),
  text: z.string(),
  timestamp: z.string(),
  username: z.string().optional(),
  from: z
    .object({
      id: z.string(),
      username: z.string(),
    })
    .optional(),
  like_count: z.number().optional(),
});

// Comments query parameters
export const CommentsQuerySchema = z.object({
  postId: z
    .string()
    .min(1, "Post ID is required")
    .max(24, "Post ID must be 24 characters")
    .refine(
      (val) => isValidObjectId(val),
      {
        message: "Post ID must be a valid MongoDB ObjectId (24 hexadecimal characters)",
      }
    )
    .transform((val) => sanitizeQueryParam(val, 24)),
});

// Comments success response
export const CommentsResponseSchema = z.object({
  success: z.literal(true),
  postId: z.string(),
  comments: z.array(InstagramCommentSchema),
  paging: z.any().optional(),
});

// Instagram connection status - connected
export const InstagramStatusConnectedSchema = z.object({
  connected: z.literal(true),
  username: z.string(),
  connectedAt: z.date(),
  lastSyncedAt: z.date().nullable(),
});

// Instagram connection status - disconnected
export const InstagramStatusDisconnectedSchema = z.object({
  connected: z.literal(false),
  message: z.string(),
});

// Instagram status response (union of connected/disconnected)
export const InstagramStatusResponseSchema = z.union([
  InstagramStatusConnectedSchema,
  InstagramStatusDisconnectedSchema,
]);

// OAuth state schema
export const OAuthStateSchema = z.object({
  clerkId: z.string(),
  returnUrl: z.string().optional(),
});

// OAuth callback query parameters
export const OAuthCallbackQuerySchema = z.object({
  code: z.string(),
  state: z.string(),
  error: z.string().optional(),
  error_description: z.string().optional(),
});

// OAuth token response
export const OAuthTokenResponseSchema = z.object({
  access_token: z.string(),
  user_id: z.number(),
});

// Long-lived token response
export const LongLivedTokenResponseSchema = z.object({
  access_token: z.string(),
  token_type: z.string(),
  expires_in: z.number(),
});

// Instagram user data schema
export const InstagramUserDataSchema = z.object({
  id: z.string(),
  username: z.string(),
  account_type: z.enum(["BUSINESS", "CREATOR", "PERSONAL"]),
  media_count: z.number().optional(),
});

// Facebook pages response schema
export const FacebookPagesResponseSchema = z.object({
  data: z.array(
    z.object({
      id: z.string(),
      name: z.string(),
      access_token: z.string(),
      instagram_business_account: z
        .object({
          id: z.string(),
        })
        .optional(),
    })
  ),
});

// OAuth authorize query parameters
export const OAuthAuthorizeQuerySchema = z.object({
  returnUrl: z.string().optional(),
});

// Token refresh response
export const TokenRefreshResponseSchema = z.object({
  success: z.literal(true),
  message: z.string(),
  expiresAt: z.string(),
});

// Disconnect response
export const DisconnectResponseSchema = z.object({
  success: z.literal(true),
  message: z.string(),
});

// Instagram connect request body
export const InstagramConnectRequestSchema = z.object({
  fullName: z.string().optional(),
  email: z.string().optional(),
  imageUrl: z.string().nullable().optional(),
});

// Instagram connect success response
export const InstagramConnectResponseSchema = z.object({
  success: z.literal(true),
  data: z.object({
    username: z.string(),
    connectedAt: z.date(),
  }),
});

// Error response schema (removed to avoid duplicates)
// export const ErrorResponseSchema = z.object({
//   success: z.literal(false),
//   error: z.string(),
//   details: z.string().optional(),
// });
