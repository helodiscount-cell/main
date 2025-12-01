# Backend Architecture Documentation

## 1. System Overview

This application is a Next.js-based platform designed to automate Instagram interactions. It connects to Instagram accounts via the Graph API, listens for real-time events (comments, messages) using webhooks, and executes automated responses based on user-defined rules.

### Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Authentication**: Clerk (User Auth) + OAuth 2.0 (Instagram Integration)
- **External API**: Instagram Graph API

## 2. Project Structure (Backend Focus)

The backend logic is primarily distributed across two main directories: `src/app/api` for HTTP endpoints and `src/lib` for core business logic and helper services.

```
src/
├── app/
│   └── api/              # HTTP Route Handlers
│       ├── automations/  # Automation CRUD operations
│       ├── instagram/    # Instagram API integration endpoints
│       ├── users/        # User management
│       └── webhooks/     # Webhook receivers
└── lib/                  # Business Logic & Services
    ├── automation/       # Automation execution engine
    ├── instagram/        # Instagram API wrappers and helpers
    └── db.ts             # Prisma client instance
```

## 3. API Endpoints

The API is organized into RESTful routes using Next.js App Router conventions.

### Automation Routes

| Route                          | File                                      | Description                                           |
| ------------------------------ | ----------------------------------------- | ----------------------------------------------------- |
| `GET /api/automations/list`    | `src/app/api/automations/list/route.ts`   | Retrieves a list of automations for the current user. |
| `POST /api/automations/create` | `src/app/api/automations/create/route.ts` | Creates a new automation rule.                        |
| `GET /api/automations/[id]`    | `src/app/api/automations/[id]/route.ts`   | Retrieves a specific automation by ID.                |
| `PUT /api/automations/[id]`    | `src/app/api/automations/[id]/route.ts`   | Updates a specific automation.                        |
| `DELETE /api/automations/[id]` | `src/app/api/automations/[id]/route.ts`   | Deletes a specific automation.                        |

### Instagram Integration Routes

| Route                                  | File                                              | Description                                                                     |
| -------------------------------------- | ------------------------------------------------- | ------------------------------------------------------------------------------- |
| `GET /api/instagram/oauth/authorize`   | `src/app/api/instagram/oauth/authorize/route.ts`  | Initiates the Instagram OAuth flow.                                             |
| `GET /api/instagram/oauth/callback`    | `src/app/api/instagram/oauth/callback/route.ts`   | Handles the redirect from Instagram, exchanges tokens, and sets up the account. |
| `POST /api/instagram/oauth/disconnect` | `src/app/api/instagram/oauth/disconnect/route.ts` | Disconnects the Instagram account and revokes tokens.                           |
| `POST /api/instagram/oauth/refresh`    | `src/app/api/instagram/oauth/refresh/route.ts`    | Manually refreshes the long-lived access token.                                 |
| `GET /api/instagram/posts`             | `src/app/api/instagram/posts/route.ts`            | Fetches recent posts from the connected Instagram account.                      |
| `GET /api/instagram/status`            | `src/app/api/instagram/status/route.ts`           | Checks the connection status of the Instagram account.                          |

### Webhooks

| Route                          | File                                      | Description                                                  |
| ------------------------------ | ----------------------------------------- | ------------------------------------------------------------ |
| `GET /api/webhooks/instagram`  | `src/app/api/webhooks/instagram/route.ts` | Handles webhook verification (challenge-response) from Meta. |
| `POST /api/webhooks/instagram` | `src/app/api/webhooks/instagram/route.ts` | Receives real-time event payloads (comments, messages).      |

### User Routes

| Route                    | File                                | Description                                   |
| ------------------------ | ----------------------------------- | --------------------------------------------- |
| `POST /api/users/ensure` | `src/app/api/users/ensure/route.ts` | Syncs the Clerk user with the local database. |

## 4. Core Modules (`src/lib`)

The `src/lib` directory contains the reusable logic that powers the API routes and background processes.

### Automation Module (`src/lib/automation/`)

- **`executor.ts`**: The core engine that performs actions. It handles:
  - Rate limiting checks.
  - Executing specific actions (COMMENT_REPLY, DM).
  - Retry logic for failed actions.
  - Logging execution results to the database.
  - **Private Reply Strategy**: Implements the "Private Reply" logic to bypass the 24h window for initial DMs.
- **`matcher.ts`**: Logic for matching incoming comments against defined automation rules.
  - Supports keyword matching (CONTAINS, EXACT).
  - Filters by specific posts if configured.

### Instagram Module (`src/lib/instagram/`)

- **`webhook-handler.ts`**: Processes incoming webhook payloads.
  - Routes events (comments vs messages) to appropriate handlers.
  - Orchestrates the flow: Event -> Matcher -> Executor.
- **`webhook-validator.ts`**: Verifies the `X-Hub-Signature-256` header to ensure request integrity.
- **`webhook-registration.ts`**: Handles subscribing the Facebook Page to Instagram events.
- **`oauth.ts`**: Helper functions for the OAuth flow (token exchange, getting user details).
- **`token-manager.ts`**: Manages access tokens, including retrieval and refreshing.
- **`comments-api.ts`**: Wrapper around Instagram Graph API for comment operations (reply, delete).
- **`messaging-api.ts`**: Wrapper around Instagram Graph API for Direct Messages.
  - Handles standard DMs and "Private Replies" (using `comment_id` as recipient).
  - Checks messaging window constraints.
- **`rate-limiter.ts`**: Implements rate limiting logic to prevent API abuse.

## 5. Key Workflows

### A. OAuth Connection Flow

1.  **Initiation**: User visits `/api/instagram/oauth/authorize`, which redirects to Facebook/Instagram login.
2.  **Callback**: User is redirected to `/api/instagram/oauth/callback` with a code.
3.  **Token Exchange**: Backend exchanges the code for a short-lived token, then upgrades it to a long-lived token (60 days).
4.  **Page Discovery**: Fetches associated Facebook Pages to find the linked Instagram Business Account.
5.  **Persistence**: Stores account details and tokens in the `InstaAccount` table.
6.  **Webhook Registration**: Automatically subscribes the page to "instagram" webhooks.

### B. Webhook Processing & Automation

1.  **Reception**: Instagram sends a POST request to `/api/webhooks/instagram`.
2.  **Verification**: `route.ts` verifies the signature using `webhook-validator.ts`.
3.  **Processing**: Payload is passed to `processWebhookEvent` in `webhook-handler.ts`.
4.  **Matching**: `handleCommentEvent` fetches active automations for the post and uses `matcher.ts` to find matching rules.
5.  **Execution**:
    - If a match is found, `executor.ts` is called.
    - Checks rate limits.
    - Performs the action (e.g., send DM via `messaging-api.ts`).
    - Logs the execution in `AutomationExecution` table.

### C. Private Reply Strategy (Compliance)

To comply with Instagram's 24-hour messaging window:

1.  When a comment triggers a DM automation, `executor.ts` calls `sendDirectMessage` with the `commentId`.
2.  `messaging-api.ts` detects the `commentId` and structures the API payload to be a **Private Reply**.
3.  This allows the initial message to be sent even if the user hasn't messaged the account recently.
4.  Subsequent messages rely on user interaction to reset the 24-hour window.

## 6. Database Interaction

The application uses Prisma ORM to interact with the PostgreSQL database. Key models involved in the backend logic:

- **User**: The application user (synced with Clerk).
- **InstaAccount**: Stores Instagram connection details (tokens, page ID, user ID).
- **Automation**: Stores the rules defined by the user (triggers, actions, messages).
- **AutomationExecution**: Logs history of triggered automations.
- **WebhookEvent**: (Optional) Raw log of received webhook events for debugging.
