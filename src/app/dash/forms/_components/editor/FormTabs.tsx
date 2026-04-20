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
  const id = formId || "new";

  const editorPath = `/dash/forms/${id}`;
  const submissionsPath = `/dash/forms/${id}/submissions`;

  return (
    <div
      className={cn(
        "bg-white flex items-center w-full h-[64px] px-8 justify-center rounded-t-xl border border-[#E2E8F0] gap-10",
        !isMobile && "justify-start",
      )}
    >
      {/* Editor Tab */}
      <Link
        href={editorPath}
        className={cn(
          "flex items-center gap-2.5 font-bold relative h-full transition-all group shrink-0",
          activeTab === "editor"
            ? "text-[#6A06E4]"
            : "text-[#64748B] hover:text-[#475569]",
        )}
      >
        <SquarePen
          size={20}
          className={cn(
            "stroke-[2.5px]",
            activeTab !== "editor" &&
              "group-hover:scale-110 transition-transform",
          )}
        />
        <span className="text-[15px] tracking-tight text-inherit">Editor</span>
        {activeTab === "editor" && (
          <div className="absolute bottom-0 left-[-4px] right-[-4px] h-[3.5px] bg-[#6A06E4] rounded-t-full shadow-[0_-2px_8px_rgba(106,6,228,0.3)]" />
        )}
      </Link>

      {/* Submissions Tab - Hide if it's a new form */}
      {id !== "new" && (
        <>
          <div className="text-slate-200 font-extralight text-xl opacity-60">
            |
          </div>
          <Link
            href={submissionsPath}
            className={cn(
              "flex items-center gap-2.5 font-bold relative h-full transition-all group shrink-0",
              activeTab === "submissions"
                ? "text-[#6A06E4]"
                : "text-[#64748B] hover:text-[#475569]",
            )}
          >
            <Inbox
              size={20}
              className={cn(
                "stroke-[2.5px]",
                activeTab !== "submissions" &&
                  "group-hover:scale-110 transition-transform",
              )}
            />
            <span className="text-[15px] tracking-tight text-inherit">
              Submissions
            </span>
            {activeTab === "submissions" && (
              <div className="absolute bottom-0 left-[-4px] right-[-4px] h-[3.5px] bg-[#6A06E4] rounded-t-full shadow-[0_-2px_8px_rgba(106,6,228,0.3)]" />
            )}
          </Link>
        </>
      )}
    </div>
  );
};
