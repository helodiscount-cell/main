import { GrowthWidget } from "@/components/dash/GrowthWidget";
import { BestPerformerWidget } from "@/components/dash/BestPerformer";
import { RefreshInstaDialog } from "@/components/auth/RefreshInstaDialog";
import { CreateAutomationDialog } from "@/components/dash/automations/create";
import { DashboardHeader } from "./_components";

export default async function Page() {
  return (
    <div className="flex flex-1 flex-col gap-4 px-4">
      <DashboardHeader
        childComp={
          <>
            <RefreshInstaDialog />
            <CreateAutomationDialog title="New Automation" />
          </>
        }
      />

      <div className="grid auto-rows-min gap-4 md:grid-cols-3">
        <GrowthWidget type="followers" />
        <GrowthWidget type="outreach" />
        <div className="md:col-span-3 lg:col-span-2">
          <BestPerformerWidget />
        </div>
      </div>
      <div className="bg-muted/50 min-h-screen flex-1 rounded-xl md:min-h-min" />
    </div>
  );
}
