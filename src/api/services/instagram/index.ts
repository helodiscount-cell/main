import { api, request } from "@/api/client";
import { ApiResponse } from "@/types/api";
import {
  UserProfileResult,
  PostsResult,
  StoriesResult,
} from "@/types/instagram";

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
      const response = await request(
        api.get<ApiResponse<PostsResult>>("/instagram/profile/posts", {
          params: { forceRefresh },
        }),
      );

      if (response.success && response.result) {
        return {
          ...response,
          result: {
            data: response.result.data,
            paging: response.result.paging,
          },
        };
      }
      return response;
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
