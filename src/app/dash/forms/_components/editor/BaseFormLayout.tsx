"use client";

import React, { useCallback } from "react";
import { FormEditorProvider, useFormEditor } from "../FormEditorProvider";
import { MobileEditorHeader } from "./mobile/MobileEditorHeader";
import { EditorHeader } from "./EditorHeader";
import { FormTabs } from "./FormTabs";
import { useIsMobile } from "@/hooks/use-mobile";
import { usePathname } from "next/navigation";
import { PatternedBackground } from "./mobile/PatternedBackground";
import { useFormActions } from "./useFormActions";

interface BaseFormLayoutProps {
  children: React.ReactNode;
  formId?: string;
}

/**
 * Shared layout component for form editor and detail views.
 * Handles mobile/desktop switching and common form actions.
 */
export function BaseFormLayout({ children, formId }: BaseFormLayoutProps) {
  const pathname = usePathname();
  const isMobile = useIsMobile();

  // Determine active tab based on URL path
  const activeTab = pathname.endsWith("/submissions")
    ? "submissions"
    : "editor";

  return (
    <FormEditorProvider formId={formId}>
      {isMobile ? (
        <MobileLayout formId={formId} activeTab={activeTab}>
          {children}
        </MobileLayout>
      ) : (
        <DesktopLayout
          formId={formId}
          activeTab={activeTab}
          pathname={pathname}
        >
          {children}
        </DesktopLayout>
      )}
    </FormEditorProvider>
  );
}

const MobileLayout = ({
  formId,
  activeTab,
  children,
}: {
  formId?: string;
  activeTab: "editor" | "submissions";
  children: React.ReactNode;
}) => {
  const { isLoading, isSaving, isMediaUploading, currentStatus } =
    useFormEditor();
  const { handlePublish, handleSave, handleUpdate, handleUnpublish } =
    useFormActions();

  return (
    <div className="flex flex-col gap-4 bg-[#F3F4F6] min-h-screen">
      <MobileEditorHeader
        formId={formId}
        onPublish={handlePublish}
        onSave={handleSave}
        isLoading={isLoading}
        isSaving={isSaving}
        isMediaUploading={isMediaUploading}
        activeTab={activeTab}
        onUpdate={handleUpdate}
        onUnpublish={handleUnpublish}
        currentStatus={currentStatus}
      />
      <FormTabs formId={formId} activeTab={activeTab} />
      <PatternedBackground>{children}</PatternedBackground>
    </div>
  );
};

const DesktopLayout = ({
  formId,
  activeTab,
  pathname,
  children,
}: {
  formId?: string;
  activeTab: "editor" | "submissions";
  pathname: string;
  children: React.ReactNode;
}) => {
  const { isLoading, isSaving, isMediaUploading } = useFormEditor();
  const { handlePublish, handleSave, handleUpdate } = useFormActions();

  return (
    <div className="flex flex-col h-full min-h-screen gap-4">
      <EditorHeader
        activeTab={activeTab}
        onPublish={handlePublish}
        onSaveDraft={handleSave}
        onUpdate={handleUpdate}
        isLoading={isLoading}
        isSaving={isSaving}
        isMediaUploading={isMediaUploading}
        formId={formId}
        pathname={pathname}
      />
      <FormTabs formId={formId} activeTab={activeTab} />
      <div
        className="flex-1 overflow-hidden rounded-xl"
        style={{
          backgroundColor: pathname.endsWith("/submissions")
            ? "white"
            : "#E0E0E0",
        }}
      >
        {children}
      </div>
    </div>
  );
};
