/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',  // 静态导出
  distDir: 'out',    // 输出目录
  images: {
    unoptimized: true,  // 静态导出需要
  },
  trailingSlash: true,
}

module.exports = nextConfig
