import type {
  InstagramPostsResponse,
  InstagramStoriesResponse,
} from "@dm-broo/common-types";

export type ApiResponse<T> = {
  success: boolean;
  result: T;
};

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
