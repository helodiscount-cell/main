/**
 * Input Sanitization Utilities
 * Provides functions to sanitize and validate user-generated content
 */
/**
 * Maximum length constants for different input types
 */
export declare const MAX_LENGTHS: {
    readonly REPLY_MESSAGE: 1000;
    readonly TRIGGER: 200;
    readonly POST_CAPTION: 2200;
    readonly USERNAME: 30;
    readonly COMMENT_TEXT: 2200;
    readonly TRIGGERS_ARRAY: 50;
};
/**
 * Escapes HTML special characters to prevent XSS attacks
 * Converts potentially dangerous characters to their HTML entity equivalents
 */
export declare function escapeHtml(text: string): string;
/**
 * Sanitizes text for use in plain text contexts (like Instagram messages)
 * Removes or escapes control characters and dangerous sequences
 */
export declare function sanitizeText(text: string, maxLength?: number): string;
/**
 * Sanitizes a username string
 * Removes dangerous characters and validates length
 */
export declare function sanitizeUsername(username: string): string;
/**
 * Sanitizes comment text from Instagram
 * Handles external, untrusted input from Instagram API
 */
export declare function sanitizeCommentText(text: string): string;
/**
 * Sanitizes a reply message
 * Ensures message is safe for sending via Instagram API
 */
export declare function sanitizeReplyMessage(message: string): string;
/**
 * Sanitizes a trigger keyword
 * Validates and sanitizes individual trigger strings
 */
export declare function sanitizeTrigger(trigger: string): string;
/**
 * Sanitizes an array of triggers
 * Validates array length and sanitizes each trigger
 */
export declare function sanitizeTriggers(triggers: string[]): string[];
/**
 * Sanitizes post caption
 * Handles optional post caption text
 */
export declare function sanitizePostCaption(caption: string | undefined | null): string | null;
/**
 * Validates that a string is within acceptable length
 */
export declare function validateLength(text: string, min: number, max: number): {
    valid: boolean;
    error?: string;
};
