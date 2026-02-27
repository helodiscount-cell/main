"use strict";
/**
 * Instagram Zod Schemas
 * Defines validation schemas for Instagram-related API endpoints
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.InstagramConnectResponseSchema =
  exports.InstagramConnectRequestSchema =
  exports.DisconnectResponseSchema =
  exports.TokenRefreshResponseSchema =
  exports.OAuthAuthorizeQuerySchema =
  exports.FacebookPagesResponseSchema =
  exports.InstagramUserDataSchema =
  exports.LongLivedTokenResponseSchema =
  exports.OAuthTokenResponseSchema =
  exports.OAuthCallbackQuerySchema =
  exports.OAuthStateSchema =
  exports.InstagramStatusResponseSchema =
  exports.InstagramStatusDisconnectedSchema =
  exports.InstagramStatusConnectedSchema =
  exports.CommentsResponseSchema =
  exports.CommentsQuerySchema =
  exports.InstagramCommentSchema =
  exports.InstagramPostsResponseSchema =
  exports.InstagramStoriesResponseSchema =
  exports.InstagramStorySchema =
  exports.InstagramPostSchema =
    void 0;
const zod_1 = require("zod");
const validation_1 = require("../lib/utils/validation");
// Instagram post schema
exports.InstagramPostSchema = zod_1.z.object({
  id: zod_1.z.string(),
  caption: zod_1.z.string().optional(),
  media_type: zod_1.z.enum(["IMAGE", "VIDEO", "CAROUSEL_ALBUM"]),
  media_product_type: zod_1.z.enum(["FEED", "REELS", "STORY"]),
  media_url: zod_1.z.string(),
  permalink: zod_1.z.string(),
  timestamp: zod_1.z.string(),
  like_count: zod_1.z.number().optional(),
  comments_count: zod_1.z.number().optional(),
});
// Instagram story schema (stories have no like_count/comments_count, and no CAROUSEL_ALBUM)
exports.InstagramStorySchema = zod_1.z.object({
  id: zod_1.z.string(),
  caption: zod_1.z.string().optional(),
  media_type: zod_1.z.enum(["IMAGE", "VIDEO"]),
  media_product_type: zod_1.z.literal("STORY"),
  media_url: zod_1.z.string(),
  permalink: zod_1.z.string(),
  timestamp: zod_1.z.string(),
});
// Instagram stories success response
exports.InstagramStoriesResponseSchema = zod_1.z.object({
  data: zod_1.z.array(exports.InstagramStorySchema),
  paging: zod_1.z
    .object({
      cursors: zod_1.z.object({
        before: zod_1.z.string().optional(),
        after: zod_1.z.string().optional(),
      }),
    })
    .optional(),
});
// Instagram posts success response
exports.InstagramPostsResponseSchema = zod_1.z.object({
  data: zod_1.z.array(exports.InstagramPostSchema),
  paging: zod_1.z
    .object({
      cursors: zod_1.z.object({
        before: zod_1.z.string().optional(),
        after: zod_1.z.string().optional(),
      }),
    })
    .optional(),
});
// Instagram comment schema
exports.InstagramCommentSchema = zod_1.z.object({
  id: zod_1.z.string(),
  text: zod_1.z.string(),
  timestamp: zod_1.z.string(),
  username: zod_1.z.string().optional(),
  from: zod_1.z
    .object({
      id: zod_1.z.string(),
      username: zod_1.z.string(),
    })
    .optional(),
  like_count: zod_1.z.number().optional(),
});
// Comments query parameters
exports.CommentsQuerySchema = zod_1.z.object({
  postId: zod_1.z
    .string()
    .min(1, "Post ID is required")
    .max(24, "Post ID must be 24 characters")
    .refine((val) => (0, validation_1.isValidObjectId)(val), {
      message:
        "Post ID must be a valid MongoDB ObjectId (24 hexadecimal characters)",
    })
    .transform((val) => (0, validation_1.sanitizeQueryParam)(val, 24)),
});
// Comments success response
exports.CommentsResponseSchema = zod_1.z.object({
  success: zod_1.z.literal(true),
  postId: zod_1.z.string(),
  comments: zod_1.z.array(exports.InstagramCommentSchema),
  paging: zod_1.z.any().optional(),
});
// Instagram connection status - connected
exports.InstagramStatusConnectedSchema = zod_1.z.object({
  connected: zod_1.z.literal(true),
  username: zod_1.z.string(),
  profilePictureUrl: zod_1.z.string().nullable(),
  accountType: zod_1.z.enum(["BUSINESS", "CREATOR", "PERSONAL"]),
  connectedAt: zod_1.z.date(),
  lastSyncedAt: zod_1.z.date().nullable(),
});
// Instagram connection status - disconnected
exports.InstagramStatusDisconnectedSchema = zod_1.z.object({
  connected: zod_1.z.literal(false),
  message: zod_1.z.string(),
});
// Instagram status response (union of connected/disconnected)
exports.InstagramStatusResponseSchema = zod_1.z.union([
  exports.InstagramStatusConnectedSchema,
  exports.InstagramStatusDisconnectedSchema,
]);
// OAuth state schema
exports.OAuthStateSchema = zod_1.z.object({
  clerkId: zod_1.z.string(),
  returnUrl: zod_1.z.string().optional(),
});
// OAuth callback query parameters
exports.OAuthCallbackQuerySchema = zod_1.z.object({
  code: zod_1.z.string(),
  state: zod_1.z.string(),
  error: zod_1.z.string().optional(),
  error_description: zod_1.z.string().optional(),
});
// OAuth token response
exports.OAuthTokenResponseSchema = zod_1.z.object({
  access_token: zod_1.z.string(),
  user_id: zod_1.z.number(),
});
// Long-lived token response
exports.LongLivedTokenResponseSchema = zod_1.z.object({
  access_token: zod_1.z.string(),
  token_type: zod_1.z.string(),
  expires_in: zod_1.z.number(),
});
// Instagram user data schema
exports.InstagramUserDataSchema = zod_1.z.object({
  id: zod_1.z.string(),
  username: zod_1.z.string(),
  user_id: zod_1.z.string(),
  account_type: zod_1.z.enum(["BUSINESS", "CREATOR", "PERSONAL"]),
  media_count: zod_1.z.number().optional(),
  name: zod_1.z.string().optional(),
  profile_picture_url: zod_1.z.string().optional(),
  followers_count: zod_1.z.number().optional(),
  follows_count: zod_1.z.number().optional(),
  biography: zod_1.z.string().optional(),
});
// Facebook pages response schema
exports.FacebookPagesResponseSchema = zod_1.z.object({
  data: zod_1.z.array(
    zod_1.z.object({
      id: zod_1.z.string(),
      name: zod_1.z.string(),
      access_token: zod_1.z.string(),
      instagram_business_account: zod_1.z
        .object({
          id: zod_1.z.string(),
        })
        .optional(),
    }),
  ),
});
// OAuth authorize query parameters
exports.OAuthAuthorizeQuerySchema = zod_1.z.object({
  returnUrl: zod_1.z.string().optional(),
});
// Token refresh response
exports.TokenRefreshResponseSchema = zod_1.z.object({
  success: zod_1.z.literal(true),
  message: zod_1.z.string(),
  expiresAt: zod_1.z.string(),
});
// Disconnect response
exports.DisconnectResponseSchema = zod_1.z.object({
  success: zod_1.z.literal(true),
  message: zod_1.z.string(),
});
// Instagram connect request body
exports.InstagramConnectRequestSchema = zod_1.z.object({
  fullName: zod_1.z.string().optional(),
  email: zod_1.z.string().optional(),
  imageUrl: zod_1.z.string().nullable().optional(),
});
// Instagram connect success response
exports.InstagramConnectResponseSchema = zod_1.z.object({
  success: zod_1.z.literal(true),
  data: zod_1.z.object({
    username: zod_1.z.string(),
    connectedAt: zod_1.z.date(),
  }),
});
// Error response schema (removed to avoid duplicates)
// export const ErrorResponseSchema = z.object({
//   success: z.literal(false),
//   error: z.string(),
//   details: z.string().optional(),
// });
