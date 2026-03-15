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
      const files = Array.from(e.target.files ?? []);
      if (files.length > 0) startUpload(files);
    },
    [startUpload],
  );

  const handleDelete = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      onChange(undefined);
    },
    [onChange],
  );

  return (
    <div className="relative w-full h-40 rounded-xl overflow-hidden bg-slate-200">
      {/* Background image when uploaded */}
      {value && <Image src={value} alt="Cover" fill className="object-cover" />}

      {/* Dark overlay on hover to show controls */}
      <div className="absolute inset-0 flex items-center justify-center gap-2 bg-black/20 group hover:bg-black/40 transition-colors">
        {/* Upload trigger */}
        <label className="flex items-center gap-1.5 bg-white/80 hover:bg-white rounded-full px-3 py-1.5 text-xs font-medium text-slate-700 cursor-pointer transition-colors">
          <ImageIcon size={13} className="text-[#6A06E4]" />
          {isUploading
            ? "Uploading…"
            : EDITOR_CANVAS_CONFIG.COVER_OVERLAY_LABEL}
          <input
            type="file"
            accept="image/*"
            className="sr-only"
            onChange={handleFileChange}
          />
        </label>

        {/* Delete button — only shown if image exists */}
        {value && (
          <button
            type="button"
            onClick={handleDelete}
            className="bg-red-500/80 hover:bg-red-500 rounded-full p-1.5 transition-colors"
            aria-label="Remove cover image"
          >
            <Trash2 size={13} className="text-white" />
          </button>
        )}
      </div>
    </div>
  );
};
