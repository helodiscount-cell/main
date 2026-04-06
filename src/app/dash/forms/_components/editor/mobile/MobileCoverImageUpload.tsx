"use client";

import React, { useCallback } from "react";
import Image from "next/image";
import { ImageIcon, Trash2 } from "lucide-react";
import { Controller, useFormContext } from "react-hook-form";
import { useUploadThing } from "@/lib/uploadthing";
import { EDITOR_CANVAS_CONFIG } from "../config";
import type { FormValues } from "@dm-broo/common-types";

export const MobileCoverImageUpload = () => {
  const { control } = useFormContext<FormValues>();

  return (
    <Controller
      name="coverImage"
      control={control}
      render={({ field }) => (
        <MobileCoverArea value={field.value} onChange={field.onChange} />
      )}
    />
  );
};

const MobileCoverArea = ({
  value,
  onChange,
}: {
  value: string | undefined;
  onChange: (url: string | undefined) => void;
}) => {
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
      e.target.value = "";
    },
    [isUploading, startUpload],
  );

  return (
    <div className="relative w-full aspect-video rounded-[24px] overflow-hidden bg-slate-100 group -[0_4px_30px_rgba(0,0,0,0.02)]">
      {/* Background image */}
      {value && <Image src={value} alt="Cover" fill className="object-cover" />}

      {/* Controls Overlay (Always visible on mobile centered) */}
      <div
        className={`absolute inset-0 flex items-center justify-center gap-3 bg-black/10 transition-colors duration-300`}
      >
        <label className="flex items-center gap-2 bg-white/95 rounded-full px-5 py-2.5 text-sm font-bold text-slate-800 -xl border border-white/50 active:scale-95 transition-transform cursor-pointer">
          <ImageIcon size={18} className="text-[#6A06E4]" />
          {isUploading ? "Uploading…" : "Select/Drop an image"}
          <input
            type="file"
            accept="image/*"
            className="sr-only"
            onChange={handleFileChange}
            disabled={isUploading}
          />
        </label>

        {value && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onChange(undefined);
            }}
            className="bg-red-500/90 text-white rounded-xl p-2.5 -lg active:scale-95 transition-transform"
          >
            <Trash2 size={18} />
          </button>
        )}
      </div>
    </div>
  );
};
