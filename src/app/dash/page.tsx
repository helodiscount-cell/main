import { RefreshInstaDialog } from "@/components/auth/RefreshInstaDialog";
import { CreateAutomationDialog } from "@/components/CreateAutomation";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";

export default async function Page() {
  return (
    <div className="flex flex-1 flex-col gap-4 px-4">
      <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="mr-2 data-[orientation=vertical]:h-4"
        />

        <div className="flex w-full gap-4">
          <div
            className="flex-1 bg-white rounded-md pl-4 flex items-center"
            style={{ height: "inherit" }}
          >
            <p className="text-sm font-semibold">Dashboard</p>
          </div>
          <RefreshInstaDialog />
          <CreateAutomationDialog title="New Automation" />
        </div>
      </header>
      <div className="grid auto-rows-min gap-4 md:grid-cols-3">
        <div className="bg-muted/50 aspect-video rounded-xl" />
        <div className="bg-muted/50 aspect-video rounded-xl" />
        <div className="bg-muted/50 aspect-video rounded-xl" />
      </div>
      <div className="bg-muted/50 min-h-screen flex-1 rounded-xl md:min-h-min" />
    </div>
  );
}
