import {
  Type,
  Hash,
  Mail,
  Link,
  Phone,
  MapPin,
  Calendar,
  ChevronDown,
  CheckSquare,
  Star,
  Upload,
} from "lucide-react";
import type { FieldType } from "@dm-broo/common-types";
import type { LucideIcon } from "lucide-react";

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
    options: [{ type: "location", label: "Location", icon: MapPin }],
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
  date: "Date",
  dropdown: "Dropdown",
  checkbox: "Checkbox",
  rating: "Rating",
  upload: "Upload",
};
