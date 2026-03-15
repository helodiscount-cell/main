"use client";

import React from "react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { EDITOR_HEADER_CONFIG, HEADER_ACTIONS } from "./config";

// Breadcrumb + 4 action buttons (Refresh, Copy Link, Preview, Publish)
export const EditorHeader = () => {
  return (
    <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
      <SidebarTrigger className="-ml-1" />
      <Separator
        orientation="vertical"
        className="mr-2 data-[orientation=vertical]:h-4"
      />

      <div className="flex w-full items-center justify-between gap-4">
        {/* Breadcrumb pill */}
        <div className="bg-white rounded-md px-4 flex items-center h-9 flex-1">
          <span className="text-sm text-slate-400">
            {EDITOR_HEADER_CONFIG.BREADCRUMB_ROOT}
          </span>
          <span className="text-sm text-slate-400 mx-1">/</span>
          <span className="text-sm font-semibold text-slate-900">
            {EDITOR_HEADER_CONFIG.BREADCRUMB_CURRENT}
          </span>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-2">
          {HEADER_ACTIONS.map((action) =>
            action.variant === "primary" ? (
              <Button
                key={action.id}
                className="bg-[#6A06E4] hover:bg-[#5a05c4] text-white gap-2 h-9 px-4"
              >
                <action.icon size={15} />
                {action.label}
              </Button>
            ) : (
              <Button
                key={action.id}
                size="icon"
                variant="secondary"
                className="h-9 w-9 bg-slate-900 hover:bg-slate-700 text-white"
                aria-label={action.label}
              >
                <action.icon size={15} />
              </Button>
            ),
          )}
        </div>
      </div>
    </header>
  );
};
