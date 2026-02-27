"use client";

import { ImageIcon, X, SmilePlus, ChevronUp, ChevronDown } from "lucide-react";
import { useRef, useState } from "react";

const MAX_CHARS = 1000;

type Props = {
  message: string;
  onMessageChange: (msg: string) => void;
};

const SendDm = ({ message, onMessageChange }: Props) => {
  const [collapsed, setCollapsed] = useState(false);
  const [media, setMedia] = useState<File | null>(null);
  const [mediaPreview, setMediaPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setMedia(file);
    setMediaPreview(URL.createObjectURL(file));
  };

  const removeMedia = () => {
    setMedia(null);
    setMediaPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (!file) return;
    setMedia(file);
    setMediaPreview(URL.createObjectURL(file));
  };

  return (
    <div className="bg-white rounded-xl border border-purple-300 w-full overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3.5">
        <span className="text-sm font-semibold text-slate-800">Send a DM</span>
        <button
          onClick={() => setCollapsed((c) => !c)}
          className="text-slate-400 hover:text-slate-600 transition-colors"
        >
          {collapsed ? <ChevronDown size={18} /> : <ChevronUp size={18} />}
        </button>
      </div>

      {!collapsed && (
        <div className="px-4 pb-4 space-y-3">
          {/* Media upload area */}
          {!mediaPreview ? (
            <div
              onClick={() => fileInputRef.current?.click()}
              onDrop={handleDrop}
              onDragOver={(e) => e.preventDefault()}
              className="flex items-center justify-center gap-2 border border-dashed border-purple-300 rounded-lg py-3 cursor-pointer hover:bg-purple-50 transition-colors"
            >
              <ImageIcon size={16} className="text-slate-400" />
              <span className="text-sm text-slate-400">
                Select/Drop an image
              </span>
            </div>
          ) : (
            <div className="relative rounded-lg overflow-hidden border border-purple-200">
              {media?.type.startsWith("video/") ? (
                <video
                  src={mediaPreview}
                  className="w-full max-h-40 object-cover"
                  controls
                />
              ) : (
                <img
                  src={mediaPreview}
                  alt="Preview"
                  className="w-full max-h-40 object-cover"
                />
              )}
              <button
                onClick={removeMedia}
                className="absolute top-1.5 right-1.5 bg-white rounded-full p-0.5 shadow text-slate-500 hover:text-red-400 transition-colors"
              >
                <X size={14} />
              </button>
            </div>
          )}

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*,video/*"
            className="hidden"
            onChange={handleFileChange}
          />

          {/* Message textarea */}
          <div className="bg-[#F5F5F5] rounded-lg px-3 pt-3 pb-2">
            <div className="flex items-start gap-2">
              <textarea
                value={message}
                onChange={(e) =>
                  onMessageChange(e.target.value.slice(0, MAX_CHARS))
                }
                placeholder="Enter your message here..."
                rows={3}
                className="flex-1 bg-transparent text-sm text-slate-700 placeholder:text-slate-400 outline-none resize-none"
              />
              <button className="text-slate-400 hover:text-slate-600 transition-colors mt-0.5 shrink-0">
                <SmilePlus size={18} />
              </button>
            </div>
            <div className="text-xs text-slate-400 text-left mt-1">
              {message.length}/{MAX_CHARS}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SendDm;
