import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Helper to get error message consistently (supports string or Error object)
export function getErrorMessage(err: unknown) {
  console.log("from getErrorMessage", err);

  if (typeof err === "string") return err;
  if (
    err &&
    typeof err === "object" &&
    "message" in err &&
    typeof (err as any).message === "string"
  ) {
    return (err as any).message;
  }
  return "An unexpected error occurred";
}
