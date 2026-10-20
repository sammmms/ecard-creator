import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  outputFileTracingIncludes: {
    "/**": ["./prisma/app.db", "./data/app.db"],
  },
};

export default nextConfig;
