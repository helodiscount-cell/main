"use client";

import Link from "next/link";
import React from "react";
import { FileText, ExternalLink, Copy } from "lucide-react";
import { toast } from "sonner";
import type { FormListItem } from "@/types/form";

type FormRowProps = {
  form: FormListItem;
};

// Badge color config keyed by form status
const STATUS_STYLES: Record<string, string> = {
  PUBLISHED: "bg-emerald-50 text-emerald-700",
  DRAFT: "bg-slate-100 text-slate-500",
};

const FormRow = ({ form }: FormRowProps) => {
  // Copy the public link to clipboard
  const handleCopyLink = () => {
    const url = `${window.location.origin}/f/${form.slug}`;
    navigator.clipboard.writeText(url).then(() => {
      toast.success("Public link copied!");
    });
  };

  return (
    <div className="grid grid-cols-[2fr_1fr_1fr_1fr_auto] items-center px-4 py-4 gap-4 border-b border-slate-50 last:border-0 hover:bg-slate-50/60 transition-colors">
      {/* Form name + icon */}
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-md bg-slate-100 shrink-0 flex items-center justify-center">
          <FileText size={15} className="text-slate-400" />
        </div>
        <Link
          href={`/dash/forms/${form.id}/submissions`}
          className="flex flex-col gap-0.5 group"
        >
          <span className="text-sm font-medium text-slate-900 group-hover:text-[#6A06E4] transition-colors">
            {form.title || "Untitled form"}
          </span>
          <span className="text-xs text-slate-400 truncate max-w-[260px]">
            {form.description || "No description"}
          </span>
        </Link>
      </div>

      {/* Submission count */}
      <div className="text-sm font-medium text-slate-700">
        {form.submissionCount}
      </div>

      {/* Status badge */}
      <div>
        <span
          className={`text-xs font-semibold px-2 py-1 rounded-full ${STATUS_STYLES[form.status] ?? STATUS_STYLES.DRAFT}`}
        >
          {form.status}
        </span>
      </div>

      {/* Updated at */}
      <div className="text-sm text-slate-400">
        {new Date(form.updatedAt).toLocaleDateString()}
      </div>

      {/* Actions */}
      <div className="flex items-center gap-1">
        {/* Copy public link */}
        <button
          onClick={handleCopyLink}
          className="p-1.5 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          title="Copy public link"
        >
          <Copy size={14} />
        </button>

        {/* Open public link in new tab */}
        <Link
          href={`/f/${form.slug}`}
          target="_blank"
          className="p-1.5 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          title="Open public form"
        >
          <ExternalLink size={14} />
        </Link>
      </div>
    </div>
  );
};

export default FormRow;
