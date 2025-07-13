import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  transpilePackages: ["@romeo/database"],
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      "@romeo/database": path.resolve(__dirname, "../packages/database/src")
    };
    return config;
  }
};

export default nextConfig;
