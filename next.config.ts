import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  poweredByHeader: false,
  images: {
    // Optimised images are cached for 30 days instead of the 60s default, so
    // repeat visits (and Lighthouse re-runs) don't re-trigger the optimizer.
    minimumCacheTTL: 60 * 60 * 24 * 30,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.public.blob.vercel-storage.com",
      },

      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
  experimental: {
    // Only pull in the components that are actually imported.
    optimizePackageImports: ["@base-ui/react", "react-icons/fa6"],
  },
};

export default nextConfig;
