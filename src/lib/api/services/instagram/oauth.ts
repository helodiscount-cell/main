import { api, request } from "@/lib/api/client";

export interface InstagramOAuthResponse {
  url: string;
}

export interface InstagramAccountInfo {
  connected: boolean;
  username: string;
  profilePictureUrl: string;
  accountType: "BUSINESS" | "CREATOR" | "PERSONAL";
  connectedAt: Date;
  lastSyncedAt: Date | null;
}

export interface InstagramUserProfile {
  id: string;
  username: string;
  accountType: string;
  profilePictureUrl: string;
  biography: string | null;
  followersCount: number;
  followsCount: number;
  mediaCount: number;
  lastSyncedAt: string;
}

export interface InstagramUserResponse {
  success: boolean;
  data: InstagramUserProfile;
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
    status: async (): Promise<void> => {},
  },
  profile: {
    getAccountInfo: async (): Promise<InstagramAccountInfo> => {
      return request(api.get<InstagramAccountInfo>("/instagram/status"));
    },
    getUserProfile: async (): Promise<InstagramUserResponse> => {
      return request(api.get<InstagramUserResponse>("/instagram/user"));
    },
  },
};
