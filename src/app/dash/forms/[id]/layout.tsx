"use client";

import React, { useCallback, use } from "react";
import {
  FormEditorProvider,
  useFormEditor,
} from "../_components/FormEditorProvider";
import { MobileEditorHeader } from "../_components/editor/mobile/MobileEditorHeader";
import { EditorHeader } from "../_components/editor/EditorHeader";
import { FormTabs } from "../_components/editor/FormTabs";
import { useIsMobile } from "@/hooks/use-mobile";
import { usePathname } from "next/navigation";
import { cn } from "@/server/utils";

export default function FormDetailLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const pathname = usePathname();
  const isMobile = useIsMobile();

  // Determine active tab based on URL path
  const activeTab = pathname.endsWith("/submissions")
    ? "submissions"
    : "editor";

  return (
    <FormEditorProvider formId={id}>
      <div className="flex flex-col h-full min-h-screen">
        <FormLayoutHeader
          formId={id}
          activeTab={activeTab}
          pathname={pathname}
          isMobile={isMobile}
        />
        <div
          className={cn(
            "flex-1 overflow-hidden rounded-xl",
            isMobile ? "m-0 px-1" : "m-4",
          )}
          style={{
            backgroundColor:
              activeTab === "editor"
                ? isMobile
                  ? "transparent"
                  : "#F1F1F1"
                : "white",
          }}
        >
          {children}
        </div>
      </div>
    </FormEditorProvider>
  );
}

// Visual header logic for the form editor flow
const FormLayoutHeader = ({
  formId,
  activeTab,
  pathname,
  isMobile,
}: {
  formId: string;
  activeTab: "submissions" | "editor";
  pathname: string;
  isMobile: boolean;
}) => {
  const { save, isLoading } = useFormEditor();

  const handlePublish = useCallback(() => save("PUBLISHED"), [save]);
  const handleSave = useCallback(() => save("DRAFT"), [save]);

  if (isMobile) {
    return (
      <>
        <MobileEditorHeader
          formId={formId}
          onPublish={handlePublish}
          onSave={handleSave}
          isLoading={isLoading}
          activeTab={activeTab}
        />
        <FormTabs formId={formId} activeTab={activeTab} />
      </>
    );
  }

  return (
    <>
      <EditorHeader
        activeTab={activeTab}
        onPublish={handlePublish}
        isLoading={isLoading}
        formId={formId}
        pathname={pathname}
      />
      <FormTabs formId={formId} activeTab={activeTab} />
    </>
  );
};
