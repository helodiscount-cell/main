# Instagram Connection Flow Documentation

This document explains the end-to-end flow of connecting an Instagram Business account to the application, including the key API endpoints and helper functions involved.

## 1. High-Level Overview

The connection process uses **OAuth 2.0** to authenticate the user via Facebook/Meta. Since Instagram Graph API access is managed through Facebook Pages, the flow involves:

1.  **Initiation**: User clicks "Connect" -> Redirects to Facebook Login.
2.  **Authorization**: User grants permissions to the app.
3.  **Callback**: Facebook redirects back to our app with a `code`.
4.  **Token Exchange**: We swap the `code` for a short-lived token, then upgrade it to a long-lived token (60 days).
5.  **Account Discovery**: We fetch the user's Facebook Pages to find the linked Instagram Business account.
6.  **Persistence**: We save the tokens and account ID to the database.
7.  **Webhook Setup**: We automatically subscribe the page to real-time events.

---

## 2. End-to-End Flow Details

### Phase 1: Initiation (Frontend & API)

- **User Action**: User clicks the "Connect Instagram" button on the dashboard (`src/components/instagram/connect.tsx`).
- **API Endpoint**: `GET /api/instagram/oauth/authorize`
  - This endpoint checks if the user is logged in (Clerk).
  - It calls `initiateOAuth` from the service layer.
  - It redirects the user's browser to the Meta authorization page.

### Phase 2: Handling the Callback

- **User Action**: User approves the app on Facebook and is redirected back.
- **API Endpoint**: `GET /api/instagram/oauth/callback`
  - Receives `code` and `state` params from the URL.
  - Validates `state` to prevent CSRF attacks.
  - Calls `handleOAuthCallback` which orchestrates the entire connection logic.

### Phase 3: Service Layer Logic (`oauth.service.ts`)

The `handleOAuthCallback` function is the core coordinator. It performs these steps sequentially:

1.  **Code Exchange**: Calls `exchangeCodeForToken` to get a short-lived access token.
2.  **Token Upgrade**: Calls `getLongLivedToken` to get a 60-day token.
3.  **Page Discovery**: Calls `fetchFacebookPages` to get a list of pages the user manages.
4.  **Account Linking**: Iterates through pages to find one with a `instagram_business_account` field.
5.  **Data Fetching**: Calls `fetchInstagramUserData` to get the Instagram handle and profile info.
6.  **Database Transaction**:
    - Finds or creates the `User`.
    - Upserts the `InstaAccount` record with the new tokens and Page ID.
7.  **Webhook Registration**: Calls `subscribeToWebhooks` to enable real-time updates.

---

## 3. Helper Functions Reference

These functions are located in `src/lib/instagram/oauth.ts` and handle the specific interactions with the Meta Graph API.

### Authentication Helpers

- **`generateAuthorizationUrl(state)`**

  - **Gist**: Constructs the Facebook Login URL. It includes the `client_id`, `redirect_uri`, and the requested `scope` (permissions). It also encodes a secure `state` parameter to protect against cross-site request forgery.

- **`exchangeCodeForToken(code)`**

  - **Gist**: Sends the temporary authorization `code` to Facebook's OAuth endpoint and returns a short-lived user access token (valid for ~1 hour).

- **`getLongLivedToken(shortLivedToken)`**
  - **Gist**: Takes the short-lived token and calls the `fb_exchange_token` endpoint. It returns a long-lived token (valid for 60 days) which we store in the database.

### Graph API Helpers

- **`fetchFacebookPages(accessToken)`**

  - **Gist**: Queries `me/accounts` on the Graph API. It returns a list of Facebook Pages the user manages, including their specific Page Access Tokens and any connected Instagram Business IDs.

- **`fetchInstagramUserData(accessToken, instagramAccountId)`**
  - **Gist**: Queries the specific Instagram Business Account ID. It retrieves the username, profile picture, and verifies the account type.

### Security & Validation Helpers

- **`decodeState(encodedState)`**

  - **Gist**: Decrypts/Verifies the `state` parameter returned by Facebook. It ensures the request originated from our app and hasn't expired.

- **`validateInstagramAccount(userData)`**

  - **Gist**: Checks if the connected account is actually a Business or Creator account. Personal accounts are not supported by the Instagram Graph API, so we reject them here.

- **`calculateTokenExpiration(expiresIn)`**
  - **Gist**: A simple utility that takes the `expires_in` seconds from the API response and calculates the exact JavaScript `Date` object for when the token will expire.

### Webhook Helpers (in `webhook-registration.ts`)

- **`subscribeToWebhooks(pageAccessToken, pageId)`**
  - **Gist**: Sends a POST request to the Page's subscribed_apps edge. This tells Facebook "Start sending webhook events for this Page to the callback URL defined in the App Dashboard."
