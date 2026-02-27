import React from "react";
import TestimonyCard from "./TestimonyCard";
import PlaceHolderImage1 from "@/assets/homepage/@2x/Ellipse 10@2x.png";
import PlaceHolderImag2 from "@/assets/homepage/@2x/Ellipse 12@2x.png";
import PlaceHolderImage3 from "@/assets/homepage/@2x/Ellipse 9@2x.png";
import PlaceHolderImage4 from "@/assets/homepage/@2x/NoPath - Copy (2)@2x.png";
import PlaceHolderImage5 from "@/assets/homepage/@2x/NoPath - Copy (3)@2x.png";
import PlaceHolderImage6 from "@/assets/homepage/@2x/NoPath - Copy (4)@2x.png";
import PlaceHolderImage7 from "@/assets/homepage/@2x/Rectangle 63@2x-2.png";
import PlaceHolderImage8 from "@/assets/homepage/@2x/Rectangle 63@2x-3.png";

import Image from "next/image";

const Testimony = () => {
  const testimonies = [
    {
      name: "Neha R.",
      role: "Fashion Creator",
      text: "XXXXX has been a game-changer for me. It saves me over 40 hours every week because I no longer have to reply to every DM manually.",
      imageSrc: PlaceHolderImage3,
    },
    {
      name: "Neha R.",
      role: "Fashion Creator",
      text: "XXXXX has been a game-changer for me. It saves me over 40 hours every week because I no longer have to reply to every DM manually.",
      imageSrc: PlaceHolderImage5,
    },
    {
      name: "Neha R.",
      role: "Fashion Creator",
      text: "XXXXX has been a game-changer for me. It saves me over 40 hours every week because I no longer have to reply to every DM manually.",
      imageSrc: PlaceHolderImage6,
    },
    {
      name: "Neha R.",
      role: "Fashion Creator",
      text: "XXXXX has been a game-changer for me. It saves me over 40 hours every week because I no longer have to reply to every DM manually.",
      imageSrc: PlaceHolderImage1,
    },
  ];

  return (
    <section className="w-full py-20 px-5 relative">
      <div className="text-box flex flex-col justify-center items-center gap-2 mb-16">
        <div className="flex gap-2">
          <span className="text-[#6A06E4] text-[40px] font-extrabold">
            What Creators
          </span>{" "}
          <span className="text-[40px] font-extrabold"> Are Saying?</span>
        </div>
        <p className="text-[20px] font-medium text-[#071329] text-center">
          See how creators are saving time, boosting engagement, <br /> and
          growing their audience with our tool.
        </p>
      </div>

      <div className="relative w-full max-w-[1200px] h-[600px] mx-auto">
        {/* Center Icon */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120px] h-[120px] flex items-center justify-center bg-gradient-to-br from-[#A876E7]/10 to-[#6A06E4]/10 rounded-3xl z-10">
          <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
            <rect
              width="80"
              height="80"
              rx="20"
              fill="url(#gradient)"
              fillOpacity="0.1"
            />
            <path
              d="M30 35H50M30 45H42M25 55H55C57.7614 55 60 52.7614 60 50V30C60 27.2386 57.7614 25 55 25H25C22.2386 25 20 27.2386 20 30V50C20 52.7614 22.2386 55 25 55Z"
              stroke="#A876E7"
              strokeWidth="3"
              strokeLinecap="round"
            />
            <defs>
              <linearGradient id="gradient" x1="0" y1="0" x2="80" y2="80">
                <stop offset="0%" stopColor="#A876E7" />
                <stop offset="100%" stopColor="#6A06E4" />
              </linearGradient>
            </defs>
          </svg>
        </div>

        {/* Cards */}
        <TestimonyCard {...testimonies[0]} className="top-10 left-[60px]" />
        <TestimonyCard {...testimonies[1]} className="top-20 right-20" />
        <TestimonyCard {...testimonies[2]} className="bottom-20 left-20" />
        <TestimonyCard {...testimonies[3]} className="bottom-10 right-[60px]" />

        {/* Floating Avatars */}
        {/* <div className="absolute top-5 left-[380px] w-20 h-20 rounded-full overflow-hidden border-4 border-white shadow-lg hover:scale-110 transition-transform">
          <Image src={PlaceHolderImage7} alt="Avatar" className="w-full h-full object-cover" />
        </div>
        <div className="absolute top-[120px] left-5 w-20 h-20 rounded-full overflow-hidden border-4 border-white shadow-lg hover:scale-110 transition-transform">
          <Image src={PlaceHolderImage8} alt="Avatar" className="w-full h-full object-cover" />
        </div>
        <div className="absolute bottom-[120px] right-5 w-20 h-20 rounded-full overflow-hidden border-4 border-white shadow-lg hover:scale-110 transition-transform">
          <Image src={PlaceHolderImag2} alt="Avatar" className="w-full h-full object-cover" />
        </div>
        <div className="absolute bottom-5 left-[380px] w-20 h-20 rounded-full overflow-hidden border-4 border-white shadow-lg hover:scale-110 transition-transform">
          <Image src={PlaceHolderImage4} alt="Avatar" className="w-full h-full object-cover" />
        </div> */}
      </div>
    </section>
  );
};

export default Testimony;
