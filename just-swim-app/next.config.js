/**
 * @type {import('next').NextConfig}
 */

const withPWA = require('next-pwa')({
  dest: 'public',
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === 'development',
  runtimeCaching: [
    {
      urlPattern: /^https:\/\/api\.just-swim\.kr\/api\/.*/i,
      handler: 'NetworkFirst',
      options: {
        cacheName: 'api-cache',
        expiration: {
          maxEntries: 100,
          maxAgeSeconds: 60 * 60 * 24, // 24시간
        },
        cacheableResponse: {
          statuses: [0, 200],
        },
      },
    },
    {
      urlPattern: /\.(?:png|jpg|jpeg|svg|gif|webp)$/,
      handler: 'CacheFirst',
      options: {
        cacheName: 'images-cache',
        expiration: {
          maxEntries: 100,
          maxAgeSeconds: 60 * 60 * 24 * 30, // 30일
        },
      },
    },
    {
      urlPattern: /\.(?:js|css)$/,
      handler: 'StaleWhileRevalidate',
      options: {
        cacheName: 'static-resources',
        expiration: {
          maxEntries: 100,
          maxAgeSeconds: 60 * 60 * 24 * 7, // 7일
        },
      },
    },
  ],
  buildExcludes: [/middleware-manifest\.json$/],
  exclude: [
    /_next\/static\/chunks\/.*/,
    /_next\/static\/css\/.*/,
    /_next\/static\/media\/.*/,
  ],
});

const nextConfig = {
  reactStrictMode: true,
  // 페이지 이동 성능 최적화
  experimental: {
    optimizePackageImports: ['@mui/material', '@mui/icons-material', 'lodash'],
  },
  // 컴파일러 최적화
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  webpack: (config, { dev, isServer }) => {
    config.module.rules.push({
      test: /\.svg$/,
      use: ['@svgr/webpack'],
    });

    // 번들 분석을 위한 설정
    if (!dev && !isServer) {
      config.optimization.splitChunks = {
        chunks: 'all',
        cacheGroups: {
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            chunks: 'all',
          },
          mui: {
            test: /[\\/]node_modules[\\/]@mui[\\/]/,
            name: 'mui',
            chunks: 'all',
          },
        },
      };
    }

    return config;
  },
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'k.kakaocdn.net',
        port: '',
        pathname: '/dn/**',
      },
      {
        hostname: 't1.kakaocdn.net',
      },
      {
        hostname: 'img1.kakaocdn.net',
      },
      {
        hostname: 'ssl.pstatic.net',
      },
      {
        protocol: 'https',
        hostname: 'just-swim-bucket.s3.ap-northeast-2.amazonaws.com',
      },
      {
        hostname: 'phinf.pstatic.net',
      },
    ],
  },
  async rewrites() {
    return [
      {
        source: '/lecture/:path*',
        destination: 'https://api.just-swim.kr/api/lecture/:path*',
      },
      {
        source: '/member/:path*',
        destination: 'https://api.just-swim.kr/api/member/:path*',
      },
      {
        source: '/auth/:path*',
        destination: 'https://api.just-swim.kr/api/auth/:path*',
      },
      {
        source: '/statistics/:path*',
        destination: 'https://api.just-swim.kr/api/statistics/:path*',
      },
    ];
  },
};

// Bundle analyzer를 조건부로 적용
if (process.env.ANALYZE === 'true') {
  const withBundleAnalyzer = require('@next/bundle-analyzer')({
    enabled: true,
  });
  module.exports = withBundleAnalyzer(withPWA(nextConfig));
} else {
  module.exports = withPWA(nextConfig);
}
