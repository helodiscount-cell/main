/**
 * Instagram Token Management
 * Handles token refresh and validation using Instagram Graph API
 */

import { prisma } from "@/lib/db";
import {
  INSTAGRAM_OAUTH,
  GRAPH_API,
  ERROR_MESSAGES,
  buildGraphApiUrl,
  getOAuthCredentials,
} from "@/config/instagram.config";
import {
  LongLivedTokenResponse,
  OAuthTokenResponse,
} from "@dm-broo/common-types";
import { fetchWithTimeout } from "@/lib/utils/fetch-with-timeout";
import { executeWithErrorHandling } from "@/server/repositories/repository-utils";
import { InstaAccount } from "@prisma/client";

export interface RefreshTokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
}

/**
 * Refreshes an Instagram access token
 * Uses graph.instagram.com/refresh_access_token endpoint
 */
export async function refreshAccessToken(
  account: Pick<
    InstaAccount,
    "id" | "accessToken" | "tokenExpiresAt"
  >
): Promise<{ accessToken: string; expiresAt: Date }> {

  // Refreshes the token using Instagram Graph API
  // Uses ig_refresh_token grant type for long-lived token refresh
  const params = new URLSearchParams({
    grant_type: "ig_refresh_token",
    access_token: account.accessToken,
  });

  const url = buildGraphApiUrl(GRAPH_API.ENDPOINTS.REFRESH_TOKEN(account.accessToken));

  params.forEach((value, key) => {
    url.searchParams.set(key, value);
  });

  const { fetchWithTimeout } = await import("@/lib/utils/fetch-with-timeout");

  try {
    const result = await fetchWithTimeout<RefreshTokenResponse>(url.toString(), {
      method: "GET",
    });

    const data = result.data;

    // Calculates new expiration date
    const expiresAt = new Date(Date.now() + data.expires_in * 1000);

    // Updates the database
    executeWithErrorHandling(async () => {
      await prisma.instaAccount.update({
        where: { id: account.id },
        data: {
          accessToken: data.access_token,
          tokenExpiresAt: expiresAt,
          lastSyncedAt: new Date(),
        },
      });
    }, {
      operation: "refreshAccessToken",
      model: "instaAccount",
    });

    return {
      accessToken: data.access_token,
      expiresAt,
    };
  } catch (error) {
    throw error;
  }
}

/**
 * Checks if a token is expired or will expire soon
 */
export function isTokenExpiringSoon(
  expiresAt: Date,
  daysThreshold: number = 7
): boolean {
  const thresholdDate = new Date();
  thresholdDate.setDate(thresholdDate.getDate() + daysThreshold);

  return expiresAt <= thresholdDate;
}

/**
 * Gets a valid access token, refreshing if needed
 */

export async function getValidAccessToken(
  account: Pick<
    InstaAccount,
    "id" | "accessToken" | "tokenExpiresAt"
  >
): Promise<string> {
  if (isTokenExpiringSoon(account.tokenExpiresAt)) {
    const { accessToken } = await refreshAccessToken(account);
    return accessToken;
  }

  return account.accessToken;
}

/**
 * Finds all accounts with expiring tokens
 */
export async function findExpiringTokens(
  daysThreshold: number = 7
): Promise<string[]> {
  const thresholdDate = new Date();
  thresholdDate.setDate(thresholdDate.getDate() + daysThreshold);

  const accounts = await prisma.instaAccount.findMany({
    where: {
      tokenExpiresAt: {
        lte: thresholdDate,
      },
      isActive: true,
    },
    select: {
      id: true,
    },
  });

  return accounts.map((acc) => acc.id);
}

/**
 * Validates token by making a test API call using Instagram Graph API
 */
export async function validateToken(
  accessToken: string,
  instagramUserId: string
): Promise<boolean> {
  try {
    const url = buildGraphApiUrl(
      GRAPH_API.ENDPOINTS.USER_INFO(instagramUserId)
    );
    url.searchParams.set("fields", "id");
    url.searchParams.set("access_token", accessToken);

    const response = await fetch(url.toString());
    return response.ok;
  } catch {
    return false;
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
    // Uses direct fetch to match reference implementation and get better error details
    const tokenResponse = await fetch(INSTAGRAM_OAUTH.TOKEN_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: formData,
    });

    const tokenData = await tokenResponse.json();

    if (!tokenResponse.ok) {
      throw new Error(`Token exchange failed: ${JSON.stringify(tokenData)}`);
    }

    // Instagram Login returns both access_token and user_id
    return {
      access_token: tokenData.access_token,
      user_id: tokenData.user_id,
    };
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : ERROR_MESSAGES.AUTH.OAUTH_FAILED;
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

  const { data: longLivedToken, status } =
    await fetchWithTimeout<LongLivedTokenResponse>(url.toString(), {
      method: "GET",
      timeout: 10000,
      retries: 1,
    });

  if (status !== 200) {
    throw new Error(
      `Failed to exchange short-lived token for long-lived token: ${status}`
    );
  }

  return longLivedToken;
}

/**
 * Calculates token expiration date
 */
export function calculateTokenExpiration(expiresIn?: number): Date {
  // Facebook long-lived tokens last 60 days by default if expires_in is not provided
  const expirationSeconds = expiresIn || 60 * 24 * 60 * 60; // 60 days in seconds
  return new Date(Date.now() + expirationSeconds * 1000);
}
