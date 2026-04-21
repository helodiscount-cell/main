import React from "react";
import { CheckCircle2 } from "lucide-react";
import { Invoice } from "../types";

interface BillingHistoryProps {
  invoices: Invoice[];
}

/**
 * BillingHistory Component - Displays a list of recent transactions/invoices.
 */
export function BillingHistory({ invoices }: BillingHistoryProps) {
  return (
    <div className="w-full bg-white border border-[#E5E7EB] rounded-xl p-8 h-full flex flex-col">
      <h3 className="text-lg font-semibold text-[#111827] tracking-tight">
        History
      </h3>

      <div className="flex flex-col">
        {invoices.length === 0 ? (
          <p className="text-slate-400 text-sm italic">
            No transaction history found.
          </p>
        ) : (
          invoices.map((invoice, index) => (
            <div key={invoice.id}>
              <div className="flex items-center justify-between py-4">
                <span className="text-[15px] font-medium text-[#111827] font-mono">
                  {invoice.id}
                </span>
                <div className="flex items-center gap-2">
                  <div className="bg-[#DCFCE7] p-0.5 rounded-full">
                    <CheckCircle2
                      size={16}
                      className="text-[#16A34A] fill-[#16A34A]/10"
                    />
                  </div>
                  <span className="text-[14px] font-bold text-[#16A34A] capitalize">
                    {invoice.status}
                  </span>
                </div>
              </div>
              {index < invoices.length - 1 && (
                <div className="h-px w-full bg-[#F3F4F6]" />
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
