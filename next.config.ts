import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: true,
  output: 'standalone',
  experimental: {
    webpackMemoryOptimizations: true,
  },
};

export default nextConfig;
