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
  CreditIndicator,
} from "../_components";
import { AutomationStatus } from "@/types/automation";
import {
  StatusFilter,
  TriggerFilter,
  SortOrder,
  SortField,
} from "../_components/TableHeader";

const PAGE_SIZE = 10;

const AutomationPage = () => {
  const isMobile = useIsMobile();
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("ALL");
  const [triggerFilter, setTriggerFilter] = useState<TriggerFilter>("ALL");
  const [sortField, setSortField] = useState<SortField>("date");
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  // Map UI filters to server-supported status filters to avoid query key fragmentation
  const serverStatus =
    statusFilter === "ACTIVE" || statusFilter === "PAUSED"
      ? (statusFilter as AutomationStatus)
      : undefined;

  const { data, isLoading } = useQuery({
    queryKey: [...automationKeys.all, "list", { status: serverStatus }],
    queryFn: () =>
      automationService.list(
        serverStatus ? { status: serverStatus } : undefined,
      ),
  });

  const automations = data?.automations ?? [];

  // Filter and Sort automations locally (Search, Trigger Types, Sorting)
  const filteredAndSorted = useMemo(() => {
    let result = [...automations];

    // Real-time Search Filter
    if (search) {
      const s = search.toLowerCase();
      result = result.filter((a) =>
        (a.automationName || "").toLowerCase().includes(s),
      );
    }

    // Trigger Type Filter (Client-side only)
    if (triggerFilter !== "ALL") {
      if (triggerFilter === "COMMENT") {
        result = result.filter((a) => a.triggerType === "COMMENT_ON_POST");
      } else if (triggerFilter === "DM") {
        result = result.filter((a) => a.triggerType === "RESPOND_TO_ALL_DMS");
      } else if (triggerFilter === "STORY") {
        result = result.filter((a) => a.triggerType === "STORY_REPLY");
      }
    }

    // Existing Sort Logic
    return result.sort((a, b) => {
      const fieldA =
        sortField === "count"
          ? a.timesTriggered || 0
          : sortField === "newFollowers"
            ? a.newFollowersGained || 0
            : new Date(a.lastTriggeredAt || a.updatedAt).getTime();
      const fieldB =
        sortField === "count"
          ? b.timesTriggered || 0
          : sortField === "newFollowers"
            ? b.newFollowersGained || 0
            : new Date(b.lastTriggeredAt || b.updatedAt).getTime();

      if (fieldA !== fieldB) {
        if (sortOrder === "asc") return fieldA - fieldB;
        return fieldB - fieldA;
      }

      // Tie-breaker: consistent order for equal values
      return a.id.localeCompare(b.id);
    });
  }, [automations, search, sortField, sortOrder, triggerFilter]);

  const handleSearchChange = (val: string) => {
    setSearch(val);
    setPage(1);
  };

  const handleStatusChange = (status: StatusFilter) => {
    setStatusFilter(status);
    setPage(1);
  };

  const handleTriggerChange = (trigger: TriggerFilter) => {
    setTriggerFilter(trigger);
    setPage(1);
  };

  // Pagination Slice
  const paginatedAutomations = useMemo(() => {
    // Clamp page before slicing
    const total = filteredAndSorted.length;
    const maxPage = Math.max(1, Math.ceil(total / PAGE_SIZE));
    const normalizedPage = page > maxPage ? maxPage : page;

    const start = (normalizedPage - 1) * PAGE_SIZE;
    return filteredAndSorted.slice(start, start + PAGE_SIZE);
  }, [filteredAndSorted, page]);

  // Sync page state if it was invalid (outside render)
  React.useEffect(() => {
    const total = filteredAndSorted.length;
    const maxPage = Math.max(1, Math.ceil(total / PAGE_SIZE));
    if (page > maxPage) {
      setPage(maxPage);
    }
  }, [filteredAndSorted.length, page]);

  const toggleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortOrder("desc");
    }
  };

  const newAutomationAction = (
    <div className="w-full">
      <CreateAutomationDialog
        title="New Automation"
        triggerClassName="w-full h-14 text-lg font-bold border-purple-200 bg-[#6A06E4] hover:bg-[#5a05c4] text-white"
      />
    </div>
  );

  if (isMobile) {
    return (
      <MobilePageLayout
        title="Automations"
        items={filteredAndSorted}
        isLoading={isLoading}
        emptyMessage={search ? "No matches found." : "No automations found."}
        actionButton={newAutomationAction}
        searchValue={search}
        onSearchChange={handleSearchChange}
        sortOrder={sortOrder}
        onSortChange={(sortKey) => {
          const normalizedKey =
            sortKey === "createdAt" ? "date" : (sortKey as SortField);
          if (normalizedKey === "date" || normalizedKey === "count") {
            toggleSort(normalizedKey);
          }
        }}
        onFilterToggle={() => {
          const nextStatus: StatusFilter =
            statusFilter === "ALL"
              ? "ACTIVE"
              : statusFilter === "ACTIVE"
                ? "PAUSED"
                : "ALL";
          handleStatusChange(nextStatus);
        }}
      />
    );
  }

  return (
    <>
      <DashboardHeader
        showSearch={true}
        searchValue={search}
        onSearchChange={handleSearchChange}
        childComp={
          <>
            <CreditIndicator />
            <RefreshInstaDialog />
            <CreateAutomationDialog title="New Automation" />
          </>
        }
      />

      {/* Table */}
      <div className="bg-white rounded-xl overflow-hidden flex-1 border border-slate-50 flex flex-col">
        {/* Table header */}
        <TableHeader
          variant="automations"
          statusFilter={statusFilter}
          setStatusFilter={handleStatusChange}
          triggerFilter={triggerFilter}
          setTriggerFilter={handleTriggerChange}
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
            <TableRow
              key={automation.id}
              data={automation}
              variant="automations"
            />
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
    </>
  );
};

export default AutomationPage;
