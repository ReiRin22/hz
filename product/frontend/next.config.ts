import type { NextConfig } from "next";
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./src/shared/i18n/request.ts');

// Docker環境では bff:3001、ローカル環境では localhost:3001
const isDocker = process.env.DOCKER_ENV === 'true';
const bffUrl = isDocker ? "http://bff:3001" : "http://localhost:3001";

const nextConfig: NextConfig = {
  reactCompiler: true,
  experimental: {
    externalDir: true,
  },
  async redirects() {
    return [
      {
        source: '/karte',
        destination: '/karte/P001',
        permanent: false,
      },
    ];
  },
  webpack: (config, { isServer }) => {
    config.resolve.symlinks = false; // シンボリックリンクを実体として扱う
    if (isServer) {
      // msw は devDependencies のみ。instrumentation.ts からの動的 import が
      // webpack の静的解析に引っかかるのを防ぐ
      config.externals = [...(config.externals ?? []), 'msw', 'msw/node'];
    }
    return config;
  },
  async rewrites() {
    return [
      {
        source: "/bff/:path*",
        destination: `${bffUrl}/bff/:path*`,
      },
    ];
  },
};

export default withNextIntl(nextConfig);

