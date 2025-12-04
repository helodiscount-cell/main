"use client";

import { AlertCircle } from "lucide-react";

interface ErrorBannerProps {
  message: string;
}

// Renders error banner with alert styling
export const ErrorBanner = ({ message }: ErrorBannerProps) => {
  return (
    <div className="bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded-lg mb-6 flex items-start gap-3 animate-fade-in">
      <AlertCircle className="size-5 shrink-0 mt-0.5" />
      <div className="flex-1">
        <p className="font-medium">Error</p>
        <p className="text-sm mt-1">{message}</p>
      </div>
    </div>
  );
};


