import { Link as LinkIcon, Edit2, SmilePlus } from "lucide-react";

interface AskToFollowProps {
  enabled: boolean;
  onEnabledChange: (enabled: boolean) => void;
  message: string;
  onMessageChange: (message: string) => void;
  link: string;
  onLinkChange: (link: string) => void;
}

const AskToFollow = ({
  enabled,
  onEnabledChange,
  message,
  onMessageChange,
  link,
  onLinkChange,
}: AskToFollowProps) => {
  const maxChars = 1000;

  return (
    <div className="bg-white rounded-2xl border border-purple-200 shadow-sm w-full overflow-hidden transition-all duration-200">
      {/* Header section with title and toggle */}
      <div className="flex items-center justify-between px-5 py-4">
        <h3 className="text-sm font-semibold text-slate-800">Ask to Follow</h3>
        <button
          onClick={() => onEnabledChange(!enabled)}
          className={`relative w-12 h-6.5 rounded-full transition-all duration-300 ease-in-out ${
            enabled ? "bg-[#6A06E4]" : "bg-slate-200"
          }`}
          type="button"
        >
          <span
            className={`absolute top-1 left-1 w-4.5 h-4.5 bg-white rounded-full shadow-sm transition-transform duration-300 ease-in-out ${
              enabled ? "translate-x-5.5" : "translate-x-0"
            }`}
          />
        </button>
      </div>

      {enabled && (
        <div className="px-5 pb-5 space-y-4">
          {/* Message input area */}
          <div className="relative bg-[#F8FAFC] rounded-xl p-4 border border-transparent focus-within:border-purple-200 transition-colors">
            <textarea
              value={message}
              onChange={(e) => onMessageChange(e.target.value)}
              placeholder="Enter follow message..."
              className="w-full bg-transparent text-[#334155] text-[15px] leading-relaxed resize-none outline-none min-h-[100px] placeholder:text-slate-400"
              maxLength={maxChars}
            />

            {/* Action buttons and character count inside the message box */}
            <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-100/50">
              <span className="text-[13px] font-medium text-slate-400">
                {message.length}/{maxChars}
              </span>
              <button
                type="button"
                className="text-slate-400 hover:text-[#6A06E4] transition-colors p-1"
              >
                <SmilePlus size={20} />
              </button>
            </div>
          </div>

          {/* Visit Profile / Link display section */}
          <div className="flex items-center justify-between bg-[#F5F3FF] rounded-xl px-4 py-3 border border-purple-50 group transition-all hover:bg-[#EDE9FE]">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center shadow-sm text-[#6A06E4]">
                <LinkIcon size={16} />
              </div>
              <span className="text-sm font-semibold text-[#4F46E5]">
                Visit Profile
              </span>
            </div>

            <button
              type="button"
              className="w-8 h-8 rounded-lg flex items-center justify-center text-[#6A06E4] hover:bg-white transition-all shadow-none hover:shadow-sm"
              onClick={() => {
                const newLink = prompt("Enter profile link:", link);
                if (newLink !== null) onLinkChange(newLink);
              }}
            >
              <Edit2 size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AskToFollow;
