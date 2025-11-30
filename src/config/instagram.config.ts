/**
 * Instagram/Facebook Graph API Configuration
 * Centralized configuration for all Instagram integration endpoints
 */

// Graph API configuration
export const GRAPH_API = {
  VERSION: "v24.0",
  BASE_URL: "https://graph.facebook.com",
  ENDPOINTS: {
    USER_MEDIA: (userId: string) => `${userId}/media`,
    POST_COMMENTS: (postId: string) => `${postId}/comments`,
    USER_INFO: (userId: string) => `${userId}`,
    SEND_MESSAGE: (igUserId: string) => `${igUserId}/messages`,
    REPLY_COMMENT: (commentId: string) => `${commentId}/replies`,
  },
} as const;

// OAuth configuration
export const INSTAGRAM_OAUTH = {
  SCOPES: [
    "instagram_basic",
    "instagram_manage_comments",
    "instagram_manage_messages",
    "pages_show_list",
    "pages_read_engagement",
    "business_management",
  ].join(","),
  AUTHORIZE_URL: "https://www.facebook.com/v24.0/dialog/oauth",
  TOKEN_URL: "https://graph.facebook.com/v24.0/oauth/access_token",
  GRAPH_TOKEN_URL: `https://graph.facebook.com/v24.0/oauth/access_token`,
  REFRESH_URL: `https://graph.instagram.com/refresh_access_token`,
} as const;

// Messaging constraints
export const MESSAGING_CONSTRAINTS = {
  WINDOW_HOURS: 24,
  RATE_LIMIT_PER_HOUR: 100,
  MESSAGE_MAX_LENGTH: 1000,
} as const;

// Field configurations for different endpoints
export const GRAPH_API_FIELDS = {
  POSTS: [
    "id",
    "caption",
    "media_type",
    "media_url",
    "permalink",
    "timestamp",
    "like_count",
    "comments_count",
  ],
  COMMENTS: ["id", "text", "timestamp", "username", "like_count", "user"],
  USER: ["id", "username", "account_type", "media_count"],
} as const;

// Rate limiting configuration
export const RATE_LIMITS = {
  POSTS_PER_REQUEST: 25,
  COMMENTS_PER_REQUEST: 50,
  REQUEST_TIMEOUT_MS: 10000, // 10 seconds
} as const;

// Error messages
export const ERROR_MESSAGES = {
  AUTH: {
    NO_USER: "You need to be signed in. Please login and try again.",
    NO_INSTAGRAM_ACCOUNT:
      "Instagram is not connected for your account. Please connect Instagram and try again.",
    NO_ACCESS_TOKEN:
      "Instagram integration is not configured. Please contact support.",
    OAUTH_FAILED: "Failed to authorize Instagram account. Please try again.",
    TOKEN_EXPIRED: "Your Instagram connection has expired. Please reconnect.",
    INVALID_ACCOUNT_TYPE:
      "Please use an Instagram Business or Creator account.",
    NO_FACEBOOK_PAGE: "Please link your Instagram account to a Facebook Page.",
  },
  NETWORK: {
    CONNECTION_FAILED:
      "Could not connect to Instagram. Please check your network connection and try again.",
    TIMEOUT: "Request to Instagram timed out. Please try again.",
  },
  API: {
    INVALID_RESPONSE:
      "Instagram returned data in an unexpected format. Please refresh or try again later.",
    GENERIC_ERROR:
      "Instagram returned an unexpected error. Please try reconnecting your account.",
  },
  SERVER: {
    INTERNAL_ERROR:
      "An unexpected server error occurred. Please try again later.",
  },
  VALIDATION: {
    INVALID_POST_ID: "Invalid or missing post ID",
    INVALID_USER_ID: "Invalid or missing user ID",
  },
  MESSAGING: {
    WINDOW_EXPIRED:
      "Cannot send message: 24-hour messaging window has expired.",
    RATE_LIMIT_EXCEEDED: "Message rate limit exceeded. Please try again later.",
    MESSAGE_TOO_LONG: "Message exceeds maximum length of 1000 characters.",
  },
} as const;

// Response status codes
export const HTTP_STATUS = {
  OK: 200,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
  BAD_GATEWAY: 502,
} as const;

/**
 * Builds a complete Graph API URL with version and endpoint
 */
export function buildGraphApiUrl(endpoint: string): URL {
  return new URL(`${GRAPH_API.BASE_URL}/${GRAPH_API.VERSION}/${endpoint}`);
}

/**
 * Adds query parameters to a Graph API URL
 */
export function addQueryParams(url: URL, params: Record<string, string>): URL {
  Object.entries(params).forEach(([key, value]) => {
    url.searchParams.set(key, value);
  });
  return url;
}

/**
 * Gets access token from environment with validation (legacy - for migration)
 */
export function getAccessToken(): string | null {
  const token = process.env.INSTAGRAM_ACCESS_TOKEN;
  return token || null;
}

/**
 * Gets OAuth app credentials from environment
 */
export function getOAuthCredentials(): {
  appId: string | null;
  appSecret: string | null;
  redirectUri: string | null;
} {
  return {
    appId: process.env.APP_ID || process.env.INSTAGRAM_APP_ID || null,
    appSecret:
      process.env.APP_SECRET || process.env.INSTAGRAM_APP_SECRET || null,
    redirectUri: process.env.INSTAGRAM_REDIRECT_URI || null,
  };
}

/**
 * Validates OAuth configuration is complete
 */
export function validateOAuthConfig(): boolean {
  const { appId, appSecret, redirectUri } = getOAuthCredentials();
  return Boolean(appId && appSecret && redirectUri);
}
