/**
 * Automation Card Component
 * Displays an automation rule with stats and controls
 */

"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MessageCircle, Zap, Pause, Play, Trash2 } from "lucide-react";
import { AutomationResponse } from "@dm-broo-auto/common-types";

interface AutomationCardProps {
  automation: AutomationResponse;
  onToggleStatus?: (id: string, newStatus: "ACTIVE" | "PAUSED") => void;
  onDelete?: (id: string) => void;
  onViewDetails?: (id: string) => void;
}

export default function AutomationCard({
  automation,
  onToggleStatus,
  onDelete,
  onViewDetails,
}: AutomationCardProps) {
  const isActive = automation.status === "ACTIVE";
  const actionTypeLabel =
    automation.actionType === "DM" ? "Send DM" : "Reply to Comment";
  const actionIcon =
    automation.actionType === "DM" ? MessageCircle : MessageCircle;

  // Formats date
  const formatDate = (date: Date | string | null | undefined) => {
    if (!date) return "Never";
    const d = typeof date === "string" ? new Date(date) : date;
    return d.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div className="border border-gray-200 dark:border-gray-800 rounded-lg p-5 bg-white dark:bg-gray-950 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-2">
          <div
            className={`p-2 rounded-lg ${
              isActive
                ? "bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400"
                : "bg-gray-100 dark:bg-gray-800 text-gray-500"
            }`}
          >
            <Zap className="size-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                {actionTypeLabel}
              </h3>
              <Badge
                variant={isActive ? "default" : "secondary"}
                className={`text-xs ${
                  isActive
                    ? "bg-green-600 hover:bg-green-700"
                    : "bg-gray-500 hover:bg-gray-600"
                }`}
              >
                {automation.status}
              </Badge>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Created {formatDate(automation.createdAt)}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          {onToggleStatus && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() =>
                onToggleStatus(automation.id, isActive ? "PAUSED" : "ACTIVE")
              }
              className="h-8 w-8 p-0"
              title={isActive ? "Pause" : "Activate"}
            >
              {isActive ? (
                <Pause className="size-4" />
              ) : (
                <Play className="size-4" />
              )}
            </Button>
          )}
          {onDelete && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onDelete(automation.id)}
              className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
              title="Delete"
            >
              <Trash2 className="size-4" />
            </Button>
          )}
        </div>
      </div>

      {/* Post caption preview */}
      {automation.postCaption && (
        <div className="mb-3 p-2 bg-gray-50 dark:bg-gray-900 rounded text-xs text-gray-600 dark:text-gray-400 line-clamp-2">
          {automation.postCaption}
        </div>
      )}

      {/* Triggers */}
      <div className="mb-3">
        <p className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-2">
          Triggers:
        </p>
        <div className="flex flex-wrap gap-1">
          {automation.triggers.map((trigger, idx) => (
            <Badge
              key={idx}
              variant="secondary"
              className="text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300"
            >
              {trigger}
            </Badge>
          ))}
        </div>
      </div>

      {/* Reply message */}
      <div className="mb-4">
        <p className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-2">
          Message:
        </p>
        <p className="text-sm text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-900 p-2 rounded line-clamp-2">
          {automation.replyMessage}
        </p>
      </div>

      {/* Stats */}
      <div className="flex items-center justify-between pt-3 border-t border-gray-200 dark:border-gray-800">
        <div className="flex gap-4 text-xs text-gray-500 dark:text-gray-400">
          <div>
            <span className="font-semibold text-gray-900 dark:text-gray-100">
              {automation.timesTriggered}
            </span>{" "}
            executions
          </div>
          <div>Last: {formatDate(automation.lastTriggeredAt)}</div>
        </div>
        {onViewDetails && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onViewDetails(automation.id)}
            className="text-xs"
          >
            View Details
          </Button>
        )}
      </div>
    </div>
  );
}
