import { useCallback } from "react";
import { useFormEditor } from "../FormEditorProvider";

/**
 * Shared hook to manage form editor actions (Save, Publish, Update, Unpublish).
 * Ensures consistent behavior across different layout variants (Mobile/Desktop).
 */
export function useFormActions() {
  const { save, currentStatus } = useFormEditor();

  const handlePublish = useCallback(() => save("PUBLISHED"), [save]);
  const handleSave = useCallback(() => save("DRAFT"), [save]);
  const handleUpdate = useCallback(
    () => save(currentStatus || "DRAFT"),
    [save, currentStatus],
  );
  const handleUnpublish = useCallback(() => save("DRAFT"), [save]);

  return {
    handlePublish,
    handleSave,
    handleUpdate,
    handleUnpublish,
  };
}
