import { api, request } from "@/api/client";
import type {
  ApiResponse,
  UserProfileResult,
  PostsResult,
  StoriesResult,
} from "./types";

export const instagramService = {
  oauth: {
    connect: async (returnUrl: string): Promise<void> => {
      const url = `/api/instagram/oauth/authorize${returnUrl ? `?returnUrl=${returnUrl}` : ""}`;
      window.location.href = url;
    },
    disconnect: async (): Promise<void> => {
      return request(api.post<void>("/instagram/oauth/disconnect"));
    },
  },
  profile: {
    getUserProfile: async (): Promise<ApiResponse<UserProfileResult>> => {
      return request(
        api.get<ApiResponse<UserProfileResult>>("/instagram/profile"),
      );
    },
    getUserPosts: async (): Promise<ApiResponse<PostsResult>> => {
      return request(
        api.get<ApiResponse<PostsResult>>("/instagram/profile/posts"),
      );
    },
    getUserStories: async (): Promise<ApiResponse<StoriesResult>> => {
      return request(
        api.get<ApiResponse<StoriesResult>>("/instagram/profile/story"),
      );
    },
  },
};
