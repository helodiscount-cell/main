"use client";

import { useController, Control, FieldValues, Path } from "react-hook-form";
import { AddKeywords } from "../widgets";

interface KeywordFields {
  anyKeyword: boolean;
  keywords: string[];
}

interface KeywordsLeftColProps<T extends FieldValues & KeywordFields> {
  control: Control<T>;
}

/**
 * Shared keywords widget for all automation editors.
 * Uses useController internally for cleaner JSX at the call site.
 */
export function KeywordsLeftCol<T extends FieldValues & KeywordFields>({
  control,
}: KeywordsLeftColProps<T>) {
  const { field: anyField } = useController({
    control,
    name: "anyKeyword" as Path<T>,
  });
  const { field: keywordsField } = useController({
    control,
    name: "keywords" as Path<T>,
  });

  return (
    <AddKeywords
      anyKeyword={anyField.value}
      onAnyKeywordChange={anyField.onChange}
      keywords={keywordsField.value}
      onKeywordsChange={keywordsField.onChange}
    />
  );
}
