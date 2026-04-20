"use client";

import { useCallback, useState } from "react";
import { useFormEditor } from "../../../../providers/FormEditorProvider";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { formService } from "@/api/services/forms";
import { toast } from "sonner";
import { downloadSubmissionsCSV } from "../_components/editor/utils/export";

/**
 * Shared hook to manage form editor actions (Save, Publish, Update, Unpublish).
 * Ensures consistent behavior across different layout variants (Mobile/Desktop).
 */
export function useFormActions() {
  const { save, currentStatus, formId, form, methods } = useFormEditor();
  const queryClient = useQueryClient();
  const [exportStatus, setExportStatus] = useState<
    "idle" | "exporting" | "exported"
  >("idle");

  const handlePublish = useCallback(() => save("PUBLISHED"), [save]);
  const handleSave = useCallback(() => save("DRAFT"), [save]);
  const handleUpdate = useCallback(
    () => save(currentStatus || "DRAFT"),
    [save, currentStatus],
  );
  const handleUnpublish = useCallback(() => save("DRAFT"), [save]);

  const { mutate: updateFormName } = useMutation({
    mutationFn: (newName: string) =>
      formService.update(formId!, { name: newName } as any),
    onSuccess: () => {
      toast.success("Form name updated.");
      queryClient.invalidateQueries({ queryKey: ["form", formId] });
      queryClient.invalidateQueries({ queryKey: ["forms"] });
    },
  });

  const handleRename = useCallback(
    (newName: string) => {
      methods.setValue("name", newName, { shouldValidate: true });
      if (formId) {
        updateFormName(newName);
      }
    },
    [formId, methods, updateFormName],
  );

  const handleExport = useCallback(async () => {
    if (!form?.fields || !formId) return;

    try {
      setExportStatus("exporting");
      const submissions = await formService.getSubmissions(formId);

      if (!submissions?.length) {
        setExportStatus("idle");
        toast.info("No submissions to export.");
        return;
      }

      downloadSubmissionsCSV(submissions, form.fields, form.slug);
      setExportStatus("exported");
      setTimeout(() => setExportStatus("idle"), 3000);
    } catch (err) {
      console.error("CSV Export Error:", err);
      setExportStatus("idle");
      toast.error("Failed to export submissions.");
    }
  }, [form, formId]);

  const handleCopyLink = useCallback(async () => {
    if (!form?.slug) return;
    const url = `${window.location.origin}/f/${form.slug}`;
    try {
      await navigator.clipboard.writeText(url);
      toast.success("Link copied to clipboard!");
    } catch (err) {
      toast.error("Failed to copy link.");
    }
  }, [form?.slug]);

  const handlePreview = useCallback(() => {
    if (!form?.slug) return;
    const w = window.open(`/f/${form.slug}`, "_blank", "noopener,noreferrer");
    if (w) w.opener = null;
  }, [form?.slug]);

  return {
    handlePublish,
    handleSave,
    handleUpdate,
    handleUnpublish,
    handleRename,
    handleExport,
    handleCopyLink,
    handlePreview,
    exportStatus,
  };
}
