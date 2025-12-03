"use strict";
/**
 * User Zod Schemas
 * Defines validation schemas for user-related API endpoints
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClerkUserDataSchema = exports.EnsureUserResponseSchema = void 0;
const zod_1 = require("zod");
// Ensure user response schema
exports.EnsureUserResponseSchema = zod_1.z.object({
    id: zod_1.z.string(),
});
// User data from Clerk
exports.ClerkUserDataSchema = zod_1.z.object({
    id: zod_1.z.string(),
    emailAddresses: zod_1.z
        .array(zod_1.z.object({
        emailAddress: zod_1.z.string(),
    }))
        .optional(),
    firstName: zod_1.z.string().nullable().optional(),
    lastName: zod_1.z.string().nullable().optional(),
    imageUrl: zod_1.z.string().nullable().optional(),
});
// Error response schema (removed to avoid duplicates)
// export const ErrorResponseSchema = z.object({
//   error: z.string(),
// });
