/**
 * Forms Configuration
 */

export const FORMS_CONFIG = {
  UPLOAD: {
    MAX_FILE_SIZE: 20 * 1024 * 1024, // 20MB in bytes
    MAX_FILE_SIZE_LABEL: "32MB", // Nearest allowed power-of-2 for uploadthing types
    MAX_FILE_SIZE_FRIENDLY: "20MB",
    ALLOWED_TYPES: [
      "image/jpeg",
      "image/png",
      "image/webp",
      "application/pdf",
      "text/plain",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "application/vnd.ms-excel",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "application/vnd.ms-powerpoint",
      "application/vnd.openxmlformats-officedocument.presentationml.presentation",
      "application/zip",
    ],
  },
} as const;
