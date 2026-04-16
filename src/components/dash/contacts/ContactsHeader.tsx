import { cn } from "@/server/utils";
import { Search, RefreshCw, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CONTACTS_CONFIG } from "./config";

const BUTTON_ACTION_CLASSES =
  "h-full shrink-0 bg-[#7C3AED] hover:bg-[#6D28D9] text-white transition-colors";

export const ContactsHeader = () => {
  return (
    <header className="flex h-10 shrink-0 items-center gap-2 border-b border-transparent bg-transparent">
      <div className="flex w-full gap-3 items-center h-full">
        <div className="flex-1 bg-white rounded-md px-4 flex items-center h-full min-w-[200px]">
          <span className="text-sm font-semibold">
            {CONTACTS_CONFIG.PAGE_TITLE}
          </span>
        </div>

        <div className="bg-white rounded-md px-3 flex items-center gap-2 h-full">
          <Search size={15} className="text-slate-400 shrink-0" />
          <input
            type="text"
            placeholder={CONTACTS_CONFIG.SEARCH_PLACEHOLDER}
            className="w-full text-sm bg-transparent outline-none text-slate-700 placeholder:text-slate-400"
          />
        </div>

        <div className="h-full w-fit flex items-center gap-2">
          <Button
            size="icon"
            className={cn(BUTTON_ACTION_CLASSES, "w-9")}
            type="button"
          >
            <RefreshCw size={15} />
          </Button>

          <Button
            className={cn(BUTTON_ACTION_CLASSES, "gap-2 px-4")}
            type="button"
          >
            <Download size={15} />
            Export List
          </Button>
        </div>
      </div>
    </header>
  );
};
