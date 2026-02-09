import React from "react";
import Image from "next/image";

const HeroSection = () => {
  return (
    <div className="relative flex flex-col gap-8 bg-slate-900 h-screen w-full overflow-hidden">
      <div className="info flex flex-col gap-8 justify-center items-center mt-8 z-10">
        <p className="text-lg font-bold text-[#AA64FF] tracking-[9px]">
          MESSAGE MATE
        </p>
        <p className="text-4xl font-bold text-white">Seamless Conversations.</p>
        <button className="bg-[#6A06E4] text-lg font-medium text-white px-4 py-2 rounded-full">
          Start for free
        </button>
      </div>

      {/* Message Card positioned absolutely */}
      <div className="absolute left-[329px] top-[400px]">
        <MessageCard />
      </div>

      <div className="absolute right-[300px] bottom-[300px]">
        <DmCard />
      </div>
    </div>
  );
};

const MessageCard = () => (
  <div
    className="w-[250px] p-4 bg-white/90 backdrop-blur-[5px] border border-white rounded-[15px] shadow-lg"
    style={{
      backdropFilter: "blur(5px)",
      WebkitBackdropFilter: "blur(5px)",
    }}
  >
    <div className="flex items-start gap-3">
      <div className="w-10 h-10 rounded-full bg-linear-to-br from-purple-400 to-pink-400 shrink-0" />
      <div className="flex-1">
        <p className="text-sm font-semibold text-gray-900">jani d/5</p>
        <p className="text-sm text-gray-700 mt-1">Send me the link</p>
        <button className="text-xs text-gray-500 mt-2 hover:text-gray-700">
          Reply
        </button>
      </div>
    </div>
  </div>
);

const DmCard = () => (
  <div
    className="w-[250px] p-4 bg-white/90 backdrop-blur-[5px] border border-white rounded-[15px] shadow-lg"
    style={{
      backdropFilter: "blur(5px)",
      WebkitBackdropFilter: "blur(5px)",
    }}
  >
    <div className="flex flex-col gap-4">
      <p className="text-[16px] font-medium text-black">
        Here's your link! Enjoy your trial
      </p>
      <button className="bg-[#6A06E4] text-lg font-medium text-white px-4 py-2 rounded-lg">
        Get Trial
      </button>
    </div>
  </div>
);

export default HeroSection;
