/** @type {import('next').NextConfig} */
const nextConfig = {
  // 忽略 TypeScript 类型检查
  typescript: {
    ignoreBuildErrors: true,
  },
  // 其他配置保持不变
  reactStrictMode: true,
  devIndicators: {
    appIsrStatus: false,
  },
};

module.exports = nextConfig;
