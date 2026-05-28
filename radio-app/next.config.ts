import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: [
    "*.trycloudflare.com",
    "always-participants-tradition-robertson.trycloudflare.com",
  ],
};

export default nextConfig;
