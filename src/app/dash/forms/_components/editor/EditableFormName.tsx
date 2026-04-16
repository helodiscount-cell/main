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
import { toast } from "sonner";

interface EditableFormNameProps {
  value: string;
  onChange: (val: string) => void;
  onSave?: (val: string) => void;
}

/**
 * Component that renders a trigger button (Pencil) to open a name-editing dialog for forms.
 */
export function EditableFormName({
  value,
  onChange,
  onSave,
}: EditableFormNameProps) {
  const [internalName, setInternalName] = useState(value);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setInternalName(value);
  }, [value, open]);

  const handleSave = () => {
    const trimmed = internalName.trim();
    if (!trimmed || trimmed === "Untitled Form") {
      toast.error("Please provide a custom form name");
      return;
    }
    if (trimmed === value) {
      setOpen(false);
      return;
    }
    onChange(trimmed);
    onSave?.(trimmed);
    setOpen(false);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSave();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button
          type="button"
          aria-label="Edit form name"
          className="text-[#6A06E4] hover:text-[#5a05c4] transition-all p-1 hover:scale-110 active:scale-95 shrink-0"
        >
          <Pencil size={15} />
        </button>
      </DialogTrigger>
      <DialogContent
        showCloseButton={false}
        className="bg-transparent border-none max-w-[420px] flex flex-col justify-center items-center"
      >
        <div className="w-full rounded-3xl gap-8 p-8 flex flex-col items-center bg-white border-none shadow-2xl animate-in zoom-in-95 duration-200">
          <DialogHeader className="w-full">
            <DialogTitle className="text-2xl font-semibold text-[#212121] text-center">
              Change Form Name
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleFormSubmit} className="w-full space-y-8">
            <div className="w-full">
              <Input
                value={internalName}
                onChange={(e) => setInternalName(e.target.value)}
                className="w-full h-14 bg-[#F8FAFC] border-none rounded-lg text-lg focus-visible:ring-2 focus-visible:ring-[#6A06E4]/20 transition-all font-medium text-[#0F172A]"
                placeholder="Form Internal Name"
                autoFocus
              />
            </div>

            <div className="w-full flex flex-col items-center">
              <Button
                type="submit"
                className="w-full h-12 bg-[#6A06E4] hover:bg-[#5a05c4] text-white text-lg font-medium rounded-lg shadow-lg shadow-purple-100 transition-all active:scale-[0.98]"
              >
                Save
              </Button>
            </div>
          </form>
        </div>
        <DialogClose asChild>
          <button
            type="button"
            aria-label="Close"
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
