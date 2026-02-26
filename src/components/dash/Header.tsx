import React from "react";
import { SidebarTrigger } from "../ui/sidebar";
import { Separator } from "../ui/separator";
import { RefreshInstaDialog } from "../auth/RefreshInstaDialog";
import { CreateAutomationDialog } from "../CreateAutomation";

interface Props {
  title: string;
  showCreateAutomation?: boolean;
  showRefreshAccount?: boolean;
  showSearchBar?: boolean;
}

const Header = () => {
  return (
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
  );
};

export default Header;
