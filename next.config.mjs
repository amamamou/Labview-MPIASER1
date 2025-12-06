/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'source.unsplash.com',
      },
    ],
  },
  experimental: {
    turbo: false,
  },
  webpack: (config) => {
    config.cache = {
      type: 'filesystem',
      cacheDirectory: '.next/cache',
      hashAlgorithm: 'md4',
      name: 'webpack-cache',
      period: 60000,
      store: 'pack',
      buildDependencies: {
        config: ['next.config.mjs'],
      },
    };
    return config;
  },
}

export default nextConfig
