/**
 * Common Types Package
 * Exports all shared types for the dm-broo application
 */

import { z } from "zod";

// Re-export all schemas
export * from "./schemas/automation.schema";
export * from "./schemas/instagram.schema";
export * from "./schemas/webhook.schema";
export * from "./schemas/user.schema";
export * from "./schemas/form.schema";

// Import schemas for type inference
import {
  CreateAutomationSchema,
  UpdateAutomationSchema,
  AutomationListQuerySchema,
  AutomationResponseSchema,
  AutomationDetailResponseSchema,
  AutomationListResponseSchema,
  CreateAutomationResponseSchema,
  UpdateAutomationResponseSchema,
  DeleteAutomationResponseSchema,
  ExecutionRecordSchema,
  DmLinkSchema,
} from "./schemas/automation.schema";

import {
  InstagramPostSchema,
  InstagramPostsResponseSchema,
  InstagramStorySchema,
  InstagramStoriesResponseSchema,
  InstagramCommentSchema,
  CommentsQuerySchema,
  CommentsResponseSchema,
  InstagramStatusConnectedSchema,
  InstagramStatusDisconnectedSchema,
  InstagramStatusResponseSchema,
  OAuthStateSchema,
  OAuthCallbackQuerySchema,
  OAuthTokenResponseSchema,
  LongLivedTokenResponseSchema,
  InstagramUserDataSchema,
  FacebookPagesResponseSchema,
  OAuthAuthorizeQuerySchema,
  TokenRefreshResponseSchema,
  DisconnectResponseSchema,
  InstagramConnectRequestSchema,
  InstagramConnectResponseSchema,
} from "./schemas/instagram.schema";

import {
  WebhookVerificationQuerySchema,
  WebhookCommentValueSchema,
  WebhookChangeSchema,
  WebhookMessagingEventSchema,
  WebhookEntryOfPostsSchema,
  WebhookPayloadOfPostsSchema,
  WebhookEntryOfStoriesSchema,
  WebhookPayloadOfStoriesSchema,
  WebhookEntrySchema,
  WebhookPayloadSchema,
  WebhookVerificationResponseSchema,
  WebhookProcessingResponseSchema,
} from "./schemas/webhook.schema";

import {
  EnsureUserResponseSchema,
  ClerkUserDataSchema,
} from "./schemas/user.schema";

import {
  FieldTypeSchema,
  FormFieldSchema,
  FormValuesSchema,
  FormFieldOptionSchema,
  CreateFormSchema,
  SubmitFormSchema,
  FormStatusSchema,
  FormSubmissionAnswerSchema,
} from "./schemas/form.schema";

// Automation Types
export type CreateAutomationInput = z.infer<typeof CreateAutomationSchema>;
export type UpdateAutomationInput = z.infer<typeof UpdateAutomationSchema>;
export type AutomationListQuery = z.infer<typeof AutomationListQuerySchema>;
export type AutomationResponse = z.infer<typeof AutomationResponseSchema>;
export type AutomationDetailResponse = z.infer<
  typeof AutomationDetailResponseSchema
>;
export type AutomationListResponse = z.infer<
  typeof AutomationListResponseSchema
>;
export type CreateAutomationResponse = z.infer<
  typeof CreateAutomationResponseSchema
>;
export type UpdateAutomationResponse = z.infer<
  typeof UpdateAutomationResponseSchema
>;
export type DeleteAutomationResponse = z.infer<
  typeof DeleteAutomationResponseSchema
>;
export type ExecutionRecord = z.infer<typeof ExecutionRecordSchema>;
export type DmLink = z.infer<typeof DmLinkSchema>;

// Instagram Types
export type InstagramPost = z.infer<typeof InstagramPostSchema>;
export type InstagramPostsResponse = z.infer<
  typeof InstagramPostsResponseSchema
>;
export type InstagramStory = z.infer<typeof InstagramStorySchema>;
export type InstagramStoriesResponse = z.infer<
  typeof InstagramStoriesResponseSchema
>;
export type InstagramComment = z.infer<typeof InstagramCommentSchema>;
export type CommentsQuery = z.infer<typeof CommentsQuerySchema>;
export type CommentsResponse = z.infer<typeof CommentsResponseSchema>;
export type InstagramStatusConnected = z.infer<
  typeof InstagramStatusConnectedSchema
>;
export type InstagramStatusDisconnected = z.infer<
  typeof InstagramStatusDisconnectedSchema
>;
export type InstagramStatusResponse = z.infer<
  typeof InstagramStatusResponseSchema
>;
export type OAuthState = z.infer<typeof OAuthStateSchema>;
export type OAuthCallbackQuery = z.infer<typeof OAuthCallbackQuerySchema>;
export type OAuthTokenResponse = z.infer<typeof OAuthTokenResponseSchema>;
export type LongLivedTokenResponse = z.infer<
  typeof LongLivedTokenResponseSchema
>;
export type InstagramUserData = z.infer<typeof InstagramUserDataSchema>;
export type FacebookPagesResponse = z.infer<typeof FacebookPagesResponseSchema>;
export type OAuthAuthorizeQuery = z.infer<typeof OAuthAuthorizeQuerySchema>;
export type TokenRefreshResponse = z.infer<typeof TokenRefreshResponseSchema>;
export type DisconnectResponse = z.infer<typeof DisconnectResponseSchema>;
export type InstagramConnectRequest = z.infer<
  typeof InstagramConnectRequestSchema
>;
export type InstagramConnectResponse = z.infer<
  typeof InstagramConnectResponseSchema
>;

// Webhook Types
export type WebhookVerificationQuery = z.infer<
  typeof WebhookVerificationQuerySchema
>;
export type WebhookCommentValue = z.infer<typeof WebhookCommentValueSchema>;
export type WebhookChange = z.infer<typeof WebhookChangeSchema>;
export type WebhookMessagingEvent = z.infer<typeof WebhookMessagingEventSchema>;
export type WebhookEntryOfPosts = z.infer<typeof WebhookEntryOfPostsSchema>;
export type WebhookPayloadOfPosts = z.infer<typeof WebhookPayloadOfPostsSchema>;
export type WebhookEntryOfStories = z.infer<typeof WebhookEntryOfStoriesSchema>;
export type WebhookPayloadOfStories = z.infer<
  typeof WebhookPayloadOfStoriesSchema
>;
export type WebhookEntry = z.infer<typeof WebhookEntrySchema>;
export type WebhookPayload = z.infer<typeof WebhookPayloadSchema>;
export type WebhookVerificationResponse = z.infer<
  typeof WebhookVerificationResponseSchema
>;
export type WebhookProcessingResponse = z.infer<
  typeof WebhookProcessingResponseSchema
>;

// User Types
export type EnsureUserResponse = z.infer<typeof EnsureUserResponseSchema>;
export type ClerkUserData = z.infer<typeof ClerkUserDataSchema>;

// Form Editor Types
export type FieldType = z.infer<typeof FieldTypeSchema>;
export type FormField = z.infer<typeof FormFieldSchema>;
export type FormValues = z.infer<typeof FormValuesSchema>;
export type FormFieldOption = z.infer<typeof FormFieldOptionSchema>;
export type CreateFormInput = z.infer<typeof CreateFormSchema>;
export type SubmitFormInput = z.infer<typeof SubmitFormSchema>;
export type FormStatus = z.infer<typeof FormStatusSchema>;
export type FormSubmissionAnswer = z.infer<typeof FormSubmissionAnswerSchema>;

// Common Error Types
export type ErrorResponse = {
  success: false;
  error: string;
  details?: string;
};
