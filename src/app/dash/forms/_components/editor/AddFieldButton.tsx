"use client";

import React, { useState } from "react";
import { Plus } from "lucide-react";
import type { FieldType } from "@dm-broo/common-types";
import AddFieldDialog from "./AddFieldDialog";

type AddFieldButtonProps = {
  onAddField: (type: FieldType) => void;
};

// Circular + button that opens the field picker dialog
export default function AddFieldButton({ onAddField }: AddFieldButtonProps) {
  const [dialogOpen, setDialogOpen] = useState(false);

  return (
    <>
      <div className="flex justify-center">
        <button
          type="button"
          onClick={() => setDialogOpen(true)}
          className="w-8 h-8 rounded-full border-2 border-slate-300 hover:border-[#6A06E4] hover:text-[#6A06E4] flex items-center justify-center text-slate-400 transition-colors"
          aria-label="Add field"
        >
          <Plus size={16} />
        </button>
      </div>

      <AddFieldDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onAddField={onAddField}
      />
    </>
  );
}
