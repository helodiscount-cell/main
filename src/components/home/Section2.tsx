import React from "react";
import { MessageSquare } from "lucide-react";
import PlaceHolderImage1 from "@/assets/homepage/@2x/Ellipse 10@2x.png";
import PlaceHolderImag2 from "@/assets/homepage/@2x/Ellipse 12@2x.png";
import PlaceHolderImage3 from "@/assets/homepage/@2x/Ellipse 9@2x.png";
import PlaceHolderImage4 from "@/assets/homepage/@2x/NoPath - Copy (2)@2x.png";
import PlaceHolderImage5 from "@/assets/homepage/@2x/NoPath - Copy (3)@2x.png";
import GridPattern from "@/assets/svgs/Group 18.svg";
import Image from "next/image";
import GrowthLine from "../icons/GrowthLine";

const Section2 = () => {
  return (
    <section className="py-20">
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
  <div className="relative w-full max-w-[966px] mx-auto p-12 bg-white rounded-3xl border-2 border-purple-200   overflow-visible">
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
      <div className="space-y-6 z-10">
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
        <div className="flex items-center gap-7 pt-8">
          {[
            PlaceHolderImage1,
            PlaceHolderImag2,
            PlaceHolderImage3,
            PlaceHolderImage4,
            PlaceHolderImage5,
          ].map((image, index) => (
            <Image
              key={index}
              width={60}
              height={60}
              src={image}
              alt=""
              className={`mb-${index % 2 === 0 ? 0 : 16} ml-2`}
            />
          ))}
        </div>
      </div>

      {/* Right Chart Area */}
      <div className="relative h-full">
        <Image src={GridPattern} fill alt="" />
        {/* Growth Chart SVG */}
        <GrowthLine className="absolute top-10" />

        {/* "After" label */}
        <div className="absolute top-8 right-12 flex items-center gap-2 bg-white px-3 py-2 rounded-lg border border-purple-200">
          <span className="text-sm font-semibold text-gray-900">After</span>
          <MessageSquare className="w-4 h-4 text-purple-600" />
        </div>
      </div>
    </div>
  </div>
);

export default Section2;
