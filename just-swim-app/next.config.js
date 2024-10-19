/**
 * @type {import('next').NextConfig}
 */
const nextConfig = {
  reactStrictMode: true,
  webpack: (config) => {
    config.module.rules.push({
      test: /\.svg$/,
      use: ['@svgr/webpack'],
    });

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
        hostname: "t1.kakaocdn.net"
      },
      {
        hostname: "img1.kakaocdn.net"
      },
      {
        hostname: "ssl.pstatic.net"
      },
      {
        hostname: "s3.ap-northeast-2.amazonaws.com"
      }
    ],
  },
  // async rewrites() {
  //   return [
  //     {
  //       source: 'http://localhost:3000',
  //       destination: "https://just-swim-bucket.s3.ap-northeast-2.amazonaws.com",
  //     },
  //   ];
  // }
};

module.exports = nextConfig;
