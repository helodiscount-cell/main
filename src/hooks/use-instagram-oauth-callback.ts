"use client";

import { useEffect } from "react";
import { toast } from "sonner";

// Handles Instagram OAuth callback parameters and shows toast notifications
export const handleInstagramOAuthCallback = () => {
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const connected = params.get("connected");
    const error = params.get("error");

    if (connected === "true") {
      toast.success("Instagram connected successfully!");
      window.history.replaceState({}, "", "/dashboard");
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
        errorMessages[error] || "Failed to connect Instagram. Please try again."
      );
      window.history.replaceState({}, "", "/dashboard");
    }
  }, []);
};
