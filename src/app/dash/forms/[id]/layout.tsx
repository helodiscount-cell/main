"use client";

import React, { use } from "react";
import { BaseFormLayout } from "../_components/editor";

export default function FormDetailLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);

  return <BaseFormLayout formId={id}>{children}</BaseFormLayout>;
}
