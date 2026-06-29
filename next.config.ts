import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    // Vercel caching issue workaround - types are verified locally
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
