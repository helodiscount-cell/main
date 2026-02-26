/**
 * Automation Zod Schemas
 * Defines validation schemas for automation-related API endpoints
 */
import { z } from "zod";
export declare const CreateAutomationSchema: z.ZodObject<
  {
    triggerType: z.ZodDefault<
      z.ZodEnum<{
        COMMENT_ON_POST: "COMMENT_ON_POST";
        STORY_REPLY: "STORY_REPLY";
      }>
    >;
    commentReplyWhenDm: z.ZodOptional<z.ZodString>;
    postId: z.ZodOptional<
      z.ZodPipe<z.ZodString, z.ZodTransform<string, string>>
    >;
    postCaption: z.ZodPipe<
      z.ZodOptional<z.ZodString>,
      z.ZodTransform<string | null, string | undefined>
    >;
    story: z.ZodOptional<
      z.ZodObject<
        {
          id: z.ZodString;
          mediaUrl: z.ZodString;
          mediaType: z.ZodEnum<{
            IMAGE: "IMAGE";
            VIDEO: "VIDEO";
          }>;
          caption: z.ZodOptional<z.ZodNullable<z.ZodString>>;
          permalink: z.ZodString;
          timestamp: z.ZodString;
        },
        z.core.$strip
      >
    >;
    triggers: z.ZodPipe<
      z.ZodArray<z.ZodPipe<z.ZodString, z.ZodTransform<string, string>>>,
      z.ZodTransform<string[], string[]>
    >;
    matchType: z.ZodDefault<
      z.ZodEnum<{
        CONTAINS: "CONTAINS";
        EXACT: "EXACT";
        REGEX: "REGEX";
      }>
    >;
    actionType: z.ZodEnum<{
      DM: "DM";
      COMMENT_REPLY: "COMMENT_REPLY";
    }>;
    replyMessage: z.ZodPipe<z.ZodString, z.ZodTransform<string, string>>;
    useVariables: z.ZodDefault<z.ZodBoolean>;
  },
  z.core.$strip
>;
export declare const UpdateAutomationSchema: z.ZodObject<
  {
    triggers: z.ZodOptional<
      z.ZodPipe<
        z.ZodArray<z.ZodPipe<z.ZodString, z.ZodTransform<string, string>>>,
        z.ZodTransform<string[], string[]>
      >
    >;
    matchType: z.ZodOptional<
      z.ZodEnum<{
        CONTAINS: "CONTAINS";
        EXACT: "EXACT";
        REGEX: "REGEX";
      }>
    >;
    actionType: z.ZodOptional<
      z.ZodEnum<{
        DM: "DM";
        COMMENT_REPLY: "COMMENT_REPLY";
      }>
    >;
    replyMessage: z.ZodOptional<
      z.ZodPipe<z.ZodString, z.ZodTransform<string, string>>
    >;
    commentReplyWhenDm: z.ZodOptional<z.ZodString>;
    status: z.ZodOptional<
      z.ZodEnum<{
        ACTIVE: "ACTIVE";
        PAUSED: "PAUSED";
        DELETED: "DELETED";
      }>
    >;
  },
  z.core.$strip
>;
export declare const AutomationListQuerySchema: z.ZodObject<
  {
    status: z.ZodPipe<
      z.ZodOptional<
        z.ZodEnum<{
          ACTIVE: "ACTIVE";
          PAUSED: "PAUSED";
          DELETED: "DELETED";
        }>
      >,
      z.ZodTransform<
        string | undefined,
        "ACTIVE" | "PAUSED" | "DELETED" | undefined
      >
    >;
    postId: z.ZodPipe<
      z.ZodOptional<z.ZodString>,
      z.ZodTransform<string | undefined, string | undefined>
    >;
    page: z.ZodPipe<
      z.ZodOptional<z.ZodString>,
      z.ZodTransform<number, string | undefined>
    >;
    limit: z.ZodPipe<
      z.ZodOptional<z.ZodString>,
      z.ZodTransform<number, string | undefined>
    >;
  },
  z.core.$strip
>;
export declare const AutomationResponseSchema: z.ZodObject<
  {
    id: z.ZodString;
    postId: z.ZodString;
    postCaption: z.ZodNullable<z.ZodString>;
    triggers: z.ZodArray<z.ZodString>;
    matchType: z.ZodEnum<{
      CONTAINS: "CONTAINS";
      EXACT: "EXACT";
      REGEX: "REGEX";
    }>;
    actionType: z.ZodEnum<{
      DM: "DM";
      COMMENT_REPLY: "COMMENT_REPLY";
    }>;
    replyMessage: z.ZodString;
    commentReplyWhenDm: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    status: z.ZodEnum<{
      ACTIVE: "ACTIVE";
      PAUSED: "PAUSED";
      DELETED: "DELETED";
    }>;
    timesTriggered: z.ZodNumber;
    lastTriggeredAt: z.ZodNullable<z.ZodDate>;
    createdAt: z.ZodDate;
    updatedAt: z.ZodDate;
    useVariables: z.ZodBoolean;
  },
  z.core.$strip
>;
export declare const ExecutionRecordSchema: z.ZodObject<
  {
    id: z.ZodString;
    automationId: z.ZodString;
    commentId: z.ZodString;
    commentText: z.ZodString;
    commenterId: z.ZodString;
    commenterUsername: z.ZodString;
    actionType: z.ZodEnum<{
      DM: "DM";
      COMMENT_REPLY: "COMMENT_REPLY";
    }>;
    replyText: z.ZodString;
    success: z.ZodBoolean;
    error: z.ZodNullable<z.ZodString>;
    executedAt: z.ZodDate;
  },
  z.core.$strip
>;
export declare const AutomationDetailResponseSchema: z.ZodObject<
  {
    success: z.ZodLiteral<true>;
    data: z.ZodObject<
      {
        id: z.ZodString;
        postId: z.ZodString;
        postCaption: z.ZodNullable<z.ZodString>;
        triggers: z.ZodArray<z.ZodString>;
        matchType: z.ZodEnum<{
          CONTAINS: "CONTAINS";
          EXACT: "EXACT";
          REGEX: "REGEX";
        }>;
        actionType: z.ZodEnum<{
          DM: "DM";
          COMMENT_REPLY: "COMMENT_REPLY";
        }>;
        replyMessage: z.ZodString;
        commentReplyWhenDm: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        status: z.ZodEnum<{
          ACTIVE: "ACTIVE";
          PAUSED: "PAUSED";
          DELETED: "DELETED";
        }>;
        timesTriggered: z.ZodNumber;
        lastTriggeredAt: z.ZodNullable<z.ZodDate>;
        createdAt: z.ZodDate;
        updatedAt: z.ZodDate;
        useVariables: z.ZodBoolean;
        recentExecutions: z.ZodOptional<
          z.ZodArray<
            z.ZodObject<
              {
                id: z.ZodString;
                automationId: z.ZodString;
                commentId: z.ZodString;
                commentText: z.ZodString;
                commenterId: z.ZodString;
                commenterUsername: z.ZodString;
                actionType: z.ZodEnum<{
                  DM: "DM";
                  COMMENT_REPLY: "COMMENT_REPLY";
                }>;
                replyText: z.ZodString;
                success: z.ZodBoolean;
                error: z.ZodNullable<z.ZodString>;
                executedAt: z.ZodDate;
              },
              z.core.$strip
            >
          >
        >;
        totalExecutions: z.ZodOptional<z.ZodNumber>;
      },
      z.core.$strip
    >;
  },
  z.core.$strip
>;
export declare const AutomationListResponseSchema: z.ZodObject<
  {
    success: z.ZodLiteral<true>;
    automations: z.ZodArray<
      z.ZodObject<
        {
          id: z.ZodString;
          postId: z.ZodString;
          postCaption: z.ZodNullable<z.ZodString>;
          triggers: z.ZodArray<z.ZodString>;
          matchType: z.ZodEnum<{
            CONTAINS: "CONTAINS";
            EXACT: "EXACT";
            REGEX: "REGEX";
          }>;
          actionType: z.ZodEnum<{
            DM: "DM";
            COMMENT_REPLY: "COMMENT_REPLY";
          }>;
          replyMessage: z.ZodString;
          commentReplyWhenDm: z.ZodOptional<z.ZodNullable<z.ZodString>>;
          status: z.ZodEnum<{
            ACTIVE: "ACTIVE";
            PAUSED: "PAUSED";
            DELETED: "DELETED";
          }>;
          timesTriggered: z.ZodNumber;
          lastTriggeredAt: z.ZodNullable<z.ZodDate>;
          createdAt: z.ZodDate;
          updatedAt: z.ZodDate;
          useVariables: z.ZodBoolean;
          executionsCount: z.ZodOptional<z.ZodNumber>;
        },
        z.core.$strip
      >
    >;
  },
  z.core.$strip
>;
export declare const CreateAutomationResponseSchema: z.ZodObject<
  {
    success: z.ZodLiteral<true>;
    automation: z.ZodObject<
      {
        id: z.ZodString;
        postId: z.ZodString;
        actionType: z.ZodEnum<{
          DM: "DM";
          COMMENT_REPLY: "COMMENT_REPLY";
        }>;
        triggers: z.ZodArray<z.ZodString>;
        replyMessage: z.ZodString;
        createdAt: z.ZodDate;
      },
      z.core.$strip
    >;
  },
  z.core.$strip
>;
export declare const UpdateAutomationResponseSchema: z.ZodObject<
  {
    success: z.ZodLiteral<true>;
    automation: z.ZodObject<
      {
        id: z.ZodString;
        postId: z.ZodString;
        triggers: z.ZodArray<z.ZodString>;
        matchType: z.ZodEnum<{
          CONTAINS: "CONTAINS";
          EXACT: "EXACT";
          REGEX: "REGEX";
        }>;
        actionType: z.ZodEnum<{
          DM: "DM";
          COMMENT_REPLY: "COMMENT_REPLY";
        }>;
        replyMessage: z.ZodString;
        commentReplyWhenDm: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        status: z.ZodEnum<{
          ACTIVE: "ACTIVE";
          PAUSED: "PAUSED";
          DELETED: "DELETED";
        }>;
        updatedAt: z.ZodDate;
      },
      z.core.$strip
    >;
  },
  z.core.$strip
>;
export declare const DeleteAutomationResponseSchema: z.ZodObject<
  {
    success: z.ZodLiteral<true>;
    message: z.ZodString;
  },
  z.core.$strip
>;
export declare const ErrorResponseSchema: z.ZodObject<
  {
    success: z.ZodLiteral<false>;
    error: z.ZodString;
    details: z.ZodOptional<z.ZodString>;
  },
  z.core.$strip
>;
