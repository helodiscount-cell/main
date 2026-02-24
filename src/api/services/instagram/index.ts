import { api, request } from "@/api/client";
import { InstagramPostsResponse } from "@dm-broo/common-types";

interface InstagramUserProfileResponse {
  success: boolean;
  result: {
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
}

interface InstagramPostsApiResponse {
  success: boolean;
  result: {
    data: InstagramPostsResponse;
    status: number;
    statusText: string;
  };
}

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
    getUserProfile: async (): Promise<InstagramUserProfileResponse> => {
      return request(
        api.get<InstagramUserProfileResponse>("/instagram/profile"),
      );
    },
    getUserPosts: async (): Promise<InstagramPostsApiResponse> => {
      return request(
        api.get<InstagramPostsApiResponse>("/instagram/profile/posts"),
      );
    },
  },
};
