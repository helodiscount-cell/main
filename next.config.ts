import type { NextConfig } from "next";

// Defines Next.js configuration
const nextConfig: NextConfig = {
  images: {
    // Allows loading images from the specified external hostnames
    remotePatterns: [
      {
        protocol: "https",
        hostname: "scontent-bom5-1.cdninstagram.com",
      },
      {
        protocol: "https",
        hostname: "scontent-sin2-3.cdninstagram.com",
      },
    ],
  },
};

export default nextConfig;
