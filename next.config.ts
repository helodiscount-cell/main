import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "scontent-bom5-1.cdninstagram.com",
      },
    ],
  },
};

export default nextConfig;
