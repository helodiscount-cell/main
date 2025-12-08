/**
 * Common Types Package
 * Exports all shared types for the dm-broo application
 */
import { z } from "zod";
export * from "./schemas/automation.schema";
export * from "./schemas/instagram.schema";
export * from "./schemas/webhook.schema";
export * from "./schemas/user.schema";
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
} from "./schemas/automation.schema";
import {
  InstagramPostSchema,
  InstagramPostsResponseSchema,
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
  WebhookEntrySchema,
  WebhookPayloadSchema,
  WebhookVerificationResponseSchema,
  WebhookProcessingResponseSchema,
} from "./schemas/webhook.schema";
import {
  EnsureUserResponseSchema,
  ClerkUserDataSchema,
} from "./schemas/user.schema";
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
export type InstagramPost = z.infer<typeof InstagramPostSchema>;
export type InstagramPostsResponse = z.infer<
  typeof InstagramPostsResponseSchema
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
export type WebhookVerificationQuery = z.infer<
  typeof WebhookVerificationQuerySchema
>;
export type WebhookCommentValue = z.infer<typeof WebhookCommentValueSchema>;
export type WebhookChange = z.infer<typeof WebhookChangeSchema>;
export type WebhookMessagingEvent = z.infer<typeof WebhookMessagingEventSchema>;
export type WebhookEntry = z.infer<typeof WebhookEntrySchema>;
export type WebhookPayload = z.infer<typeof WebhookPayloadSchema>;
export type WebhookVerificationResponse = z.infer<
  typeof WebhookVerificationResponseSchema
>;
export type WebhookProcessingResponse = z.infer<
  typeof WebhookProcessingResponseSchema
>;
export type EnsureUserResponse = z.infer<typeof EnsureUserResponseSchema>;
export type ClerkUserData = z.infer<typeof ClerkUserDataSchema>;
export type ErrorResponse = {
  success: false;
  error: string;
  details?: string;
};
