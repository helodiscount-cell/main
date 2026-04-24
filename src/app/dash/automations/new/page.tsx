import React from "react";
import Image from "next/image";
import MobilePhone from "@/assets/stock-images/Screenshot_20251106_001211_Instagram@2x.png";
import { CreateAutomationModal } from "@/components/dash/automations/create";
import { PlusIcon } from "lucide-react";

const NewAutomationPage = () => {
  return (
    <div className="relative w-full h-full flex items-center overflow-hidden bg-white justify-evenly rounded-3xl">
      {/* ── Layer 1: Full-width purple-to-white gradient ── */}
      <div className="absolute inset-0 bg-linear-to-r from-[#7c22e8] via-[#a855f7]/60 to-white h-full w-full" />

      {/* ── Layer 2: Phone + concentric dashed strokes ── */}
      <div className="inset-0 flex items-center">
        <div className="relative flex items-center justify-center w-full">
          {/* Stroke 4 — outermost */}
          <div className="absolute w-[660px] h-[840px] rounded-[72px] border border-dashed border-white/15" />
          {/* Stroke 3 */}
          <div className="absolute w-[580px] h-[760px] rounded-[60px] border border-dashed border-white/25" />
          {/* Stroke 2 */}
          <div className="absolute w-[500px] h-[680px] rounded-[50px] border border-dashed border-white/38" />
          {/* Stroke 1 — closest to phone */}
          <div className="absolute w-[420px] h-[600px] rounded-[40px] border border-dashed border-white/[0.55]" />
          <div className="absolute w-[320px] h-[500px] rounded-[40px] border border-dashed border-white/[0.55]" />

          {/* Phone image — natural size, no wrapper frame */}
          <Image
            src={MobilePhone}
            alt="Instagram DM automation preview"
            height={580}
            className="drop-shadow-[0_24px_72px_rgba(80,0,180,0.38)]"
          />
        </div>
      </div>

      {/* ── Layer 3: Right-side text content ── */}
      <div className="relative z-10 flex flex-col gap-5 items-center">
        <h1 className="text-2xl font-bold text-[#071329] leading-tight tracking-tight">
          Launch your first automation
        </h1>
        <p className="text-sm text-[#3A3A3A] font-medium leading-relaxed text-center">
          Automate conversations and watch your
          <br />
          DMs do the work for you
        </p>
        <CreateAutomationModal>
          <button className="mt-1 w-fit flex items-center gap-3 bg-[#7c3aed] hover:bg-[#6d28d9] active:bg-[#5b21b6] text-white font-semibold text-[0.95rem] px-6 py-3.5 rounded-md transition-all duration-200 cursor-pointer">
            <PlusIcon />
            Start Automating
          </button>
        </CreateAutomationModal>
      </div>
    </div>
  );
};

export default NewAutomationPage;
