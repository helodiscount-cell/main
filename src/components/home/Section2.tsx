import React from "react";
import { MessageSquare } from "lucide-react";

const Section2 = () => {
  return (
    <section className="bg-[#FCF9FF] bg-[linear-gradient(to_right,rgba(106,6,228,0.18),transparent_20%,transparent_80%,rgba(106,6,228,0.18))] py-20">
      <div className="">
        <div className="text-box flex flex-col justify-center items-center gap-2 mb-16">
          <div className="flex gap-2">
            <span className="text-[#6A06E4] text-[40px] font-extrabold">
              Level Up
            </span>{" "}
            <span className="text-[40px] font-extrabold">Your Reach</span>
          </div>
          <p className="text-[20px] font-medium text-[#071329]">
            Convert interactions into followers, engagement, and real results.
          </p>
        </div>

        <FeatureCard />
      </div>
    </section>
  );
};

const FeatureCard = () => (
  <div className="relative w-full max-w-[966px] mx-auto p-12 bg-white rounded-3xl border-2 border-purple-200 shadow-lg overflow-visible">
    {/* Grid background */}
    <div className="absolute inset-0 opacity-10">
      <div
        className="w-full h-full"
        style={{
          backgroundImage:
            "linear-gradient(to right, #e5e7eb 1px, transparent 1px), linear-gradient(to bottom, #e5e7eb 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />
    </div>

    <div className="relative grid grid-cols-2 gap-12 items-start">
      {/* Left Content */}
      <div className="space-y-6">
        <h2 className="text-[46px] font-bold text-[#071329] leading-tight">
          Accelerate Your
          <br />
          Follower Growth
        </h2>
        <p className="text-[16px] text-[#071329] leading-relaxed">
          Boost your engagement with smart automation that connects you to every
          user. Grow your community faster while focusing on creating content
          you love.
        </p>

        {/* Avatar circles in a row below text */}
        <div className="flex items-center gap-4 pt-8">
          <div className="w-12 h-12 rounded-full bg-linear-to-br from-pink-300 to-pink-400 border-4 border-white shadow-lg" />
          <div className="w-14 h-14 rounded-full bg-linear-to-br from-purple-400 to-purple-500 border-4 border-white shadow-lg" />
          <div className="w-12 h-12 rounded-full bg-linear-to-br from-gray-300 to-gray-400 border-4 border-white shadow-lg" />
          <div className="w-16 h-16 rounded-full bg-linear-to-br from-orange-300 to-orange-400 border-4 border-white shadow-lg" />
          <div className="w-14 h-14 rounded-full bg-linear-to-br from-orange-400 to-yellow-400 border-4 border-white shadow-lg" />
        </div>
      </div>

      {/* Right Chart Area */}
      <div className="relative h-80">
        {/* Growth Chart SVG */}
        <svg
          className="absolute inset-0 w-full h-full"
          viewBox="0 0 400 320"
          fill="none"
        >
          {/* Growth curve */}
          <path
            d="M 20 280 Q 100 250, 150 200 T 280 100 T 380 40"
            stroke="url(#gradient)"
            strokeWidth="4"
            fill="none"
            strokeLinecap="round"
          />
          <defs>
            <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#a855f7" />
              <stop offset="100%" stopColor="#6366f1" />
            </linearGradient>
          </defs>
        </svg>

        {/* "After" label */}
        <div className="absolute top-8 right-12 flex items-center gap-2 bg-white px-3 py-2 rounded-lg border border-purple-200 shadow-sm">
          <MessageSquare className="w-4 h-4 text-purple-600" />
          <span className="text-sm font-semibold text-gray-900">After</span>
        </div>
      </div>
    </div>
  </div>
);

export default Section2;
