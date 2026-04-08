"use client";

import React from "react";
import {
  ArrowDown,
  Loader2,
  ChevronLeft,
  ChevronRight,
  User,
} from "lucide-react";
import { CONTACTS_CONFIG } from "./config";
import { useContacts } from "@/hooks/use-contacts";

export const ContactsTable = () => {
  const {
    contacts,
    isLoading,
    isError,
    refetch,
    handleNext,
    handlePrev,
    canGoNext,
    canGoPrev,
    currentPage,
  } = useContacts();

  if (isLoading) {
    return (
      <div className="bg-white rounded-xl flex-1 mt-4 flex flex-col items-center justify-center p-12">
        <Loader2 className="w-8 h-8 text-purple-600 animate-spin mb-4" />
        <p className="text-sm font-medium text-slate-500">
          Loading contacts...
        </p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="bg-white rounded-xl flex-1 mt-4 flex flex-col items-center justify-center p-12 border border-red-100">
        <p className="text-sm font-medium text-red-500">
          Failed to load contacts.
        </p>
        <button
          onClick={() => refetch()}
          className="mt-4 px-4 py-2 bg-slate-100 text-slate-700 rounded-lg text-sm hover:bg-slate-200 transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl overflow-hidden flex-1 mt-4 flex flex-col pt-2 border border-slate-100">
      {/* Table header */}
      <div className="grid grid-cols-[1.5fr_0.8fr_auto_1.5fr_auto_1fr] items-center px-6 py-4 border-b border-slate-100">
        <span className="text-sm font-medium text-slate-500">
          {CONTACTS_CONFIG.COLUMNS[0].label}
        </span>
        <span className="text-sm font-medium text-slate-500 text-center">
          {CONTACTS_CONFIG.COLUMNS[1].label}
        </span>
        <div className="w-px h-4 bg-slate-200 mx-4" />
        <span className="text-sm font-medium text-slate-500 text-center">
          {CONTACTS_CONFIG.COLUMNS[2].label}
        </span>
        <div className="w-px h-4 bg-slate-200 mx-4" />
        <div className="flex items-center gap-2 justify-center">
          <span className="text-sm font-medium text-slate-500">
            {CONTACTS_CONFIG.COLUMNS[3].label}
          </span>
          <div className="bg-slate-900 rounded-full p-0.5 mt-0.5">
            <ArrowDown className="text-white w-3 h-3" />
          </div>
        </div>
      </div>

      {/* Rows */}
      <div className="flex-1 overflow-auto">
        {contacts.length === 0 ? (
          <div className="flex items-center justify-center py-16 text-sm text-slate-400">
            {CONTACTS_CONFIG.EMPTY_STATE_MESSAGE}
          </div>
        ) : (
          contacts.map((contact, index) => (
            <div key={contact.id}>
              <div className="grid grid-cols-[1.5fr_0.8fr_auto_1.5fr_auto_1fr] items-center px-6 py-4 group hover:bg-slate-50/50 transition-colors">
                {/* Username Column */}
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full overflow-hidden bg-slate-50 border border-slate-200 shrink-0 relative flex items-center justify-center">
                    {contact.avatarUrl ? (
                      <img
                        src={contact.avatarUrl}
                        alt={contact.username}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <User
                        className="w-4 h-4 text-slate-300"
                        strokeWidth={2.5}
                      />
                    )}
                  </div>
                  <span className="text-sm font-medium text-slate-700">
                    {contact.username}
                  </span>
                </div>

                {/* Type Column */}
                <span className="text-sm text-center font-semibold text-purple-600">
                  {contact.type}
                </span>

                {/* Separator Column 1 */}
                <div className="w-px h-4 bg-slate-200 mx-4" />

                {/* Email Column */}
                <span
                  className={`text-sm text-center ${
                    contact.email ? "text-slate-400" : "text-slate-300"
                  }`}
                >
                  {contact.email || "Not Found"}
                </span>

                {/* Separator Column 2 */}
                <div className="w-px h-4 bg-slate-200 mx-4" />

                {/* Last Interacted Column */}
                <span className="text-sm text-slate-700 text-center font-medium">
                  {contact.lastInteractedAt}
                </span>
              </div>
              {/* Divider */}
              {index < contacts.length - 1 && (
                <div className="border-b border-slate-50 mx-6" />
              )}
            </div>
          ))
        )}
      </div>

      {/* Pagination Footer */}
      <div className="flex items-center justify-between px-6 py-4 border-t border-slate-100 bg-slate-50/50">
        <span className="text-xs text-slate-500 font-medium">
          Page {currentPage}
        </span>
        <div className="flex items-center gap-2">
          <button
            onClick={handlePrev}
            disabled={!canGoPrev}
            title="Previous Page"
            className="p-1.5 rounded-lg border border-slate-200 bg-white disabled:opacity-30 disabled:cursor-not-allowed hover:bg-slate-50 transition-all active:scale-95"
          >
            <ChevronLeft size={18} className="text-slate-600" />
          </button>
          <button
            onClick={handleNext}
            disabled={!canGoNext}
            title="Next Page"
            className="p-1.5 rounded-lg border border-slate-200 bg-white disabled:opacity-30 disabled:cursor-not-allowed hover:bg-slate-50 transition-all active:scale-95"
          >
            <ChevronRight size={18} className="text-slate-600" />
          </button>
        </div>
      </div>
    </div>
  );
};
