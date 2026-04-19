"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { EDITOR_HEADER_CONFIG } from "./config";
import { useFormEditor } from "../FormEditorProvider";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { formService } from "@/api/services/forms";
import { Play, Download, Square, RefreshCw, Link2, Eye } from "lucide-react";
import { downloadSubmissionsCSV } from "./utils/export";
import { toast } from "sonner";
import { EditableFormName } from "./EditableFormName";

type EditorHeaderProps = {
  onPublish: () => void;
  onSaveDraft: () => void;
  onUpdate: () => void;
  isLoading?: boolean;
  isSaving?: boolean;
  isMediaUploading?: boolean;
  formId?: string;
  activeTab: string;
  pathname: string;
};

/**
 * Enhanced form editor header with automation-style controls.
 * Displays [Stop] [Update] [Live Badge] when active.
 */
export const EditorHeader = ({
  onPublish,
  onSaveDraft,
  onUpdate,
  isLoading,
  formId,
  activeTab,
  pathname,
}: EditorHeaderProps) => {
  const {
    currentStatus,
    methods,
    formId: contextFormId,
    isNameDialogOpen,
    setIsNameDialogOpen,
    isSaving,
    isMediaUploading,
  } = useFormEditor();
  const effectiveFormId = formId || contextFormId;

  const queryClient = useQueryClient();
  const [exportStatus, setExportStatus] = React.useState<
    "idle" | "exporting" | "exported"
  >("idle");

  const nameWatch = methods.watch("name");

  const { data } = useQuery({
    queryKey: ["form", effectiveFormId],
    queryFn: () => formService.getById(effectiveFormId!),
    enabled: !!effectiveFormId,
  });

  const { mutate: updateFormName } = useMutation({
    mutationFn: (newName: string) =>
      formService.update(effectiveFormId!, { name: newName } as any),
    onSuccess: () => {
      toast.success("Form name updated.");
      queryClient.invalidateQueries({ queryKey: ["form", effectiveFormId] });
      queryClient.invalidateQueries({ queryKey: ["forms"] });
    },
  });

  const isFormMetadataReady = !!data?.fields;

  const handleRename = (newName: string) => {
    // Always update local form state so it's included in the next save/publish
    methods.setValue("name", newName, { shouldValidate: true });

    // If already persisted, update it immediately via API too
    if (effectiveFormId) {
      updateFormName(newName);
    }
  };

  const handleExport = async () => {
    if (!data?.fields || !effectiveFormId) return;

    try {
      setExportStatus("exporting");
      const submissions = await formService.getSubmissions(effectiveFormId);

      if (!submissions?.length) {
        setExportStatus("idle");
        toast.info("No submissions to export.");
        return;
      }

      downloadSubmissionsCSV(submissions, data.fields, data.slug);

      setExportStatus("exported");
      setTimeout(() => setExportStatus("idle"), 3000);
    } catch (err) {
      console.error("CSV Export Error:", err);
      setExportStatus("idle");
    }
  };

  return (
    <header className="flex h-10 shrink-0 items-center gap-4">
      <div className="flex w-full items-center justify-between gap-4 h-full">
        {/* Breadcrumb pill */}
        <div className="bg-white justify-between rounded-lg px-4 flex items-center h-full flex-1 min-w-0">
          <p className="text-sm font-semibold flex gap-1 items-center truncate">
            <span
              className="opacity-50 shrink-0"
              style={{
                opacity: pathname === "/dash/forms" ? 1 : 0.5,
              }}
            >
              {EDITOR_HEADER_CONFIG.BREADCRUMB_ROOT} /{" "}
            </span>
            <span
              className={
                nameWatch && nameWatch !== "Untitled Form"
                  ? "text-[#1A1D1F] font-bold"
                  : "text-[#6A06E4] italic font-medium"
              }
            >
              {nameWatch || "Untitled Form"}
            </span>
          </p>
          {/* This triggers the rename dialog */}
          <EditableFormName
            value={nameWatch || ""}
            onChange={handleRename}
            open={isNameDialogOpen}
            onOpenChange={setIsNameDialogOpen}
          />
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-4 shrink-0">
          {activeTab === "editor" && data?.slug && (
            <>
              <Button
                disabled={isLoading}
                onClick={async () => {
                  const url = `${window.location.origin}/f/${data?.slug}`;
                  try {
                    await navigator.clipboard.writeText(url);
                    toast.success("Link copied to clipboard!");
                  } catch (err) {
                    toast.error("Failed to copy link.", {
                      description:
                        "Please copy the URL manually from the address bar.",
                    });
                  }
                }}
                size="icon"
                variant="secondary"
                title="Copy Link"
                className="h-10 w-10 bg-slate-900 hover:bg-slate-700 text-white"
              >
                <Link2 size={15} />
              </Button>
              <Button
                disabled={isLoading}
                onClick={() => {
                  const w = window.open(
                    `/f/${data?.slug}`,
                    "_blank",
                    "noopener,noreferrer",
                  );
                  if (w) w.opener = null;
                }}
                size="icon"
                variant="secondary"
                title="Preview"
                className="h-10 w-10 bg-slate-900 hover:bg-slate-700 text-white"
              >
                <Eye size={15} />
              </Button>
            </>
          )}

          {activeTab === "editor" && (
            <div className="flex items-center gap-4 h-10 scale-90 sm:scale-100 origin-right">
              {/* Stop Button - Only if Live */}
              {currentStatus === "PUBLISHED" && (
                <Button
                  onClick={onSaveDraft}
                  disabled={isLoading}
                  className="bg-red-500 hover:bg-red-600 disabled:bg-slate-300 disabled:text-slate-500 text-white gap-2 h-10 px-4 transition-all"
                >
                  {isSaving ? (
                    <RefreshCw size={15} className="animate-spin" />
                  ) : (
                    <Square size={15} fill="currentColor" />
                  )}
                </Button>
              )}

              {/* Status Indicator / Go Live Button */}
              {currentStatus === "PUBLISHED" ? (
                <div className="h-10 px-6 rounded-lg border-[2.5px] border-[#4ADE80] text-[#15803D] text-[15px] font-bold flex items-center justify-center shrink-0 bg-[#CCFFD9]">
                  Live
                </div>
              ) : (
                <Button
                  onClick={onPublish}
                  disabled={isLoading}
                  className="bg-green-500 hover:bg-green-600 disabled:bg-gray-200 disabled:text-gray-400 text-white gap-2 h-10 px-4 font-semibold transition-all"
                >
                  {isSaving ? (
                    <RefreshCw size={13} className="animate-spin" />
                  ) : isMediaUploading ? (
                    <span className="w-2 h-2 rounded-full bg-gray-400" />
                  ) : (
                    <span className="w-2 h-2 rounded-full bg-white" />
                  )}
                  {isSaving ? "Starting..." : "Go Live"}
                </Button>
              )}

              {/* Update Button - Only if Live */}
              {currentStatus === "PUBLISHED" && (
                <Button
                  onClick={onUpdate}
                  disabled={isLoading}
                  className="bg-[#6A06E4] hover:bg-[#5a05c4] text-white gap-2 h-10 px-4 transition-all"
                >
                  Update
                </Button>
              )}
            </div>
          )}

          {activeTab === "submissions" && (
            <Button
              disabled={
                !isFormMetadataReady || isLoading || exportStatus !== "idle"
              }
              onClick={handleExport}
              className="bg-[#6A06E4] hover:bg-[#5a05c4] text-white gap-2 h-10 px-4"
            >
              <Download size={15} />
              {exportStatus === "exporting"
                ? "Exporting..."
                : exportStatus === "exported"
                  ? "Exported"
                  : "Export List"}
            </Button>
          )}
        </div>
      </div>
    </header>
  );
};
