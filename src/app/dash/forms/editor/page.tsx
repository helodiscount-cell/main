import React from "react";
import { FormEditorCanvas } from "../_components/editor";
import { Separator } from "@/components/ui/separator";

// Editor page — header is rendered inside FormEditorCanvas so it has access to save callbacks
const FormEditorPage = () => {
  return (
    <div className="flex flex-col h-full">
      {/* Tab bar — Submissions tab will be linked once a form is saved */}
      <div className="mx-4 mt-4 p-4 rounded-md flex items-center gap-6 border-b border-slate-100 bg-white">
        <button
          type="button"
          className="pb-1 text-sm font-semibold text-[#6A06E4] border-b-2 border-[#6A06E4]"
        >
          Editor
        </button>
        <Separator orientation="vertical" />
        <button
          type="button"
          className="pb-1 text-sm font-medium text-slate-400 cursor-not-allowed"
          disabled
        >
          Submissions
        </button>
      </div>

      {/* Canvas — contains its own header with save/publish wired */}
      <FormEditorCanvas />
    </div>
  );
};

export default FormEditorPage;
