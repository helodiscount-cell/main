"use client";

import React from "react";
import { SquarePen, Inbox } from "lucide-react";
import Link from "next/link";
import { cn } from "@/server/utils";
import { useIsMobile } from "@/hooks/use-mobile";

type TabType = "editor" | "submissions";

interface FormTabsProps {
  formId?: string; // If missing, we are in "editor" (create) mode
  activeTab: TabType;
}

/**
 * Shared tabs component for the form maker and submissions view.
 * Handles navigation between "Editor" and "Submissions" for a specific form.
 */
export const FormTabs = ({ formId, activeTab }: FormTabsProps) => {
  const isMobile = useIsMobile();
  // Routes — If no formId, we are on the /editor page
  const editorPath = formId ? `/dash/forms/${formId}` : "/dash/forms/editor";
  const submissionsPath = formId
    ? `/dash/forms/${formId}/submissions`
    : "/dash/forms/editor/submissions";

  return (
    <div className="px-4 py-2">
      <div
        className={cn(
          "bg-white flex items-center w-full h-16 px-6 rounded-xl border border-[#E2E8F0] gap-8",
          isMobile && "justify-center",
        )}
      >
        {/* Editor Tab */}
        <Link
          href={editorPath}
          className={cn(
            "flex items-center gap-2 font-semibold relative h-full transition-all group",
            activeTab === "editor"
              ? "text-[#6A06E4]"
              : "text-[#64748B] hover:text-[#475569]",
          )}
        >
          <SquarePen
            size={18}
            className={cn(
              activeTab !== "editor" &&
                "group-hover:scale-110 transition-transform",
            )}
          />
          <span className="text-sm tracking-tight text-inherit">Editor</span>
          {activeTab === "editor" && (
            <div className="w-1/2 mx-auto absolute bottom-0 left-0 right-0 h-1 bg-[#6A06E4] rounded-t-full -[0_-2px_6px_rgba(106,6,228,0.2)]" />
          )}
        </Link>

        {/* Vertical divider */}
        <div className="text-slate-200 font-extralight pb-1">|</div>

        {/* Submissions Tab */}
        <Link
          href={submissionsPath}
          className={cn(
            "flex items-center gap-2 font-semibold relative h-full transition-all group",
            activeTab === "submissions"
              ? "text-[#6A06E4]"
              : "text-[#64748B] hover:text-[#475569]",
          )}
        >
          <Inbox
            size={18}
            className={cn(
              activeTab !== "submissions" &&
                "group-hover:scale-110 transition-transform",
            )}
          />
          <span className="text-sm tracking-tight text-inherit">
            Submissions
          </span>
          {activeTab === "submissions" && (
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#6A06E4] rounded-t-full -[0_-2px_6px_rgba(106,6,228,0.2)]" />
          )}
        </Link>
      </div>
    </div>
  );
};
