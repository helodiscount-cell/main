"use client";

import React, { useState, useMemo } from "react";
import { RefreshInstaDialog } from "@/components/auth/RefreshInstaDialog";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { formService } from "@/api/services/forms";
import { formKeys } from "@/keys/react-query";
import { type FormStatus } from "@dm-broo/common-types";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  DashboardHeader,
  TableHeader,
  TableRow,
  MobilePageLayout,
  Pagination,
} from "../_components";
import {
  StatusFilter,
  getStatusOptions,
  SortOrder,
  SortField,
} from "../_components/TableHeader";
import PlusIconSvg from "@/assets/svgs/addthis.svg";
import Image from "next/image";

export default function FormsPage() {
  const isMobile = useIsMobile();
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("ALL");
  const [sortField, setSortField] = useState<SortField>("date");
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const PAGE_SIZE = 10;

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

  // Filter and Sort forms
  const filteredAndSortedForms = useMemo(() => {
    let result = [...forms];

    // Real-time Search Filter
    if (search) {
      const s = search.toLowerCase();
      result = result.filter(
        (f) =>
          f.title?.toLowerCase().includes(s) ||
          f.description?.toLowerCase().includes(s),
      );
    }

    // Existing Sort Logic
    return result.sort((a, b) => {
      const fieldA =
        sortField === "count"
          ? a.submissionCount
          : new Date(a.updatedAt).getTime();
      const fieldB =
        sortField === "count"
          ? b.submissionCount
          : new Date(b.updatedAt).getTime();

      if (fieldA !== fieldB) {
        if (sortOrder === "asc") return fieldA - fieldB;
        return fieldB - fieldA;
      }
      // Deterministic tie-breaker
      return a.id.localeCompare(b.id);
    });
  }, [forms, search, sortField, sortOrder]);

  const handleSearchChange = (val: string) => {
    setSearch(val);
    setPage(1);
  };

  const handleStatusChange = (status: StatusFilter) => {
    setStatusFilter(status);
    setPage(1);
  };

  // Pagination Slice
  const paginatedForms = useMemo(() => {
    // Clamp page before slicing
    const total = filteredAndSortedForms.length;
    const maxPage = Math.max(1, Math.ceil(total / PAGE_SIZE));
    const normalizedPage = page > maxPage ? maxPage : page;

    const start = (normalizedPage - 1) * PAGE_SIZE;
    return filteredAndSortedForms.slice(start, start + PAGE_SIZE);
  }, [filteredAndSortedForms, page]);

  // Sync page state if it was invalid (outside render)
  React.useEffect(() => {
    const total = filteredAndSortedForms.length;
    const maxPage = Math.max(1, Math.ceil(total / PAGE_SIZE));
    if (page > maxPage) {
      setPage(maxPage);
    }
  }, [filteredAndSortedForms.length, page]);

  const toggleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortOrder("desc");
    }
  };

  const newFormAction = (
    <Button
      className="bg-[#6A06E4] hover:bg-[#5a05c4] w-full h-14 rounded-xl text-lg font-bold"
      asChild
    >
      <Link href="/dash/forms/editor" className="flex items-center gap-2">
        <PlusIcon size={20} />
        New Form
      </Link>
    </Button>
  );

  if (isMobile) {
    return (
      <MobilePageLayout
        title="Forms"
        items={filteredAndSortedForms}
        isLoading={isLoading}
        emptyMessage={
          search ? "No matches found." : "No forms yet. Create your first one!"
        }
        actionButton={newFormAction}
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
    <div className="flex flex-col h-full bg-[#F1F1F1]">
      {/* Top header */}
      <DashboardHeader
        showSearch={true}
        searchValue={search}
        onSearchChange={handleSearchChange}
        childComp={
          <>
            <RefreshInstaDialog />
            <Button
              className="rounded-sm bg-[#6A06E4] hover:bg-[#5a05c4]"
              asChild
            >
              <Link
                href="/dash/forms/editor"
                className="flex items-center gap-2"
              >
                <Image src={PlusIconSvg} alt="add" width={15} height={15} />
                New Form
              </Link>
            </Button>
          </>
        }
      />

      {/* Table */}
      <div className="m-4 bg-white rounded-xl overflow-hidden flex-1 border border-slate-50 flex flex-col">
        <div className="flex-1">
          {/* Column headers */}
          <TableHeader
            title="Forms"
            statusFilter={statusFilter}
            setStatusFilter={handleStatusChange}
            sortField={sortField}
            sortOrder={sortOrder}
            onSort={toggleSort}
          />

          {/* Rows */}
          {isLoading ? (
            <div className="flex items-center justify-center py-16 text-sm text-slate-400">
              Loading forms…
            </div>
          ) : paginatedForms.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 gap-2 text-slate-400">
              <span className="text-3xl">📋</span>
              <p className="text-sm">
                {search
                  ? "No matches found."
                  : "No forms yet. Create your first one!"}
              </p>
            </div>
          ) : (
            paginatedForms.map((form) => <TableRow key={form.id} data={form} />)
          )}
        </div>

        {/* Pagination */}
        <Pagination
          currentPage={page}
          totalItems={filteredAndSortedForms.length}
          pageSize={PAGE_SIZE}
          onPageChange={setPage}
        />
      </div>
    </div>
  );
}
