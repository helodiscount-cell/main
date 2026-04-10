"use client";

import React from "react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { EDITOR_HEADER_CONFIG } from "./config";
import { useFormEditor } from "../FormEditorProvider";
import { useQuery } from "@tanstack/react-query";
import { formService } from "@/api/services/forms";
import { Play, Download, Square, RefreshCw, Link2 } from "lucide-react";
import { downloadSubmissionsCSV } from "./utils/export";
import { toast } from "sonner";

type EditorHeaderProps = {
  onPublish: () => void;
  onSaveDraft: () => void;
  onUpdate: () => void;
  isLoading?: boolean;
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
  const { currentStatus } = useFormEditor();
  const [exportStatus, setExportStatus] = React.useState<
    "idle" | "exporting" | "exported"
  >("idle");

  const { data } = useQuery({
    queryKey: ["form", formId],
    queryFn: () => formService.getById(formId!),
    enabled: !!formId,
  });

  const isFormMetadataReady = !!data?.fields;

  const handleExport = async () => {
    if (!data?.fields) return;

    try {
      setExportStatus("exporting");
      const submissions = await formService.getSubmissions(formId!);

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
    <header className="flex h-16 shrink-0 items-center gap-2 px-4">
      <SidebarTrigger className="-ml-1" />
      <Separator
        orientation="vertical"
        className="mr-2 data-[orientation=vertical]:h-4"
      />

      <div className="flex w-full items-center justify-between gap-4">
        {/* Breadcrumb pill */}
        <div className="bg-white rounded-md px-4 flex items-center h-9 flex-1 min-w-0">
          <span
            className="text-sm text-[#212121] font-semibold"
            style={{
              opacity: pathname === "/dash/forms" ? 1 : 0.5,
            }}
          >
            {EDITOR_HEADER_CONFIG.BREADCRUMB_ROOT}
          </span>
          <span className="text-sm text-[#212121] font-semibold mx-1">/</span>
          <span className="capitalize text-sm font-semibold text-slate-900 truncate">
            {data?.title || "Untitled Form"}
          </span>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-2 shrink-0">
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
                className="h-9 w-9 bg-slate-900 hover:bg-slate-700 text-white"
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
                className="h-9 w-9 bg-slate-900 hover:bg-slate-700 text-white"
              >
                <Play size={15} />
              </Button>
            </>
          )}

          {activeTab === "editor" && (
            <div className="flex items-center gap-2 scale-90 sm:scale-100 origin-right">
              {/* Stop Button - Only if Live */}
              {currentStatus === "PUBLISHED" && (
                <Button
                  onClick={onSaveDraft}
                  disabled={isLoading}
                  className="bg-red-500 hover:bg-red-600 text-white gap-2 h-9 px-4 transition-all"
                >
                  {isLoading ? (
                    <RefreshCw size={13} className="animate-spin" />
                  ) : (
                    <Square size={13} fill="currentColor" />
                  )}
                  {isLoading ? "Stopping..." : "Stop"}
                </Button>
              )}

              {/* Update Button - Only if Live */}
              {currentStatus === "PUBLISHED" && (
                <Button
                  onClick={onUpdate}
                  disabled={isLoading}
                  className="bg-[#6A06E4] hover:bg-[#5a05c4] text-white gap-2 h-9 px-4 transition-all"
                >
                  <RefreshCw
                    size={13}
                    className={isLoading ? "animate-spin" : ""}
                  />
                  Update
                </Button>
              )}

              {/* Status Indicator / Go Live Button */}
              {currentStatus === "PUBLISHED" ? (
                <div className="h-9 px-4 rounded-md border-2 border-green-500 text-green-600 text-sm font-semibold flex items-center gap-1.5 shrink-0 bg-white">
                  <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                  Live
                </div>
              ) : (
                <Button
                  onClick={onPublish}
                  disabled={isLoading}
                  className="bg-green-500 hover:bg-green-600 text-white gap-2 h-9 px-4 font-semibold transition-all"
                >
                  {isLoading ? (
                    <RefreshCw size={13} className="animate-spin" />
                  ) : (
                    <span className="w-2 h-2 rounded-full bg-white" />
                  )}
                  {isLoading ? "Starting..." : "Go Live"}
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
              className="bg-[#6A06E4] hover:bg-[#5a05c4] text-white gap-2 h-9 px-4"
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
