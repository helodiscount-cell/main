"use client";

import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { instagramKeys } from "@/lib/api/services/instagram/hooks/use-insta-oauth";

/**
 * Handles Instagram OAuth callback parameters and shows toast notifications
 * This hook should be used on the page where Instagram redirects after OAuth
 */
export function useInstagramOAuthCallback() {
  const queryClient = useQueryClient();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const connected = params.get("connected");
    const error = params.get("error");

    if (connected === "true") {
      toast.success("Instagram connected successfully!");

      // Invalidate Instagram account query to refetch the updated data
      queryClient.invalidateQueries({ queryKey: instagramKeys.account() });

      // Clean up URL
      window.history.replaceState({}, "", window.location.pathname);
    } else if (error) {
      const errorMessages: Record<string, string> = {
        oauth_declined: "You declined the Instagram authorization.",
        oauth_invalid: "Invalid OAuth response from Instagram.",
        oauth_invalid_state: "OAuth security check failed. Please try again.",
        invalid_account_type:
          "Please use an Instagram Business or Creator account.",
        oauth_failed: "Failed to connect Instagram. Please try again.",
      };

      toast.error(
        errorMessages[error] ||
          "Failed to connect Instagram. Please try again.",
      );

      // Clean up URL
      window.history.replaceState({}, "", window.location.pathname);
    }
  }, [queryClient]);
}
