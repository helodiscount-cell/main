import {
  useApiQuery,
  useApiMutation,
  useInvalidateQueries,
} from "@/hooks/use-api";

// User service with React Query hooks
export function useUserService() {
  const { invalidateByKey } = useInvalidateQueries();

  // Get current user
  const useGetCurrentUser = () => {
    return useApiQuery({
      queryKey: ["user", "current"],
      endpoint: "/users/me",
      staleTime: 5 * 60 * 1000, // 5 minutes
    });
  };

  // Update user profile
  const useUpdateUser = () => {
    return useApiMutation({
      endpoint: "/users/update",
      method: "POST",
      onSuccess: () => {
        invalidateByKey(["user"]);
      },
    });
  };

  // Delete user account
  const useDeleteUser = () => {
    return useApiMutation({
      endpoint: "/users/delete",
      method: "POST",
      onSuccess: () => {
        invalidateByKey(["user"]);
      },
    });
  };

  return {
    useGetCurrentUser,
    useUpdateUser,
    useDeleteUser,
  };
}

// Example usage in a component:
/*
function UserProfile() {
  const { useGetCurrentUser, useUpdateUser } = useUserService();

  const { data: user, isLoading, error } = useGetCurrentUser();
  const updateUserMutation = useUpdateUser();

  const handleUpdateProfile = (data: any) => {
    updateUserMutation.mutate(data, {
      onSuccess: () => {
        console.log('Profile updated successfully');
      },
      onError: (error) => {
        console.error('Failed to update profile:', error);
      },
    });
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading user</div>;

  return (
    <div>
      <h1>{user?.fullName}</h1>
      <button onClick={() => handleUpdateProfile({ fullName: 'New Name' })}>
        Update Profile
      </button>
    </div>
  );
}
*/
