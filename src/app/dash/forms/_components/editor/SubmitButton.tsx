"use client";

import { useFormContext } from "react-hook-form";
import { FormValues } from "@dm-broo/common-types";
import { EditableNameDialog } from "@/components/shared/EditableNameDialog";

type SubmitButtonProps = {
  disabled?: boolean;
};

// User facing customizable button
export default function SubmitButton({ disabled }: SubmitButtonProps) {
  const { watch, setValue } = useFormContext<FormValues>();
  const label = watch("submitButtonLabel") || "Submit";

  return (
    <div className="relative group mt-auto pt-4 flex items-center justify-center">
      {/* Floating Pencil Icon Dialog */}
      <div className="absolute -left-12 -bottom-2 -translate-y-1/2">
        <div className="w-8 h-8 bg-white border border-slate-200 rounded-full flex items-center justify-center shadow-md hover:bg-slate-50 transition-all active:scale-90">
          <EditableNameDialog
            value={label}
            onChange={(val) => setValue("submitButtonLabel", val)}
            title="Change Button Text"
            placeholder="e.g. Register Now, Send..."
          />
        </div>
      </div>

      <button
        type="button"
        disabled={disabled}
        className="w-full bg-[#6A06E4] hover:bg-[#5a05c4] disabled:opacity-50 text-white font-semibold py-1 rounded-sm transition-all shadow-lg active:scale-[0.99] flex items-center justify-center min-h-[44px]"
      >
        <span>{label}</span>
      </button>
    </div>
  );
}
