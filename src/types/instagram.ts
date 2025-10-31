import { z } from "zod";

// Defines the request body schema using zod
export const InstagramConnectRequestSchema = z.object({
  fullName: z.string().optional(),
  email: z.string().optional(),
  imageUrl: z.string().nullable().optional(),
});
