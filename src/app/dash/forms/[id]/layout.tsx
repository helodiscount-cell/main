"use client";

import React, { useCallback, use } from "react";
import {
  FormEditorProvider,
  useFormEditor,
} from "../_components/FormEditorProvider";
import { EditorHeader } from "../_components/editor/EditorHeader";
import { FormTabs } from "../_components/editor/FormTabs";
import { usePathname } from "next/navigation";

export default function FormDetailLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);

  const pathname = usePathname();

  // Determine active tab based on URL path
  const activeTab = pathname.endsWith("/submissions")
    ? "submissions"
    : "editor";

  return (
    <FormEditorProvider formId={id}>
      <div className="flex flex-col h-full min-h-screen">
        <FormLayoutHeader formId={id} />
        <div
          className="flex-1 overflow-hidden m-4 rounded-xl"
          style={{
            backgroundColor: activeTab === "editor" ? "#F1F1F1" : "white",
          }}
        >
          {children}
        </div>
      </div>
    </FormEditorProvider>
  );
}

// Visual header logic for the form editor flow
const FormLayoutHeader = ({ formId }: { formId: string }) => {
  const { save, isLoading } = useFormEditor();
  const pathname = usePathname();

  // Determine active tab based on URL path
  const activeTab = pathname.endsWith("/submissions")
    ? "submissions"
    : "editor";

  const handlePublish = useCallback(() => save("PUBLISHED"), [save]);

  return (
    <>
      <EditorHeader
        activeTab={activeTab}
        onPublish={handlePublish}
        isLoading={isLoading}
        formId={formId}
      />
      <FormTabs formId={formId} activeTab={activeTab} />
    </>
  );
};
