import React from "react";
import { RefreshInstaDialog } from "@/components/auth/RefreshInstaDialog";
import { CreditIndicator } from "@/app/dash/_components/CreditIndicator";
import { CreateAutomationDialog } from "@/components/dash/automations/create";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import PlusIconSvg from "@/assets/svgs/addthis.svg";
import Image from "next/image";

import { RefreshCw, Download } from "lucide-react";
import { cn } from "@/server/utils";

export interface HeaderConfig {
  showSearch: boolean;
  childComp: React.ReactNode;
  hideHeader?: boolean;
}

const CONTACTS_BUTTON_CLASSES =
  "h-full shrink-0 bg-[#7C3AED] hover:bg-[#6D28D9] text-white transition-colors";

export const DASHBOARD_HEADER_CONFIG: Record<string, HeaderConfig> = {
  "/dash": {
    showSearch: false,
    childComp: (
      <>
        <RefreshInstaDialog />
        <CreateAutomationDialog title="New Automation" />
      </>
    ),
  },
  "/dash/automations": {
    showSearch: true,
    childComp: (
      <>
        <CreditIndicator />
        <RefreshInstaDialog />
        <CreateAutomationDialog title="New Automation" />
      </>
    ),
  },
  "/dash/forms": {
    showSearch: true,
    childComp: (
      <>
        <RefreshInstaDialog />
        <Button className="bg-[#6A06E4] hover:bg-[#5a05c4] h-full" asChild>
          <Link
            href="/dash/forms/new"
            className="h-full flex items-center gap-2"
          >
            <Image src={PlusIconSvg} alt="add" width={15} height={15} />
            New Form
          </Link>
        </Button>
      </>
    ),
  },
  "/dash/contacts": {
    showSearch: true,
    childComp: (
      <>
        <Button
          size="icon"
          className={cn(CONTACTS_BUTTON_CLASSES, "w-9")}
          type="button"
        >
          <RefreshCw size={15} />
        </Button>

        <Button
          className={cn(CONTACTS_BUTTON_CLASSES, "gap-2 px-4")}
          type="button"
        >
          <Download size={15} />
          Export List
        </Button>
      </>
    ),
  },
};

export const getHeaderConfig = (pathname: string): HeaderConfig | null => {
  // Exact match for now, can be extended to prefix match if needed
  return DASHBOARD_HEADER_CONFIG[pathname] || null;
};
