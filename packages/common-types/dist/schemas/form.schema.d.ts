import { z } from "zod";
export declare const FieldTypeSchema: z.ZodEnum<{
  number: "number";
  date: "date";
  url: "url";
  text: "text";
  email: "email";
  phone: "phone";
  location: "location";
  country: "country";
  dropdown: "dropdown";
  checkbox: "checkbox";
  rating: "rating";
  upload: "upload";
}>;
export declare const FormFieldOptionSchema: z.ZodObject<
  {
    id: z.ZodString;
    label: z.ZodString;
  },
  z.core.$strip
>;
export declare const FormFieldSchema: z.ZodObject<
  {
    id: z.ZodString;
    type: z.ZodEnum<{
      number: "number";
      date: "date";
      url: "url";
      text: "text";
      email: "email";
      phone: "phone";
      location: "location";
      country: "country";
      dropdown: "dropdown";
      checkbox: "checkbox";
      rating: "rating";
      upload: "upload";
    }>;
    label: z.ZodString;
    placeholder: z.ZodOptional<z.ZodString>;
    required: z.ZodBoolean;
    options: z.ZodOptional<
      z.ZodArray<
        z.ZodObject<
          {
            id: z.ZodString;
            label: z.ZodString;
          },
          z.core.$strip
        >
      >
    >;
  },
  z.core.$strip
>;
export declare const FormValuesSchema: z.ZodObject<
  {
    title: z.ZodString;
    description: z.ZodString;
    coverImage: z.ZodOptional<z.ZodString>;
    fields: z.ZodArray<
      z.ZodObject<
        {
          id: z.ZodString;
          type: z.ZodEnum<{
            number: "number";
            date: "date";
            url: "url";
            text: "text";
            email: "email";
            phone: "phone";
            location: "location";
            country: "country";
            dropdown: "dropdown";
            checkbox: "checkbox";
            rating: "rating";
            upload: "upload";
          }>;
          label: z.ZodString;
          placeholder: z.ZodOptional<z.ZodString>;
          required: z.ZodBoolean;
          options: z.ZodOptional<
            z.ZodArray<
              z.ZodObject<
                {
                  id: z.ZodString;
                  label: z.ZodString;
                },
                z.core.$strip
              >
            >
          >;
        },
        z.core.$strip
      >
    >;
  },
  z.core.$strip
>;
