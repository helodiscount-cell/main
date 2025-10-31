import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "scontent-bru2-1.cdninstagram.com",
      },
    ],
  },
};

export default nextConfig;
