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
import { createSecureState } from "./oauth-state";
import { fetchWithTimeout } from "@/lib/utils/fetch-with-timeout";
import { InstagramUserData, OAuthState } from "@dm-broo/common-types";

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
 * Fetches Instagram user data using Instagram Graph API
 * Uses /me endpoint or user_id from token exchange
 */
export async function fetchInstagramUserData(
  accessToken: string
): Promise<InstagramUserData> {
  // For Instagram Login, always uses /me endpoint with access token
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

  // Uses the exact format: https://graph.instagram.com/v21.0/me?fields=...&access_token=...

  const url = buildGraphApiUrl(GRAPH_API.ENDPOINTS.USER_INFO("me"));
  url.searchParams.set("fields", fields);
  url.searchParams.set("access_token", accessToken);

  const { data: userData, status } = await fetchWithTimeout<InstagramUserData>(
    url.toString(),
    {
      method: "GET",
      timeout: 10000,
      retries: 1,
    }
  );

  if (status !== 200) {
    throw new Error(`Failed to fetch Instagram user data: ${status}`);
  }

  return {
    id: userData.id,
    username: userData.username,
    account_type: userData.account_type || "BUSINESS",
    name: userData.name,
    profile_picture_url: userData.profile_picture_url,
    followers_count: userData.followers_count,
    follows_count: userData.follows_count,
    media_count: userData.media_count,
  };
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

async function getWebhookInstagramUserId(
  accessToken: string,
  oauthUserId: string
) {
  const url = buildGraphApiUrl(
    GRAPH_API.ENDPOINTS.SUBSCRIBED_APPS(oauthUserId)
  );

  url.searchParams.set("access_token", accessToken);
  const { data, status } = await fetchWithTimeout<{
    data: { id: string; subscribed_fields: string[] }[];
  }>(url.toString(), {
    method: "GET",
    timeout: 10000,
    retries: 1,
  });
  return data.data[0].id;
}
