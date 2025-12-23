/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  reactStrictMode: false,
  transpilePackages: ["@/components/ui"], // Add this for shadcn/ui
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn-news.shironam.news",
        port: "",
        pathname: "/storage/shironam-media/**",
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        port: "",
        pathname: "/dt1tch0v9/image/upload/**",
      },
    ],
  },
  eslint: {
    ignoreDuringBuilds: true, // ✅ FIX VERCEL BUILD ERROR
  },
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: `${process.env.NEXT_PUBLIC_BASE_URL}/api/:path*`,
      },
    ];
  },
  trailingSlash: true,
  webpack: (config) => {
    config.resolve.fallback = { fs: false, net: false, tls: false };
    return config;
  },
};

export default nextConfig;
