# API Client Setup

This directory contains the API client configuration and service modules for the application.

## Structure

```
lib/api/
├── client.ts                 # Axios instance with interceptors
├── index.ts                  # Central export for all services
└── services/
    └── instagram/
        └── oauth.ts          # Instagram OAuth service
```

## Usage

### 1. Using API Services Directly

```typescript
import { instagramService } from "@/lib/api";

// Start OAuth flow
const response = await instagramService.start();
window.location.href = response.url;

// Get account info
const account = await instagramService.getAccountInfo();
```

### 2. Using React Query Hooks (Recommended)

```typescript
import { useStartInstagramOAuthApi, useInstagramAccountApi } from "@/hooks/use-instagram-oauth";

function MyComponent() {
  const { data: account } = useInstagramAccountApi();
  const { mutate: start } = useStartInstagramOAuthApi();

  return (
    <button onClick={() => start()}>
      Connect Instagram
    </button>
  );
}
```

### 3. Handling OAuth Callback

```typescript
import { useInstagramOAuthCallback } from "@/hooks/use-instagram-oauth-callback";

function DashboardPage() {
  // This will automatically handle OAuth callback params
  useInstagramOAuthCallback();

  return <div>Dashboard</div>;
}
```

## Adding New Services

1. Create a new service file in `services/`:

   ```typescript
   // services/analytics/index.ts
   import { api, request } from "@/lib/api/client";

   export const analyticsService = {
     getStats: async () => {
       return request(api.get("/api/analytics/stats"));
     },
   };
   ```

2. Export it from `index.ts`:

   ```typescript
   export * from "./services/analytics";
   ```

3. Create React Query hooks:

   ```typescript
   // hooks/use-analytics.ts
   import { useQuery } from "@tanstack/react-query";
   import { analyticsService } from "@/lib/api";

   export function useAnalytics() {
     return useQuery({
       queryKey: ["analytics", "stats"],
       queryFn: analyticsService.getStats,
     });
   }
   ```

## Environment Variables

Make sure to set the API base URL:

```env
NEXT_PUBLIC_API_URL=http://localhost:3000
```

## Features

- ✅ Axios instance with interceptors
- ✅ Request/response logging in development
- ✅ Error handling with proper status codes
- ✅ TypeScript types for all endpoints
- ✅ React Query integration
- ✅ Automatic cache invalidation
- ✅ Toast notifications for errors
- ✅ React Query DevTools in development
