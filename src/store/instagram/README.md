# Instagram Zustand Store

This is a simple, beginner-friendly Zustand store for managing Instagram OAuth and account state.

## Installation

Zustand is already installed in this project.

## Store Location

- **Store**: `src/store/index.ts`
- **Helpers**: `src/store/instagram-helpers.ts`
- **Example Component**: `src/components/instagram/InstagramAccountStatus.tsx`

## What the Store Contains

The Instagram store manages:

1. **Account Data** - Instagram account information (username, account type, etc.)
2. **Loading States** - Track if operations are in progress
3. **Error State** - Store and display errors
4. **Actions** - Functions to update the store

## How to Use the Store

### 1. Basic Usage in Components

```tsx
import { useInstagramStore } from "@/store/instagram";

function MyComponent() {
  // Get account data from store
  const account = useInstagramStore((state) => state.account);

  // Get loading state
  const isLoading = useInstagramStore((state) => state.isLoading);

  // Get error
  const error = useInstagramStore((state) => state.error);

  return (
    <div>
      {account && <p>Connected as @{account.username}</p>}
      {isLoading && <p>Loading...</p>}
      {error && <p>Error: {error}</p>}
    </div>
  );
}
```

### 2. Using Multiple Store Values

```tsx
import { useInstagramStore } from "@/store/instagram";

function MyComponent() {
  // Get multiple values at once
  const { account, isLoading, error } = useInstagramStore((state) => ({
    account: state.account,
    isLoading: state.isLoading,
    error: state.error,
  }));

  return <div>{/* Your component */}</div>;
}
```

### 3. Using Store Actions

```tsx
import { useInstagramStore } from "@/store/instagram";

function MyComponent() {
  // Get actions from store
  const setError = useInstagramStore((state) => state.setError);
  const clearError = useInstagramStore((state) => state.clearError);
  const reset = useInstagramStore((state) => state.reset);

  const handleSomething = () => {
    // Set an error
    setError("Something went wrong");

    // Clear error after 3 seconds
    setTimeout(() => {
      clearError();
    }, 3000);
  };

  return (
    <div>
      <button onClick={handleSomething}>Test Error</button>
      <button onClick={reset}>Reset Store</button>
    </div>
  );
}
```

### 4. Using with React Query Hooks

The hooks automatically update the store:

```tsx
import { useInstagramAccountApi } from "@/hooks/api/use-instagram-oauth";
import { useInstagramStore } from "@/store/instagram-store";

function MyComponent() {
  // This hook fetches data AND updates the store
  useInstagramAccountApi();

  // Get data from store (updated by the hook)
  const account = useInstagramStore((state) => state.account);
  const isLoading = useInstagramStore((state) => state.isLoading);

  return (
    <div>
      {isLoading ? (
        <p>Loading...</p>
      ) : account ? (
        <p>Connected as @{account.username}</p>
      ) : (
        <p>Not connected</p>
      )}
    </div>
  );
}
```

### 5. Using Helper Functions (Outside React)

```tsx
import {
  getCurrentAccount,
  isAccountConnected,
  resetInstagramStore,
  setInstagramError,
} from "@/store/instagram-helpers";

// Use in regular functions (not React components)
function checkConnection() {
  if (isAccountConnected()) {
    const account = getCurrentAccount();
    console.log("Connected as", account?.username);
  } else {
    console.log("Not connected");
  }
}

// Set error from anywhere
function handleError() {
  setInstagramError("Something went wrong");
}

// Reset store
function logout() {
  resetInstagramStore();
}
```

## Store State

The store contains these values:

```typescript
{
  // Account data (null if not connected)
  account: {
    id: string;
    username: string;
    accountType: string;
    isConnected: boolean;
  } | null;

  // Loading states
  isLoading: boolean;          // General loading
  isConnecting: boolean;       // OAuth connection in progress
  isDisconnecting: boolean;    // Disconnection in progress

  // Error state
  error: string | null;        // Error message
}
```

## Store Actions

The store provides these actions:

```typescript
{
  setAccount: (account) => void;        // Set account data
  setLoading: (loading) => void;        // Set loading state
  setConnecting: (connecting) => void;  // Set connecting state
  setDisconnecting: (disconnecting) => void; // Set disconnecting state
  setError: (error) => void;            // Set error message
  clearError: () => void;               // Clear error
  reset: () => void;                    // Reset entire store
}
```

## Example: Complete Component

See `src/components/instagram/InstagramAccountStatus.tsx` for a complete example.

## Integration with React Query

The store is integrated with React Query hooks:

- `useInstagramAccountApi()` - Fetches account and updates store
- `useStartInstagramOAuthApi()` - Starts OAuth and updates connecting state
- `useDisconnectInstagramApi()` - Disconnects account and updates store

You can use either:

1. React Query hooks directly (for mutations)
2. Zustand store (for reading state)
3. Both together (recommended)

## Best Practices

1. **Read from store, write with hooks** - Use Zustand to read state, use React Query hooks to perform actions
2. **Use selectors** - Only subscribe to the state you need: `useInstagramStore((state) => state.account)`
3. **Use helpers for non-React code** - Use helper functions when working outside React components
4. **Let hooks update the store** - The React Query hooks automatically update the store, you don't need to do it manually

## Why Use Zustand?

1. **Simple** - Easy to understand and use
2. **No boilerplate** - No providers, actions, or reducers needed
3. **Works everywhere** - Use in components, functions, or anywhere
4. **Small** - Very lightweight library
5. **Fast** - Only re-renders components that use changed state
