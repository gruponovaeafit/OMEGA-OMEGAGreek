import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'novaeafit.blob.core.windows.net',
        port: '',
        pathname: '/*/**', 
      }
    ]
  }
};

export default nextConfig;
