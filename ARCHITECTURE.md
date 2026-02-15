# React Query Architecture

## Data Flow Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                         React Component                          │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │  useInstagramAccountApi()                                      │ │
│  │  useStartInstagramOAuthApi()                                   │ │
│  │  useDisconnectInstagramApi()                                   │ │
│  └────────────────────────────────────────────────────────────┘ │
└───────────────────────────┬─────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────────┐
│                      React Query Hooks                           │
│                 (src/hooks/use-instagram-oauth.ts)               │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │  • useQuery / useMutation                                   │ │
│  │  • Cache management                                         │ │
│  │  • Loading/error states                                     │ │
│  │  • Toast notifications                                      │ │
│  └────────────────────────────────────────────────────────────┘ │
└───────────────────────────┬─────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────────┐
│                       API Service Layer                          │
│          (src/lib/api/services/instagram/oauth.ts)               │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │  instagramService {                                    │ │
│  │    start()                                             │ │
│  │    getAccountInfo()                                         │ │
│  │    disconnect()                                             │ │
│  │  }                                                          │ │
│  └────────────────────────────────────────────────────────────┘ │
└───────────────────────────┬─────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────────┐
│                        API Client                                │
│                  (src/lib/api/client.ts)                         │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │  • Axios instance                                           │ │
│  │  • Request interceptor (logging)                            │ │
│  │  • Response interceptor (error handling)                    │ │
│  │  • request<T>() helper                                      │ │
│  └────────────────────────────────────────────────────────────┘ │
└───────────────────────────┬─────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────────┐
│                         Backend API                              │
│                    (Your Express/Next.js API)                    │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │  /api/instagram/oauth/start                                 │ │
│  │  /api/instagram/account                                     │ │
│  │  /api/instagram/disconnect                                  │ │
│  └────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
```

## Component Usage Example

```tsx
// Simple usage
import { useInstagramAccountApi, useStartInstagramOAuthApi } from "@/hooks";

function MyComponent() {
  const { data: account, isLoading } = useInstagramAccountApi();
  const { mutate: connect, isPending } = useStartInstagramOAuthApi();

  return (
    <button onClick={() => connect()} disabled={isPending}>
      {account?.isConnected ? account.username : "Connect"}
    </button>
  );
}
```

## Cache Flow

```
User Action → Mutation → API Call → Success
                                      │
                                      ▼
                            Invalidate Cache
                                      │
                                      ▼
                            Refetch Queries
                                      │
                                      ▼
                            UI Updates Automatically
```

## Benefits

1. **Type Safety**: Full TypeScript support from API to UI
2. **Automatic Caching**: No manual state management needed
3. **Optimistic Updates**: UI updates before API confirms
4. **Error Handling**: Centralized error handling with toasts
5. **DevTools**: Visual debugging in development
6. **Code Reusability**: Hooks can be used anywhere
7. **Separation of Concerns**: Clear layers (UI → Hooks → Service → API)
