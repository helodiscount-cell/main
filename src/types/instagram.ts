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

export type PostsResult = {
  data: InstagramPostsResponse;
  status: number;
  statusText: string;
};

export type StoriesResult = {
  stories: InstagramStoriesResponse["data"];
  paging: InstagramStoriesResponse["paging"];
};
