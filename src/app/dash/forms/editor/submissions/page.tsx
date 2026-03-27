"use client";

import React from "react";
import { Inbox } from "lucide-react";

/**
 * Empty submissions view for new forms.
 */
export default function NewFormSubmissionsPage() {
  return (
    <div className="flex flex-col items-center justify-center h-full py-32 gap-4 text-slate-400">
      <div className="w-16 h-16 rounded-full bg-slate-50 flex items-center justify-center border border-dashed border-slate-200">
        <Inbox size={24} className="text-slate-300" />
      </div>
      <div className="text-center">
        <h3 className="text-sm font-semibold text-slate-600">
          No submissions yet
        </h3>
        <p className="text-xs max-w-[200px]">
          Save and publish your form to start collecting responses.
        </p>
      </div>
    </div>
  );
}
