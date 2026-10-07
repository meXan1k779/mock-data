import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    domains: ['storage.googleapis.com'],
  },
  reactCompiler: true,
  // @ts-expect-error - publicRuntimeConfig deprecated but needed for legacy code
  publicRuntimeConfig: {
    BASE_API_URL: process.env.BASE_API_URL,
  },
};

export default nextConfig;
