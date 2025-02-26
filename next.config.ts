import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  // reactStrictMode: true,
  typescript: {
    ignoreBuildErrors: true,  // Ignore TypeScript errors during build
  },
   eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    domains: ['img.clerk.com'], //allows images to be loaded from the specified domain
  },
  async redirects() {
    return [
      {
        source: '/',
        destination: '/landing',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;

