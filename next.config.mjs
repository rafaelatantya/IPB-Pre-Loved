/** @type {import('next').NextConfig} */
// import { setupDevPlatform } from '@cloudflare/next-on-pages/next-dev';

const nextConfig = {
  // Cloudflare Pages butuh runtime edge untuk Server Actions agar bisa akses D1/R2
  experimental: {
    serverActions: {
      allowedOrigins: ["localhost:8788"],
    },
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Cross-Origin-Opener-Policy',
            value: 'same-origin',
          },
          {
            key: 'Cross-Origin-Embedder-Policy',
            value: 'require-corp',
          },
        ],
      },
    ];
  },
};

// Hanya panggil setupDevPlatform saat development
if (process.env.NODE_ENV === 'development') {
  const { setupDevPlatform } = await import('@cloudflare/next-on-pages/next-dev');
  await setupDevPlatform();
}

export default nextConfig;



