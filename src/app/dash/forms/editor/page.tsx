import React from "react";
import { FormEditorCanvas } from "../_components/editor";

// Editor page — header is rendered inside FormEditorCanvas so it has access to save callbacks
const FormEditorPage = () => {
  return (
    <div className="flex flex-col h-full">
      {/* Canvas — contains its own header with save/publish wired */}
      <FormEditorCanvas />
    </div>
  );
};

export default FormEditorPage;
