"use client";

// Example component - currently disabled as it references hooks that don't exist
// TODO: Implement useApiQuery, useApiMutation, useApiCall, useInvalidateQueries hooks
// or update this component to use the existing useApi hook

/*
import {
  useApiQuery,
  useApiMutation,
  useApiCall,
  useInvalidateQueries,
} from "@/hooks/use-api";
import { User } from "@/lib/api-types";

export default function ApiExample() {
  const { invalidateByKey } = useInvalidateQueries();
  const { makeRequest } = useApiCall();

  // Example 1: Using useApiQuery for GET requests
  const {
    data: users,
    isLoading: usersLoading,
    error: usersError,
  } = useApiQuery<User[]>({
    queryKey: ["users"],
    endpoint: "/users",
    enabled: false, // Don't auto-fetch
  });

  // Example 2: Using useApiMutation for POST requests
  const createUserMutation = useApiMutation({
    endpoint: "/users",
    method: "POST",
    onSuccess: (data) => {
      console.log("User created:", data);
      invalidateByKey(["users"]); // Refresh users list
    },
    onError: (error) => {
      console.error("Failed to create user:", error);
    },
  });

  // Example 3: Manual API call
  const handleManualCall = async () => {
    try {
      const result = await makeRequest("/users/me", "GET");
      console.log("Manual API call result:", result);
    } catch (error) {
      console.error("Manual API call failed:", error);
    }
  };

  return (
    <div className="p-6 space-y-4">
      <h2 className="text-2xl font-bold">API System Examples</h2>

      <div className="space-y-2">
        <h3 className="text-lg font-semibold">Query Example (GET)</h3>
        <button
          onClick={() => {
            // Trigger the query manually
            console.log("Fetching users...");
          }}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Fetch Users
        </button>
        {usersLoading && <p>Loading users...</p>}
        {usersError && (
          <p className="text-red-500">Error: {usersError.message}</p>
        )}
        {users && <p>Users loaded: {users.length}</p>}
      </div>

      <div className="space-y-2">
        <h3 className="text-lg font-semibold">Mutation Example (POST)</h3>
        <button
          onClick={() => {
            createUserMutation.mutate({
              fullName: "John Doe",
              email: "john@example.com",
            });
          }}
          disabled={createUserMutation.isPending}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50"
        >
          {createUserMutation.isPending ? "Creating..." : "Create User"}
        </button>
        {createUserMutation.isError && (
          <p className="text-red-500">
            Error: {createUserMutation.error?.message}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <h3 className="text-lg font-semibold">Manual API Call</h3>
        <button
          onClick={handleManualCall}
          className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600"
        >
          Manual API Call
        </button>
      </div>

      <div className="space-y-2">
        <h3 className="text-lg font-semibold">Cache Management</h3>
        <button
          onClick={() => invalidateByKey(["users"])}
          className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
        >
          Invalidate Users Cache
        </button>
      </div>
    </div>
  );
}
*/

export default function ApiExample() {
  return (
    <div className="p-6 space-y-4">
      <h2 className="text-2xl font-bold">API System Examples</h2>
      <p className="text-gray-500">This component is currently disabled.</p>
    </div>
  );
}
