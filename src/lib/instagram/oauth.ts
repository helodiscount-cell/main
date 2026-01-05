/**
 * Instagram OAuth Helper Functions
 * Handles OAuth flow using Instagram Login (Business Login for Instagram)
 * Uses graph.instagram.com API endpoints (not Facebook)
 */

import {
  INSTAGRAM_OAUTH,
  GRAPH_API,
  ERROR_MESSAGES,
  getOAuthCredentials,
  validateOAuthConfig,
  buildGraphApiUrl,
} from "@/config/instagram.config";
import { createSecureState, validateSecureState } from "./oauth-state";
import { fetchWithTimeout } from "@/lib/utils/fetch-with-timeout";

export interface OAuthState {
  clerkId: string;
  returnUrl?: string;
}

// Response from Instagram short-lived token exchange
export interface OAuthTokenResponse {
  access_token: string;
  user_id: number;
}

// Response from Instagram long-lived token exchange
export interface LongLivedTokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
}

// Instagram user profile data
export interface InstagramUserData {
  id: string;
  username: string;
  account_type: "BUSINESS" | "MEDIA_CREATOR" | "PERSONAL";
  name?: string;
  profile_picture_url?: string;
  followers_count?: number;
  follows_count?: number;
  media_count?: number;
}

/**
 * Generates the Instagram OAuth authorization URL
 * Uses secure state with HMAC signature to prevent CSRF attacks
 */
export function generateAuthorizationUrl(state: OAuthState): string {
  if (!validateOAuthConfig()) {
    throw new Error(ERROR_MESSAGES.AUTH.NO_ACCESS_TOKEN);
  }

  const { appId, redirectUri } = getOAuthCredentials();

  // Creates secure, signed state with expiration and nonce
  const encodedState = createSecureState({
    clerkId: state.clerkId,
    returnUrl: state.returnUrl,
  });

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
 * Validates and decodes the OAuth state parameter
 * Verifies HMAC signature, expiration, and prevents replay attacks
 */
export function decodeState(encodedState: string): OAuthState {
  try {
    // Validates secure state (signature, expiration, structure)
    const validatedState = validateSecureState(encodedState);
    return validatedState;
  } catch (error) {
    // Re-throws with appropriate error message
    throw new Error(
      error instanceof Error
        ? error.message
        : ERROR_MESSAGES.AUTH.OAUTH_FAILED
    );
  }
}

/**
 * Exchanges authorization code for short-lived access token
 * Uses Instagram's token endpoint (api.instagram.com)
 */
export async function exchangeCodeForToken(
  code: string
): Promise<OAuthTokenResponse> {
  const { appId, appSecret, redirectUri } = getOAuthCredentials();

  // Instagram token exchange uses POST with form data
  const formData = new URLSearchParams({
    client_id: appId!,
    client_secret: appSecret!,
    grant_type: "authorization_code",
    redirect_uri: redirectUri!,
    code,
  });

  try {
    const result = await fetchWithTimeout<OAuthTokenResponse>(
      INSTAGRAM_OAUTH.TOKEN_URL,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: formData.toString(),
        timeout: 15000,
        retries: 2,
      }
    );

    // Instagram Login returns both access_token and user_id
    return {
      access_token: result.data.access_token,
      user_id: result.data.user_id,
    };
  } catch (error) {
    const errorMessage =
      error instanceof Error
        ? error.message
        : ERROR_MESSAGES.AUTH.OAUTH_FAILED;
    throw new Error(errorMessage);
  }
}

/**
 * Exchanges short-lived token for long-lived token (60 days)
 * Uses graph.instagram.com/access_token endpoint
 */
export async function getLongLivedToken(
  shortLivedToken: string
): Promise<LongLivedTokenResponse> {
  const { appSecret } = getOAuthCredentials();

  const params = new URLSearchParams({
    grant_type: "ig_exchange_token",
    client_secret: appSecret!,
    access_token: shortLivedToken,
  });

  const url = `${INSTAGRAM_OAUTH.LONG_LIVED_TOKEN_URL}?${params.toString()}`;

  try {
    const result = await fetchWithTimeout<LongLivedTokenResponse>(url, {
      method: "GET",
      timeout: 15000,
      retries: 2,
    });

    return result.data;
  } catch (error) {
    const errorMessage =
      error instanceof Error
        ? error.message
        : ERROR_MESSAGES.AUTH.TOKEN_EXPIRED;
    throw new Error(errorMessage);
  }
}

/**
 * Fetches Instagram user data using Instagram Graph API
 * Uses /me endpoint or user_id from token exchange
 */
export async function fetchInstagramUserData(
  accessToken: string,
  instagramUserId?: string | number
): Promise<InstagramUserData> {
  // Uses /me endpoint or specific user ID
  const endpoint = instagramUserId ? `${instagramUserId}` : "me";
  const fields = [
    "id",
    "username",
    "account_type",
    "name",
    "profile_picture_url",
    "followers_count",
    "follows_count",
    "media_count",
  ].join(",");

  const url = buildGraphApiUrl(endpoint);
  url.searchParams.set("fields", fields);
  url.searchParams.set("access_token", accessToken);

  try {
    const result = await fetchWithTimeout<any>(url.toString(), {
      method: "GET",
      timeout: 20000,
      retries: 2,
    });

    const data = result.data;

    return {
      id: data.id,
      username: data.username,
      account_type: data.account_type || "BUSINESS",
      name: data.name,
      profile_picture_url: data.profile_picture_url,
      followers_count: data.followers_count,
      follows_count: data.follows_count,
      media_count: data.media_count,
    };
  } catch (error) {
    const errorMessage =
      error instanceof Error
        ? error.message
        : ERROR_MESSAGES.API.GENERIC_ERROR;
    throw new Error(errorMessage);
  }
}

/**
 * Validates that the Instagram account meets requirements
 * Accepts BUSINESS or MEDIA_CREATOR accounts (not PERSONAL)
 */
export function validateInstagramAccount(userData: InstagramUserData): {
  valid: boolean;
  error?: string;
} {
  // Instagram Login only works with professional accounts
  const validTypes = ["BUSINESS", "MEDIA_CREATOR"];

  if (!validTypes.includes(userData.account_type)) {
    return {
      valid: false,
      error: ERROR_MESSAGES.AUTH.INVALID_ACCOUNT_TYPE,
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
