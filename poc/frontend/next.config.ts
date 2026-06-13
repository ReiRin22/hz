import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  experimental: {
    externalDir: true,
  },
  webpack: (config) => {
    config.resolve.symlinks = false; // シンボリックリンクを実体として扱う
    return config;
  },
};

export default nextConfig;
