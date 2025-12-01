/**
 * OAuth Service
 * Contains business logic for Instagram OAuth flow
 */

import { prisma } from "@/lib/db";
import {
  generateAuthorizationUrl,
  decodeState,
  exchangeCodeForToken,
  getLongLivedToken,
  fetchInstagramUserData,
  fetchFacebookPages,
  validateInstagramAccount,
  calculateTokenExpiration,
} from "@/lib/instagram/oauth";
import {
  INSTAGRAM_OAUTH,
  ERROR_MESSAGES,
  validateOAuthConfig,
} from "@/config/instagram.config";
import {
  subscribeToWebhooks,
  markWebhooksEnabled,
} from "@/lib/instagram/webhook-registration";
import { refreshAccessToken as refreshToken } from "@/lib/instagram/token-manager";

/**
 * Initiates the OAuth flow by generating authorization URL
 */
export async function initiateOAuth(clerkId: string, returnUrl?: string) {
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
 */
export async function handleOAuthCallback(code: string, state: string) {
  // Decodes and validates state
  const oauthState = decodeState(state);
  const { clerkId, returnUrl } = oauthState;

  // Exchange code for short-lived token
  const shortLivedToken = await exchangeCodeForToken(code);

  // Exchange for long-lived token (60 days)
  const longLivedToken = await getLongLivedToken(shortLivedToken.access_token);

  // Fetch Facebook Pages (needed to get Instagram Business Account)
  const pages = await fetchFacebookPages(longLivedToken.access_token);

  // Finds page with linked Instagram Business Account
  const linkedPage = pages.data.find(
    (page) => page.instagram_business_account?.id
  );

  if (!linkedPage || !linkedPage.instagram_business_account) {
    throw new Error(ERROR_MESSAGES.AUTH.NO_FACEBOOK_PAGE);
  }

  const instagramAccountId = linkedPage.instagram_business_account.id;
  const facebookPageId = linkedPage.id;
  const facebookPageName = linkedPage.name;
  const pageAccessToken = linkedPage.access_token;

  // Fetch Instagram user data using page access token
  const instagramUser = await fetchInstagramUserData(
    pageAccessToken,
    instagramAccountId
  );

  // Validate account type
  const validation = validateInstagramAccount(instagramUser);
  if (!validation.valid) {
    throw new Error(
      validation.error || ERROR_MESSAGES.AUTH.INVALID_ACCOUNT_TYPE
    );
  }

  // Find or create user in database
  let user = await prisma.user.findUnique({
    where: { clerkId },
  });

  if (!user) {
    user = await prisma.user.create({
      data: {
        clerkId,
        fullName: "",
        email: "",
      },
    });
  }

  // Calculate token expiration
  const tokenExpiresAt = calculateTokenExpiration(longLivedToken.expires_in);

  // Upsert Instagram account (using page access token)
  const grantedScopes = INSTAGRAM_OAUTH.SCOPES.split(",");

  const instaAccount = await prisma.instaAccount.upsert({
    where: { userId: user.id },
    create: {
      userId: user.id,
      instagramUserId: instagramUser.id,
      username: instagramUser.username,
      accountType: instagramUser.account_type,
      accessToken: pageAccessToken,
      refreshToken: null,
      tokenExpiresAt,
      grantedScopes,
      facebookPageId,
      facebookPageName,
      connectedAt: new Date(),
      lastSyncedAt: new Date(),
      webhooksEnabled: false,
      isActive: true,
    },
    update: {
      instagramUserId: instagramUser.id,
      username: instagramUser.username,
      accountType: instagramUser.account_type,
      accessToken: pageAccessToken,
      tokenExpiresAt,
      grantedScopes,
      facebookPageId,
      facebookPageName,
      connectedAt: new Date(),
      lastSyncedAt: new Date(),
      isActive: true,
    },
  });

  // Register webhooks
  try {
    const webhookRegistered = await subscribeToWebhooks(
      pageAccessToken,
      facebookPageId
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
}

/**
 * Refreshes the access token for an Instagram account
 */
export async function refreshAccessToken(clerkId: string) {
  // Finds user with Instagram account
  const user = await prisma.user.findUnique({
    where: { clerkId },
    include: { instaAccount: true },
  });

  if (!user || !user.instaAccount) {
    throw new Error(ERROR_MESSAGES.AUTH.NO_INSTAGRAM_ACCOUNT);
  }

  // Refreshes the token
  const { accessToken, expiresAt } = await refreshToken(user.instaAccount.id);

  return {
    message: "Token refreshed successfully",
    expiresAt: expiresAt.toISOString(),
  };
}

/**
 * Disconnects the Instagram account for a user
 */
export async function disconnectAccount(clerkId: string) {
  // Finds user with Instagram account
  const user = await prisma.user.findUnique({
    where: { clerkId },
    include: { instaAccount: true },
  });

  if (!user || !user.instaAccount) {
    throw new Error(ERROR_MESSAGES.AUTH.NO_INSTAGRAM_ACCOUNT);
  }

  // Deletes the Instagram account (cascade will delete automations)
  await prisma.instaAccount.delete({
    where: { id: user.instaAccount.id },
  });

  return {
    message: "Instagram account disconnected successfully",
  };
}
