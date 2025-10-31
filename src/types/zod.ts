import { z } from "zod";

// Defines the request body schema using zod
export const InstagramConnectRequestSchema = z.object({
  fullName: z.string().optional(),
  email: z.string().optional(),
  imageUrl: z.string().nullable().optional(),
});

// Defines zod schema for the automation config
export const AutoReplyCommentsSchema = z.object({
  triggers: z.array(z.string().min(1)).min(1, "At least one trigger required"),
  replyWith: z.string().min(1, "Reply required"),
  postId: z.string(),
});
