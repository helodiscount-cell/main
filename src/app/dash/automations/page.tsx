"use client";

import React, { useState, useMemo } from "react";
import { CreateAutomationDialog } from "@/components/dash/automations/create";
import { RefreshInstaDialog } from "@/components/auth/RefreshInstaDialog";
import { useQuery } from "@tanstack/react-query";
import { automationService } from "@/api/services/automations";
import { automationKeys } from "@/keys/react-query";
import { useIsMobile } from "@/hooks/use-mobile";
import { Spinner } from "@/components/ui/spinner";
import {
  DashboardHeader,
  TableHeader,
  TableRow,
  MobilePageLayout,
  Pagination,
} from "../_components";
import {
  StatusFilter,
  STATUS_OPTIONS,
  SortOrder,
  SortField,
} from "../_components/TableHeader";

const AutomationPage = () => {
  const isMobile = useIsMobile();
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("ALL");
  const [sortField, setSortField] = useState<SortField>("date");
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const PAGE_SIZE = 10;

  const { data, isLoading } = useQuery({
    queryKey: automationKeys.list(
      statusFilter !== "ALL" ? { status: statusFilter as any } : undefined,
    ),
    queryFn: () =>
      automationService.list(
        statusFilter !== "ALL" ? { status: statusFilter as any } : undefined,
      ),
  });

  const automations = data?.automations ?? [];

  // Filter and Sort automations
  const filteredAndSorted = useMemo(() => {
    let result = [...automations];

    // Real-time Search Filter
    if (search) {
      const s = search.toLowerCase();
      result = result.filter((a) =>
        a.automationName?.toLowerCase().includes(s),
      );
    }

    // Existing Sort Logic
    return result.sort((a, b) => {
      const fieldA =
        sortField === "count"
          ? a.timesTriggered || 0
          : new Date(a.lastTriggeredAt || a.updatedAt).getTime();
      const fieldB =
        sortField === "count"
          ? b.timesTriggered || 0
          : new Date(b.lastTriggeredAt || b.updatedAt).getTime();

      if (sortOrder === "asc") return fieldA - fieldB;
      return fieldB - fieldA;
    });
  }, [automations, search, sortField, sortOrder]);

  // Handle Search Change (reset pagination)
  const handleSearchChange = (val: string) => {
    setSearch(val);
    setPage(1);
  };

  // Pagination Slice
  const paginatedAutomations = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return filteredAndSorted.slice(start, start + PAGE_SIZE);
  }, [filteredAndSorted, page]);

  const toggleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortOrder("desc");
    }
  };

  const selectedLabel =
    STATUS_OPTIONS.find((o) => o.value === statusFilter)?.label ?? "All";

  const newAutomationAction = (
    <div className="w-full">
      <CreateAutomationDialog
        title="New Automation"
        triggerClassName="w-full h-14 rounded-2xl text-lg font-bold      -purple-200 bg-[#6A06E4] hover:bg-[#5a05c4] text-white"
      />
    </div>
  );

  if (isMobile) {
    return (
      <MobilePageLayout
        title="Automations"
        items={filteredAndSorted}
        isLoading={isLoading}
        emptyMessage="No automations found."
        actionButton={newAutomationAction}
        onSortChange={() => toggleSort("date")}
      />
    );
  }

  return (
    <div className="flex flex-col h-full bg-[#F1F1F1]">
      <DashboardHeader
        showSearch={true}
        searchValue={search}
        onSearchChange={handleSearchChange}
        childComp={
          <>
            <RefreshInstaDialog />
            <CreateAutomationDialog title="New Automation" />
          </>
        }
      />

      {/* Table */}
      <div className="m-4 bg-white rounded-xl overflow-hidden flex-1 border border-slate-50 flex flex-col">
        <div className="flex-1">
          {/* Table header */}
          <TableHeader
            title="Automations"
            selectedLabel={selectedLabel}
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
            sortField={sortField}
            sortOrder={sortOrder}
            onSort={toggleSort}
          />

          {/* Rows */}
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-16 gap-3 text-sm text-slate-400">
              <Spinner className="text-[#6A06E4] size-5" strokeWidth={2.5} />
              Loading automations…
            </div>
          ) : paginatedAutomations.length === 0 ? (
            <div className="flex items-center justify-center py-16 text-sm text-slate-400">
              {search ? "No matches found." : "No automations found."}
            </div>
          ) : (
            paginatedAutomations.map((automation) => (
              <TableRow key={automation.id} data={automation} />
            ))
          )}
        </div>

        {/* Pagination */}
        <Pagination
          currentPage={page}
          totalItems={filteredAndSorted.length}
          pageSize={PAGE_SIZE}
          onPageChange={setPage}
        />
      </div>
    </div>
  );
};

export default AutomationPage;
