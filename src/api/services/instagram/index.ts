import { api, request } from "@/api/client";
import { ApiResponse } from "@/api/types";
import { PostsResult, StoriesResult } from "@/api/services/instagram/types";

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
    getUserPosts: async (
      forceRefresh?: boolean,
    ): Promise<ApiResponse<PostsResult>> => {
      return request(
        api.get<ApiResponse<PostsResult>>("/instagram/profile/posts", {
          params: { forceRefresh },
        }),
      );
    },
    getUserStories: async (
      forceRefresh?: boolean,
    ): Promise<ApiResponse<StoriesResult>> => {
      return request(
        api.get<ApiResponse<StoriesResult>>("/instagram/profile/story", {
          params: { forceRefresh },
        }),
      );
    },
  },
};
