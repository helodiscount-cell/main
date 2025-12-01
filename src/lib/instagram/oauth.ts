/**
 * Instagram OAuth Helper Functions
 * Handles OAuth flow for Instagram Business accounts
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

  try {
    const result = await fetchWithTimeout<OAuthTokenResponse>(url, {
      method: "GET",
      timeout: 15000, // 15 seconds for OAuth token exchange
      retries: 2,
    });

    // Facebook OAuth returns access_token but not user_id directly
    // We have to fetch user ID separately if needed
    return {
      access_token: result.data.access_token,
      user_id: result.data.user_id || 0, // Will be fetched later from Graph API
    };
  } catch (error) {
    // Handles timeout and other errors
    const errorMessage =
      error instanceof Error
        ? error.message
        : ERROR_MESSAGES.AUTH.OAUTH_FAILED;
    throw new Error(errorMessage);
  }
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

  try {
    const result = await fetchWithTimeout<LongLivedTokenResponse>(url, {
      method: "GET",
      timeout: 15000, // 15 seconds for token exchange
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
 * Fetches Instagram user data using Facebook Graph API
 */
export async function fetchInstagramUserData(
  accessToken: string,
  instagramAccountId: string
): Promise<InstagramUserData> {
  // For Instagram Business accounts, we fetch data through Facebook Graph API
  const fields = ["id", "username", "name", "profile_picture_url"].join(",");

  // Always uses Facebook Graph API with the Instagram Business Account ID
  const url = buildGraphApiUrl(
    GRAPH_API.ENDPOINTS.USER_INFO(instagramAccountId)
  );
  url.searchParams.set("fields", fields);
  url.searchParams.set("access_token", accessToken);

  try {
    const result = await fetchWithTimeout<any>(url.toString(), {
      method: "GET",
      timeout: 20000, // 20 seconds for user data fetch
      retries: 2,
    });

    const data = result.data;

    // Instagram Business accounts are always BUSINESS type
    return {
      id: data.id,
      username: data.username,
      account_type: "BUSINESS",
      media_count: undefined, // Not available in initial fetch
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

  const url = buildGraphApiUrl("me/accounts");
  url.searchParams.set("fields", fields);
  url.searchParams.set("access_token", accessToken);

  try {
    const result = await fetchWithTimeout<FacebookPagesResponse>(url.toString(), {
      method: "GET",
      timeout: 20000, // 20 seconds for pages fetch
      retries: 2,
    });

    return result.data;
  } catch (error) {
    const errorMessage =
      error instanceof Error
        ? error.message
        : ERROR_MESSAGES.AUTH.NO_FACEBOOK_PAGE;
    throw new Error(errorMessage);
  }
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
