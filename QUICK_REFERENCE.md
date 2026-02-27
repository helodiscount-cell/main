# Quick Reference: Adding New API Endpoints

## Step-by-Step Guide

### 1. Create API Service

**Location:** `src/lib/api/services/[feature]/[name].ts`

```typescript
import { api, request } from "@/lib/api/client";

// Define types
export interface MyDataResponse {
  id: string;
  name: string;
}

// Create service
export const myService = {
  getData: async (): Promise<MyDataResponse> => {
    return request(api.get<MyDataResponse>("/api/my-endpoint"));
  },

  createData: async (data: { name: string }): Promise<MyDataResponse> => {
    return request(api.post<MyDataResponse>("/api/my-endpoint", data));
  },
};
```

### 2. Export Service

**Location:** `src/lib/api/index.ts`

```typescript
export * from "./services/my-feature/my-service";
```

### 3. Create React Query Hooks

**Location:** `src/hooks/use-my-feature.ts`

```typescript
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { myService } from "@/lib/api";
import { toast } from "sonner";

// Query keys
export const myFeatureKeys = {
  all: ["my-feature"] as const,
  data: () => [...myFeatureKeys.all, "data"] as const,
};

// Query hook
export function useMyData() {
  return useQuery({
    queryKey: myFeatureKeys.data(),
    queryFn: myService.getData,
  });
}

// Mutation hook
export function useCreateData() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: myService.createData,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: myFeatureKeys.data() });
      toast.success("Data created successfully!");
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to create data");
    },
  });
}
```

### 4. Export Hooks

**Location:** `src/hooks/index.ts`

```typescript
export * from "./use-my-feature";
```

### 5. Use in Component

```tsx
import { useMyData, useCreateData } from "@/hooks";

function MyComponent() {
  const { data, isLoading } = useMyData();
  const { mutate: create, isPending } = useCreateData();

  if (isLoading) return <div>Loading...</div>;

  return (
    <div>
      <p>{data?.name}</p>
      <button onClick={() => create({ name: "New Item" })} disabled={isPending}>
        Create
      </button>
    </div>
  );
}
```

## Common Patterns

### Query with Parameters

```typescript
export function useMyData(id: string) {
  return useQuery({
    queryKey: [...myFeatureKeys.all, id],
    queryFn: () => myService.getData(id),
    enabled: !!id, // Only run if id exists
  });
}
```

### Optimistic Updates

```typescript
export function useUpdateData() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: myService.updateData,
    onMutate: async (newData) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: myFeatureKeys.data() });

      // Snapshot previous value
      const previous = queryClient.getQueryData(myFeatureKeys.data());

      // Optimistically update
      queryClient.setQueryData(myFeatureKeys.data(), newData);

      return { previous };
    },
    onError: (err, newData, context) => {
      // Rollback on error
      queryClient.setQueryData(myFeatureKeys.data(), context?.previous);
    },
    onSettled: () => {
      // Refetch after error or success
      queryClient.invalidateQueries({ queryKey: myFeatureKeys.data() });
    },
  });
}
```

### Pagination

```typescript
export function useMyDataPaginated(page: number) {
  return useQuery({
    queryKey: [...myFeatureKeys.all, "paginated", page],
    queryFn: () => myService.getDataPaginated(page),
    keepPreviousData: true, // Keep old data while fetching new
  });
}
```

### Infinite Scroll

```typescript
import { useInfiniteQuery } from "@tanstack/react-query";

export function useMyDataInfinite() {
  return useInfiniteQuery({
    queryKey: myFeatureKeys.all,
    queryFn: ({ pageParam = 1 }) => myService.getDataPaginated(pageParam),
    getNextPageParam: (lastPage) => lastPage.nextPage ?? undefined,
  });
}
```

## Tips

- ✅ Always define TypeScript types for API responses
- ✅ Use query keys consistently (create a keys object)
- ✅ Invalidate queries after mutations
- ✅ Add toast notifications for user feedback
- ✅ Handle loading and error states
- ✅ Use `enabled` option to conditionally run queries
- ✅ Keep services pure (no side effects)
- ✅ Put business logic in hooks, not services
