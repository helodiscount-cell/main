/**
 * Instagram Token Management
 * Handles token refresh and validation
 */

import { prisma } from "@/lib/db";
import {
  INSTAGRAM_OAUTH,
  GRAPH_API,
  ERROR_MESSAGES,
  getOAuthCredentials,
  buildGraphApiUrl,
} from "@/config/instagram.config";

export interface RefreshTokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
}

/**
 * Refreshes an Instagram access token
 */
export async function refreshAccessToken(
  accountId: string
): Promise<{ accessToken: string; expiresAt: Date }> {
  // Gets the account from database
  const account = await prisma.instaAccount.findUnique({
    where: { id: accountId },
  });

  if (!account) {
    throw new Error(ERROR_MESSAGES.AUTH.NO_INSTAGRAM_ACCOUNT);
  }

  const { appSecret } = getOAuthCredentials();

  if (!appSecret) {
    throw new Error(ERROR_MESSAGES.AUTH.NO_ACCESS_TOKEN);
  }

  // Refreshes the token using Instagram Graph API
  const params = new URLSearchParams({
    grant_type: "ig_refresh_token",
    access_token: account.accessToken,
  });

  const url = `${INSTAGRAM_OAUTH.REFRESH_URL}?${params.toString()}`;

  const response = await fetch(url, {
    method: "GET",
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.error?.message || ERROR_MESSAGES.AUTH.TOKEN_EXPIRED);
  }

  const data: RefreshTokenResponse = await response.json();

  // Calculates new expiration date
  const expiresAt = new Date(Date.now() + data.expires_in * 1000);

  // Updates the database
  await prisma.instaAccount.update({
    where: { id: accountId },
    data: {
      accessToken: data.access_token,
      tokenExpiresAt: expiresAt,
      lastSyncedAt: new Date(),
    },
  });

  return {
    accessToken: data.access_token,
    expiresAt,
  };
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
export async function getValidAccessToken(accountId: string): Promise<string> {
  const account = await prisma.instaAccount.findUnique({
    where: { id: accountId },
  });

  if (!account) {
    throw new Error(ERROR_MESSAGES.AUTH.NO_INSTAGRAM_ACCOUNT);
  }

  // Checks if token needs refresh (within 7 days of expiry)
  if (isTokenExpiringSoon(account.tokenExpiresAt)) {
    const { accessToken } = await refreshAccessToken(accountId);
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
 * Batch refreshes tokens for multiple accounts
 */
export async function batchRefreshTokens(accountIds: string[]): Promise<{
  successful: string[];
  failed: Array<{ accountId: string; error: string }>;
}> {
  const successful: string[] = [];
  const failed: Array<{ accountId: string; error: string }> = [];

  for (const accountId of accountIds) {
    try {
      await refreshAccessToken(accountId);
      successful.push(accountId);
    } catch (error) {
      failed.push({
        accountId,
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }

  return { successful, failed };
}

/**
 * Validates token by making a test API call using Facebook Graph API
 */
export async function validateToken(
  accessToken: string,
  instagramUserId: string
): Promise<boolean> {
  try {
    const url = buildGraphApiUrl(GRAPH_API.ENDPOINTS.USER_INFO(instagramUserId));
    url.searchParams.set("fields", "id");
    url.searchParams.set("access_token", accessToken);

    const response = await fetch(url.toString());
    return response.ok;
  } catch {
    return false;
  }
}
