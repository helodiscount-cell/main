import type { FormField } from "@dm-broo/common-types";
import type { FormSubmission } from "@/types/form";

const IMAGE_EXTENSIONS = /\.(jpe?g|png|gif|webp|avif|svg|bmp)$/i;

// Returns true when the value looks like an image URL
export const isImageUrl = (value: string): boolean => {
  try {
    const url = new URL(value);
    const pathname = url.pathname;
    return IMAGE_EXTENSIONS.test(pathname);
  } catch {
    return false;
  }
};

// Extracts a human-readable filename from a URL for use in download attribute
export const getFileNameFromUrl = (url: string): string => {
  try {
    const pathname = new URL(url).pathname;
    const segments = pathname.split("/").filter(Boolean);
    return decodeURIComponent(segments[segments.length - 1] ?? "download");
  } catch {
    return "download";
  }
};

// Returns true when a string value looks like a remote URL
export const isUrl = (value: string): boolean => {
  try {
    const parsed = new URL(value);
    return parsed.protocol === "http:" || parsed.protocol === "https:";
  } catch {
    return false;
  }
};

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
