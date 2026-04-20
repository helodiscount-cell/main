"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { formService } from "@/api/services/forms";
import { formKeys } from "@/keys/react-query";
import { type FormStatus } from "@dm-broo/common-types";
import { useIsMobile } from "@/hooks/use-mobile";
import { useTableState } from "@/hooks/use-table-state";
import { useSearchSync } from "@/hooks/use-search-sync";
import { APP_CONFIG } from "@/configs/app.config";
import { TableRow, MobilePageLayout, TablePageLayout } from "../_components";
import { StatusFilter, SortField } from "../_components/TableHeader";

export default function FormsPage() {
  const isMobile = useIsMobile();

  const [statusFilter, setStatusFilter] = useState<StatusFilter>("ALL");

  const { sync: syncSearch } = useSearchSync();

  // query to fetch forms list
  const { data: forms = [], isLoading } = useQuery({
    queryKey: formKeys.list(
      statusFilter !== "ALL" ? { status: statusFilter } : undefined,
    ),
    queryFn: () =>
      formService.list(
        statusFilter !== "ALL"
          ? { status: statusFilter as FormStatus }
          : undefined,
      ),
  });

  const {
    search,
    sortField,
    sortOrder,
    page,
    setPage,
    toggleSort,
    paginatedItems: paginatedForms,
    totalItems,
    filteredAndSorted,
  } = useTableState({
    data: forms,
    defaultSortField: "date" as SortField,
    defaultSortOrder: "desc",
    filterFn: (f, s) =>
      f.name?.toLowerCase().includes(s.toLowerCase()) ||
      f.title?.toLowerCase().includes(s.toLowerCase()) ||
      f.description?.toLowerCase().includes(s.toLowerCase()),
    sortFn: (a, b, field, order) => {
      const fieldA =
        field === "count" ? a.submissionCount : new Date(a.updatedAt).getTime();
      const fieldB =
        field === "count" ? b.submissionCount : new Date(b.updatedAt).getTime();

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

  if (isMobile) {
    return (
      <MobilePageLayout
        title="Forms"
        items={filteredAndSorted}
        isLoading={isLoading}
        emptyMessage={
          search ? "No matches found." : "No forms yet. Create your first one!"
        }
        actionButton={
          <Button
            className="bg-[#6A06E4] hover:bg-[#5a05c4] w-full h-11 rounded-lg text-lg font-semibold"
            asChild
          >
            <Link href="/dash/forms/new" className="flex items-center gap-2">
              New Form
            </Link>
          </Button>
        }
        searchValue={search}
        onSearchChange={handleSearchChange}
        sortOrder={sortOrder}
        onSortChange={(sortKey) =>
          toggleSort(sortKey === "createdAt" ? "date" : (sortKey as SortField))
        }
        onFilterToggle={() => {
          const nextStatus: StatusFilter =
            statusFilter === "ALL"
              ? "PUBLISHED"
              : statusFilter === "PUBLISHED"
                ? "DRAFT"
                : "ALL";
          handleStatusChange(nextStatus);
        }}
      />
    );
  }

  return (
    <TablePageLayout
      variant="forms"
      isLoading={isLoading}
      totalItems={totalItems}
      currentPage={page}
      pageSize={APP_CONFIG.PAGINATION.DEFAULT_PAGE_SIZE}
      onPageChange={setPage}
      items={paginatedForms}
      renderRow={(form) => (
        <TableRow key={form.id} data={form} variant="forms" />
      )}
      emptyState={{
        message: search
          ? "No matches found."
          : "No forms yet. Create your first one!",
        icon: <span className="text-4xl text-slate-300">📋</span>,
      }}
      statusFilter={statusFilter}
      handleStatusChange={handleStatusChange}
      sortField={sortField}
      sortOrder={sortOrder}
      handleSort={toggleSort}
    />
  );
}
