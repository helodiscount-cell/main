"use client";

import { Plus, Trash2, SmilePlus } from "lucide-react";
import { useRef, useState, KeyboardEvent } from "react";

type Reply = {
  id: string;
  text: string;
};

type Props = {
  enabled: boolean;
  onEnabledChange: (enabled: boolean) => void;
  replies: Reply[];
  onRepliesChange: (replies: Reply[]) => void;
};

const PublicReplyToComments = ({
  enabled,
  onEnabledChange,
  replies,
  onRepliesChange,
}: Props) => {
  const [showInput, setShowInput] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const addReply = () => {
    const trimmed = inputValue.trim();
    if (trimmed) {
      onRepliesChange([...replies, { id: crypto.randomUUID(), text: trimmed }]);
    }
    setInputValue("");
    setShowInput(false);
  };

  const removeReply = (id: string) => {
    onRepliesChange(replies.filter((r) => r.id !== id));
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") addReply();
    if (e.key === "Escape") {
      setShowInput(false);
      setInputValue("");
    }
  };

  const handleAddClick = () => {
    setShowInput(true);
    setTimeout(() => inputRef.current?.focus(), 50);
  };

  return (
    <div className="bg-white rounded-xl border border-purple-300 w-full overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3.5">
        <span className="text-sm font-semibold text-slate-800">
          Public Reply to Comment
        </span>
        <button
          type="button"
          onClick={() => onEnabledChange(!enabled)}
          className={`relative w-11 h-6 rounded-full transition-colors duration-200 ${
            enabled ? "bg-[#6A06E4]" : "bg-slate-200"
          }`}
        >
          <span
            className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-200 ${
              enabled ? "translate-x-5" : "translate-x-0"
            }`}
          />
        </button>
      </div>

      {enabled && (
        <div className="px-4 pb-4 space-y-2">
          {replies.map((reply) => (
            <div
              key={reply.id}
              className="flex items-center gap-2 bg-[#F5F5F5] rounded-lg px-3 py-2.5"
            >
              <span className="flex-1 text-sm text-slate-700 truncate">
                {reply.text}
              </span>
              <button
                type="button"
                className="text-slate-400 hover:text-slate-600 transition-colors shrink-0"
              >
                <SmilePlus size={16} />
              </button>
              <button
                type="button"
                className="text-slate-400 hover:text-red-400 transition-colors shrink-0"
              >
                <Trash2 size={15} />
              </button>
            </div>
          ))}

          {showInput && (
            <div className="flex items-center gap-2 bg-[#F5F5F5] rounded-lg px-3 py-2.5 border border-purple-300">
              <input
                ref={inputRef}
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                onBlur={addReply}
                placeholder="Type a reply…"
                className="flex-1 bg-transparent text-sm text-slate-700 placeholder:text-slate-400 outline-none"
              />
            </div>
          )}

          {!showInput && (
            <button
              type="button"
              onClick={handleAddClick}
              className="flex items-center gap-1.5 text-sm font-medium text-[#6A06E4] hover:text-[#5a05c4] transition-colors pt-1"
            >
              <Plus size={15} />
              Add Public Reply
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default PublicReplyToComments;
