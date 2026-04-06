"use client";

import React, { useState } from "react";
import Link from "next/link";
import { MoreVertical, Copy } from "lucide-react";
import { toast } from "sonner";
import { AutomationListItem } from "@/types/automation";
import { FormListItem } from "@/types/form";
import { useDashboardItemMapper } from "../useDashboardItemMapper";
import { AutomationActionsMenu } from "@/components/dash/automations/AutomationActionsMenu";
import { FormActionsMenu } from "../../forms/_components/FormActionsMenu";

interface MobileCardProps {
  data: AutomationListItem | FormListItem;
}

/**
 * Mobile-specific card UI for Forms and Automations.
 * Matches the design requested by the user.
 */
export const MobileCard = ({ data }: MobileCardProps) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const mapped = useDashboardItemMapper(data);
  const isAutomation = "triggerType" in data;

  const handleCopy = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    let textToCopy = "";
    if (isAutomation) {
      // Automation: copy name or keywords
      const automation = data as AutomationListItem;
      textToCopy =
        automation.triggers.join(", ") || automation.automationName || "";
    } else {
      // Form: copy public link
      textToCopy = `${window.location.origin}/f/${(data as FormListItem).slug}`;
    }

    if (textToCopy) {
      navigator.clipboard.writeText(textToCopy);
      toast.success("Copied to clipboard!");
    }
  };

  return (
    <div className="bg-white rounded-[24px] p-5 border border-slate-50 flex flex-col gap-5 mb-4    -[0_4px_20px_rgba(0,0,0,0.02)]">
      {/* Top Row: Info + Status + Menu */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-12 h-12 rounded-xl bg-slate-50 shrink-0 overflow-hidden border border-slate-100 flex items-center justify-center">
            {mapped.image}
          </div>
          <Link href={mapped.href} className="flex flex-col gap-0.5 min-w-0">
            <span className="capitalize text-[17px] font-semibold text-slate-800 truncate">
              {mapped.title}
            </span>
            <span className="text-xs text-slate-400 truncate max-w-[180px]">
              {mapped.subtitle}
            </span>
          </Link>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {/* Custom Status Pill to match Image */}
          <div className="scale-90">
            {isAutomation ? (
              <div
                className={`px-3 py-1 rounded-lg text-xs font-bold ${
                  (data as AutomationListItem).status === "ACTIVE"
                    ? "bg-emerald-100 text-emerald-600"
                    : "bg-blue-100 text-blue-600"
                }`}
              >
                {(data as AutomationListItem).status === "ACTIVE"
                  ? "Live"
                  : "Paused"}
              </div>
            ) : (
              mapped.status
            )}
          </div>
          <div className="relative">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="p-1 text-slate-400 active:bg-slate-50 rounded-full transition-colors"
            >
              <MoreVertical size={20} />
            </button>
            {menuOpen &&
              ("triggerType" in data ? (
                <AutomationActionsMenu
                  onClose={() => setMenuOpen(false)}
                  fullAutomation={data as AutomationListItem}
                />
              ) : (
                <FormActionsMenu
                  formId={data.id}
                  onClose={() => setMenuOpen(false)}
                  slug={(data as FormListItem).slug}
                />
              ))}
          </div>
        </div>
      </div>

      {/* Bottom Row: Stats + Date + Copy Link */}
      <div className="flex items-center justify-between border-t border-slate-50 pt-4">
        <div className="flex items-center gap-4 flex-1">
          {isAutomation && (
            <div className="flex items-center gap-1.5 min-w-fit">
              <span className="text-sm text-slate-400 font-medium">
                New Follower:
              </span>
              <span className="text-sm text-[#6A06E4] font-semibold font-mono">
                56
              </span>
            </div>
          )}

          <div className="flex items-center gap-1.5 min-w-fit">
            <span className="text-sm text-slate-400 font-medium">
              {isAutomation ? "Run" : mapped.statsLabel}:
            </span>
            <span className="text-sm text-slate-600 font-semibold font-mono">
              {mapped.stats}
            </span>
          </div>

          <div className="ml-auto text-sm text-slate-500 font-medium">
            {mapped.date}
          </div>
        </div>

        {!isAutomation && (
          <button
            onClick={handleCopy}
            className="ml-4 flex items-center gap-1.5 text-[#6A06E4] font-semibold text-sm hover:opacity-80 transition-opacity"
          >
            <Copy size={14} />
            Copy
          </button>
        )}
      </div>
    </div>
  );
};
