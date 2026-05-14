import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  // Allowed Dev Origins lets you access the dev server from your mobile phone on the same WiFi
  allowedDevOrigins: ["10.145.255.106", "localhost", "127.0.0.1"] as any,
};

export default nextConfig;
