import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  basePath: "/vrstudiolab",
  images: {
    unoptimized: true,
  },
};

export default nextConfig;