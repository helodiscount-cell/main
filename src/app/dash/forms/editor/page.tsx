"use client";

import React from "react";
import { FormEditorCanvas } from "../_components/editor";

/**
 * FormEditorPage is the main entry for the form maker view.
 * It is wrapped by FormEditorLayout which provides the header and tab navigation.
 */
const FormEditorPage = () => {
  return <FormEditorCanvas />;
};

export default FormEditorPage;
