"use client";

import React from "react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { UserButton, useUser } from "@clerk/nextjs";
import { RefreshCw, Link2, Eye, Send, Square } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { formService } from "@/api/services/forms";
import { cn } from "@/server/utils";
import { toast } from "sonner";

interface MobileEditorHeaderProps {
  formId?: string;
  onPublish: () => void;
  onSave: () => void;
  onUpdate: () => void;
  onUnpublish: () => void;
  isLoading?: boolean;
  activeTab: "editor" | "submissions";
  currentStatus?: "DRAFT" | "PUBLISHED";
}

/**
 * Mobile-specific header for the form editor.
 * Matches the design with a custom top row and an action buttons row.
 */
export const MobileEditorHeader = ({
  formId,
  onPublish,
  onSave,
  onUpdate,
  onUnpublish,
  isLoading,
  activeTab,
  currentStatus = "DRAFT",
}: MobileEditorHeaderProps) => {
  const isPublished = currentStatus === "PUBLISHED";

  const { data: form } = useQuery({
    queryKey: ["form", formId],
    queryFn: ({ queryKey: [, id] }) => {
      if (!id) throw new Error("Missing formId");
      return formService.getById(id as string);
    },
    enabled: !!formId,
  });

  return (
    <div className="flex flex-col bg-[#f1f1f1] px-5 py-6 gap-5 shadow-sm">
      {/* Top Row: Menu + Logo + User */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <SidebarTrigger className="-ml-2 text-slate-800 scale-125" />
          <span className="text-2xl font-semibold text-[#6A06E4] tracking-tight">
            Dmbroo
          </span>
        </div>
        <div className="rounded-full overflow-hidden scale-110">
          <UserButton afterSignOutUrl="/" />
        </div>
      </div>

      {/* Second Row: Breadcrumb + Action Buttons - Only visible on editor tab */}
      {activeTab === "editor" && (
        <div className="flex items-center gap-2 pt-1">
          {/* Breadcrumb box */}
          <div className="flex items-center h-12 bg-white rounded-xl px-4 flex-1 min-w-0">
            <span className="text-sm font-medium text-slate-300">Forms</span>
            <span className="text-sm font-medium text-slate-300 mx-1">/</span>
            <span className="text-sm font-bold text-[#0F172A] truncate">
              Editor
            </span>
          </div>

          {/* Action icons */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Update / Save Draft */}
            <Button
              onClick={isPublished ? onUpdate : onSave}
              disabled={isLoading}
              size="icon"
              aria-label={isPublished ? "Update form" : "Save draft"}
              className="h-12 w-12 rounded-xl bg-[#6A06E4] hover:bg-[#5a05c4] text-white shrink-0 border-none shadow-none"
            >
              <RefreshCw
                size={24}
                className={cn(isLoading && "animate-spin")}
              />
            </Button>

            {/* Link (Copy Link) */}
            {form?.slug && (
              <>
                <Button
                  size="icon"
                  aria-label="Copy form link"
                  className="h-12 w-12 rounded-xl bg-[#0F172A] hover:bg-[#1E293B] text-white shrink-0 border-none shadow-none"
                  onClick={async () => {
                    try {
                      await navigator.clipboard.writeText(
                        `${window.location.origin}/f/${form.slug}`,
                      );
                      toast.success("Link copied to clipboard!");
                    } catch (err) {
                      console.error("Failed to copy link:", err);
                      toast.error("Failed to copy link");
                    }
                  }}
                >
                  <Link2 size={24} />
                </Button>

                {/* Preview */}
                <Button
                  size="icon"
                  aria-label="Preview form"
                  className="h-12 w-12 rounded-xl bg-[#0F172A] hover:bg-[#1E293B] text-white shrink-0 border-none shadow-none"
                  onClick={() => {
                    const newWindow = window.open(
                      `${window.location.origin}/f/${form.slug}`,
                      "_blank",
                      "noopener,noreferrer",
                    );
                    if (newWindow) newWindow.opener = null;
                  }}
                >
                  <Eye size={24} />
                </Button>
              </>
            )}

            {/* Stop / Publish */}
            <Button
              onClick={isPublished ? onUnpublish : onPublish}
              disabled={isLoading}
              size="icon"
              aria-label={isPublished ? "Stop publishing" : "Publish form"}
              className={cn(
                "h-12 w-12 rounded-xl text-white shrink-0 border-none shadow-none",
                isPublished
                  ? "bg-red-500 hover:bg-red-600"
                  : "bg-[#16A34A] hover:bg-[#15803D]",
              )}
            >
              {isPublished ? (
                <Square size={24} fill="currentColor" />
              ) : (
                <Send size={24} />
              )}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
