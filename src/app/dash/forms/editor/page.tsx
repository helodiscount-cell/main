import React from "react";
import { EditorHeader, FormEditorCanvas } from "../_components/editor";
import { Separator } from "@/components/ui/separator";

// Editor-only tab page — Submissions tab is out of scope
const FormEditorPage = () => {
  return (
    <div className="flex flex-col h-full">
      {/* Sticky top header */}
      <EditorHeader />

      {/* Tab bar — only Editor is active; Submissions ignored for now */}
      <div className="m-4 p-4 rounded-md flex items-center gap-6 border-b border-slate-100 bg-white">
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

      {/* Form canvas with react-hook-form context */}
      <FormEditorCanvas />
    </div>
  );
};

export default FormEditorPage;
