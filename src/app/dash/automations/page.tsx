"use client";

import React, { useState } from "react";
import { CreateAutomationDialog } from "@/components/CreateAutomation";
import { RefreshInstaDialog } from "@/components/auth/RefreshInstaDialog";
import { useQuery } from "@tanstack/react-query";
import { automationService } from "@/api/services/automations";
import { automationKeys } from "@/keys/react-query";
import TableRow from "../_components/TableRow";
import { DashboardHeader } from "../_components/Header";
import {
  TableHeader,
  StatusFilter,
  STATUS_OPTIONS,
} from "../_components/TableHeader";

const AutomationPage = () => {
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("ALL");

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
  const selectedLabel =
    STATUS_OPTIONS.find((o) => o.value === statusFilter)?.label ?? "All";

  return (
    <div className="flex flex-col h-full">
      <DashboardHeader
        showSearch={true}
        childComp={
          <>
            <RefreshInstaDialog />
            <CreateAutomationDialog title="New Automation" />
          </>
        }
      />

      {/* Table */}
      <div className="m-4 bg-white rounded-xl overflow-hidden flex-1">
        {/* Table header */}
        <TableHeader
          title="Automations"
          selectedLabel={selectedLabel}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
        />

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
            <TableRow key={automation.id} data={automation} />
          ))
        )}
      </div>
    </div>
  );
};

export default AutomationPage;
