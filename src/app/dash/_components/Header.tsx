"use client";

import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { usePathname } from "next/navigation";
import { Search } from "lucide-react";

interface Props {
  showSearch?: boolean;
  childComp: React.ReactNode;
}

export function DashboardHeader({ showSearch, childComp }: Props) {
  const pathname = usePathname();

  const title = pathname
    .split("/")
    .map((item) => item.charAt(0).toUpperCase() + item.slice(1));

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
          <p className="text-sm font-semibold capitalize">
            {title[title.length - 1]}
          </p>
        </div>

        {showSearch && (
          <div className="flex-1 bg-white rounded-md px-3 flex items-center gap-2 h-9">
            <Search size={15} className="text-slate-400 shrink-0" />
            <input
              type="text"
              placeholder="Search automations"
              className="w-full text-sm bg-transparent outline-none text-slate-700 placeholder:text-slate-400"
            />
          </div>
        )}

        {childComp}
      </div>
    </header>
  );
}
