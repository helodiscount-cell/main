"use client";

import React, { useCallback } from "react";
import Image from "next/image";
import { ImageIcon, Trash2 } from "lucide-react";
import { Controller, useFormContext } from "react-hook-form";
import { useUploadThing } from "@/lib/uploadthing";
import { EDITOR_CANVAS_CONFIG } from "./config";
import type { FormValues } from "@dm-broo/common-types";

// Cover image area with upload overlay and delete button
// Uses uploadthing's hook under the hood, fires onChange to react-hook-form
export const CoverImageUpload = () => {
  const { control } = useFormContext<FormValues>();

  return (
    <Controller
      name="coverImage"
      control={control}
      render={({ field }) => (
        <CoverImageArea value={field.value} onChange={field.onChange} />
      )}
    />
  );
};

type CoverImageAreaProps = {
  value: string | undefined;
  onChange: (url: string | undefined) => void;
};

const CoverImageArea = ({ value, onChange }: CoverImageAreaProps) => {
  const { startUpload, isUploading } = useUploadThing("imageUploader", {
    onClientUploadComplete: (res) => {
      if (res[0]?.ufsUrl) onChange(res[0].ufsUrl);
    },
  });

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (isUploading) return;
      const files = Array.from(e.target.files ?? []);
      if (files.length > 0) startUpload(files);
      // Reset input value to allow uploading the same file twice
      e.target.value = "";
    },
    [isUploading, startUpload],
  );

  const handleDelete = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      onChange(undefined);
    },
    [onChange],
  );

  return (
    <div className="relative w-full h-40 rounded-xl overflow-hidden bg-slate-200 group">
      {/* Background image when uploaded */}
      {value && <Image src={value} alt="Cover" fill className="object-cover" />}

      {/* Control overlay — only visible on hover if image exists, always visible if empty */}
      <div
        className={`absolute inset-0 flex items-center justify-center gap-2 ${
          value
            ? "bg-black/0 hover:bg-black/40 opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 focus-within:opacity-100"
            : "bg-black/10"
        } transition-all duration-300`}
      >
        {/* Upload trigger */}
        <label
          className={`flex items-center gap-1.5 bg-white/90 rounded-full px-4 py-2 text-xs font-semibold text-slate-700 transition-all transform ${
            isUploading
              ? "opacity-50 cursor-not-allowed"
              : "hover:bg-white cursor-pointer hover:scale-105 active:scale-95"
          }`}
        >
          <ImageIcon size={14} className="text-[#6A06E4]" />
          {isUploading
            ? "Uploading…"
            : value
              ? "Change Image"
              : EDITOR_CANVAS_CONFIG.COVER_OVERLAY_LABEL}
          <input
            type="file"
            accept="image/*"
            className="sr-only"
            onChange={handleFileChange}
            disabled={isUploading}
          />
        </label>

        {/* Delete button — only shown if image exists */}
        {value && (
          <button
            type="button"
            onClick={handleDelete}
            className="bg-red-500 hover:bg-red-600 rounded-full p-2 transition-all transform hover:scale-105 active:scale-95"
            aria-label="Remove cover image"
          >
            <Trash2 size={14} className="text-white" />
          </button>
        )}
      </div>
    </div>
  );
};
