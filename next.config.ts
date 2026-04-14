import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
      remotePatterns: [
        {
          protocol: 'https',
          hostname: 'media*.giphy.com',
          port: '',
          pathname: '/media/**',
          search: '',
        },
      ],
    },
};

export default nextConfig;
