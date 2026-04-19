"use client";

import React from "react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { ActiveWorkspaceAvatar } from "@/components/ActiveWorkspaceAvatar";
import {
  RefreshCw,
  Link2,
  Eye,
  Send,
  Square,
  CircleStopIcon,
} from "lucide-react";
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
  isSaving?: boolean;
  isMediaUploading?: boolean;
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
  isSaving,
  isMediaUploading,
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
    <div className="flex flex-col bg-[#F3F4F6] gap-6">
      {/* Top Row: Menu + Logo + User */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <SidebarTrigger className="text-[#0F172A] scale-125" />
          <span className="text-3xl font-semibold text-[#6A06E4] tracking-tight">
            Dmbroo
          </span>
        </div>
        <ActiveWorkspaceAvatar size={50} />
      </div>

      {/* Second Row: Breadcrumb + Action Buttons - Only visible on editor tab */}
      {activeTab === "editor" && (
        <div className="flex items-center gap-3">
          {/* Breadcrumb box */}
          <div className="flex items-center h-[52px] bg-white rounded-xl px-4 flex-1 min-w-0 shadow-[0_2px_15px_rgba(0,0,0,0.02)] border border-slate-50">
            <span className="text-[15px] font-medium text-slate-300">
              Forms
            </span>
            <span className="text-[15px] font-medium text-slate-300 mx-1.5">
              /
            </span>
            <span className="text-[15px] font-bold text-[#0F172A] truncate">
              Editor
            </span>
          </div>

          {/* Action icons - ALWAYS 4 buttons for unification */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Stop Button (Red) */}
            <Button
              onClick={onUnpublish}
              disabled={isLoading || !isPublished}
              size="icon"
              aria-label="Stop publishing"
              className={cn(
                "h-[52px] w-[52px] rounded-xl bg-red-500 hover:bg-red-600 text-white shrink-0 border-none shadow-lg transition-all active:scale-95 disabled:opacity-40",
              )}
            >
              <Square size={22} fill="currentColor" />
            </Button>

            {/* Link (Copy Link) - Black */}
            <Button
              size="icon"
              disabled={!form?.slug}
              aria-label="Copy form link"
              className="h-[52px] w-[52px] rounded-xl bg-[#0F172A] hover:bg-[#1E293B] text-white shrink-0 border-none shadow-lg transition-all active:scale-95 disabled:opacity-40"
              onClick={async () => {
                if (!form?.slug) return;
                try {
                  await navigator.clipboard.writeText(
                    `${window.location.origin}/f/${form.slug}`,
                  );
                  toast.success("Link copied!");
                } catch {
                  toast.error("Failed to copy link");
                }
              }}
            >
              <Link2 size={22} />
            </Button>

            {/* Preview (Eye) - Black */}
            <Button
              size="icon"
              disabled={!form?.slug}
              aria-label="Preview form"
              className="h-[52px] w-[52px] rounded-xl bg-[#0F172A] hover:bg-[#1E293B] text-white shrink-0 border-none shadow-lg transition-all active:scale-95 disabled:opacity-40"
              onClick={() => {
                if (!form?.slug) return;
                window.open(
                  `${window.location.origin}/f/${form.slug}`,
                  "_blank",
                );
              }}
            >
              <Eye size={22} />
            </Button>

            {/* Save / Update (Green) */}
            <Button
              onClick={isPublished ? onUpdate : onSave}
              disabled={isLoading || isSaving || isMediaUploading}
              size="icon"
              aria-label={isPublished ? "Update form" : "Save form"}
              className={cn(
                "h-[52px] w-[52px] rounded-xl bg-[#16A34A] hover:bg-[#15803D] text-white shrink-0 border-none shadow-lg transition-all active:scale-95 disabled:opacity-50",
              )}
            >
              {isSaving || isMediaUploading ? (
                <RefreshCw size={22} className="animate-spin" />
              ) : (
                <Send size={22} className="ml-0.5" />
              )}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
