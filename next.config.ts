import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  output: "standalone",
  experimental: {
    // Making sure the output is optimized for Vercel
    serverComponentsExternalPackages: [],
  },
  // Explicitly define routes to ensure they're properly generated
  async exportPathMap(defaultPathMap, { dev, dir, outDir, distDir, buildId }) {
    return {
      "/": { page: "/" },
      "/dashboard": { page: "/dashboard" },
      "/sign-in": { page: "/sign-in" },
      "/sign-up": { page: "/sign-up" },
      "/interview/create": { page: "/interview/create" },
      // Dynamic routes will be handled by Next.js automatically
    };
  },
};

export default nextConfig;
