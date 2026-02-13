"use client";

import React, { useState } from "react";

interface FAQItemProps {
  question: string;
  answer: string;
  isOpen: boolean;
  onToggle: () => void;
}

const FAQItem: React.FC<FAQItemProps> = ({
  question,
  answer,
  isOpen,
  onToggle,
}) => {
  return (
    <div className="border-b border-gray-200 last:border-0">
      <button
        onClick={onToggle}
        className="w-full py-5 px-6 flex justify-between items-center text-left hover:bg-gray-50 transition-colors"
      >
        <span className="text-[18px] font-medium pr-4 text-[#6A06E4]">
          {question}
        </span>
        <svg
          className={`w-6 h-6 text-[#A876E7] transition-transform shrink-0 ${isOpen ? "rotate-180" : ""}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>
      {isOpen && (
        <div className="px-6 pb-5 text-[16px] text-gray-600 leading-relaxed">
          {answer}
        </div>
      )}
    </div>
  );
};

export default FAQItem;
