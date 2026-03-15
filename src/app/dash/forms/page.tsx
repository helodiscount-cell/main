"use client";

import React, { useState } from "react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { RefreshInstaDialog } from "@/components/auth/RefreshInstaDialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ColHeader } from "@/components/dash/automations/ColHeader";
import { Button } from "@/components/ui/button";
import { ChevronDown, PlusIcon, Search, SlidersHorizontal } from "lucide-react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { formService } from "@/api/services/forms";
import { formKeys } from "@/keys/react-query";
import FormRow from "./_components/FormRow";

type StatusFilter = "DRAFT" | "PUBLISHED" | "ALL";

// Config-driven filter options
const STATUS_OPTIONS: { label: string; value: StatusFilter }[] = [
  { label: "All", value: "ALL" },
  { label: "Published", value: "PUBLISHED" },
  { label: "Draft", value: "DRAFT" },
];

export default function FormsPage() {
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("ALL");
  const [searchQuery, setSearchQuery] = useState("");

  const { data: forms = [], isLoading } = useQuery({
    queryKey: formKeys.list(
      statusFilter !== "ALL" ? { status: statusFilter } : undefined,
    ),
    queryFn: () => formService.list(),
  });

  // Client-side filter — status + search on title/description
  const filteredForms = forms.filter((form) => {
    const matchesStatus =
      statusFilter === "ALL" || form.status === statusFilter;
    const matchesSearch =
      searchQuery.trim() === "" ||
      form.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      form.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const selectedLabel =
    STATUS_OPTIONS.find((o) => o.value === statusFilter)?.label ?? "All";

  return (
    <div className="flex flex-col h-full">
      {/* Top header */}
      <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="mr-2 data-[orientation=vertical]:h-4"
        />

        <div className="flex w-full gap-3 items-center">
          <div className="flex-2 bg-white rounded-md px-4 flex items-center h-9">
            <p className="text-sm font-semibold">Forms</p>
          </div>

          <div className="flex-1 bg-white rounded-md px-3 flex items-center gap-2 h-9">
            <Search size={15} className="text-slate-400 shrink-0" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search forms"
              className="w-full text-sm bg-transparent outline-none text-slate-700 placeholder:text-slate-400"
            />
          </div>

          <RefreshInstaDialog />
          <Button className="bg-[#6A06E4] hover:bg-[#5a05c4]" asChild>
            <Link href="/dash/forms/editor" className="flex items-center gap-2">
              <PlusIcon size={15} />
              New Form
            </Link>
          </Button>
        </div>
      </header>

      {/* Table */}
      <div className="m-4 bg-white rounded-xl overflow-hidden flex-1">
        {/* Column headers */}
        <div className="grid grid-cols-[2fr_1fr_1fr_1fr_auto] items-center px-4 py-3 gap-4 border-b border-slate-100">
          <span className="text-sm font-medium text-slate-700">Form</span>

          <div className="flex items-center gap-2">
            <ColHeader label="Submissions" />
            <div className="w-px h-4 bg-slate-200" />
          </div>

          {/* Status filter dropdown */}
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
            <ColHeader label="Updated" />
          </div>

          <SlidersHorizontal size={14} className="text-slate-400" />
        </div>

        {/* Rows */}
        {isLoading ? (
          <div className="flex items-center justify-center py-16 text-sm text-slate-400">
            Loading forms…
          </div>
        ) : filteredForms.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 gap-2 text-slate-400">
            <span className="text-3xl">📋</span>
            <p className="text-sm">
              {searchQuery
                ? "No forms match your search."
                : "No forms yet. Create your first one!"}
            </p>
          </div>
        ) : (
          filteredForms.map((form) => <FormRow key={form.id} form={form} />)
        )}
      </div>
    </div>
  );
}
