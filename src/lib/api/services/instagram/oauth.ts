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
  },
};
