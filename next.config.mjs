/** @type {import('next').NextConfig} */
// import { setupDevPlatform } from '@cloudflare/next-on-pages/next-dev';

const nextConfig = {
  // Cloudflare Pages butuh runtime edge untuk Server Actions agar bisa akses D1/R2
  // Kita set secara manual di setiap file atau via config ini (opsional)
};

// Hanya panggil setupDevPlatform saat development
// if (process.env.NODE_ENV === 'development') {
//   await setupDevPlatform();
// }

export default nextConfig;
