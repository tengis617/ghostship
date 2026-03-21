import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: [
    "chat",
    "@chat-adapter/github",
    "@chat-adapter/slack",
    "@chat-adapter/state-memory",
    "@chat-adapter/state-redis",
  ],
};

export default nextConfig;
