import React from "react";
import LandingCover from "@/assets/homepage/@2x/landing-cover.png";
import Image from "next/image";
import PlaceHolderImage2 from "@/assets/homepage/@2x/Ellipse 12@2x.png";
import Link from "next/link";

const HeroSection = () => {
  return (
    <div
      id="hero-section"
      className="relative min-h-screen w-full overflow-hidden"
    >
      {/* Background Image */}
      <Image
        src={LandingCover}
        alt="Landing Cover"
        fill
        className="object-cover"
        priority
      />

      {/* Center Info */}
      <div className="relative z-10 flex flex-col gap-8 justify-center items-center min-h-screen">
        <div className="flex flex-col gap-8 justify-center items-center absolute top-[12%]">
          {" "}
          <p className="text-lg font-bold text-[#AA64FF] tracking-[9px]">
            MESSAGE MATE
          </p>
          <p className="text-4xl font-bold text-white">
            Seamless Conversations.
          </p>
          <Link
            href="/auth"
            className="bg-[#6A06E4] text-lg font-medium text-white px-6 py-3 rounded-full"
          >
            Start for free
          </Link>
        </div>
      </div>

      {/* Floating Cards */}
      <div className="absolute z-10 left-[25%] top-[65%]">
        <MessageCard />
      </div>

      <div className="absolute z-10 right-[23%] bottom-[10%]">
        <DmCard />
      </div>
    </div>
  );
};

const MessageCard = () => (
  <div
    className="w-[250px] p-4 bg-white/70 backdrop-blur-3xl rounded-[15px]  "
    // style={{
    //   backdropFilter: "blur(5px)",
    //   WebkitBackdropFilter: "blur(5px)",
    // }}
  >
    <div className="flex items-start gap-3">
      <Image
        src={PlaceHolderImage2}
        alt=""
        width={40}
        height={40}
        className="rounded-full"
      />
      <div className="flex-1">
        <p className="text-sm font-normal text-slate-800">jani d/5</p>
        <p className="text-sm text-black mt-1">Send me the link</p>
        <button className="text-xs text-gray-500 mt-2 hover:text-gray-700">
          Reply
        </button>
      </div>
    </div>
  </div>
);

const DmCard = () => (
  <div
    className="w-[250px] p-4 bg-white/70 backdrop-blur-3xl rounded-[15px]  "
    style={{
      backdropFilter: "blur(5px)",
      WebkitBackdropFilter: "blur(5px)",
    }}
  >
    <div className="flex flex-col gap-4">
      <p className="text-lg font-medium text-black">
        Here's your link! Enjoy your trial
      </p>
      <button className="bg-purple-500 text-lg text-white px-4 py-2 rounded-lg">
        Get Trial
      </button>
    </div>
  </div>
);

export default HeroSection;
