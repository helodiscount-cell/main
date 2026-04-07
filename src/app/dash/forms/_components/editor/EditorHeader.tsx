"use client";

import React from "react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { EDITOR_HEADER_CONFIG, HEADER_ACTIONS } from "./config";
import { useQuery } from "@tanstack/react-query";
import { formService } from "@/api/services/forms";
import { Download } from "lucide-react";
import { downloadSubmissionsCSV } from "./utils/export";

import { toast } from "sonner";

type EditorHeaderProps = {
  onPublish: () => void;
  isLoading?: boolean;
  formId: string;
  activeTab: string;
};

// Breadcrumb + action buttons — Refresh saves as draft, Publish publishes
export const EditorHeader = ({
  onPublish,
  isLoading,
  formId,
  activeTab,
}: EditorHeaderProps) => {
  const [exportStatus, setExportStatus] = React.useState<
    "idle" | "exporting" | "exported"
  >("idle");

  const { data, refetch } = useQuery({
    queryKey: ["form", formId],
    queryFn: () => formService.getById(formId),
  });

  // Maps action id to its click handler
  const ACTION_HANDLERS: Record<string, () => void> = {
    publish: onPublish,
    "copy-link": () => {
      if (!data?.slug) return;
      const url = `${window.location.origin}/f/${data.slug}`;
      navigator.clipboard.writeText(url);
      toast.success("Link copied to clipboard!");
    },
    preview: () => {
      if (!data?.slug) return;
      const url = `${window.location.origin}/f/${data.slug}`;
      window.open(url, "_blank");
    },
  };

  /**
   * Fetches all form submissions and triggers a CSV download
   * Maps dynamic field IDs to human-readable labels for the CSV header
   */
  const handleExport = async () => {
    if (!data?.fields) return;

    try {
      setExportStatus("exporting");
      const submissions = await formService.getSubmissions(formId);

      if (!submissions?.length) {
        setExportStatus("idle");
        return;
      }

      // Deletage CSV building and download trigger to utility
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
        <div className="bg-white rounded-md px-4 flex items-center h-9 flex-1">
          <span className="text-sm text-slate-400">
            {EDITOR_HEADER_CONFIG.BREADCRUMB_ROOT}
          </span>
          <span className="text-sm text-slate-400 mx-1">/</span>
          <span className="capitalize text-sm font-semibold text-slate-900">
            {data?.title}
          </span>
        </div>

        {/* Action buttons — Conditional display based on active tab */}
        <div className="flex items-center gap-2">
          {HEADER_ACTIONS.filter((a) => {
            // If form is not ready (no slug), hide copy-link and preview
            if (!data?.slug && (a.id === "copy-link" || a.id === "preview")) {
              return false;
            }

            if (activeTab === "submissions") {
              return false;
            }

            return true;
          }).map(({ id, icon: Icon, label, variant }) => (
            <Button
              key={id}
              disabled={isLoading}
              onClick={ACTION_HANDLERS[id]}
              size={variant === "primary" ? "default" : "icon"}
              variant={variant === "primary" ? "default" : "secondary"}
              title={label} // Show label on hover for icon buttons
              className={
                variant === "primary"
                  ? EDITOR_HEADER_CONFIG.STYLES.PRIMARY
                  : EDITOR_HEADER_CONFIG.STYLES.ICON
              }
            >
              <Icon size={EDITOR_HEADER_CONFIG.ICON_SIZE} />
              {variant === "primary" && label}
            </Button>
          ))}

          {activeTab === "submissions" && (
            <Button
              disabled={isLoading || exportStatus !== "idle"}
              onClick={handleExport}
              className={EDITOR_HEADER_CONFIG.STYLES.PRIMARY}
            >
              <Download size={EDITOR_HEADER_CONFIG.ICON_SIZE} />
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
