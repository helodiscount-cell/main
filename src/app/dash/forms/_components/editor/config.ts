import {
  Type,
  Hash,
  Mail,
  Link,
  Phone,
  MapPin,
  Globe,
  Calendar,
  ChevronDown,
  CheckSquare,
  Star,
  Upload,
  RefreshCw,
  Link2,
  Play,
  Send,
} from "lucide-react";
import type { FieldType } from "@dm-broo/common-types";
import type { LucideIcon } from "lucide-react";

// ------- Header -------

export const EDITOR_HEADER_CONFIG = {
  BREADCRUMB_ROOT: "Forms",
  BREADCRUMB_CURRENT: "Editor",
  PUBLISH_LABEL: "Publish",
  STYLES: {
    PRIMARY: "bg-[#6A06E4] hover:bg-[#5a05c4] text-white gap-2 h-9 px-4",
    ICON: "h-9 w-9 bg-slate-900 hover:bg-slate-700 text-white",
  },
  ICON_SIZE: 15,
} as const;

export type HeaderAction = {
  id: string;
  icon: LucideIcon;
  label: string;
  variant: "icon" | "primary" | "custom";
};

export const HEADER_ACTIONS: HeaderAction[] = [
  { id: "refresh", icon: RefreshCw, label: "", variant: "primary" },
  { id: "copy-link", icon: Link2, label: "Copy Link", variant: "icon" },
  { id: "preview", icon: Play, label: "Preview", variant: "icon" },
  { id: "publish", icon: Send, label: "Publish", variant: "primary" },
];

// ------- Canvas -------

export const EDITOR_CANVAS_CONFIG = {
  COVER_OVERLAY_LABEL: "Select/Drop an image",
  TITLE_PLACEHOLDER: "Add a form title",
  DESCRIPTION_PLACEHOLDER: "Add short description",
  SUBMIT_LABEL: "Submit",
} as const;

// ------- Field picker dialog -------

export type FieldTypeOption = {
  type: FieldType;
  label: string;
  icon: LucideIcon;
};

export type FieldTypeGroup = {
  groupLabel: string;
  options: FieldTypeOption[];
};

export const FIELD_TYPE_GROUPS: FieldTypeGroup[] = [
  {
    groupLabel: "Text Input",
    options: [
      { type: "text", label: "Text", icon: Type },
      { type: "number", label: "Number", icon: Hash },
      { type: "email", label: "Email", icon: Mail },
      { type: "url", label: "URL", icon: Link },
      { type: "phone", label: "Phone", icon: Phone },
    ],
  },
  {
    groupLabel: "Location",
    options: [
      { type: "location", label: "Location", icon: MapPin },
      { type: "country", label: "Country", icon: Globe },
    ],
  },
  {
    groupLabel: "Date",
    options: [{ type: "date", label: "Date", icon: Calendar }],
  },
  {
    groupLabel: "Multiple Element",
    options: [
      { type: "dropdown", label: "Dropdown", icon: ChevronDown },
      { type: "checkbox", label: "Checkbox", icon: CheckSquare },
      { type: "rating", label: "Rating", icon: Star },
    ],
  },
  {
    groupLabel: "Files & Media",
    options: [{ type: "upload", label: "Upload", icon: Upload }],
  },
];

// Labels shown on each FieldCard header for each type
export const FIELD_TYPE_LABELS: Record<FieldType, string> = {
  text: "Text",
  number: "Number",
  email: "Email",
  url: "URL",
  phone: "Phone",
  location: "Location",
  country: "Country",
  date: "Date",
  dropdown: "Dropdown",
  checkbox: "Checkbox",
  rating: "Rating",
  upload: "Upload",
};
