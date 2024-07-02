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
    domains: ["k.kakaocdn.net"], // 키키오톡 프로필 사진을 불러오기 위해 사용
  }
}

export default nextConfig;
