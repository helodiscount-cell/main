import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Helper to get error message consistently (supports string, Error object, or BeErrorResponse)
export function getErrorMessage(err: unknown) {
  if (typeof err === "string") return err;
  if (err && typeof err === "object") {
    // Handles BeErrorResponse format
    if ("error" in err && typeof (err as any).error === "string") {
      return (err as any).error;
    }
    // Handles standard Error objects
    if ("message" in err && typeof (err as any).message === "string") {
      return (err as any).message;
    }
  }
  return "An unexpected error occurred";
}
