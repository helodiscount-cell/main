import React from "react";
import { Search, RefreshCw, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { CONTACTS_CONFIG } from "./config";

export const ContactsHeader = () => {
  return (
    <header className="flex h-16 shrink-0 items-center gap-2 px-4 border-b border-transparent bg-transparent">
      <SidebarTrigger className="-ml-1" />
      <Separator
        orientation="vertical"
        className="mr-2 h-4"
        data-orientation="vertical"
      />

      <div className="flex w-full gap-3 items-center">
        <div className="bg-white rounded-md px-4 flex items-center h-9 min-w-[200px]">
          <span className="text-sm font-semibold">
            {CONTACTS_CONFIG.PAGE_TITLE}
          </span>
        </div>

        <div className="flex-1 bg-white rounded-md px-3 flex items-center gap-2 h-9">
          <Search size={15} className="text-slate-400 shrink-0" />
          <input
            type="text"
            placeholder={CONTACTS_CONFIG.SEARCH_PLACEHOLDER}
            className="w-full text-sm bg-transparent outline-none text-slate-700 placeholder:text-slate-400"
          />
        </div>

        <div className="w-fit flex items-center gap-2">
          <Button
            size="icon"
            className="h-9 w-9 shrink-0 bg-[#7C3AED] hover:bg-[#6D28D9]    -sm text-white"
          >
            <RefreshCw size={15} />
          </Button>

          <Button className="h-9 shrink-0 bg-[#7C3AED] hover:bg-[#6D28D9] gap-2    -sm text-white px-4">
            <Download size={15} />
            Export List
          </Button>
        </div>
      </div>
    </header>
  );
};
