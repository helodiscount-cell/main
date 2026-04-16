import type {
  InstagramPostsResponse,
  InstagramStoriesResponse,
} from "@dm-broo/common-types";

export interface RefreshTokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
}

export interface SendMessageOptions {
  recipientId: string;
  commentId?: string;
  message: string;
  accessToken: string;
  messagingType?: "RESPONSE" | "UPDATE" | "MESSAGE_TAG";
  tag?: string;
  instagramUserId?: string;
}

export interface SendMessageResult {
  success: boolean;
  messageId?: string;
  error?: string;
}

export interface ReplyToCommentOptions {
  commentId: string;
  message: string;
  accessToken: string;
  instagramUserId?: string;
}

export interface ReplyToCommentResult {
  success: boolean;
  replyId?: string;
  error?: string;
}

export type UserProfileResult = {
  id: string;
  username: string;
  accountType: string;
  profilePictureUrl: string;
  biography: string | null;
  followersCount: number;
  followsCount: number;
  mediaCount: number;
  lastSyncedAt: string;
};

export interface InstagramMediaItem {
  id: string;
  media_type: string;
  media_url: string;
  thumbnail_url?: string;
  caption?: string | null;
  permalink: string;
  timestamp: string;
}

export type PostsResult = {
  data: InstagramMediaItem[];
  paging?: any;
};

export interface InstagramStory extends InstagramMediaItem {}

export type StoriesResult = {
  stories: InstagramStory[];
  paging: InstagramStoriesResponse["paging"];
};
