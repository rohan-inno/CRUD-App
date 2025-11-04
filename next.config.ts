import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {},
  experimental: {
    serverComponentsExternalPackages: ["pg", "pg-hstore", "sequelize"],
  },
};

export default nextConfig;
