import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        hostname: "nyc.cloud.appwrite.io",
      },
    ],
  },
};

export default nextConfig;
