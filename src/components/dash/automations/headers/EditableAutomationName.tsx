"use client";

import { EditableNameDialog } from "../../EditableNameDialog";

interface EditableAutomationNameProps {
  value: string;
  onChange: (val: string) => void;
  onSave?: (val: string) => void;
}

/**
 * Component that renders a trigger button (Pencil) to open a name-editing dialog.
 * Uses the unified EditableNameDialog.
 */
export function EditableAutomationName(props: EditableAutomationNameProps) {
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
