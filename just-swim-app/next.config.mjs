/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    config.module.rules.push({
      test: /\.svg$/,
      use: ['@svgr/webpack'],
    })

    return config;
  },
  images: {
    remotePatterns: [
      {
        hostname: "k.kakaocdn.net",
      },
      {
        hostname: "t1.kakaocdn.net"
      }
    ],
    // domains: ["k.kakaocdn.net"], // 키키오톡 프로필 사진을 불러오기 위해 사용
    // domains: ["t1.kakaocdn.net"]
  }
}

export default nextConfig;
