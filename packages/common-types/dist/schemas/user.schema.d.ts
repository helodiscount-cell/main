/**
 * User Zod Schemas
 * Defines validation schemas for user-related API endpoints
 */
import { z } from "zod";
export declare const EnsureUserResponseSchema: z.ZodObject<{
    id: z.ZodString;
}, z.core.$strip>;
export declare const ClerkUserDataSchema: z.ZodObject<{
    id: z.ZodString;
    emailAddresses: z.ZodOptional<z.ZodArray<z.ZodObject<{
        emailAddress: z.ZodString;
    }, z.core.$strip>>>;
    firstName: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    lastName: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    imageUrl: z.ZodOptional<z.ZodNullable<z.ZodString>>;
}, z.core.$strip>;
