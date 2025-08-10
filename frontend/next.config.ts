import type { NextConfig } from "next";

const nextConfig: NextConfig = {
   eslint: {
    ignoreDuringBuilds: true,
  },
};

if (process.env.NODE_ENV === "development") {
  // Dynamically import and call setupDevPlatform only in dev
  // (use top-level await only if your TS config supports it; otherwise use a function)
  import("@cloudflare/next-on-pages/next-dev").then(({ setupDevPlatform }) => {
    setupDevPlatform();
  });
}

export default nextConfig;
