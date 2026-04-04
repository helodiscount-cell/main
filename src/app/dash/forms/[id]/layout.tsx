"use client";

import React, { useCallback, use } from "react";
import {
  FormEditorProvider,
  useFormEditor,
} from "../_components/FormEditorProvider";
import { EditorHeader } from "../_components/editor/EditorHeader";
import { FormTabs } from "../_components/editor/FormTabs";
import { usePathname } from "next/navigation";

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
      <EditorHeader onPublish={handlePublish} isLoading={isLoading} />
      <FormTabs formId={formId} activeTab={activeTab} />
    </>
  );
};

export default function FormDetailLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);

  return (
    <FormEditorProvider formId={id}>
      <div className="flex flex-col h-full min-h-screen">
        <FormLayoutHeader formId={id} />
        <div className="flex-1 overflow-hidden bg-[#F1F1F1] m-4 rounded-xl ">
          {children}
        </div>
      </div>
    </FormEditorProvider>
  );
}
