/**
 * Instagram Zod Schemas
 * Defines validation schemas for Instagram-related API endpoints
 */
import { z } from "zod";
export declare const InstagramPostSchema: z.ZodObject<
  {
    id: z.ZodString;
    caption: z.ZodOptional<z.ZodString>;
    media_type: z.ZodEnum<{
      IMAGE: "IMAGE";
      VIDEO: "VIDEO";
      CAROUSEL_ALBUM: "CAROUSEL_ALBUM";
    }>;
    media_product_type: z.ZodEnum<{
      FEED: "FEED";
      REELS: "REELS";
      STORY: "STORY";
    }>;
    media_url: z.ZodString;
    permalink: z.ZodString;
    timestamp: z.ZodString;
    like_count: z.ZodOptional<z.ZodNumber>;
    comments_count: z.ZodOptional<z.ZodNumber>;
  },
  z.core.$strip
>;
export declare const InstagramStorySchema: z.ZodObject<
  {
    id: z.ZodString;
    caption: z.ZodOptional<z.ZodString>;
    media_type: z.ZodEnum<{
      IMAGE: "IMAGE";
      VIDEO: "VIDEO";
    }>;
    media_product_type: z.ZodLiteral<"STORY">;
    media_url: z.ZodString;
    permalink: z.ZodString;
    timestamp: z.ZodString;
  },
  z.core.$strip
>;
export declare const InstagramStoriesResponseSchema: z.ZodObject<
  {
    data: z.ZodArray<
      z.ZodObject<
        {
          id: z.ZodString;
          caption: z.ZodOptional<z.ZodString>;
          media_type: z.ZodEnum<{
            IMAGE: "IMAGE";
            VIDEO: "VIDEO";
          }>;
          media_product_type: z.ZodLiteral<"STORY">;
          media_url: z.ZodString;
          permalink: z.ZodString;
          timestamp: z.ZodString;
        },
        z.core.$strip
      >
    >;
    paging: z.ZodOptional<
      z.ZodObject<
        {
          cursors: z.ZodObject<
            {
              before: z.ZodOptional<z.ZodString>;
              after: z.ZodOptional<z.ZodString>;
            },
            z.core.$strip
          >;
        },
        z.core.$strip
      >
    >;
  },
  z.core.$strip
>;
export declare const InstagramPostsResponseSchema: z.ZodObject<
  {
    data: z.ZodArray<
      z.ZodObject<
        {
          id: z.ZodString;
          caption: z.ZodOptional<z.ZodString>;
          media_type: z.ZodEnum<{
            IMAGE: "IMAGE";
            VIDEO: "VIDEO";
            CAROUSEL_ALBUM: "CAROUSEL_ALBUM";
          }>;
          media_product_type: z.ZodEnum<{
            FEED: "FEED";
            REELS: "REELS";
            STORY: "STORY";
          }>;
          media_url: z.ZodString;
          permalink: z.ZodString;
          timestamp: z.ZodString;
          like_count: z.ZodOptional<z.ZodNumber>;
          comments_count: z.ZodOptional<z.ZodNumber>;
        },
        z.core.$strip
      >
    >;
    paging: z.ZodOptional<
      z.ZodObject<
        {
          cursors: z.ZodObject<
            {
              before: z.ZodOptional<z.ZodString>;
              after: z.ZodOptional<z.ZodString>;
            },
            z.core.$strip
          >;
        },
        z.core.$strip
      >
    >;
  },
  z.core.$strip
>;
export declare const InstagramCommentSchema: z.ZodObject<
  {
    id: z.ZodString;
    text: z.ZodString;
    timestamp: z.ZodString;
    username: z.ZodOptional<z.ZodString>;
    from: z.ZodOptional<
      z.ZodObject<
        {
          id: z.ZodString;
          username: z.ZodString;
        },
        z.core.$strip
      >
    >;
    like_count: z.ZodOptional<z.ZodNumber>;
  },
  z.core.$strip
>;
export declare const CommentsQuerySchema: z.ZodObject<
  {
    postId: z.ZodPipe<z.ZodString, z.ZodTransform<string, string>>;
  },
  z.core.$strip
>;
export declare const CommentsResponseSchema: z.ZodObject<
  {
    success: z.ZodLiteral<true>;
    postId: z.ZodString;
    comments: z.ZodArray<
      z.ZodObject<
        {
          id: z.ZodString;
          text: z.ZodString;
          timestamp: z.ZodString;
          username: z.ZodOptional<z.ZodString>;
          from: z.ZodOptional<
            z.ZodObject<
              {
                id: z.ZodString;
                username: z.ZodString;
              },
              z.core.$strip
            >
          >;
          like_count: z.ZodOptional<z.ZodNumber>;
        },
        z.core.$strip
      >
    >;
    paging: z.ZodOptional<z.ZodAny>;
  },
  z.core.$strip
>;
export declare const InstagramStatusConnectedSchema: z.ZodObject<
  {
    connected: z.ZodLiteral<true>;
    username: z.ZodString;
    profilePictureUrl: z.ZodNullable<z.ZodString>;
    accountType: z.ZodEnum<{
      BUSINESS: "BUSINESS";
      CREATOR: "CREATOR";
      PERSONAL: "PERSONAL";
    }>;
    connectedAt: z.ZodDate;
    lastSyncedAt: z.ZodNullable<z.ZodDate>;
  },
  z.core.$strip
>;
export declare const InstagramStatusDisconnectedSchema: z.ZodObject<
  {
    connected: z.ZodLiteral<false>;
    message: z.ZodString;
  },
  z.core.$strip
>;
export declare const InstagramStatusResponseSchema: z.ZodUnion<
  readonly [
    z.ZodObject<
      {
        connected: z.ZodLiteral<true>;
        username: z.ZodString;
        profilePictureUrl: z.ZodNullable<z.ZodString>;
        accountType: z.ZodEnum<{
          BUSINESS: "BUSINESS";
          CREATOR: "CREATOR";
          PERSONAL: "PERSONAL";
        }>;
        connectedAt: z.ZodDate;
        lastSyncedAt: z.ZodNullable<z.ZodDate>;
      },
      z.core.$strip
    >,
    z.ZodObject<
      {
        connected: z.ZodLiteral<false>;
        message: z.ZodString;
      },
      z.core.$strip
    >,
  ]
>;
export declare const OAuthStateSchema: z.ZodObject<
  {
    clerkId: z.ZodString;
    returnUrl: z.ZodOptional<z.ZodString>;
  },
  z.core.$strip
>;
export declare const OAuthCallbackQuerySchema: z.ZodObject<
  {
    code: z.ZodString;
    state: z.ZodString;
    error: z.ZodOptional<z.ZodString>;
    error_description: z.ZodOptional<z.ZodString>;
  },
  z.core.$strip
>;
export declare const OAuthTokenResponseSchema: z.ZodObject<
  {
    access_token: z.ZodString;
    user_id: z.ZodNumber;
  },
  z.core.$strip
>;
export declare const LongLivedTokenResponseSchema: z.ZodObject<
  {
    access_token: z.ZodString;
    token_type: z.ZodString;
    expires_in: z.ZodNumber;
  },
  z.core.$strip
>;
export declare const InstagramUserDataSchema: z.ZodObject<
  {
    id: z.ZodString;
    username: z.ZodString;
    user_id: z.ZodString;
    account_type: z.ZodEnum<{
      BUSINESS: "BUSINESS";
      CREATOR: "CREATOR";
      PERSONAL: "PERSONAL";
    }>;
    media_count: z.ZodOptional<z.ZodNumber>;
    name: z.ZodOptional<z.ZodString>;
    profile_picture_url: z.ZodOptional<z.ZodString>;
    followers_count: z.ZodOptional<z.ZodNumber>;
    follows_count: z.ZodOptional<z.ZodNumber>;
    biography: z.ZodOptional<z.ZodString>;
  },
  z.core.$strip
>;
export declare const FacebookPagesResponseSchema: z.ZodObject<
  {
    data: z.ZodArray<
      z.ZodObject<
        {
          id: z.ZodString;
          name: z.ZodString;
          access_token: z.ZodString;
          instagram_business_account: z.ZodOptional<
            z.ZodObject<
              {
                id: z.ZodString;
              },
              z.core.$strip
            >
          >;
        },
        z.core.$strip
      >
    >;
  },
  z.core.$strip
>;
export declare const OAuthAuthorizeQuerySchema: z.ZodObject<
  {
    returnUrl: z.ZodOptional<z.ZodString>;
  },
  z.core.$strip
>;
export declare const TokenRefreshResponseSchema: z.ZodObject<
  {
    success: z.ZodLiteral<true>;
    message: z.ZodString;
    expiresAt: z.ZodString;
  },
  z.core.$strip
>;
export declare const DisconnectResponseSchema: z.ZodObject<
  {
    success: z.ZodLiteral<true>;
    message: z.ZodString;
  },
  z.core.$strip
>;
export declare const InstagramConnectRequestSchema: z.ZodObject<
  {
    fullName: z.ZodOptional<z.ZodString>;
    email: z.ZodOptional<z.ZodString>;
    imageUrl: z.ZodOptional<z.ZodNullable<z.ZodString>>;
  },
  z.core.$strip
>;
export declare const InstagramConnectResponseSchema: z.ZodObject<
  {
    success: z.ZodLiteral<true>;
    data: z.ZodObject<
      {
        username: z.ZodString;
        connectedAt: z.ZodDate;
      },
      z.core.$strip
    >;
  },
  z.core.$strip
>;
