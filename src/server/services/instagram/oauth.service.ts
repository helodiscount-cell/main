/**
 * OAuth Service
 * Contains business logic for Instagram OAuth flow using Instagram Login
 * No Facebook Pages required - uses Instagram User access token directly
 */

import {
  generateAuthorizationUrl,
  fetchInstagramUserData,
  validateInstagramAccount,
} from "@/lib/instagram/oauth/oauth";
import {
  INSTAGRAM_OAUTH,
  ERROR_MESSAGES,
  validateOAuthConfig,
} from "@/config/instagram.config";
import {
  subscribeToWebhooks,
  markWebhooksEnabled,
} from "@/lib/instagram/webhook/webhook-registration";
import { refreshAccessToken as refreshToken } from "@/lib/instagram/token-manager";
import { findUserWithInstaAccount } from "@/server/repository/user-profile/user.repository";
import { deleteInstaAccount } from "@/server/repository/instagram/insta-account.repository";
import { validateSecureState } from "@/lib/instagram/oauth/oauth-state";
import {
  exchangeCodeForToken,
  calculateTokenExpiration,
  getLongLivedToken,
} from "@/lib/instagram/token-manager";
import { getServerUser } from "@/lib/auth/get-server-user";

/**
 * Initiates the OAuth flow by generating authorization URL
 * @param clerkId - The Clerk ID of the user
 * @param returnUrl - The URL to redirect to after the OAuth flow
 * @returns The authorization URL
 */
export async function initiateOAuth(clerkId: string, returnUrl: string) {
  // Validates OAuth configuration
  if (!validateOAuthConfig()) {
    throw new Error(ERROR_MESSAGES.AUTH.NO_ACCESS_TOKEN);
  }

  // Generates authorization URL with state
  const authUrl = generateAuthorizationUrl({
    clerkId,
    returnUrl: returnUrl || "/dashboard",
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
  const serverUser = await getServerUser();
  if (!serverUser) {
    throw new Error(ERROR_MESSAGES.AUTH.NO_USER);
  }
  const { fullName, emailAddresses, imageUrl } = serverUser;

  try {
    // Decodes and validates state
    const { clerkId, returnUrl } = validateSecureState(state);

    // Exchanges code for short-lived token (returns user_id too)
    const shortLivedToken = await exchangeCodeForToken(code);

    console.log("shortLivedToken", shortLivedToken);

    // Exchanges for long-lived token (60 days)
    const longLivedToken = await getLongLivedToken(
      shortLivedToken.access_token,
    );

    console.log("longLivedToken", longLivedToken);

    // Fetches Instagram user data using the token
    // Passes user_id from token exchange for direct access
    const instagramUser = await fetchInstagramUserData(
      longLivedToken.access_token,
    );

    console.log("instagramUser", instagramUser);

    // Validates account type (must be BUSINESS or MEDIA_CREATOR)
    const validation = validateInstagramAccount(instagramUser);

    if (!validation.valid) {
      throw new Error(
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
              fullName: fullName ?? "",
              email: emailAddresses ?? "",
              imageUrl: imageUrl ?? "",
            },
          });
        }

        // Upserts Instagram account (no Facebook Page needed anymore)
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
      returnUrl: returnUrl || "/dashboard",
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

/**
 * Disconnects the Instagram account for a user
 * @param clerkId - The Clerk ID of the user
 * @returns The disconnect account result with the message
 */
export async function disconnectAccount(clerkId: string) {
  // Finds user with Instagram account
  const user = await findUserWithInstaAccount(clerkId);

  if (!user || !user.instaAccount) {
    throw new Error(ERROR_MESSAGES.AUTH.NO_INSTAGRAM_ACCOUNT);
  }

  // Deletes the Instagram account (cascade will delete automations)
  await deleteInstaAccount(user.instaAccount.id, clerkId);

  return {
    message: "Instagram account disconnected successfully",
  };
}
