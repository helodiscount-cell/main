"use client";

import React, { useState } from "react";
import type { FormField } from "@dm-broo/common-types";
import type { FormSubmission } from "@/types/form";
import { ArrowDown, Layers } from "lucide-react";
import { SubmissionRow } from "./submissions/SubmissionRow";
import { SubmissionDetailDialog } from "./submissions/SubmissionDetailDialog";

/**
 * SubmissionsList orchestrates the display of form entries.
 * Decomposes into smaller components for rows and detail dialogs.
 */
interface SubmissionsListProps {
  fields: FormField[];
  submissions: FormSubmission[];
}

export const SubmissionsList = ({
  fields,
  submissions,
}: SubmissionsListProps) => {
  const [selectedSubmission, setSelectedSubmission] =
    useState<FormSubmission | null>(null);

  if (submissions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-32 text-slate-400 gap-4">
        <div className="w-16 h-16 rounded-full bg-slate-50 flex items-center justify-center border border-dashed border-slate-200">
          <Layers size={24} className="text-slate-300" />
        </div>
        <div className="text-center">
          <p className="text-sm font-semibold text-slate-600">
            No submissions yet
          </p>
          <p className="text-xs">
            Once users fill out your form, they will appear here.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full rounded-2xl border border-slate-100 overflow-hidden">
      {/* List Header */}
      <div className="grid grid-cols-[1fr_auto] items-center px-8 py-4 bg-slate-50/50 border-b border-slate-100">
        <span className="text-sm font-semibold text-slate-500 text-left">
          Title
        </span>
        <div className="flex items-center gap-2 text-sm font-semibold text-slate-500">
          <span>Submitted</span>
          <div className="bg-slate-900 text-white rounded-md p-1">
            <ArrowDown size={14} />
          </div>
        </div>
      </div>

      {/* Submission Rows */}
      <div className="divide-y divide-slate-50">
        {submissions.map((submission) => (
          <SubmissionRow
            key={submission.id}
            submission={submission}
            fields={fields}
            onClick={() => setSelectedSubmission(submission)}
          />
        ))}
      </div>

      {/* Submission Detail Dialog */}
      <SubmissionDetailDialog
        submission={selectedSubmission}
        fields={fields}
        onClose={() => setSelectedSubmission(null)}
      />
    </div>
  );
};
