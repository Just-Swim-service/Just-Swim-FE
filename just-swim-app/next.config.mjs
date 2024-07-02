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
    domains: ["k.kakaocdn.net"], // 이곳에 에러에서 hostname 다음 따옴표에 오는 링크를 적으면
    // images: {
    //   remotePatterns: [
    //     {
    //       protocol: 'https',
    //       hostname: 'k.kakaocdn.net',
    //       // Optionally you can include the port if needed
    //       // port: '443', // Default HTTPS port
    //       pathname: '/dn/d3UHmi/btsH8xClKxG/jGQI0gBeKrlOkneK7KYIbK/**',
    //     },
    //   ],
    // },
  }
}

export default nextConfig;
