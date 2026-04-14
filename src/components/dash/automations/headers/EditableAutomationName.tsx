"use client";

import { useState, useEffect } from "react";
import { Pencil, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface EditableAutomationNameProps {
  value: string;
  onChange: (val: string) => void;
  onSave?: (val: string) => void; // Keeping for compatibility with potential other usages
}

/**
 * Component that renders a trigger button (Pencil) to open a name-editing dialog.
 * Replaces the previous "click-to-edit-inline" behavior.
 */
export function EditableAutomationName({
  value,
  onChange,
  onSave,
}: EditableAutomationNameProps) {
  const [internalName, setInternalName] = useState(value);

  // Synchronize internal state when the external value prop changes
  useEffect(() => {
    setInternalName(value);
  }, [value]);

  const handleSave = () => {
    onChange(internalName);
    onSave?.(internalName);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <button
          type="button"
          className="text-[#6A06E4] hover:text-[#5a05c4] transition-all p-1 hover:scale-110 active:scale-95 shrink-0"
        >
          <Pencil size={15} />
        </button>
      </DialogTrigger>
      <DialogContent
        showCloseButton={false}
        className="bg-transparent border-none max-w-[420px] flex flex-col justify-center items-center"
      >
        <div className="rounded-3xl gap-8 p-8 flex flex-col items-center bg-white border-none shadow-2xl animate-in zoom-in-95 duration-200">
          <DialogHeader className="w-full">
            <DialogTitle className="text-2xl font-semibold text-[#212121] text-center">
              Change Name
            </DialogTitle>
          </DialogHeader>

          <div className="w-full space-y-2.5">
            <Input
              value={internalName}
              onChange={(e) => setInternalName(e.target.value)}
              className="w-[20vw] h-14 bg-[#F8FAFC] border-none rounded-lg text-lg focus-visible:ring-2 focus-visible:ring-[#6A06E4]/20 transition-all font-medium text-[#0F172A]"
              placeholder="Automation Name"
              autoFocus
            />
          </div>

          <div className="w-full space-y-4 flex flex-col items-center">
            <DialogClose asChild>
              <Button
                onClick={handleSave}
                className="w-full h-12 bg-[#6A06E4] hover:bg-[#5a05c4] text-white text-lg font-medium rounded-lg shadow-lg shadow-purple-100 transition-all active:scale-[0.98]"
              >
                Save
              </Button>
            </DialogClose>
          </div>
        </div>
        <DialogClose asChild>
          <button
            type="button"
            className="w-8 h-8 bg-white text-[#0F172A] rounded-full flex items-center justify-center hover:bg-gray-100 transition-all shadow-md group mt-2"
          >
            <X
              size={16}
              className="group-hover:rotate-90 transition-transform duration-300"
            />
          </button>
        </DialogClose>
      </DialogContent>
    </Dialog>
  );
}
