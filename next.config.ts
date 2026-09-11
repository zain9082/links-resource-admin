import type { NextConfig } from "next";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const configDir = path.dirname(fileURLToPath(import.meta.url));

const nextConfig: NextConfig = {
  poweredByHeader: false,
  transpilePackages: [],
  experimental: {
    externalDir: true,
    serverActions: {
      bodySizeLimit: "6mb",
    },
  },
  turbopack: {
    root: configDir,
  },
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "linksresource.com" },
      { protocol: "https", hostname: "www.linksresource.com" },
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "*.public.blob.vercel-storage.com" },
      { protocol: "http", hostname: "localhost" },
      { protocol: "http", hostname: "127.0.0.1" },
    ],
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=(), payment=()",
          },
          { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
        ],
      },
    ];
  },
  async redirects() {
    const generatedPath = path.join(process.cwd(), "redirects.generated.json");
    if (!fs.existsSync(generatedPath)) return [];
    try {
      const parsed = JSON.parse(fs.readFileSync(generatedPath, "utf-8")) as Array<{
        source: string;
        destination: string;
        permanent: boolean;
      }>;
      return parsed;
    } catch {
      return [];
    }
  },
};

export default nextConfig;
