import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    // Указываем корень проекта, где лежит package.json
    root: process.cwd(),
  },
};

export default nextConfig;