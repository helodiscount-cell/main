"use client";

import React from "react";
import { FormEditorCanvas } from "../_components/editor";
import { MobileFormEditorCanvas } from "../_components/editor/mobile/MobileFormEditorCanvas";
import { useIsMobile } from "@/hooks/use-mobile";

/**
 * FormEditorPage is the main entry for the form maker view.
 * It is wrapped by FormEditorLayout which provides the header and tab navigation.
 */
const FormEditorPage = () => {
  const isMobile = useIsMobile();
  return isMobile ? <MobileFormEditorCanvas /> : <FormEditorCanvas />;
};

export default FormEditorPage;
