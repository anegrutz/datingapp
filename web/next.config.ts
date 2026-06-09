import type { NextConfig } from "next";

// When building for GitHub Pages (project site), the app is served from
// https://<user>.github.io/<repo>/, so it needs a basePath. This is enabled
// only in CI via NEXT_PUBLIC_BASE_PATH; local dev runs at the root.
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";

const nextConfig: NextConfig = {
  output: "export", // static HTML export to out/ for GitHub Pages
  basePath: basePath || undefined,
  images: { unoptimized: true }, // required for static export
  trailingSlash: true,
};

export default nextConfig;
