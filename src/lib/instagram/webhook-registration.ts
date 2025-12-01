/**
 * Instagram Webhook Registration
 * Registers webhooks with Instagram/Facebook Graph API
 */

import { getOAuthCredentials, buildGraphApiUrl } from "@/config/instagram.config";
import { prisma } from "@/lib/db";

export interface WebhookSubscription {
  object: string;
  callback_url: string;
  fields: string[];
  verify_token: string;
}

/**
 * Subscribes to Instagram webhooks for an app
 * Note: This is done at the app level, not per-user
 */
export async function subscribeToWebhooks(
  accessToken: string,
  pageId: string
): Promise<boolean> {
  try {
    const { appId } = getOAuthCredentials();

    if (!appId) {
      throw new Error("App ID not configured");
    }

    const verifyToken = process.env.INSTAGRAM_WEBHOOK_VERIFY_TOKEN;
    const callbackUrl = process.env.INSTAGRAM_WEBHOOK_CALLBACK_URL;

    if (!verifyToken || !callbackUrl) {
      throw new Error("Webhook configuration incomplete");
    }

    // Subscribes to Instagram webhooks via the Page
    const url = buildGraphApiUrl(`${pageId}/subscribed_apps`);

    const response = await fetch(url.toString(), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        subscribed_fields: ["comments", "messages", "messaging_postbacks"].join(
          ","
        ),
        access_token: accessToken,
      }),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      return false;
    }

    const data = await response.json();
    return data.success === true;
  } catch (error) {
    return false;
  }
}

/**
 * Unsubscribes from Instagram webhooks for a page
 */
export async function unsubscribeFromWebhooks(
  accessToken: string,
  pageId: string
): Promise<boolean> {
  try {
    const url = buildGraphApiUrl(`${pageId}/subscribed_apps`);
    url.searchParams.set("access_token", accessToken);

    const response = await fetch(url.toString(), {
      method: "DELETE",
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      return false;
    }

    return true;
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
 * Gets webhook subscription status for a page
 */
export async function getWebhookSubscriptionStatus(
  accessToken: string,
  pageId: string
): Promise<{
  subscribed: boolean;
  fields: string[];
}> {
  try {
    const statusUrl =
      process.env.NEXT_PUBLIC_FACEBOOK_API_BASE_URL +
      `/${pageId}/subscribed_apps?access_token=${accessToken}`;

    const response = await fetch(statusUrl);

    if (!response.ok) {
      return { subscribed: false, fields: [] };
    }

    const data = await response.json();

    if (data.data && data.data.length > 0) {
      // Checks if our app is subscribed
      const subscription = data.data.find((sub: any) => {
        const appId = getOAuthCredentials().appId;
        return sub.id === appId || sub.name;
      });

      if (subscription) {
        return {
          subscribed: true,
          fields: subscription.subscribed_fields || [],
        };
      }
    }

    return { subscribed: false, fields: [] };
  } catch (error) {
    return { subscribed: false, fields: [] };
  }
}
