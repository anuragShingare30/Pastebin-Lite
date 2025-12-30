import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Vercel deployment optimizations
  experimental: {
    // Enable server actions if needed
  },
  // Ensure proper handling of Prisma in serverless
  serverExternalPackages: ["@prisma/client", "prisma"],
};

export default nextConfig;
