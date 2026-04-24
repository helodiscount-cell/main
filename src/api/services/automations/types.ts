import {
  TriggerType,
  AutomationStatus,
  MatchType,
  ActionType,
  ExecutionStatus,
} from "@prisma/client";

export type {
  TriggerType,
  AutomationStatus,
  MatchType,
  ActionType,
  ExecutionStatus,
};

export interface AutomationListItem {
  type: "automation";
  id: string;
  triggerType: TriggerType;
  newFollowersGained: number;
  post: {
    id: string;
    caption: string | null;
    mediaUrl: string | null;
    mediaType: string | null;
    thumbnailUrl: string | null;
  } | null;
  story: {
    id: string;
    mediaUrl: string;
    mediaType: string;
    thumbnailUrl: string | null;
    caption: string | null;
    permalink: string;
    timestamp: string;
  } | null;
  triggers: string[];
  matchType: MatchType;
  actionType: ActionType;
  replyMessage: string;
  replyImage: string | null;
  commentReplyWhenDm?: string[];
  askToFollowEnabled?: boolean;
  askToFollowMessage?: string | null;
  askToFollowLink?: string | null;
  openingMessageEnabled?: boolean;
  openingMessage?: string | null;
  openingButtonText?: string | null;
  dmLinks?: { title: string; url: string }[];
  anyKeyword?: boolean;
  status: AutomationStatus;
  timesTriggered: number;
  lastTriggeredAt: string | null;
  automationName: string | null;
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
  automationName: string;
  postCaption?: string | null;
  postMediaUrl?: string | null;
  postMediaType?: string | null;
  postThumbnailUrl?: string | null;
  postPermalink?: string | null;
  postTimestamp?: string | null;
  triggers: string[];
  matchType: MatchType;
  actionType: ActionType;
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
  dmLinks?: { title: string; url: string }[];
}

export interface UpdateAutomationData {
  automationName?: string;
  postCaption?: string | null;
  triggers?: string[];
  matchType?: MatchType;
  actionType?: ActionType;
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
  dmLinks?: { title: string; url: string }[];
  status?: AutomationStatus;
}

export interface AutomationFilters {
  instaAccountId: string;
  status?: AutomationStatus | AutomationStatus[];
  skip?: number;
  take?: number;
}

export interface CreateExecutionData {
  automationId: string;
  commentId: string;
  commentText: string;
  commentUsername: string;
  commentUserId: string;
  actionType: ActionType;
  sentMessage: string;
  status: ExecutionStatus;
  errorMessage?: string | null;
  instagramMessageId?: string | null;
}
