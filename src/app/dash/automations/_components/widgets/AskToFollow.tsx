import { Link as LinkIcon } from "lucide-react";
import { AutomationInput } from "./AutomationInput";

interface AskToFollowProps {
  enabled: boolean;
  onEnabledChange: (enabled: boolean) => void;
  message: string;
  onMessageChange: (message: string) => void;
  link: string;
  onLinkChange: (link: string) => void;
}

import { useFeatureGates } from "@/hooks/use-feature-gates";
import { LockedOverlay } from "@/components/dash/LockedOverlay";

const AskToFollow = ({
  enabled,
  onEnabledChange,
  message,
  onMessageChange,
}: AskToFollowProps) => {
  const maxChars = 1000;
  const { data: gates } = useFeatureGates();
  const isLocked = gates?.access?.hasAskToFollow === false;

  return (
    <LockedOverlay
      isLocked={isLocked}
      title="Ask to Follow"
      description="Available on Black & Free plans"
      className="w-full"
      borderRadius="1rem"
    >
      <div className="bg-white rounded-2xl border border-purple-200    -sm w-full overflow-hidden transition-all duration-200">
        {/* Header section with title and toggle */}
        <div className="flex items-center justify-between px-5 py-4">
          <h3 className="text-sm font-semibold text-slate-800">
            Ask to Follow
          </h3>
          <button
            onClick={() => onEnabledChange(!enabled)}
            className={`relative w-12 h-6.5 rounded-full transition-all duration-300 ease-in-out ${
              enabled ? "bg-[#6A06E4]" : "bg-slate-200"
            }`}
            type="button"
          >
            <span
              className={`absolute top-1 left-1 w-4.5 h-4.5 bg-white rounded-full    -sm transition-transform duration-300 ease-in-out ${
                enabled ? "translate-x-5.5" : "translate-x-0"
              }`}
            />
          </button>
        </div>

        {enabled && (
          <div className="px-5 pb-5 space-y-4">
            {/* Unified Automation Input */}
            <AutomationInput
              value={message}
              onChange={onMessageChange}
              maxLength={maxChars}
              placeholder="Enter follow message..."
            />

            {/* Visit Profile / Link display section */}
            <div className="flex items-center justify-between bg-[#F5F3FF] rounded-xl px-4 py-3 border border-purple-50 group transition-all hover:bg-[#EDE9FE]">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center    -sm text-[#6A06E4]">
                  <LinkIcon size={16} />
                </div>
                <span className="text-sm font-semibold text-[#4F46E5]">
                  Visit Profile
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </LockedOverlay>
  );
};

export default AskToFollow;
