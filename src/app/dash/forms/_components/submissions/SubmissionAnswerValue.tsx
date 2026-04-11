"use client";

import React, { useState } from "react";
import { Download, FileDown } from "lucide-react";
import { isImageUrl, isUrl, getFileNameFromUrl } from "./submission-utils";

interface SubmissionAnswerValueProps {
  value: string | string[];
}

// Triggers a programmatic download without opening a new tab
const triggerDownload = (url: string, filename: string): void => {
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.target = "_blank";
  anchor.rel = "noopener noreferrer";
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
};

// Image card with a download button that appears on hover
const ImageAnswer = ({ url }: { url: string }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [hasError, setHasError] = useState(false);
  const filename = getFileNameFromUrl(url);

  // If the image fails to load (e.g. it's actually a PDF or Zip from utfs.io), fallback to file view
  if (hasError) {
    return <FileAnswer url={url} />;
  }

  return (
    <div
      className="relative mt-2 rounded-xl overflow-hidden border border-slate-100 cursor-pointer group"
      style={{ maxWidth: "100%", maxHeight: 240 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={url}
        alt="Uploaded image"
        onError={() => setHasError(true)}
        className="w-full h-auto object-cover rounded-xl"
        style={{ maxHeight: 240 }}
      />

      {/* Hover overlay */}
      <div
        className="absolute inset-0 flex items-center justify-center rounded-xl transition-all duration-200"
        style={{
          background: isHovered ? "rgba(0,0,0,0.45)" : "transparent",
          pointerEvents: isHovered ? "auto" : "none",
          opacity: isHovered ? 1 : 0,
        }}
      >
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            triggerDownload(url, filename);
          }}
          className="flex items-center gap-2 px-4 py-2 bg-white text-slate-800 text-xs font-bold rounded-md hover:bg-[#6A06E4] hover:text-white transition-colors"
        >
          <Download size={13} />
          Download
        </button>
      </div>
    </div>
  );
};

// Generic file download button for non-image uploads
const FileAnswer = ({ url }: { url: string }) => {
  const filename = getFileNameFromUrl(url);

  return (
    <div className="mt-2 flex items-center justify-between gap-2 px-3 py-2.5 bg-[#EDE9FF] rounded-xl border border-[#D6CFFF]">
      <div className="flex items-center gap-2 min-w-0">
        <FileDown size={15} className="text-[#6A06E4] shrink-0" />
        <span className="text-xs font-semibold text-slate-700 truncate">
          {filename !== "download" ? filename : "Uploaded File"}
        </span>
      </div>
      <button
        type="button"
        onClick={() => triggerDownload(url, filename)}
        className="flex items-center gap-1.5 px-3 py-1.5 bg-[#6A06E4] text-white text-xs font-bold rounded-md hover:bg-[#5505C0] transition-colors shrink-0"
      >
        <Download size={11} />
        Download
      </button>
    </div>
  );
};

// Internal renderer for a single value (string)
const SingleAnswerValue = ({ val }: { val: string }) => {
  if (!val || val === "—") {
    return (
      <p className="text-sm font-semibold text-slate-800 leading-relaxed">—</p>
    );
  }

  if (isImageUrl(val)) {
    return <ImageAnswer url={val} />;
  }

  if (isUrl(val)) {
    return <FileAnswer url={val} />;
  }

  return (
    <p className="text-sm font-semibold text-slate-800 break-all leading-relaxed">
      {val}
    </p>
  );
};

// Decides which renderer to use based on the answer value
export const SubmissionAnswerValue = ({
  value,
}: SubmissionAnswerValueProps) => {
  if (Array.isArray(value)) {
    return (
      <div className="space-y-2">
        {value.map((v, i) => (
          <SingleAnswerValue key={i} val={v} />
        ))}
      </div>
    );
  }

  return <SingleAnswerValue val={value} />;
};
