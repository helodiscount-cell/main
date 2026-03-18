import type { Automation } from "@prisma/client";

export type AutomationStatus = "ACTIVE" | "PAUSED";

export interface AutomationListItem {
  id: string;
  triggerType: "COMMENT_ON_POST" | "STORY_REPLY";
  post: { id: string; caption: string | null; mediaUrl: string } | null;
  story: {
    id: string;
    mediaUrl: string;
    mediaType: string;
    caption: string | null;
    permalink: string;
    timestamp: string;
  } | null;
  triggers: string[];
  matchType: string;
  actionType: string;
  replyMessage: string;
  replyImage: string | null;
  commentReplyWhenDm?: string[];
  askToFollowEnabled?: boolean;
  askToFollowMessage?: string | null;
  askToFollowLink?: string | null;
  openingMessageEnabled?: boolean;
  openingMessage?: string | null;
  openingButtonText?: string | null;
  status: string;
  timesTriggered: number;
  lastTriggeredAt: string | null;
  createdAt: string;
  updatedAt: string;
  _count: {
    executions: number;
  };
}

export interface AutomationListResponse {
  automations: AutomationListItem[];
}

export interface CreateAutomationData {
  postId: string;
  postCaption?: string | null;
  postMediaUrl?: string | null;
  postPermalink?: string | null;
  postTimestamp?: string | null;
  triggers: string[];
  matchType: string;
  actionType: string;
  replyMessage: string;
  replyImage?: string | null;
  useVariables: boolean;
  commentReplyWhenDm?: string[];
  askToFollowEnabled?: boolean;
  askToFollowMessage?: string | null;
  askToFollowLink?: string | null;
  openingMessageEnabled?: boolean;
  openingMessage?: string | null;
  openingButtonText?: string | null;
}

export interface UpdateAutomationData {
  postCaption?: string | null;
  triggers?: string[];
  matchType?: string;
  actionType?: string;
  replyMessage?: string;
  replyImage?: string | null;
  commentReplyWhenDm?: string[];
  useVariables?: boolean;
  askToFollowEnabled?: boolean;
  askToFollowMessage?: string | null;
  askToFollowLink?: string | null;
  openingMessageEnabled?: boolean;
  openingMessage?: string | null;
  openingButtonText?: string | null;
  status?: string;
}

export interface AutomationFilters {
  userId: string;
  status?: string | string[];
  skip?: number;
  take?: number;
}

export interface CreateExecutionData {
  automationId: string;
  commentId: string;
  commentText: string;
  commentUsername: string;
  commentUserId: string;
  actionType: string;
  sentMessage: string;
  status: string;
  errorMessage?: string | null;
  instagramMessageId?: string | null;
}
