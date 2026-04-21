"use client";

import React, { useState } from "react";
import { CreateAutomationDialog } from "@/components/dash/automations/create";
import { useQuery } from "@tanstack/react-query";
import { automationService } from "@/api/services/automations";
import { automationKeys } from "@/keys/react-query";
import { useIsMobile } from "@/hooks/use-mobile";
import { TableRow, MobilePageLayout, TablePageLayout } from "../_components";
import { AutomationStatus } from "@/api/services/automations/types";
import {
  StatusFilter,
  TriggerFilter,
  SortField,
} from "../_components/TableHeader";
import { useTableState } from "@/hooks/use-table-state";
import { useSearchSync } from "@/hooks/use-search-sync";
import { APP_CONFIG } from "@/configs/app.config";

const AutomationPage = () => {
  const isMobile = useIsMobile();

  const [statusFilter, setStatusFilter] = useState<StatusFilter>("ALL");
  const [triggerFilter, setTriggerFilter] = useState<TriggerFilter>("ALL");

  const { sync: syncSearch } = useSearchSync();

  // Maps UI filters to server-supported status filters to avoid query key fragmentation
  const serverStatus =
    statusFilter === "ACTIVE" ||
    statusFilter === "STOPPED" ||
    statusFilter === "EXPIRED"
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

  const {
    search,
    sortField,
    sortOrder,
    page,
    setPage,
    toggleSort,
    paginatedItems: paginatedAutomations,
    totalItems,
    filteredAndSorted,
  } = useTableState({
    data: automations,
    defaultSortField: "date" as SortField,
    defaultSortOrder: "desc",
    filterFn: (a, s) => {
      const matchesSearch = (a.automationName || "")
        .toLowerCase()
        .includes(s.toLowerCase());
      if (!matchesSearch) return false;

      // Trigger Type Filter (Client-side only)
      if (triggerFilter !== "ALL") {
        if (triggerFilter === "COMMENT")
          return a.triggerType === "COMMENT_ON_POST";
        if (triggerFilter === "DM")
          return a.triggerType === "RESPOND_TO_ALL_DMS";
        if (triggerFilter === "STORY") return a.triggerType === "STORY_REPLY";
      }
      return true;
    },
    sortFn: (a, b, field, order) => {
      const fieldA =
        field === "count"
          ? a.timesTriggered || 0
          : field === "newFollowers"
            ? a.newFollowersGained || 0
            : new Date(a.lastTriggeredAt || a.updatedAt).getTime();
      const fieldB =
        field === "count"
          ? b.timesTriggered || 0
          : field === "newFollowers"
            ? b.newFollowersGained || 0
            : new Date(b.lastTriggeredAt || b.updatedAt).getTime();

      if (fieldA !== fieldB) {
        return order === "asc" ? fieldA - fieldB : fieldB - fieldA;
      }
      return a.id.localeCompare(b.id);
    },
  });

  const handleSearchChange = (val: string) => {
    syncSearch(val);
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

  if (isMobile) {
    return (
      <MobilePageLayout
        title="Automations"
        items={filteredAndSorted}
        isLoading={isLoading}
        emptyMessage={search ? "No matches found." : "No automations found."}
        actionButton={
          <div className="w-full">
            <CreateAutomationDialog
              title="New Automation"
              triggerClassName="w-full h-14 text-lg font-bold border-purple-200 bg-[#6A06E4] hover:bg-[#5a05c4] text-white"
            />
          </div>
        }
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
                ? "STOPPED"
                : statusFilter === "STOPPED"
                  ? "EXPIRED"
                  : "ALL";
          handleStatusChange(nextStatus);
        }}
      />
    );
  }

  return (
    <TablePageLayout
      variant="automations"
      isLoading={isLoading}
      totalItems={totalItems}
      currentPage={page}
      pageSize={APP_CONFIG.PAGINATION.DEFAULT_PAGE_SIZE}
      onPageChange={setPage}
      items={paginatedAutomations}
      renderRow={(automation) => (
        <TableRow key={automation.id} data={automation} variant="automations" />
      )}
      emptyState={{
        message: search ? "No matches found." : "No automations found.",
      }}
      statusFilter={statusFilter}
      handleStatusChange={handleStatusChange}
      triggerFilter={triggerFilter}
      handleTriggerChange={handleTriggerChange}
      sortField={sortField}
      sortOrder={sortOrder}
      handleSort={toggleSort}
    />
  );
};

export default AutomationPage;
