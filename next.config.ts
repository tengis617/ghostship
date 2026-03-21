import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: [
    "chat",
    "@chat-adapter/discord",
    "@chat-adapter/gchat",
    "@chat-adapter/github",
    "@chat-adapter/linear",
    "@chat-adapter/slack",
    "@chat-adapter/state-memory",
    "@chat-adapter/state-redis",
    "@chat-adapter/telegram",
    "@chat-adapter/teams",
    "@chat-adapter/whatsapp",
  ],
  typescript: {
    ignoreBuildErrors: true,
  },
  // Externalize discord.js and its native dependencies for serverless compatibility
  serverExternalPackages: [
    "discord.js",
    "@discordjs/ws",
    "@discordjs/voice",
    "zlib-sync",
    "bufferutil",
    "utf-8-validate",
  ],
};

export default nextConfig;
