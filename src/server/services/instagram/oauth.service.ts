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
import { deleteInstaAccount } from "@/server/repository/instagram/insta-account.repository";
import { validateSecureState } from "@/server/instagram/oauth/oauth-state";
import {
  exchangeCodeForToken,
  calculateTokenExpiration,
  getLongLivedToken,
} from "@/server/instagram/token-manager";
import { ApiRouteError } from "@/server/middleware/errors/classes";
import { OAuthState } from "@dm-broo/common-types";
import { getRedisClient } from "@/server/redis";
import { redisKeys } from "@/server/redis/keys";

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
  // const serverUser = await getServerUser();
  // if (!serverUser) {
  //   throw new ApiRouteError(ERROR_MESSAGES.AUTH.NO_USER);
  // }
  // const { fullName, emailAddresses, imageUrl } = serverUser;

  try {
    // Decodes and validates state
    const { clerkId, returnUrl } = validateSecureState(state);

    // Exchanges code for short-lived token (returns user_id too)
    const shortLivedToken = await exchangeCodeForToken(code);

    // Exchanges for long-lived token (60 days)
    const longLivedToken = await getLongLivedToken(
      shortLivedToken.access_token,
    );

    // Fetches Instagram user data using the token
    // Passes user_id from token exchange for direct access
    const instagramUser = await fetchInstagramUserData(
      longLivedToken.access_token,
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
              email: "",
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
      const { createClerkClient } = await import("@clerk/nextjs/server");
      const clerkClient = createClerkClient({
        secretKey: process.env.CLERK_SECRET_KEY,
      });
      await clerkClient.users.updateUserMetadata(clerkId, {
        publicMetadata: {
          isConnected: true,
        },
      });
    } catch (metadataError) {
      console.error("Failed to update Clerk metadata:", metadataError);
      // Non-fatal: the DB is updated, but middleware might be slightly out of sync
      // until the next session refresh or manual fix
    }

    const redisClient = getRedisClient();

    await redisClient.set(
      `insta-account:${clerkId}`,
      JSON.stringify({
        id: instaAccount.id,
        username: instaAccount.username,
        accountType: instaAccount.accountType,
        profilePictureUrl: instaAccount.profilePictureUrl,
        biography: instaAccount.biography,
        followersCount: instaAccount.followersCount,
        followsCount: instaAccount.followsCount,
        mediaCount: instaAccount.mediaCount,
        lastSyncedAt: instaAccount.lastSyncedAt,
      }),
    );

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
  const { expiresAt } = await refreshToken(user.instaAccount);

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

  // Clear Redis cache to ensure no stale profile data remains
  try {
    const redisClient = getRedisClient();
    await redisClient.del(redisKeys.instagram.account(clerkId));
  } catch (redisError) {
    console.error("Failed to clear Redis cache on disconnect:", redisError);
  }

  // Finds user with Instagram account
  const user = await findUserWithInstaAccount(clerkId);

  // If user doesn't exist in Prisma, that's fine, we already fixed their Clerk state!
  if (user && user.instaAccount) {
    // Deletes the Instagram account (cascade will delete automations)
    await deleteInstaAccount(user.instaAccount.id, clerkId);
  }

  return {
    message: "Instagram account disconnected successfully",
  };
}
