import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  basePath: "/app-budzet-domowego",
  images: { unoptimized: true },
};

export default nextConfig;
