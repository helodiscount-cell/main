/**
 * Instagram OAuth Callback Endpoint
 * Handles the redirect back from Instagram after user authorizes
 */

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import {
  decodeState,
  exchangeCodeForToken,
  getLongLivedToken,
  fetchInstagramUserData,
  fetchFacebookPages,
  validateInstagramAccount,
  calculateTokenExpiration,
} from "@/lib/instagram/oauth";
import { logger } from "@/lib/logger-backend";
import { INSTAGRAM_OAUTH } from "@/config/instagram.config";
import {
  subscribeToWebhooks,
  markWebhooksEnabled,
} from "@/lib/instagram/webhook-registration";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const code = searchParams.get("code");
    const state = searchParams.get("state");
    const error = searchParams.get("error");
    const errorDescription = searchParams.get("error_description");

    // Handles user declining authorization
    if (error) {
      logger.apiRoute("GET", "/api/instagram/oauth/callback", {
        error,
        errorDescription,
      });

      const returnUrl = "/dashboard?error=oauth_declined";
      return NextResponse.redirect(new URL(returnUrl, request.url));
    }

    // Validates required parameters
    if (!code || !state) {
      logger.apiRoute("GET", "/api/instagram/oauth/callback", {
        error: "Missing code or state",
      });

      const returnUrl = "/dashboard?error=oauth_invalid";
      return NextResponse.redirect(new URL(returnUrl, request.url));
    }

    // Decodes and validates state
    let oauthState;
    try {
      oauthState = decodeState(state);
    } catch (err) {
      logger.apiRoute("GET", "/api/instagram/oauth/callback", {
        error: "Invalid state parameter",
      });

      const returnUrl = "/dashboard?error=oauth_invalid_state";
      return NextResponse.redirect(new URL(returnUrl, request.url));
    }

    const { clerkId, returnUrl } = oauthState;

    // Step 1: Exchange code for short-lived token
    logger.apiRoute("GET", "/api/instagram/oauth/callback", {
      step: "exchange_code",
      clerkId,
    });

    const shortLivedToken = await exchangeCodeForToken(code);

    // Step 2: Exchange for long-lived token (60 days)
    logger.apiRoute("GET", "/api/instagram/oauth/callback", {
      step: "get_long_lived_token",
      clerkId,
    });

    const longLivedToken = await getLongLivedToken(
      shortLivedToken.access_token
    );

    // Step 3: Fetch Facebook Pages (needed to get Instagram Business Account)
    logger.apiRoute("GET", "/api/instagram/oauth/callback", {
      step: "fetch_facebook_pages",
      clerkId,
    });

    const pages = await fetchFacebookPages(longLivedToken.access_token);

    // Finds page with linked Instagram Business Account
    const linkedPage = pages.data.find(
      (page) => page.instagram_business_account?.id
    );

    if (!linkedPage || !linkedPage.instagram_business_account) {
      logger.apiRoute("GET", "/api/instagram/oauth/callback", {
        error: "No Instagram Business Account found",
        hint: "Make sure your Instagram account is linked to a Facebook Page",
      });

      const errorUrl = `/dashboard?error=no_instagram_account`;
      return NextResponse.redirect(new URL(errorUrl, request.url));
    }

    const instagramAccountId = linkedPage.instagram_business_account.id;
    const facebookPageId = linkedPage.id;
    const facebookPageName = linkedPage.name;
    const pageAccessToken = linkedPage.access_token;

    // Step 4: Fetch Instagram user data using page access token
    logger.apiRoute("GET", "/api/instagram/oauth/callback", {
      step: "fetch_instagram_data",
      clerkId,
      instagramAccountId,
    });

    const instagramUser = await fetchInstagramUserData(
      pageAccessToken,
      instagramAccountId
    );

    // Step 5: Validate account type
    const validation = validateInstagramAccount(instagramUser);
    if (!validation.valid) {
      logger.apiRoute("GET", "/api/instagram/oauth/callback", {
        error: "Invalid account type",
        accountType: instagramUser.account_type,
      });

      const errorUrl = `/dashboard?error=invalid_account_type`;
      return NextResponse.redirect(new URL(errorUrl, request.url));
    }

    // Step 6: Find or create user in database
    let user = await prisma.user.findUnique({
      where: { clerkId },
    });

    if (!user) {
      // Creates user if doesn't exist
      user = await prisma.user.create({
        data: {
          clerkId,
          fullName: "",
          email: "",
        },
      });
    }

    // Step 7: Calculate token expiration
    const tokenExpiresAt = calculateTokenExpiration(longLivedToken.expires_in);

    // Step 8: Upsert Instagram account (using page access token)
    const grantedScopes = INSTAGRAM_OAUTH.SCOPES.split(",");

    const instaAccount = await prisma.instaAccount.upsert({
      where: { userId: user.id },
      create: {
        userId: user.id,
        instagramUserId: instagramUser.id,
        username: instagramUser.username,
        accountType: instagramUser.account_type,
        accessToken: pageAccessToken, // Use page access token for Instagram API
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
        accessToken: pageAccessToken, // Use page access token for Instagram API
        tokenExpiresAt,
        grantedScopes,
        facebookPageId,
        facebookPageName,
        connectedAt: new Date(),
        lastSyncedAt: new Date(),
        isActive: true,
      },
    });

    // Step 9: Register webhooks
    logger.apiRoute("GET", "/api/instagram/oauth/callback", {
      step: "register_webhooks",
      pageId: facebookPageId,
    });

    try {
      const webhookRegistered = await subscribeToWebhooks(
        pageAccessToken, // Use page access token for webhook subscription
        facebookPageId
      );

      if (webhookRegistered) {
        await markWebhooksEnabled(instaAccount.id, true);
        logger.apiRoute("GET", "/api/instagram/oauth/callback", {
          step: "webhooks_registered",
        });
      } else {
        logger.apiRoute("GET", "/api/instagram/oauth/callback", {
          warning: "Webhook registration failed",
        });
      }
    } catch (webhookError) {
      // Non-fatal: user can still use the app without webhooks
      logger.apiRoute("GET", "/api/instagram/oauth/callback", {
        warning: "Webhook registration error",
        error:
          webhookError instanceof Error
            ? webhookError.message
            : "Unknown error",
      });
    }

    logger.apiRoute("GET", "/api/instagram/oauth/callback", {
      step: "complete",
      clerkId,
      username: instagramUser.username,
      accountType: instagramUser.account_type,
      hasPage: true,
      webhooksEnabled: true,
    });

    // Redirects back to the return URL with success
    const successUrl = `${returnUrl || "/dashboard"}?connected=true`;
    const redirectUrl = new URL(successUrl, request.url);

    // Fixes protocol for localhost (dev environment)
    if (redirectUrl.hostname === "localhost" || redirectUrl.hostname === "127.0.0.1") {
      redirectUrl.protocol = "http:";
    }

    return NextResponse.redirect(redirectUrl);
  } catch (error) {
    console.error("Error in OAuth callback:", error);
    logger.apiRoute("GET", "/api/instagram/oauth/callback", {
      error: "Internal error",
      details: error instanceof Error ? error.message : "Unknown error",
    });

    const errorUrl = "/dashboard?error=oauth_failed";
    const redirectUrl = new URL(errorUrl, request.url);

    // Fixes protocol for localhost (dev environment)
    if (redirectUrl.hostname === "localhost" || redirectUrl.hostname === "127.0.0.1") {
      redirectUrl.protocol = "http:";
    }

    return NextResponse.redirect(redirectUrl);
  }
}
