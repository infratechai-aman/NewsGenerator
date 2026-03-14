import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Allow images from external sources
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '**' },
      { protocol: 'http', hostname: '**' },
    ],
  },
  // Puppeteer and canvas need serverExternalPackages
  serverExternalPackages: ['puppeteer', 'canvas'],
  // Increase API body size limit for file uploads
  experimental: {
    serverActions: {
      bodySizeLimit: '10mb',
    },
  },
};

export default nextConfig;
