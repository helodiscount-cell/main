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
        api.get<ApiResponse<any>>("/instagram/profile/posts", {
          params: { forceRefresh },
        }),
      );

      if (response.success && response.result?.data) {
        return {
          ...response,
          result: {
            data: response.result.data.data, // Map the nested array to the top-level data property
            paging: response.result.data.paging,
            status: response.result.status,
            statusText: response.result.statusText,
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
