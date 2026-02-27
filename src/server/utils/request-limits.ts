/**
 * Request Size Limit Utilities
 * Provides constants and validation for request body size limits
 */

import { ApiRouteError } from "../middleware/errors/classes";

/**
 * Maximum request body sizes (in bytes) for different endpoint types
 */
export const REQUEST_SIZE_LIMITS = {
  // General API endpoints (automations, etc.)
  API_DEFAULT: 100 * 1024, // 100 KB
  // Webhook endpoints (can receive larger payloads from Instagram)
  WEBHOOK: 500 * 1024, // 500 KB
  // File upload endpoints (if any)
  FILE_UPLOAD: 10 * 1024 * 1024, // 10 MB
} as const;

/**
 * Validates request size based on Content-Length header
 * Returns true if request size is within limit
 */
export function validateRequestSize(
  contentLength: string | null,
  maxSize: number,
): { valid: boolean; error?: string } {
  if (!contentLength) {
    // If Content-Length is missing, we can't validate upfront
    // The request will be validated during body parsing
    return { valid: true };
  }

  const size = parseInt(contentLength, 10);

  if (isNaN(size)) {
    return { valid: false, error: "Invalid Content-Length header" };
  }

  if (size > maxSize) {
    const maxSizeMB = (maxSize / (1024 * 1024)).toFixed(2);
    return {
      valid: false,
      error: `Request body too large. Maximum size is ${maxSizeMB} MB`,
    };
  }

  return { valid: true };
}

/**
 * Gets the appropriate size limit for a given route path
 */
export function getSizeLimitForRoute(pathname: string): number {
  // Webhook endpoints can receive larger payloads
  if (pathname.includes("/webhooks/")) {
    return REQUEST_SIZE_LIMITS.WEBHOOK;
  }

  // File upload endpoints (if any)
  if (pathname.includes("/upload") || pathname.includes("/files")) {
    return REQUEST_SIZE_LIMITS.FILE_UPLOAD;
  }

  // Default limit for all other API endpoints
  return REQUEST_SIZE_LIMITS.API_DEFAULT;
}

/**
 * Safely parses request body with size validation
 * Throws an error if body exceeds the specified limit
 */
export async function parseRequestBodySafely(
  request: Request,
  maxSize: number = REQUEST_SIZE_LIMITS.API_DEFAULT,
): Promise<any> {
  const contentLength = request.headers.get("content-length");

  // Validates size before parsing
  if (contentLength) {
    const size = parseInt(contentLength, 10);
    if (!isNaN(size) && size > maxSize) {
      const maxSizeMB = (maxSize / (1024 * 1024)).toFixed(2);
      throw new ApiRouteError(
        `Request body too large. Maximum size is ${maxSizeMB} MB`,
        "REQUEST_BODY_TOO_LARGE",
      );
    }
  }

  // Gets body text and validates size
  const bodyText = await request.text();

  if (bodyText.length > maxSize) {
    const maxSizeMB = (maxSize / (1024 * 1024)).toFixed(2);
    throw new ApiRouteError(
      `Request body too large. Maximum size is ${maxSizeMB} MB`,
      "REQUEST_BODY_TOO_LARGE",
    );
  }

  // Parses JSON if content type is JSON
  const contentType = request.headers.get("content-type");
  if (contentType?.includes("application/json")) {
    try {
      return JSON.parse(bodyText);
    } catch (error) {
      throw new ApiRouteError("Invalid JSON in request body", "INVALID_JSON");
    }
  }

  // Returns text for non-JSON content
  return bodyText;
}
