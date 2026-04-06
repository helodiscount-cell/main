"use client";

import React, { useState } from "react";
import { Plus } from "lucide-react";
import { AddFieldDialog } from "../AddFieldDialog";
import type { FieldType } from "@dm-broo/common-types";

/**
 * Mobile-specific AddFieldButton matching the design.
 * Larger, shadowed, and clean white background.
 */
export const MobileAddFieldButton = ({
  onAddField,
}: {
  onAddField: (type: FieldType) => void;
}) => {
  const [dialogOpen, setDialogOpen] = useState(false);

  return (
    <>
      <div className="flex justify-center -mb-2 z-10 scale-110">
        <button
          type="button"
          onClick={() => setDialogOpen(true)}
          className="w-10 h-10 rounded-full bg-white text-[#6A06E4]   border border-slate-50 flex items-center justify-center hover:scale-105 active:scale-95 transition-transform"
          aria-label="Add field"
        >
          <Plus size={20} strokeWidth={3} />
        </button>
      </div>

      <AddFieldDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onAddField={onAddField}
      />
    </>
  );
};
