/**
 * Validation Utilities
 * Provides validation functions for common data types
 */
/**
 * Validates MongoDB ObjectId format
 * ObjectId must be exactly 24 hexadecimal characters
 */
export declare function isValidObjectId(id: string): boolean;
/**
 * Sanitizes a string for use in queries
 * Removes dangerous characters and limits length
 */
export declare function sanitizeQueryParam(value: string, maxLength?: number): string;
/**
 * Validates and sanitizes a MongoDB ObjectId from query parameters
 * Returns null if invalid
 */
export declare function validateAndSanitizeObjectId(id: string | null | undefined): string | null;
