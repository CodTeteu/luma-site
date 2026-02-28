import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone',
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        pathname: '/**',
      },
    ],
  },
  async rewrites() {
    return {
      beforeFiles: [
        // Casamento Malu & Lisses — main page
        {
          source: '/malu-lisses',
          destination: 'https://casamento-malu-lisses.vercel.app/',
        },
        // Casamento Malu & Lisses — SPA sub-routes (admin, etc)
        {
          source: '/malu-lisses/:path*',
          destination: 'https://casamento-malu-lisses.vercel.app/:path*',
        },
      ],
      afterFiles: [],
      fallback: [],
    };
  },
};

export default nextConfig;
