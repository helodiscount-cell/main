"use client";

import React, { useState } from "react";
import { RefreshInstaDialog } from "@/components/auth/RefreshInstaDialog";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { formService } from "@/api/services/forms";
import { formKeys } from "@/keys/react-query";
import { DashboardHeader, TableHeader, TableRow } from "../_components";
import { StatusFilter, STATUS_OPTIONS } from "../_components/TableHeader";

export default function FormsPage() {
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("ALL");

  const { data: forms = [], isLoading } = useQuery({
    queryKey: formKeys.list(
      statusFilter !== "ALL" ? { status: statusFilter } : undefined,
    ),
    queryFn: () => formService.list(),
  });

  const selectedLabel =
    STATUS_OPTIONS.find((o) => o.value === statusFilter)?.label ?? "All";

  return (
    <div className="flex flex-col h-full">
      {/* Top header */}
      <DashboardHeader
        showSearch={true}
        childComp={
          <>
            <RefreshInstaDialog />
            <Button className="bg-[#6A06E4] hover:bg-[#5a05c4]" asChild>
              <Link
                href="/dash/forms/editor"
                className="flex items-center gap-2"
              >
                <PlusIcon size={15} />
                New Form
              </Link>
            </Button>
          </>
        }
      />

      {/* Table */}
      <div className="m-4 bg-white rounded-xl overflow-hidden flex-1">
        {/* Column headers */}
        <TableHeader
          title="Forms"
          selectedLabel={selectedLabel}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
        />

        {/* Rows */}
        {isLoading ? (
          <div className="flex items-center justify-center py-16 text-sm text-slate-400">
            Loading forms…
          </div>
        ) : forms.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 gap-2 text-slate-400">
            <span className="text-3xl">📋</span>
            <p className="text-sm">No forms yet. Create your first one!</p>
          </div>
        ) : (
          forms.map((form) => <TableRow key={form.id} data={form} />)
        )}
      </div>
    </div>
  );
}
