import { FormSubmission } from "@/api/services/forms/form";
import type { FormField } from "@dm-broo/common-types";

/**
 * Escapes values for CSV safety to handle commas and quotes
 */
const escapeCsvValue = (val: any) => {
  const str = String(val ?? "");
  return `"${str.replace(/"/g, '""')}"`;
};

/**
 * Transforms form submission data into a CSV string and triggers a browser download
 * Handles dynamic field mapping based on the form's field definitions
 */
export const downloadSubmissionsCSV = (
  submissions: FormSubmission[],
  fields: FormField[],
  slug: string,
) => {
  if (!submissions.length) return;

  // 1. Prepare Headers (Submission metadata + Dynamic Field Labels)
  const headers = [
    "Submission ID",
    "Date",
    ...fields.map((f) => f.label || f.type),
  ];
  const fieldIds = fields.map((f) => f.id);

  // 2. Prepare Data Rows
  const rows = submissions.map((sub) => {
    const values = [
      sub.id,
      new Date(sub.submittedAt).toLocaleString(),
      ...fieldIds.map((fid) => {
        const ans = sub.answers[fid];
        // Handle multi-select values by joining with a semicolon
        return Array.isArray(ans) ? ans.join("; ") : ans;
      }),
    ];
    return values.map(escapeCsvValue).join(",");
  });

  // 3. Construct CSV and trigger download
  const csvContent = [headers.join(","), ...rows].join("\n");
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", `submissions-${slug}.csv`);

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  // Clean up
  URL.revokeObjectURL(url);
};
