"use client";

import React, { useState, useMemo, useEffect, useRef } from "react";
import { Search, ChevronDown, Check, MapPin } from "lucide-react";
import { COUNTRIES, type Country } from "@/configs/countries";
import { INDIAN_STATES } from "@/configs/india-regions";
import { cn } from "@/server/utils";

interface HierarchicalLocationPickerProps {
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
}

/**
 * Hierarchical Location Picker:
 * 1. Country Selector (Searchable)
 * 2. If India: State & City Searchable Dropdowns
 * 3. If Other: State & City Text Inputs
 */
export const HierarchicalLocationPicker = ({
  value,
  onChange,
  required,
}: HierarchicalLocationPickerProps) => {
  // Parse existing value "City, State, Country"
  const initialParts = value ? value.split(", ").map((p) => p.trim()) : [];
  const [selectedCountry, setSelectedCountry] = useState<string>(
    initialParts.length === 3 ? initialParts[2] : "India",
  );
  const [selectedState, setSelectedState] = useState<string>(
    initialParts.length === 3 ? initialParts[1] : "",
  );
  const [selectedCity, setSelectedCity] = useState<string>(
    initialParts.length === 3 ? initialParts[0] : "",
  );

  // Seed local state from value prop whenever it changes (e.g. form reset or parent update)
  useEffect(() => {
    const parts = value ? value.split(", ").map((p) => p.trim()) : [];
    if (parts.length === 3) {
      if (parts[2] !== selectedCountry) setSelectedCountry(parts[2]);
      if (parts[1] !== selectedState) setSelectedState(parts[1]);
      if (parts[0] !== selectedCity) setSelectedCity(parts[0]);
    } else if (!value) {
      if (selectedCountry !== "India") setSelectedCountry("India");
      if (selectedState !== "") setSelectedState("");
      if (selectedCity !== "") setSelectedCity("");
    }
  }, [value, selectedCountry, selectedState, selectedCity]);

  // Sync back to parent whenever local state changes
  useEffect(() => {
    if (selectedCountry && selectedState && selectedCity) {
      onChange(`${selectedCity}, ${selectedState}, ${selectedCountry}`);
    } else {
      onChange(""); // Keep it empty until fully filled if required
    }
  }, [selectedCountry, selectedState, selectedCity, onChange]);

  const isIndia = selectedCountry.toLowerCase() === "india";

  return (
    <div className="space-y-4 animate-in fade-in duration-300">
      {/* 1. Country Selection */}
      <div className="space-y-1.5">
        <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
          Country
        </label>
        <SearchableSelect
          options={COUNTRIES.map((c) => c.name)}
          value={selectedCountry}
          onChange={(val) => {
            setSelectedCountry(val);
            setSelectedState("");
            setSelectedCity("");
          }}
          placeholder="Select country"
        />
      </div>

      {/* 2. State & City Selection (Conditional) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* State */}
        <div className="space-y-1.5">
          <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            State / Province
          </label>
          {isIndia ? (
            <SearchableSelect
              options={INDIAN_STATES}
              value={selectedState}
              onChange={(val) => {
                setSelectedState(val);
                setSelectedCity("");
              }}
              placeholder="Select state"
              disabled={!selectedCountry}
            />
          ) : (
            <input
              type="text"
              value={selectedState}
              onChange={(e) => setSelectedState(e.target.value)}
              disabled={!selectedCountry}
              placeholder="Enter state"
              className="w-full border border-slate-200 rounded-lg px-4 py-2.5 text-sm text-slate-700 outline-none focus:border-[#6A06E4] focus:ring-1 focus:ring-[#6A06E4] transition-colors disabled:bg-slate-50 disabled:text-slate-400"
            />
          )}
        </div>

        {/* City */}
        <div className="space-y-1.5">
          <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            City
          </label>
          <input
            type="text"
            value={selectedCity}
            onChange={(e) => setSelectedCity(e.target.value)}
            disabled={!selectedState}
            placeholder="Enter city"
            className="w-full border border-slate-200 rounded-lg px-4 py-2.5 text-sm text-slate-700 outline-none focus:border-[#6A06E4] focus:ring-1 focus:ring-[#6A06E4] transition-colors disabled:bg-slate-50 disabled:text-slate-400"
          />
        </div>
      </div>
    </div>
  );
};

/**
 * Reusable Searchable Select Component (similar to CountryPicker but generic)
 */
const SearchableSelect = ({
  options,
  value,
  onChange,
  placeholder,
  disabled,
}: {
  options: string[];
  value: string;
  onChange: (val: string) => void;
  placeholder: string;
  disabled?: boolean;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filtered = useMemo(() => {
    if (!search) return options;
    const s = search.toLowerCase();
    return options.filter((o) => o.toLowerCase().includes(s));
  }, [options, search]);

  return (
    <div className="relative" ref={containerRef}>
      <button
        type="button"
        disabled={disabled}
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full border border-slate-200 rounded-lg px-4 py-2.5 bg-white hover:border-[#6A06E4] transition-colors gap-2 disabled:bg-slate-50 disabled:cursor-not-allowed group"
      >
        <span
          className={cn(
            "text-sm truncate",
            !value ? "text-slate-400" : "text-slate-700 font-medium",
          )}
        >
          {value || placeholder}
        </span>
        <ChevronDown
          size={14}
          className={cn(
            "text-slate-400 transition-transform",
            isOpen && "rotate-180",
            !disabled && "group-hover:text-[#6A06E4]",
          )}
        />
      </button>

      {isOpen && !disabled && (
        <div className="absolute top-full left-0 mt-1 w-full bg-white border border-slate-200 rounded-xl shadow-xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="p-2 border-b border-slate-50 flex items-center gap-2 bg-slate-50/50">
            <Search size={14} className="text-slate-400 shrink-0" />
            <input
              autoFocus
              type="text"
              placeholder="Search..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-transparent border-none outline-none text-sm text-slate-700 placeholder:text-slate-400"
            />
          </div>

          <div className="max-h-52 overflow-y-auto no-scrollbar py-1">
            {filtered.length > 0 ? (
              filtered.map((opt) => (
                <button
                  key={opt}
                  type="button"
                  onClick={() => {
                    onChange(opt);
                    setIsOpen(false);
                    setSearch("");
                  }}
                  className="flex items-center justify-between w-full px-4 py-2 text-sm text-slate-600 hover:bg-[#F7F0FF] hover:text-[#6A06E4] transition-colors text-left"
                >
                  <span
                    className={cn(opt === value && "font-bold text-[#6A06E4]")}
                  >
                    {opt}
                  </span>
                  {opt === value && (
                    <Check size={14} className="text-[#6A06E4]" />
                  )}
                </button>
              ))
            ) : (
              <p className="px-4 py-4 text-xs text-slate-400 text-center">
                No results found
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
