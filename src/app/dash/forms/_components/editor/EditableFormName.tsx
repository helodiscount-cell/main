"use client";

import { EditableNameDialog } from "@/components/dash/EditableNameDialog";

interface EditableFormNameProps {
  value: string;
  onChange: (val: string) => void;
  onSave?: (val: string) => void;
}

/**
 * Component that renders a trigger button (Pencil) to open a name-editing dialog for forms.
 * Uses the unified EditableNameDialog.
 */
export function EditableFormName(props: EditableFormNameProps) {
  return (
    <EditableNameDialog
      {...props}
      title="Change Form Name"
      placeholder="Form Internal Name"
      ariaLabel="Edit form name"
      forbiddenNames={["Untitled Form"]}
      errorMessage="Please provide a custom form name"
    />
  );
}
