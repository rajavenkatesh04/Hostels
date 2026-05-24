import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
    images: {
        unoptimized: true,  // serves images as-is, no Vercel processing
    },
};

export default nextConfig;
