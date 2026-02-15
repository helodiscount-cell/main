# React Query Setup Summary

## ✅ What Was Done

### 1. Installed Dependencies

- `@tanstack/react-query` - Core React Query library
- `@tanstack/react-query-devtools` - DevTools for debugging

### 2. Created Query Provider

**File:** `src/providers/query.tsx`

- Configured QueryClient with sensible defaults
- Added React Query DevTools for development
- Set staleTime to 1 minute and disabled refetch on window focus

### 3. Integrated into App Layout

**File:** `src/app/layout.tsx`

- Wrapped the app with `QueryProvider`
- Positioned correctly in the provider hierarchy

### 4. Created Instagram OAuth API Service

**File:** `src/lib/api/services/instagram/oauth.ts`

- `start()` - Initiates OAuth flow
- `getAccountInfo()` - Gets account connection status
- `disconnect()` - Disconnects Instagram account
- All methods use TypeScript types

### 5. Enhanced API Client

**File:** `src/lib/api/client.ts`

- Added request interceptor for logging
- Improved error handling in response interceptor
- Added proper TypeScript types
- Environment-aware logging (dev only)

### 6. Created React Query Hooks

**File:** `src/hooks/use-instagram-oauth.ts`

- `useInstagramAccountApi()` - Query hook for account info
- `useStartInstagramOAuthApi()` - Mutation hook to start OAuth
- `useDisconnectInstagramApi()` - Mutation hook to disconnect
- Includes automatic cache invalidation
- Toast notifications for errors

### 7. Updated OAuth Callback Hook

**File:** `src/hooks/use-instagram-oauth-callback.ts`

- Integrated with React Query
- Invalidates cache on successful connection
- Cleans up URL parameters

### 8. Created Example Component

**File:** `src/components/InstagramConnectButton.tsx`

- Shows how to use the hooks
- Handles loading states
- Shows connected/disconnected states

### 9. Documentation

**File:** `src/lib/api/README.md`

- Complete usage guide
- Examples for adding new services
- Best practices

## 🎯 How to Use

### Basic Usage (Recommended)

```tsx
import {
  useStartInstagramOAuthApi,
  useInstagramAccountApi,
} from "@/hooks/use-instagram-oauth";

function MyComponent() {
  const { data: account, isLoading } = useInstagramAccountApi();
  const { mutate: connect } = useStartInstagramOAuthApi();

  if (isLoading) return <div>Loading...</div>;

  return (
    <button onClick={() => connect()}>
      {account?.isConnected ? `@${account.username}` : "Connect Instagram"}
    </button>
  );
}
```

### On OAuth Callback Page

```tsx
import { useInstagramOAuthCallback } from "@/hooks/use-instagram-oauth-callback";

function DashboardPage() {
  useInstagramOAuthCallback(); // Handles ?connected=true or ?error=...

  return <div>Dashboard</div>;
}
```

## 📁 File Structure

```
src/
├── providers/
│   └── query.tsx                    # React Query provider
├── lib/
│   └── api/
│       ├── client.ts                # Axios instance
│       ├── index.ts                 # Central exports
│       ├── README.md                # Documentation
│       └── services/
│           └── instagram/
│               └── oauth.ts         # Instagram OAuth service
├── hooks/
│   ├── use-instagram-oauth.ts       # React Query hooks
│   └── use-instagram-oauth-callback.ts  # OAuth callback handler
└── components/
    └── InstagramConnectButton.tsx   # Example component
```

## 🚀 Next Steps

To add more API endpoints:

1. Create a new service file in `src/lib/api/services/`
2. Export it from `src/lib/api/index.ts`
3. Create React Query hooks in `src/hooks/`
4. Use the hooks in your components

Example:

```typescript
// src/lib/api/services/analytics/index.ts
export const analyticsService = {
  getStats: async () => request(api.get("/api/analytics/stats")),
};

// src/hooks/use-analytics.ts
export function useAnalytics() {
  return useQuery({
    queryKey: ["analytics"],
    queryFn: analyticsService.getStats,
  });
}
```

## 🔧 Environment Variables

Make sure you have:

```env
NEXT_PUBLIC_API_URL=http://localhost:3000
```

## ✨ Features

- ✅ Type-safe API calls
- ✅ Automatic caching
- ✅ Cache invalidation
- ✅ Loading states
- ✅ Error handling
- ✅ Toast notifications
- ✅ DevTools in development
- ✅ Request/response logging (dev only)
