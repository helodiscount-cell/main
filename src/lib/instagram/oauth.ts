/**
 * Instagram OAuth Helper Functions
 * Handles OAuth flow for Instagram Business accounts
 */

import {
  INSTAGRAM_OAUTH,
  getOAuthCredentials,
  validateOAuthConfig,
} from "@/config/instagram.config";

export interface OAuthState {
  clerkId: string;
  returnUrl?: string;
}

export interface OAuthTokenResponse {
  access_token: string;
  user_id: number;
}

export interface LongLivedTokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
}

export interface InstagramUserData {
  id: string;
  username: string;
  account_type: "BUSINESS" | "CREATOR" | "PERSONAL";
  media_count?: number;
}

export interface FacebookPagesResponse {
  data: Array<{
    id: string;
    name: string;
    access_token: string;
    instagram_business_account?: {
      id: string;
    };
  }>;
}

/**
 * Generates the Instagram OAuth authorization URL
 */
export function generateAuthorizationUrl(state: OAuthState): string {
  if (!validateOAuthConfig()) {
    throw new Error("OAuth configuration is incomplete");
  }

  const { appId, redirectUri } = getOAuthCredentials();

  // Encodes state as base64
  const encodedState = Buffer.from(JSON.stringify(state)).toString("base64");

  const params = new URLSearchParams({
    client_id: appId!,
    redirect_uri: redirectUri!,
    scope: INSTAGRAM_OAUTH.SCOPES,
    response_type: "code",
    state: encodedState,
  });

  return `${INSTAGRAM_OAUTH.AUTHORIZE_URL}?${params.toString()}`;
}

/**
 * Decodes the OAuth state parameter
 */
export function decodeState(encodedState: string): OAuthState {
  try {
    const decoded = Buffer.from(encodedState, "base64").toString("utf-8");
    return JSON.parse(decoded);
  } catch (error) {
    throw new Error("Invalid state parameter");
  }
}

/**
 * Exchanges authorization code for short-lived access token
 */
export async function exchangeCodeForToken(
  code: string
): Promise<OAuthTokenResponse> {
  const { appId, appSecret, redirectUri } = getOAuthCredentials();

  const params = new URLSearchParams({
    client_id: appId!,
    client_secret: appSecret!,
    redirect_uri: redirectUri!,
    code,
  });

  const url = `${INSTAGRAM_OAUTH.TOKEN_URL}?${params.toString()}`;

  const response = await fetch(url, {
    method: "GET",
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(
      error.error_message ||
        error.error?.message ||
        "Failed to exchange code for token"
    );
  }

  const data = await response.json();

  // Facebook OAuth returns access_token but not user_id directly
  // We'll need to fetch user ID separately if needed
  return {
    access_token: data.access_token,
    user_id: data.user_id || 0, // Will be fetched later from Graph API
  };
}

/**
 * Exchanges short-lived token for long-lived token (60 days)
 */
export async function getLongLivedToken(
  shortLivedToken: string
): Promise<LongLivedTokenResponse> {
  const { appId, appSecret } = getOAuthCredentials();

  const params = new URLSearchParams({
    grant_type: "fb_exchange_token",
    client_id: appId!,
    client_secret: appSecret!,
    fb_exchange_token: shortLivedToken,
  });

  const url = `${INSTAGRAM_OAUTH.GRAPH_TOKEN_URL}?${params.toString()}`;

  const response = await fetch(url, {
    method: "GET",
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.error?.message || "Failed to get long-lived token");
  }

  return await response.json();
}

/**
 * Fetches Instagram user data
 */
export async function fetchInstagramUserData(
  accessToken: string,
  instagramAccountId?: string
): Promise<InstagramUserData> {
  // For Instagram Business accounts, we only have id, username, and name fields
  // account_type is not available, so we'll default to BUSINESS
  const fields = ["id", "username", "name", "profile_picture_url"].join(",");

  // Uses Instagram Business Account ID if provided, otherwise tries /me endpoint
  const endpoint = instagramAccountId
    ? `https://graph.facebook.com/v24.0/${instagramAccountId}`
    : `https://graph.instagram.com/me`;

  const url = `${endpoint}?fields=${fields}&access_token=${accessToken}`;

  const response = await fetch(url);

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(
      error.error?.message || "Failed to fetch Instagram user data"
    );
  }

  const data = await response.json();

  // Instagram Business accounts are always BUSINESS type
  return {
    id: data.id,
    username: data.username,
    account_type: "BUSINESS",
    media_count: undefined, // Not available in initial fetch
  };
}

/**
 * Fetches Facebook Pages connected to the user
 */
export async function fetchFacebookPages(
  accessToken: string
): Promise<FacebookPagesResponse> {
  const fields = [
    "id",
    "name",
    "access_token",
    "instagram_business_account",
  ].join(",");
  const url = `https://graph.facebook.com/v24.0/me/accounts?fields=${fields}&access_token=${accessToken}`;

  const response = await fetch(url);

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.error?.message || "Failed to fetch Facebook pages");
  }

  return await response.json();
}

/**
 * Validates that the Instagram account meets requirements
 */
export function validateInstagramAccount(userData: InstagramUserData): {
  valid: boolean;
  error?: string;
} {
  if (userData.account_type === "PERSONAL") {
    return {
      valid: false,
      error:
        "Personal accounts are not supported. Please use a Business or Creator account.",
    };
  }

  return { valid: true };
}

/**
 * Calculates token expiration date
 */
export function calculateTokenExpiration(expiresIn?: number): Date {
  // Facebook long-lived tokens last 60 days by default if expires_in is not provided
  const expirationSeconds = expiresIn || 60 * 24 * 60 * 60; // 60 days in seconds
  return new Date(Date.now() + expirationSeconds * 1000);
}
