import { createUploadthing, type FileRouter } from "uploadthing/next";
import { auth } from "@clerk/nextjs/server";

import { FORMS_CONFIG } from "@/configs/forms.config";

const f = createUploadthing();

// FileRouter for our app, can contain multiple FileRoutes
export const ourFileRouter = {
  // Define as many FileRoutes as you like, each with a unique routeSlug
  imageUploader: f({
    image: {
      maxFileSize: "4MB",
      maxFileCount: 1,
    },
  })
    // Set permissions and file types for this FileRoute
    .middleware(async ({ req }) => {
      // This code runs on your server before upload
      const { userId } = await auth();

      // If you throw, the user will not be able to upload
      if (!userId) throw new Error("Unauthorized");

      // Whatever is returned here is accessible in onUploadComplete as `metadata`
      return { userId: userId };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      // This code RUNS ON YOUR SERVER after upload
      console.log("Upload complete for userId:", metadata.userId);
      console.log("file url", file.url);

      // !!! Whatever is returned here is sent to the clientside `onClientUploadComplete` callback
      return { uploadedBy: metadata.userId };
    }),

  // Add a route for public form attachments — anonymous users allowed
  formAttachment: f({
    // Permitted file types capped at configuration limit
    "image/jpeg": {
      maxFileSize: FORMS_CONFIG.UPLOAD.MAX_FILE_SIZE_FRIENDLY as any,
      maxFileCount: 1,
    },
    "image/png": {
      maxFileSize: FORMS_CONFIG.UPLOAD.MAX_FILE_SIZE_FRIENDLY as any,
      maxFileCount: 1,
    },
    "image/webp": {
      maxFileSize: FORMS_CONFIG.UPLOAD.MAX_FILE_SIZE_FRIENDLY as any,
      maxFileCount: 1,
    },
    pdf: {
      maxFileSize: FORMS_CONFIG.UPLOAD.MAX_FILE_SIZE_FRIENDLY as any,
      maxFileCount: 1,
    },
    text: {
      maxFileSize: FORMS_CONFIG.UPLOAD.MAX_FILE_SIZE_FRIENDLY as any,
      maxFileCount: 1,
    },
    "application/msword": {
      maxFileSize: FORMS_CONFIG.UPLOAD.MAX_FILE_SIZE_FRIENDLY as any,
      maxFileCount: 1,
    },
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document": {
      maxFileSize: FORMS_CONFIG.UPLOAD.MAX_FILE_SIZE_FRIENDLY as any,
      maxFileCount: 1,
    },
    "application/vnd.ms-excel": {
      maxFileSize: FORMS_CONFIG.UPLOAD.MAX_FILE_SIZE_FRIENDLY as any,
      maxFileCount: 1,
    },
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": {
      maxFileSize: FORMS_CONFIG.UPLOAD.MAX_FILE_SIZE_FRIENDLY as any,
      maxFileCount: 1,
    },
    "application/vnd.ms-powerpoint": {
      maxFileSize: FORMS_CONFIG.UPLOAD.MAX_FILE_SIZE_FRIENDLY as any,
      maxFileCount: 1,
    },
    "application/vnd.openxmlformats-officedocument.presentationml.presentation":
      {
        maxFileSize: FORMS_CONFIG.UPLOAD.MAX_FILE_SIZE_FRIENDLY as any,
        maxFileCount: 1,
      },
    "application/zip": {
      maxFileSize: FORMS_CONFIG.UPLOAD.MAX_FILE_SIZE_FRIENDLY as any,
      maxFileCount: 1,
    },
  })
    .middleware(async () => {
      // No auth requirement for public form submissions
      return { isPublic: true };
    })
    .onUploadComplete(async ({ file }) => {
      console.log("Public form attachment uploaded:", file.url);
      return { url: file.url };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
