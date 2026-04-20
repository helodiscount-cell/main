"use client";

import { useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { toast } from "sonner";

export function OAuthErrorListener() {
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const error = searchParams.get("error");
    const connected = searchParams.get("connected");

    if (error) {
      // Clear the query params from the URL after reading
      const newUrl = window.location.pathname;
      router.replace(newUrl);

      // Handle specific error cases
      switch (error) {
        case "oauth_declined":
          toast.error("Connection Declined", {
            description: "You declined the Instagram authorization request.",
          });
          break;
        case "oauth_invalid":
          toast.error("Invalid Request", {
            description:
              "The Instagram connection request was invalid or expired.",
          });
          break;
        default:
          toast.error("Connection Failed", {
            description:
              "Something went wrong while connecting your Instagram account.",
          });
      }
    }

    if (connected === "true") {
      const newUrl = window.location.pathname;
      router.replace(newUrl);

      toast.success("Instagram Connected!", {
        description: "Your account has been successfully linked.",
      });
    }
  }, [searchParams, router]);

  return null;
}
