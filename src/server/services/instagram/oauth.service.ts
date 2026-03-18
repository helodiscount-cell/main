/**
 * OAuth Service
 * Contains business logic for Instagram OAuth flow using Instagram Login
 * No Facebook Pages required - uses Instagram User access token directly
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
import { findUserWithInstaAccount } from "@/server/repository/user/user.repository";
import {
  deleteInstaAccount,
  deactivateInstaAccount,
} from "@/server/repository/instagram/insta-account.repository";
import { validateSecureState } from "@/server/instagram/oauth/oauth-state";
import {
  exchangeCodeForToken,
  calculateTokenExpiration,
  getLongLivedToken,
} from "@/server/instagram/token-manager";
import { ApiRouteError } from "@/server/middleware/errors/classes";
import { OAuthState } from "@dm-broo/common-types";
import { getRedisClient } from "@/server/redis";
import { KEYS } from "@/server/redis/keys";
import {
  setUserConnected,
  invalidateUser,
} from "@/server/redis/operations/user";
import { cacheAccessTokenR } from "@/server/redis/operations/token";
import { createClerkClient } from "@clerk/nextjs/server";

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
        // Finds or creates user
        let user = await tx.user.findUnique({
          where: { clerkId },
        });

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

        // Upserts Instagram account
        // Ensures Instagram user ID is stored as a string
        const instagramUserIdString = String(instagramUser.id);

        const instaAccount = await tx.instaAccount.upsert({
          where: { userId: user.id },
          update: {
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
            refreshToken: null,
            tokenExpiresAt,
            grantedScopes,
            webhooksEnabled: false,
            isActive: true,
          },
          create: {
            userId: user.id,
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
            refreshToken: null,
            isActive: true,
            tokenExpiresAt,
            webhooksEnabled: false,
            grantedScopes,
          },
        });

        // Atomic baseline snapshot for follower tracking
        const nowUtc = new Date();
        const todayUtc = new Date(
          Date.UTC(
            nowUtc.getUTCFullYear(),
            nowUtc.getUTCMonth(),
            nowUtc.getUTCDate(),
          ),
        );

        try {
          await tx.instaFollowerSnapshot.create({
            data: {
              instaAccountId: instaAccount.id,
              followersCount: instagramUser.followers_count || 0,
              date: todayUtc,
            },
          });
        } catch (e: any) {
          // Ignore P2002 unique constraint if they re-connect on the exact same day
          if (e.code !== "P2002") {
            throw e;
          }
        }

        return { user, instaAccount };
      },
      {
        operation: "handleOAuthCallback",
        models: ["User", "InstaAccount"],
      },
    );

    // Updates Clerk metadata to reflect connection status
    // This allows the middleware to check connection status without a DB query
    try {
      await clerkClient.users.updateUserMetadata(clerkId, {
        publicMetadata: {
          isConnected: true,
          instaUsername: instagramUser.username,
          instaProfilePictureUrl: instagramUser.profile_picture_url,
          instaUserId: instagramUser.id,
          instaAccountType: instagramUser.account_type,
          lastSync: new Date().toISOString(),
        },
      });
    } catch (metadataError) {
      console.error("Failed to update Clerk metadata:", metadataError);
      // Non-fatal: the DB is updated, but middleware might be slightly out of sync
      // until the next session refresh or manual fix
    }

    // Registers webhooks using Instagram user ID
    try {
      const webhookRegistered = await subscribeToWebhooks(
        longLivedToken.access_token,
        instagramUser.id,
      );

      if (webhookRegistered) {
        await markWebhooksEnabled(instaAccount.id, true);
      }
    } catch (webhookError) {
      // Non-fatal: user can still use the app without webhooks
    }

    // Actively populate Redis cache so the worker is instantly aware of the connection
    await setUserConnected(String(instagramUser.id));
    await cacheAccessTokenR(instaAccount.id, longLivedToken.access_token);

    return {
      returnUrl: returnUrl || "/dash",
      username: instagramUser.username,
      accountType: instagramUser.account_type,
    };
  } catch (error) {
    throw error;
  }
}

/**
 * Refreshes the access token for an Instagram account
 * @param clerkId - The Clerk ID of the user
 * @returns The refresh access token result with the message and expires at
 */
export async function refreshAccessToken(clerkId: string) {
  // Finds user with Instagram account
  const user = await findUserWithInstaAccount(clerkId);

  if (!user || !user.instaAccount) {
    throw new Error(ERROR_MESSAGES.AUTH.NO_INSTAGRAM_ACCOUNT);
  }

  // Refreshes the token
  const { accessToken, expiresAt } = await refreshToken(user.instaAccount);

  // Actively push new token to cache so the worker doesn't miss
  await cacheAccessTokenR(user.instaAccount.id, accessToken);

  return {
    message: "Token refreshed successfully",
    expiresAt: expiresAt.toISOString(),
  };
}

export async function disconnectAccount(clerkId: string) {
  // Always update Clerk metadata to reflect disconnection first to prevent zombie states
  try {
    const { createClerkClient } = await import("@clerk/nextjs/server");
    const clerkClient = createClerkClient({
      secretKey: process.env.CLERK_SECRET_KEY,
    });
    await clerkClient.users.updateUserMetadata(clerkId, {
      publicMetadata: {
        isConnected: false,
      },
    });
  } catch (metadataError) {
    console.error(
      "Failed to update Clerk metadata on disconnect:",
      metadataError,
    );
  }

  // Finds user with Instagram account
  const user = await findUserWithInstaAccount(clerkId);

  // If user doesn't exist in Prisma, that's fine, we already fixed their Clerk state!
  if (user && user.instaAccount) {
    // Actively invalidate Redis Cache using all Identifiers
    await invalidateUser(
      user.instaAccount.instagramUserId,
      user.id,
      user.instaAccount.id,
    );

    // Deactivates the Instagram account (leaves it intact for history but inactive)
    await deactivateInstaAccount(user.instaAccount.id, clerkId);
  }

  return {
    message: "Instagram account disconnected successfully",
  };
}
