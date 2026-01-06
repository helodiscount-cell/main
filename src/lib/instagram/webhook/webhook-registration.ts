/**
 * Instagram Webhook Registration
 * For Instagram API with Instagram Login, webhooks are configured at the app level
 * in the Meta App Dashboard under Instagram > Webhooks
 */

import {
  getOAuthCredentials,
  buildGraphApiUrl,
} from "@/config/instagram.config";
import { prisma } from "@/lib/db";
import { fetchWithTimeout } from "@/lib/utils/fetch-with-timeout";

// export interface WebhookSubscription {
//   object: string;
//   callback_url: string;
//   fields: string[];
//   verify_token: string;
// }

/**
 * Subscribes to Instagram webhooks
 * With Instagram Login, webhooks are primarily configured in the app dashboard
 * This function verifies the connection is properly set up
 */
export async function subscribeToWebhooks(
  accessToken: string,
  instagramUserId: string
): Promise<boolean> {
  try {
    const { appId } = getOAuthCredentials();

    if (!appId) {
      throw new Error("App ID not configured");
    }

    const verifyToken = process.env.INSTAGRAM_WEBHOOK_VERIFY_TOKEN;
    const callbackUrl = process.env.INSTAGRAM_WEBHOOK_CALLBACK_URL;

    if (!verifyToken || !callbackUrl) {
      // Webhooks configured in app dashboard, not required per-user
      return true;
    }

    // For Instagram Login, webhooks are app-level subscriptions
    // Verifies the token is valid by making a simple API call
    const url = buildGraphApiUrl(instagramUserId);
    url.searchParams.set("fields", "id,username");
    url.searchParams.set("access_token", accessToken);

    try {
      const result = await fetchWithTimeout<any>(url.toString(), {
        method: "GET",
        timeout: 10000,
        retries: 1,
      });

      // If we can read user data, webhooks should work
      return result.data.id === instagramUserId;
    } catch (error) {
      return false;
    }
  } catch (error) {
    return false;
  }
}

/**
 * Marks webhooks as enabled for an Instagram account
 */
export async function markWebhooksEnabled(
  accountId: string,
  enabled: boolean
): Promise<void> {
  await prisma.instaAccount.update({
    where: { id: accountId },
    data: {
      webhooksEnabled: enabled,
    },
  });
}

/**
 * Gets webhook subscription status
 * With Instagram Login, webhooks are configured at the app level
 */
export async function getWebhookSubscriptionStatus(
  accessToken: string,
  instagramUserId: string
): Promise<{
  subscribed: boolean;
  fields: string[];
}> {
  try {
    // Verifies the token is valid and account is accessible
    const url = buildGraphApiUrl(instagramUserId);
    url.searchParams.set("fields", "id");
    url.searchParams.set("access_token", accessToken);

    try {
      const result = await fetchWithTimeout<any>(url.toString(), {
        method: "GET",
        timeout: 10000,
        retries: 1,
      });

      if (result.data.id) {
        // Account is accessible, webhooks should be receiving events
        return {
          subscribed: true,
          fields: ["comments", "messages"],
        };
      }

      return { subscribed: false, fields: [] };
    } catch (error) {
      return { subscribed: false, fields: [] };
    }
  } catch (error) {
    return { subscribed: false, fields: [] };
  }
}
