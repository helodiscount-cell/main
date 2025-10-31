export interface IIConnectionStatus {
  connected: boolean;
  username?: string;
  connectedAt?: string;
  lastSyncedAt?: string;
}

// Defines error response type
export interface BeErrorResponse {
  success: false;
  error: string;
  details?: string;
}

// Defines Instagram post structure
export interface InstagramPost {
  id: string;
  caption?: string;
  media_type: "IMAGE" | "VIDEO" | "CAROUSEL_ALBUM";
  media_url: string;
  permalink: string;
  timestamp: string;
  like_count?: number;
  comments_count?: number;
}

// Defines successful response type for posts
export interface InstagramPostsSuccessResponse {
  success: true;
  posts: InstagramPost[];
  username: string;
  paging?: unknown;
}

// Defines the response structure for a successful status check
export interface InstagramStatusConnectedResponse {
  connected: true;
  username: string;
  connectedAt: Date;
  lastSyncedAt: Date | null;
}

// Defines the response structure for a disconnected status check
export interface InstagramStatusDisconnectedResponse {
  connected: false;
  message: string;
}

// Defines the request body schema type for Instagram connect
export interface InstagramConnectRequestBody {
  fullName?: string;
  email?: string;
  imageUrl?: string | null;
}

// Defines the response structure for a successful connection
export interface InstagramConnectSuccessResponse {
  success: true;
  data: {
    username: string;
    connectedAt: Date;
  };
}
