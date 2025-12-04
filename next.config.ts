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
      {
        protocol: "https",
        hostname: "scontent-sin11-2.cdninstagram.com",
      },
      {
        protocol: "https",
        hostname: "scontent-atl3-3.cdninstagram.com",
      },
    ],
  },
  // Configures API route body size limits
  // Note: Next.js App Router handles body parsing differently
  // These limits are enforced via middleware and route handlers
  experimental: {
    // Maximum body size for API routes (in bytes)
    // Default is 1MB, we set it to 500KB for webhooks
    serverActions: {
      bodySizeLimit: "500kb",
    },
  },
};

export default nextConfig;
