/**
 * OAuth Service
 * Business logic for Instagram OAuth flow — no Clerk metadata dependency
 */

import {
  generateAuthorizationUrl,
  fetchInstagramUserData,
  validateInstagramAccount,
} from "@/server/instagram/oauth/oauth";
import {
  INSTAGRAM_OAUTH,
  ERROR_MESSAGES,
  validateOAuthConfig,
} from "@/server/config/instagram.config";
import {
  subscribeToWebhooks,
  markWebhooksEnabled,
} from "@/server/instagram/webhook/registration";
import { refreshAccessToken as refreshToken } from "@/server/instagram/token-manager";
import { findUserByClerkId } from "@/server/repository/user/user.repository";
import { deactivateInstaAccount } from "@/server/repository/instagram/insta-account.repository";
import { validateSecureState } from "@/server/instagram/oauth/oauth-state";
import {
  exchangeCodeForToken,
  calculateTokenExpiration,
  getLongLivedToken,
} from "@/server/instagram/token-manager";
import { ApiRouteError } from "@/server/middleware/errors/classes";
import { OAuthState } from "@dm-broo/common-types";
import {
  setUserConnected,
  invalidateUser,
} from "@/server/redis/operations/user";
import { cacheAccessTokenR } from "@/server/redis/operations/token";
import { createClerkClient } from "@clerk/nextjs/server";
import { prisma } from "@/server/db";

/**
 * Initiates the OAuth flow by generating authorization URL
 * @param clerkId - The Clerk ID of the user
 * @param returnUrl - The URL to redirect to after the OAuth flow
 * @returns The authorization URL
 */
export async function initiateOAuth({
  clerkId,
  returnUrl,
}: OAuthState): Promise<string> {
  // Validates OAuth configuration
  if (!validateOAuthConfig())
    throw new ApiRouteError(
      ERROR_MESSAGES.AUTH.NO_ACCESS_TOKEN,
      "AUTH_NO_ACCESS_TOKEN",
      500,
    );

  // Generates authorization URL with state
  const authUrl = generateAuthorizationUrl({
    clerkId,
    returnUrl: returnUrl || "/dash",
  });

  return authUrl;
}

/**
 * Handles the OAuth callback from Instagram
 * Uses Instagram Login - no Facebook Pages required
 * @param code - The code from the OAuth callback
 * @param state - The secure state from the OAuth callback
 * @returns The OAuth callback result with the return URL, username, and account type
 */
export async function handleOAuthCallback(code: string, state: string) {
  try {
    // Decodes and validates state
    const { clerkId, returnUrl } = validateSecureState(state);

    // Fetch user directly from Clerk using their known ID
    const clerkClient = createClerkClient({
      secretKey: process.env.CLERK_SECRET_KEY,
    });
    const currentClerkUser = await clerkClient.users.getUser(clerkId);

    // Exchanges code for short-lived token (returns user_id too)
    console.log("Exchanging code for short-lived token...");
    const shortLivedToken = await exchangeCodeForToken(code);

    // Exchanges for long-lived token (60 days)
    console.log("Exchanging for long-lived token...");
    const longLivedToken = await getLongLivedToken(
      shortLivedToken.access_token,
    );

    // Fetches Instagram user data using the token
    console.log("Fetching Instagram user data...");
    const instagramUser = await fetchInstagramUserData(
      longLivedToken.access_token,
    );

    console.log(
      "Instagram user data fetched successfully:",
      instagramUser.username,
    );

    // Validates account type (must be BUSINESS or MEDIA_CREATOR)
    const validation = validateInstagramAccount(instagramUser);

    if (!validation.valid) {
      throw new ApiRouteError(
        validation.error || ERROR_MESSAGES.AUTH.INVALID_ACCOUNT_TYPE,
      );
    }

    // Calculates token expiration
    const tokenExpiresAt = calculateTokenExpiration(longLivedToken.expires_in);
    const grantedScopes = INSTAGRAM_OAUTH.SCOPES.split(",");

    // Wraps user creation and Instagram account linking in a transaction
    const { executeTransaction } =
      await import("@/server/repository/repository-utils");

    const { instaAccount } = await executeTransaction(
      async (tx) => {
        // Finds or creates the platform user record
        let user = await tx.user.findUnique({ where: { clerkId } });

        if (!user) {
          user = await tx.user.create({
            data: {
              clerkId,
              fullName: instagramUser.username,
              email: currentClerkUser?.primaryEmailAddress?.emailAddress,
              imageUrl: instagramUser.profile_picture_url,
            },
          });
        }

        const instagramUserIdString = String(instagramUser.id);

        // Pre-flight: ensure this IG account isn't already claimed by another user
        const existingAccount = await tx.instaAccount.findUnique({
          where: { instagramUserId: instagramUserIdString },
          select: { id: true, userId: true, isActive: true },
        });

        if (existingAccount && existingAccount.userId !== user.id) {
          throw new ApiRouteError(
            "This Instagram account is already connected to another Dmbroo account.",
            "IG_ACCOUNT_ALREADY_CLAIMED",
            409,
          );
        }

        const accountPayload = {
          instagramUserId: instagramUserIdString,
          username: instagramUser.username,
          accountType: instagramUser.account_type,
          webhookUserId: instagramUser.user_id,
          profilePictureUrl: instagramUser.profile_picture_url,
          biography: instagramUser.biography,
          followersCount: instagramUser.followers_count,
          followsCount: instagramUser.follows_count,
          mediaCount: instagramUser.media_count,
          accessToken: longLivedToken.access_token,
          refreshToken: null as null,
          tokenExpiresAt,
          grantedScopes,
          webhooksEnabled: false,
          isActive: true,
        };

        // If it's a reconnect of an existing account, update in place; otherwise create a new workspace
        let instaAccount;
        if (existingAccount) {
          instaAccount = await tx.instaAccount.update({
            where: { id: existingAccount.id },
            data: accountPayload,
          });
        } else {
          instaAccount = await tx.instaAccount.create({
            data: { userId: user.id, ...accountPayload },
          });
        }

        // Baseline follower snapshot for the day
        const nowUtc = new Date();
        const todayUtc = new Date(
          Date.UTC(
            nowUtc.getUTCFullYear(),
            nowUtc.getUTCMonth(),
            nowUtc.getUTCDate(),
          ),
        );

        const existingSnapshot = await tx.instaFollowerSnapshot.findUnique({
          where: {
            instaAccountId_date: {
              instaAccountId: instaAccount.id,
              date: todayUtc,
            },
          },
        });

        if (!existingSnapshot) {
          await tx.instaFollowerSnapshot.create({
            data: {
              instaAccountId: instaAccount.id,
              followersCount: instagramUser.followers_count || 0,
              date: todayUtc,
            },
          });
        }

        return { user, instaAccount };
      },
      { operation: "handleOAuthCallback", models: ["User", "InstaAccount"] },
    );

    // Register webhooks (non-fatal)
    try {
      const webhookRegistered = await subscribeToWebhooks(
        longLivedToken.access_token,
        instagramUser.id,
      );
      if (webhookRegistered) {
        await markWebhooksEnabled(instaAccount.id, true);
      }
    } catch {
      // Non-fatal: user can still use the app without webhooks
    }

    // Populate Redis so the worker instantly knows this workspace is live
    await setUserConnected(String(instagramUser.id));
    await cacheAccessTokenR(instaAccount.id, longLivedToken.access_token);

    return {
      returnUrl: returnUrl || "/dash",
      instaAccountId: instaAccount.id,
      username: instagramUser.username,
      accountType: instagramUser.account_type,
    };
  } catch (error) {
    throw error;
  }
}

// Refreshes the access token for a specific Instagram workspace
export async function refreshAccessToken(instaAccountId: string) {
  const account = await prisma.instaAccount.findUnique({
    where: { id: instaAccountId, isActive: true },
  });

  if (!account) {
    throw new Error(ERROR_MESSAGES.AUTH.NO_INSTAGRAM_ACCOUNT);
  }

  const { accessToken, expiresAt } = await refreshToken(account);

  // Push new token to cache so worker picks it up immediately
  await cacheAccessTokenR(account.id, accessToken);

  return {
    message: "Token refreshed successfully",
    expiresAt: expiresAt.toISOString(),
  };
}

// Deactivates a specific Instagram workspace — does not touch Clerk session
export async function disconnectAccount(instaAccountId: string) {
  const account = await prisma.instaAccount.findUnique({
    where: { id: instaAccountId },
    select: {
      id: true,
      userId: true,
      instagramUserId: true,
      user: { select: { id: true } },
    },
  });

  if (!account) return { message: "Account not found" };

  // Flush Redis cache for this workspace immediately
  await invalidateUser(account.instagramUserId, account.user.id, account.id);

  // Soft-deactivate; keeps historical data intact
  await deactivateInstaAccount(account.id, account.user.id);

  return { message: "Instagram account disconnected successfully" };
}
