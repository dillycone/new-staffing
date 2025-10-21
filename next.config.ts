import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  // Explicitly set workspace root to silence lockfile detection warnings
  // See: https://nextjs.org/docs/app/api-reference/config/next-config-js/output#caveats
  outputFileTracingRoot: path.join(__dirname),
};

export default nextConfig;
