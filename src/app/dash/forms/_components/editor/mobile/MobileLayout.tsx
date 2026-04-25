import { FormTabs } from "../FormTabs";
import { MobileEditorHeader } from "./MobileEditorHeader";
import { PatternedBackground } from "./PatternedBackground";

export default function MobileLayout({
  formId,
  activeTab,
  children,
}: {
  formId?: string;
  activeTab: "editor" | "submissions";
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-4 bg-[#F3F4F6] min-h-screen">
      <MobileEditorHeader formId={formId} activeTab={activeTab} />
      <FormTabs formId={formId} activeTab={activeTab} />
      <PatternedBackground>
        <div className="flex-1">
          <div className="rounded-3xl border border-slate-100 overflow-hidden">
            {children}
          </div>
        </div>
      </PatternedBackground>
    </div>
  );
}
