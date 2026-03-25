import type { FormField } from "@dm-broo/common-types";
import type { FormSubmission } from "@/types/form";

/**
 * Attempts to find a sensible "Name" from the form answers.
 * Looks for field labels containing common name-related keywords.
 */
export const getDisplayName = (
  fields: FormField[],
  submission: FormSubmission,
) => {
  const nameField = fields.find((f) =>
    /name|user|full|first|sender/i.test(f.label),
  );
  const value = nameField ? submission.answers[nameField.id] : null;
  return typeof value === "string" ? value : "Unknown User";
};

/**
 * Generates initials for avatar display.
 */
export const getInitials = (name: string) => {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
};

/**
 * Formats submission dates for consistent display.
 */
export const formatDate = (dateString: string) => {
  if (!dateString) return "—";
  return new Intl.DateTimeFormat("en-US", {
    month: "numeric",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  })
    .format(new Date(dateString))
    .replace(",", " |");
};
