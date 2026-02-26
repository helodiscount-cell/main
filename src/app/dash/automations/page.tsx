"use client";

import React, { useState } from "react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { CreateAutomationDialog } from "@/components/CreateAutomation";
import { RefreshInstaDialog } from "@/components/auth/RefreshInstaDialog";
import {
  Search,
  RefreshCw,
  SlidersHorizontal,
  ChevronDown,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useQuery } from "@tanstack/react-query";
import { automationService } from "@/api/services/automations";
import { automationKeys } from "@/keys/react-query";
import { AutomationRow } from "@/components/dash/automations/AutomationRow";
import { ColHeader } from "@/components/dash/automations/ColHeader";

type StatusFilter = "ACTIVE" | "PAUSED" | "ALL";

const STATUS_OPTIONS: { label: string; value: StatusFilter }[] = [
  { label: "All", value: "ALL" },
  { label: "Live", value: "ACTIVE" },
  { label: "Draft", value: "PAUSED" },
];

const AutomationPage = () => {
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("ALL");

  const { data, isLoading } = useQuery({
    queryKey: automationKeys.list(
      statusFilter !== "ALL" ? { status: statusFilter } : undefined,
    ),
    queryFn: () =>
      automationService.list(
        statusFilter !== "ALL" ? { status: statusFilter } : undefined,
      ),
  });

  const automations = data?.automations ?? [];
  const selectedLabel =
    STATUS_OPTIONS.find((o) => o.value === statusFilter)?.label ?? "All";

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="mr-2 data-[orientation=vertical]:h-4"
        />

        <div className="flex w-full gap-3 items-center">
          <div className="flex-2 bg-white rounded-md px-4 flex items-center h-9">
            <p className="text-sm font-semibold">Automation</p>
          </div>

          <div className="flex-1 bg-white rounded-md px-3 flex items-center gap-2 h-9">
            <Search size={15} className="text-slate-400 shrink-0" />
            <input
              type="text"
              placeholder="Search automations"
              className="w-full text-sm bg-transparent outline-none text-slate-700 placeholder:text-slate-400"
            />
          </div>

          <div className="w-fit flex items-center gap-2 bg-white rounded-md px-3 h-9">
            <RefreshCw size={15} className="text-slate-400" />
            <span className="text-sm text-slate-600">
              <span className="font-semibold text-slate-800">
                {automations.length}
              </span>
              <span className="text-slate-400"> / 1000</span>
            </span>
          </div>

          <RefreshInstaDialog />
          <CreateAutomationDialog title="Create Automation" />
        </div>
      </header>

      {/* Table */}
      <div className="m-4 bg-white rounded-xl overflow-hidden flex-1">
        {/* Table header */}
        <div className="grid grid-cols-[2fr_1fr_1fr_1fr_1fr_auto] items-center px-4 py-3 gap-4 border-b border-slate-100">
          <span className="text-sm font-medium text-slate-700">Automation</span>
          <div className="flex items-center gap-2">
            <ColHeader label="Triggers" />
            <div className="w-px h-4 bg-slate-200" />
          </div>

          {/* Status column with filter dropdown */}
          <div className="flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-1 text-sm font-medium text-slate-700 hover:text-slate-900 transition-colors">
                  {selectedLabel === "All" ? "Status" : selectedLabel}
                  <ChevronDown size={13} className="text-slate-400" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="min-w-[130px]">
                <DropdownMenuRadioGroup
                  value={statusFilter}
                  onValueChange={(v) => setStatusFilter(v as StatusFilter)}
                >
                  {STATUS_OPTIONS.map((opt) => (
                    <DropdownMenuRadioItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </DropdownMenuRadioItem>
                  ))}
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>
            <div className="w-px h-4 bg-slate-200" />
          </div>

          <div className="flex items-center gap-2">
            <ColHeader label="Runs" />
            <div className="w-px h-4 bg-slate-200" />
          </div>
          <ColHeader label="Last Triggered" />
          <button className="bg-slate-900 text-white rounded-md p-1.5 hover:bg-slate-700 transition-colors">
            <SlidersHorizontal size={14} />
          </button>
        </div>

        {/* Rows */}
        {isLoading ? (
          <div className="flex items-center justify-center py-16 text-sm text-slate-400">
            Loading automations…
          </div>
        ) : automations.length === 0 ? (
          <div className="flex items-center justify-center py-16 text-sm text-slate-400">
            No automations found.
          </div>
        ) : (
          automations.map((automation) => (
            <AutomationRow key={automation.id} automation={automation} />
          ))
        )}
      </div>
    </div>
  );
};

export default AutomationPage;
