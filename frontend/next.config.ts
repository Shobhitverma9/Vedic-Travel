import type { NextConfig } from "next";

// Derive just the origin (https://host) from the full API URL env var.
// This is used to build the CSP connect-src directive so that switching
// hosting platforms (Render → GCP, etc.) only requires changing the env var.
const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000";
const apiOrigin = new URL(apiUrl).origin;

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'assets.mixkit.co',
      },
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      }
    ],
  },
};

export default nextConfig;
