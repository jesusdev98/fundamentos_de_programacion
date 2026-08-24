import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  outputFileTracingIncludes: {
    "/typescript-compiler-5.9.3.js": ["./node_modules/typescript/lib/typescript.js"],
  },
};

export default nextConfig;
