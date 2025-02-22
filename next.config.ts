import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  // reactStrictMode: true,
  images: {
    domains: ['img.clerk.com'], //allows images to be loaded from the specified domain
    },
};

export default nextConfig;
