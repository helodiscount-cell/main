# Instagram Connection

## OAuth Flow

Uses Instagram Login (Business Login for Instagram). No Facebook Pages required.

**Endpoints:**
- Authorization: `https://www.instagram.com/oauth/authorize`
- Token exchange: `https://api.instagram.com/oauth/access_token`
- Long-lived token: `https://graph.instagram.com/access_token`
- Refresh: `https://graph.instagram.com/refresh_access_token`

**Flow:**
1. User initiates → `GET /api/instagram/oauth/authorize`
2. Redirects to Instagram with scopes: `instagram_business_basic`, `instagram_business_manage_messages`, `instagram_business_manage_comments`, `instagram_business_content_publish`, `instagram_business_manage_insights`
3. Instagram redirects with `code` → `GET /api/instagram/oauth/callback`
4. Exchanges `code` for short-lived token (returns `access_token`, `user_id`)
5. Exchanges short-lived token for long-lived token (60 days)
6. Fetches user data via `graph.instagram.com/v21.0/me`
7. Validates account type (BUSINESS or MEDIA_CREATOR only)
8. Stores token, user data, expiration in `InstaAccount` table

**State Security:**
- HMAC-signed state parameter prevents CSRF
- Includes `clerkId`, `returnUrl`, expiration, nonce

## Token Management

**Lifecycle:**
- Short-lived: ~1 hour (from code exchange)
- Long-lived: 60 days (from short-lived exchange)
- Refresh: Extends 60 days from refresh date

**Refresh Logic:**
- `getValidAccessToken()` checks expiration
- Auto-refreshes if expiring within 7 days
- Uses `grant_type=ig_refresh_token` with current access token
- Updates `tokenExpiresAt` in database

**Storage:**
- `InstaAccount.accessToken`: Current token
- `InstaAccount.tokenExpiresAt`: Expiration timestamp
- `InstaAccount.lastSyncedAt`: Last refresh time

## Webhooks

**Configuration:**
- App-level subscription in Meta App Dashboard
- Endpoint: `POST /api/webhooks/instagram`
- Verification: `GET /api/webhooks/instagram?hub.mode=subscribe&hub.verify_token=...&hub.challenge=...`

**Events:**
- `comments`: New comments on posts
- `messages`: Direct messages

**Processing:**
1. Validates signature (`x-hub-signature-256`)
2. Parses payload (`entry[]` with `changes[]` or `messaging[]`)
3. Checks account status (Redis cache → DB fallback)
4. Matches automations
5. Executes actions (idempotent via Redis)

**Caching:**
- Account status: `ig:webhook:{instagramUserId}` (1 hour TTL)
- Automation existence: `ig:automation:{clerkId}:{postId}` (5 min TTL)

## API Usage

**Base URL:** `https://graph.instagram.com/v21.0`

**Endpoints:**
- User info: `/{userId}?fields=...&access_token=...`
- User media: `/{userId}/media?fields=...&access_token=...`
- Post comments: `/{postId}/comments?access_token=...`
- Reply comment: `/{commentId}/replies` (POST)
- Send message: `/{igUserId}/messages` (POST)

**Token Usage:**
- All requests require `access_token` query parameter
- Token obtained via `getValidAccessToken(accountId)`
- Auto-refreshes if needed before API calls

## Account Validation

**Requirements:**
- Account type: BUSINESS or MEDIA_CREATOR
- Valid access token
- Active status (`isActive=true`)

**Storage:**
- `instagramUserId`: Instagram user ID (string)
- `webhookUserId`: User ID for webhook events
- `accountType`: BUSINESS | MEDIA_CREATOR
- `isActive`: Connection status

## Disconnection

**Process:**
1. `POST /api/instagram/oauth/disconnect`
2. Deletes `InstaAccount` record
3. Cascades to delete related automations
4. Webhook events ignored (account cache marks inactive)
