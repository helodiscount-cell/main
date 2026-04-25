"use client";

import { EditableNameDialog } from "@/components/shared/EditableNameDialog";

interface EditableAutomationNameProps {
  value: string;
  onChange: (val: string) => void;
  onSave?: (val: string) => void;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

/**
 * Pencil-button trigger that opens the shared name-editing dialog.
 */
export default function EditableAutomationName(
  props: EditableAutomationNameProps,
) {
  return (
    <EditableNameDialog
      {...props}
      title="Change Name"
      placeholder="Automation Name"
      ariaLabel="Edit automation name"
      allowEmpty={false}
      errorMessage="Please define a name for this automation"
    />
  );
}
