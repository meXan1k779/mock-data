import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    domains: ['storage.googleapis.com'],
  },
  reactCompiler: true,
  // Prototype — keep every response (HTML and assets) out of search engines.
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [{ key: 'X-Robots-Tag', value: 'noindex, nofollow' }],
      },
    ];
  },
  // @ts-expect-error - publicRuntimeConfig deprecated but needed for legacy code
  publicRuntimeConfig: {
    BASE_API_URL: process.env.BASE_API_URL,
  },
};

export default nextConfig;
