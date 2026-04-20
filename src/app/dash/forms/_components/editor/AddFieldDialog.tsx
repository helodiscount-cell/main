"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { FIELD_TYPE_GROUPS } from "./config";
import { useIsMobile } from "@/hooks/use-mobile";
import type { FieldType } from "@dm-broo/common-types";

type AddFieldDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddField: (type: FieldType) => void;
};

// Modal picker — shows grouped field types, closes on selection
// On mobile, it slides from bottom using Sheet; on desktop, it's a centered Dialog.
export default function AddFieldDialog({
  open,
  onOpenChange,
  onAddField,
}: AddFieldDialogProps) {
  const isMobile = useIsMobile();

  const handleSelect = (type: FieldType) => {
    onAddField(type);
    onOpenChange(false);
  };

  const ContentBody = () => (
    <div className="space-y-4 pt-2">
      {FIELD_TYPE_GROUPS.map((group) => (
        <div key={group.groupLabel}>
          {/* Group label */}
          <p className="text-xs font-semibold text-slate-500 mb-2">
            {group.groupLabel}
          </p>

          {/* Field type chips */}
          <div className="flex flex-wrap gap-2">
            {group.options.map((option) => (
              <button
                key={option.type}
                type="button"
                onClick={() => handleSelect(option.type)}
                className="flex items-center gap-1.5 border border-slate-200 rounded-lg px-3 py-1.5 text-sm text-slate-700 hover:border-[#6A06E4] hover:text-[#6A06E4] hover:bg-purple-50 transition-all cursor-pointer"
              >
                <option.icon size={13} />
                {option.label}
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );

  if (isMobile) {
    return (
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent side="bottom" className="rounded-t-xl px-6 pb-12">
          <SheetHeader className="text-left">
            <SheetTitle>Select a Field</SheetTitle>
            <p className="text-sm text-slate-400 mt-0.5">
              Pick a field type to add
            </p>
          </SheetHeader>
          <ContentBody />
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Select a Field</DialogTitle>
          <p className="text-sm text-slate-400 mt-0.5">
            Pick a field type to add
          </p>
        </DialogHeader>

        <ContentBody />
      </DialogContent>
    </Dialog>
  );
}
