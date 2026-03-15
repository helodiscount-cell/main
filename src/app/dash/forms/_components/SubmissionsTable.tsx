"use client";

import React from "react";
import type { FormField } from "@dm-broo/common-types";
import type { FormSubmission } from "@/types/form";

type SubmissionsTableProps = {
  fields: FormField[];
  submissions: FormSubmission[];
};

// Table that renders all submissions — columns match the form's fields
export const SubmissionsTable = ({
  fields,
  submissions,
}: SubmissionsTableProps) => {
  if (submissions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-slate-400 gap-2">
        <span className="text-4xl">📭</span>
        <p className="text-sm font-medium">No submissions yet.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-slate-100">
      <table className="w-full text-sm">
        <thead className="bg-slate-50 border-b border-slate-100">
          <tr>
            {fields.map((field) => (
              <th
                key={field.id}
                className="px-4 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider"
              >
                {field.label}
              </th>
            ))}
            <th className="px-4 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">
              Submitted At
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-50">
          {submissions.map((submission) => (
            <tr
              key={submission.id}
              className="hover:bg-slate-50 transition-colors"
            >
              {fields.map((field) => {
                const answer = submission.answers[field.id];
                const display = Array.isArray(answer)
                  ? answer.join(", ")
                  : (answer ?? "—");

                return (
                  <td
                    key={field.id}
                    className="px-4 py-3 text-slate-700 max-w-[200px] truncate"
                  >
                    {display}
                  </td>
                );
              })}
              <td className="px-4 py-3 text-slate-400 whitespace-nowrap">
                {new Date(submission.submittedAt).toLocaleString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
