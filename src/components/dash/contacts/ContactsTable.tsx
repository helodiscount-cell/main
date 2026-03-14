import React from "react";
import { ArrowDown } from "lucide-react";
import { CONTACTS_CONFIG } from "./config";
import { MOCK_CONTACTS } from "./mockData";
import { Contact } from "./types";
import Image from "next/image";

export const ContactsTable = () => {
  return (
    <div className="bg-white rounded-xl overflow-hidden flex-1 mt-4 flex flex-col pt-2">
      {/* Table header */}
      <div className="grid grid-cols-[1.5fr_1.5fr_auto_1fr] items-center px-6 py-4 border-b border-slate-100">
        <span className="text-sm font-medium text-slate-500">
          {CONTACTS_CONFIG.COLUMNS[0].label}
        </span>
        <span className="text-sm font-medium text-slate-500 text-center">
          {CONTACTS_CONFIG.COLUMNS[1].label}
        </span>
        <div className="w-px h-4 bg-slate-200 mx-4" />
        <div className="flex items-center gap-2 justify-center">
          <span className="text-sm font-medium text-slate-500">
            {CONTACTS_CONFIG.COLUMNS[2].label}
          </span>
          <div className="bg-slate-900 rounded-full p-0.5 mt-0.5">
            <ArrowDown className="text-white w-3 h-3" />
          </div>
        </div>
      </div>

      {/* Rows */}
      <div className="flex-1 overflow-auto">
        {MOCK_CONTACTS.length === 0 ? (
          <div className="flex items-center justify-center py-16 text-sm text-slate-400">
            {CONTACTS_CONFIG.EMPTY_STATE_MESSAGE}
          </div>
        ) : (
          MOCK_CONTACTS.map((contact, index) => (
            <div key={contact.id}>
              <div className="grid grid-cols-[1.5fr_1.5fr_auto_1fr] items-center px-6 py-4">
                {/* Username Column */}
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full overflow-hidden bg-slate-100 border border-slate-200 shrink-0 relative">
                    {/* Replaced img with Next.js Image or standard img. For now img to avoid domain issues */}
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={contact.avatarUrl}
                      alt={contact.username}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <span className="text-sm font-medium text-slate-700">
                    {contact.username}
                  </span>
                </div>

                {/* Email Column */}
                <span
                  className={`text-sm text-center ${
                    contact.email ? "text-slate-400" : "text-slate-300"
                  }`}
                >
                  {contact.email || "Not Found"}
                </span>

                {/* Separator Column */}
                <div className="w-px h-4 bg-slate-200 mx-4" />

                {/* Last Interacted Column */}
                <span className="text-sm text-slate-700 text-center font-medium">
                  {contact.lastInteractedAt}
                </span>
              </div>
              {/* Add a divider below row only if it's not the last one, wait, the screenshot shows full width dividers */}
              {index < MOCK_CONTACTS.length - 1 && (
                <div className="border-b border-slate-50 mx-6" />
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};
