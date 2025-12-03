/**
 * User Zod Schemas
 * Defines validation schemas for user-related API endpoints
 */

import { z } from "zod";

// Ensure user response schema
export const EnsureUserResponseSchema = z.object({
  id: z.string(),
});

// User data from Clerk
export const ClerkUserDataSchema = z.object({
  id: z.string(),
  emailAddresses: z
    .array(
      z.object({
        emailAddress: z.string(),
      })
    )
    .optional(),
  firstName: z.string().nullable().optional(),
  lastName: z.string().nullable().optional(),
  imageUrl: z.string().nullable().optional(),
});

// Error response schema (removed to avoid duplicates)
// export const ErrorResponseSchema = z.object({
//   error: z.string(),
// });
