import type { NextConfig } from 'next';
import path from 'path';

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: true,
  output: 'standalone',
  outputFileTracingRoot: path.join(__dirname, './'),
  experimental: {
    webpackMemoryOptimizations: true,
  },
};

export default nextConfig;
