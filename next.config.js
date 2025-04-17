/** @type {import('next').NextConfig} */
const nextConfig = {
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

module.exports = nextConfig;