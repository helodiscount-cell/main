import { RefreshInstaDialog } from "@/components/auth/RefreshInstaDialog";
import { ColHeader } from "@/components/dash/automations/ColHeader";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import {
  ChevronDown,
  PlusIcon,
  RefreshCw,
  Search,
  SlidersHorizontal,
} from "lucide-react";
import FormRow from "./_components/FormRow";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Page() {
  return (
    <div className="flex flex-col h-full">
      <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="mr-2 data-[orientation=vertical]:h-4"
        />

        <div className="flex w-full gap-3 items-center">
          <div className="flex-2 bg-white rounded-md px-4 flex items-center h-9">
            <p className="text-sm font-semibold">Forms</p>
          </div>

          <div className="flex-1 bg-white rounded-md px-3 flex items-center gap-2 h-9">
            <Search size={15} className="text-slate-400 shrink-0" />
            <input
              type="text"
              placeholder="Search automations"
              className="w-full text-sm bg-transparent outline-none text-slate-700 placeholder:text-slate-400"
            />
          </div>

          <RefreshInstaDialog />
          <Button className="bg-[#6A06E4]">
            <Link
              href={"/dash/forms/editor"}
              className="flex items-center justify-center gap-2"
            >
              <PlusIcon />
              New Form
            </Link>
          </Button>
        </div>
      </header>

      {/* Table */}
      <div className="m-4 bg-white rounded-xl overflow-hidden flex-1">
        {/* Table header */}
        <div className="grid grid-cols-[2fr_1fr_1fr_1fr_auto] items-center px-4 py-3 gap-4 border-b border-slate-100">
          <span className="text-sm font-medium text-slate-700">Forms</span>
          <div className="flex items-center gap-2">
            <ColHeader label="Submissions" />
            <div className="w-px h-4 bg-slate-200" />
          </div>

          {/* Status column with filter dropdown */}
          <div className="flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-1 text-sm font-medium text-slate-700 hover:text-slate-900 transition-colors">
                  {/* {selectedLabel === "All" ? "Status" : selectedLabel} */}
                  Status
                  <ChevronDown size={13} className="text-slate-400" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="min-w-[130px]">
                <DropdownMenuRadioGroup
                // value={statusFilter}
                // onValueChange={(v) => setStatusFilter(v as StatusFilter)}
                >
                  <DropdownMenuRadioItem value="all">All</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="active">
                    Active
                  </DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="inactive">
                    Inactive
                  </DropdownMenuRadioItem>
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>
            <div className="w-px h-4 bg-slate-200" />
          </div>

          <div className="flex items-center gap-2">
            <ColHeader label="Last Triggered" />
          </div>
          <button className="bg-slate-900 text-white rounded-md p-1.5 hover:bg-slate-700 transition-colors">
            <SlidersHorizontal size={14} />
          </button>
        </div>

        {/* Rows */}
        <FormRow id={1} form={{}} />

        {/* {isLoading ? (
          <div className="flex items-center justify-center py-16 text-sm text-slate-400">
            Loading automations…
          </div>
        ) : automations.length === 0 ? (
          <div className="flex items-center justify-center py-16 text-sm text-slate-400">
            No automations found.
          </div>
        ) : (
          automations.map((automation) => (
            <AutomationRow key={automation.id} automation={automation} />
          ))
        )} */}
      </div>
    </div>
  );
}
