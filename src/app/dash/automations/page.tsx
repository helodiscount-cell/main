"use client";

import React, { useState } from "react";
import { CreateAutomationDialog } from "@/components/dash/automations/create";
import { RefreshInstaDialog } from "@/components/auth/RefreshInstaDialog";
import { useQuery } from "@tanstack/react-query";
import { automationService } from "@/api/services/automations";
import { automationKeys } from "@/keys/react-query";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  DashboardHeader,
  TableHeader,
  TableRow,
  MobilePageLayout,
} from "../_components";
import { StatusFilter, STATUS_OPTIONS } from "../_components/TableHeader";

const AutomationPage = () => {
  const isMobile = useIsMobile();
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
        items={automations}
        isLoading={isLoading}
        emptyMessage="No automations found."
        actionButton={newAutomationAction}
      />
    );
  }

  return (
    <div className="flex flex-col h-full bg-[#F8FAFC]">
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
      <div className="m-4 bg-white rounded-xl overflow-hidden flex-1 border border-slate-50">
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
