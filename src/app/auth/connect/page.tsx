"use client";

import { Button } from "@/components/ui/button";
import { instagramService } from "@/api/services/instagram";
import { Instagram } from "lucide-react";
import { useState } from "react";
import Image from "next/image";

// Import local assets
import connectImage from "@/assets/stock-images/connect-page.png";
import metaLogo from "@/assets/svgs/meta-color.svg";

export default function ConnectPage() {
  const [isConnecting, setIsConnecting] = useState(false);

  // Handle the connection sequence to Instagram OAuth
  const handleConnect = () => {
    setIsConnecting(true);
    instagramService.oauth.connect("/dash");
  };

  return (
    // Main full-screen wrapper with subtle background
    <div className="min-h-screen bg-[#F1F1F1] flex items-center justify-center p-4 md:p-8 font-sans">
      {/* Responsive split container */}
      <div className="max-w-[960px] w-full grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 items-stretch">
        {/* Left Side: Authentication Card */}
        <div className="bg-white rounded-[20px] shadow-sm flex flex-col items-center justify-between p-10 lg:p-12 text-center h-full min-h-[560px]">
          <div className="w-full relative flex flex-col items-center grow">
            {/* Top Logo */}
            <h2 className="text-[#6A06E4] font-bold text-[18px] mb-12">Logo</h2>

            {/* Headings */}
            <h1 className="text-[#1A1A1A] font-bold text-[26px] mb-2 tracking-tight">
              Connect Instagram
            </h1>
            <p className="text-gray-500 text-[13px] mb-8 max-w-[240px] mx-auto">
              Use your Instagram account to connect with us.
            </p>

            {/* Visual Connection Graphic */}
            <div className="flex items-center justify-center my-6">
              {/* Instagram App Target */}
              <div className="w-[46px] h-[46px] rounded-[14px] bg-linear-to-tr from-[#FFB800] via-[#FF007A] to-[#6A06E4] flex items-center justify-center shadow-[0_2px_10px_rgba(0,0,0,0.1)] ring-[3px] ring-white">
                <Instagram className="text-white w-6 h-6" />
              </div>

              {/* Dotted Connection dots */}
              <div className="flex gap-[6px] items-center px-[14px]">
                {[...Array(9)].map((_, i) => (
                  <div
                    key={i}
                    className="w-[5px] h-[5px] rounded-full bg-[#6A06E4]"
                  />
                ))}
              </div>

              {/* DMBro/Logo App Target */}
              <div className="w-[46px] h-[46px] rounded-[14px] bg-[#6A06E4] flex items-center justify-center shadow-[0_2px_10px_rgba(106,6,228,0.25)] ring-[3px] ring-white">
                <span className="text-white font-bold text-[10px]">Logo</span>
              </div>
            </div>

            {/* Connection Action Button */}
            <div className="px-4 w-full mt-6">
              <Button
                onClick={handleConnect}
                disabled={isConnecting}
                className="w-full bg-[#6A06E4] hover:bg-[#5a05c4] text-white py-6 rounded-[10px] font-medium text-[15px] shadow-[0_8px_20px_rgba(106,6,228,0.25)] transition-all border-none outline-none mt-2"
              >
                {isConnecting ? (
                  <span className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-[2.5px] border-white border-t-transparent rounded-full animate-spin" />
                    Connecting...
                  </span>
                ) : (
                  "Go to Instagram"
                )}
              </Button>
            </div>

            {/* Consent Text */}
            <p className="mt-5 text-[10px] text-gray-400 leading-relaxed max-w-[240px] mx-auto">
              Log in with Instagram and set your permissions.
              <br />
              Once that connect you're all set to connect with us.
            </p>
          </div>

          {/* Bottom Meta Provider Banner */}
          <div className="mt-8 flex flex-col items-center">
            <div className="mb-1">
              <Image
                src={metaLogo}
                alt="Meta Tech Provider"
                className="h-[22px] w-auto object-contain"
              />
            </div>
            <p className="text-[9px] text-gray-400 font-medium">
              Certified by Meta as an official Tech Provider.
            </p>
          </div>
        </div>

        {/* Right Side: Graphic/Image Display */}
        <div className="hidden md:block w-full h-full relative rounded-[20px] overflow-hidden shadow-sm">
          <Image
            src={connectImage}
            alt="Grow your audience"
            fill
            className="object-cover"
            priority
          />
        </div>
      </div>
    </div>
  );
}
