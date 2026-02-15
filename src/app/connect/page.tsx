"use client";

import { Button } from "@/components/ui/button";
import { Instagram } from "lucide-react";
import { useInstagram } from "@/hooks/instagram/use-instagram";

export default function ConnectPage() {
  // Use the all-in-one hook - much simpler!
  const instagram = useInstagram();

  if (instagram.account) {
    console.log(instagram.account);
  }

  return (
    <div className="min-h-screen bg-[#F1F1F1] flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8 text-center">
        {/* Icon */}
        <div className="flex justify-center">
          <div className="p-6 rounded-full bg-white shadow-sm ring-1 ring-gray-200">
            <Instagram className="w-16 h-16 text-[#6A06E4]" />
          </div>
        </div>

        {/* Heading */}
        <div className="space-y-3">
          <h1 className="text-3xl font-semibold text-gray-900 tracking-tight">
            Connect Your Instagram
          </h1>
          <p className="text-base text-gray-500 max-w-sm mx-auto leading-relaxed">
            Link your Instagram Business or Creator account to start automating
            your engagement
          </p>
        </div>

        {/* Error Message */}
        {instagram.error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-sm text-sm">
            {instagram.error}
          </div>
        )}

        {/* Connect Button */}
        <div className="pt-4">
          <Button
            onClick={() => instagram.connect("/dashboard")}
            disabled={instagram.isConnecting}
            className="bg-[#6A06E4] hover:bg-[#5a05c4] text-white rounded-sm px-8 py-6 text-base font-medium border-none outline-none w-full max-w-xs mx-auto"
          >
            {instagram.isConnecting ? (
              <span className="flex items-center justify-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Connecting...
              </span>
            ) : (
              <span className="flex items-center justify-center gap-2">
                <Instagram className="w-5 h-5" />
                Connect Instagram Account
              </span>
            )}
          </Button>
        </div>

        {/* Info */}
        <div className="pt-8 space-y-2">
          <p className="text-xs text-gray-400">
            We'll never post without your permission
          </p>
          <p className="text-xs text-gray-400">
            Secure authentication powered by Meta
          </p>
        </div>
      </div>
    </div>
  );
}
