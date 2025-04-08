import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "novaeafit2.blob.core.windows.net",
        port: "",
        pathname: "/omega-2025/**",
      },
    ],
  },
};

export default nextConfig;
