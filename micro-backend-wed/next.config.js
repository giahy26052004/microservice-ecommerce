/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  swcMinify: true,
  experimental: { esmExternals: true },
  async rewrites() {
    return [
      {
        source: "/api/v1/:path*",
        destination: "http://54.252.198.12:3100/api/v1/:path*", // Proxy to Backend
      },
    ];
  },
};

module.exports = nextConfig;
