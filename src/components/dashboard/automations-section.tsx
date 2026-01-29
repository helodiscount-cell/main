"use client";

import { Spinner } from "@/components/ui/spinner";
import AutomationCard from "@/components/automations/AutomationCard";
import { Zap } from "lucide-react";
import type { AutomationListResponse } from "@dm-broo/common-types";

interface AutomationsSectionProps {
  automations: { data: AutomationListResponse, success: true } | null;
  isFetching: boolean;
  onToggleStatus: (id: string, newStatus: "ACTIVE" | "PAUSED") => void;
  onDelete: (id: string) => void;
  onViewDetails: (id: string) => void;
}

// Renders active automations grid with controls
export const AutomationsSection = ({
  automations,
  isFetching,
  onToggleStatus,
  onDelete,
  onViewDetails,
}: AutomationsSectionProps) => {

  if (isFetching) {
    return (
      <div className="flex justify-center py-12">
        <Spinner className="size-8" />
      </div>
    );
  }

  if (automations?.data.automations.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground border-2 border-dashed border-border rounded-2xl bg-muted/30">
        <Zap className="mx-auto mb-4 text-muted-foreground/50" size={48} />
        <p className="text-lg font-medium mb-2">No active automations yet</p>
        <p className="text-sm">
          Clicks on a post to create your first automation
        </p>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-2xl font-bold text-foreground mb-6">
        Active{" "}
        <span className="bg-linear-to-r from-cyan-500 to-fuchsia-500 bg-clip-text text-transparent">
          Automations
        </span>
      </h2>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {automations?.data.automations.map((automation) => (
          <AutomationCard
            key={automation.id}
            automation={automation}
            onToggleStatus={onToggleStatus}
            onDelete={onDelete}
            onViewDetails={onViewDetails}
          />
        ))}
      </div>
    </div>
  );
};
