"use client";

import { AuthenticateWithRedirectCallback } from "@clerk/nextjs";
import { useEffect } from "react";

export default function SSOCallback() {
  useEffect(() => {
    console.log("SSO Callback page loaded");
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F1F1F1]">
      <div className="text-center space-y-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
        <p className="text-gray-600">Completing sign in...</p>
      </div>
      <AuthenticateWithRedirectCallback />
    </div>
  );
}
