"use client";

import React, { useState } from "react";
import Link from "next/link";
import { MoreVertical, Copy } from "lucide-react";
import { toast } from "sonner";
import { AutomationListItem } from "@/api/services/automations/types";
import { FormListItem } from "@/api/services/forms/form";
import { Contact } from "@/api/services/contacts/types";
import { AutomationActionsMenu } from "@/components/dash/automations/AutomationActionsMenu";
import { FormActionsMenu } from "../../forms/_components/FormActionsMenu";
import mapDashboardItem, { DashboardItem } from "../mapDashboardItem";

interface MobileCardProps {
  data: DashboardItem;
}

/**
 * Mobile-specific card UI for Forms and Automations.
 * Matches the design requested by the user.
 */
export const MobileCard = ({ data }: MobileCardProps) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const mapped = mapDashboardItem(data);
  const isAutomation = data.type === "automation";
  const isForm = data.type === "form";
  const isContact = data.type === "contact";

  const handleCopy = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    let textToCopy = "";
    if (isAutomation) {
      // Automation: copy name or keywords
      const automation = data as AutomationListItem;
      textToCopy =
        automation.triggers.join(", ") || automation.automationName || "";
    } else if (isForm) {
      // Form: copy public link
      textToCopy = `${window.location.origin}/f/${(data as FormListItem).slug}`;
    } else if (isContact) {
      // Contact: copy email or username
      const contact = data as Contact;
      textToCopy = contact.email || contact.username;
    }

    if (textToCopy) {
      navigator.clipboard
        .writeText(textToCopy)
        .then(() => {
          toast.success("Copied to clipboard!");
        })
        .catch((err) => {
          console.error("Failed to copy:", err);
          toast.error("Failed to copy to clipboard");
        });
    }
  };

  return (
    <div className="bg-white rounded-lg p-5 border border-slate-50 flex flex-col gap-5 shadow-[0_4px_20px_rgba(0,0,0,0.02)]">
      {/* Top Row: Info + Status + Menu */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-12 h-12 rounded-lg bg-slate-50 shrink-0 overflow-hidden border border-slate-100 flex items-center justify-center">
            {mapped.image}
          </div>
          {mapped.href ? (
            <Link href={mapped.href} className="flex flex-col gap-0.5 min-w-0">
              <span className="capitalize text-[15px] font-semibold text-slate-800 truncate">
                {mapped.title}
              </span>
              <span className="text-xs text-slate-400 truncate max-w-[180px]">
                {mapped.subtitle}
              </span>
            </Link>
          ) : (
            <div className="flex flex-col gap-0.5 min-w-0 opacity-70">
              <span className="capitalize text-[15px] font-semibold text-slate-800 truncate">
                {mapped.title}
              </span>
              <span className="text-xs text-slate-400 truncate max-w-[180px]">
                {mapped.subtitle}
              </span>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {/* Custom Status Pill to match Image */}
          <div className="scale-90">
            {isAutomation ? (
              <div
                className={`px-3 py-1 rounded-lg text-xs font-bold ${
                  (data as AutomationListItem).status === "ACTIVE"
                    ? "bg-emerald-100 text-emerald-600"
                    : (data as AutomationListItem).status === "EXPIRED"
                      ? "bg-red-100 text-red-600"
                      : "bg-blue-100 text-blue-600"
                }`}
              >
                {(data as AutomationListItem).status === "ACTIVE"
                  ? "Live"
                  : (data as AutomationListItem).status === "EXPIRED"
                    ? "Expired"
                    : "Stopped"}
              </div>
            ) : (
              mapped.status
            )}
          </div>
          <div className="relative">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="p-1 text-slate-400 active:bg-slate-50 rounded-full transition-colors"
              aria-label="Open menu"
              aria-expanded={menuOpen}
            >
              <MoreVertical size={20} />
            </button>
            {menuOpen &&
              (isAutomation ? (
                <AutomationActionsMenu
                  onClose={() => setMenuOpen(false)}
                  fullAutomation={data as AutomationListItem}
                />
              ) : isForm ? (
                <FormActionsMenu
                  formId={data.id}
                  onClose={() => setMenuOpen(false)}
                  slug={(data as FormListItem).slug}
                />
              ) : null)}
          </div>
        </div>
      </div>
      <hr />
      {/* Bottom Row: Stats + Date + Copy Link */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4 flex-1">
          <div className="flex flex-col gap-1 min-w-fit">
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                {mapped.statsLabel}
              </span>
              <span className="text-sm text-[#6A06E4] font-bold font-mono">
                {mapped.stats}
              </span>
            </div>
            {isAutomation && mapped.secondaryStats !== undefined && (
              <div className="flex items-center gap-1.5 ">
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                  {mapped.secondaryStatsLabel}
                </span>
                <span className="text-sm text-slate-600 font-bold font-mono">
                  {mapped.secondaryStats}
                </span>
              </div>
            )}
            {isAutomation && mapped.newFollowersGained !== undefined && (
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                  New Followers
                </span>
                <span className="text-sm text-emerald-600 font-bold font-mono">
                  {mapped.newFollowersGained}
                </span>
              </div>
            )}
          </div>

          <div className="ml-auto flex flex-col items-end gap-0.5">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
              {mapped.dateLabel}
            </span>
            <div className="text-sm text-slate-500 font-semibold italic">
              {mapped.date}
            </div>
          </div>
        </div>

        {isForm && (
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
