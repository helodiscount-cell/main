/**
 * Validation Utilities
 * Provides validation functions for common data types
 */

import { CommentData } from "../automation/matcher";
import { sanitizeCommentText, sanitizeText, sanitizeUsername } from "./sanitize";

/**
 * Validates MongoDB ObjectId format
 * ObjectId must be exactly 24 hexadecimal characters
 */
export function isValidObjectId(id: string): boolean {
  if (typeof id !== "string" || id.length !== 24) {
    return false;
  }

  // Checks if string contains only hexadecimal characters
  return /^[0-9a-fA-F]{24}$/.test(id);
}

/**
 * Sanitizes a string for use in queries
 * Removes dangerous characters and limits length
 */
export function sanitizeQueryParam(value: string, maxLength: number = 100): string {
  if (typeof value !== "string") {
    return "";
  }

  // Trims whitespace
  let sanitized = value.trim();

  // Removes null bytes and control characters
  sanitized = sanitized.replace(/[\x00-\x1F\x7F]/g, "");

  // Removes zero-width characters
  sanitized = sanitized.replace(/[\u200B-\u200D\uFEFF]/g, "");

  // Limits length
  if (sanitized.length > maxLength) {
    sanitized = sanitized.substring(0, maxLength);
  }

  return sanitized;
}

/**
 * Validates and sanitizes a MongoDB ObjectId from query parameters
 * Returns null if invalid
 */
export function validateAndSanitizeObjectId(id: string | null | undefined): string | null {
  if (!id || typeof id !== "string") {
    return null;
  }

  // Sanitizes first
  const sanitized = sanitizeQueryParam(id, 24);

  // Validates format
  if (!isValidObjectId(sanitized)) {
    return null;
  }

  return sanitized;
}

/**
 * Validates and sanitizes comment data from Instagram webhook
 * Ensures all external input is properly sanitized before use
 */
export function validateCommentData(data: any): CommentData | null {
  if (!data.id || !data.text) {
    return null;
  }

  // Sanitizes all comment data from external source (Instagram API)
  return {
    id: sanitizeText(String(data.id), 100), // Comment IDs are typically short
    text: sanitizeCommentText(data.text),
    username: sanitizeUsername(
      data.username || data.from?.username || "unknown"
    ),
    userId: sanitizeText(String(data.from?.id || data.user?.id || ""), 100),
    timestamp: data.timestamp || new Date().toISOString(),
  };
}
