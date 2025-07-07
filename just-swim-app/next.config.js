/**
 * @type {import('next').NextConfig}
 */

const nextConfig = {
  reactStrictMode: true,
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
    ];
  },
};

// Bundle analyzer를 조건부로 적용
if (process.env.ANALYZE === 'true') {
  const withBundleAnalyzer = require('@next/bundle-analyzer')({
    enabled: true,
  });
  module.exports = withBundleAnalyzer(nextConfig);
} else {
  module.exports = nextConfig;
}
