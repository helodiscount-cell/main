"use strict";
/**
 * Validation Utilities
 * Provides validation functions for common data types
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.isValidObjectId = isValidObjectId;
exports.sanitizeQueryParam = sanitizeQueryParam;
exports.validateAndSanitizeObjectId = validateAndSanitizeObjectId;
/**
 * Validates MongoDB ObjectId format
 * ObjectId must be exactly 24 hexadecimal characters
 */
function isValidObjectId(id) {
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
function sanitizeQueryParam(value, maxLength = 100) {
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
function validateAndSanitizeObjectId(id) {
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
