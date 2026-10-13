import type { NextConfig } from 'next';

// Zdjęcia produktów i wpisów pochodzą z API (/uploads), więc next/image musi znać jego adres
const apiUrl = new URL(process.env.API_URL ?? 'http://localhost:3000');

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: apiUrl.protocol.replace(':', '') as 'http' | 'https',
        hostname: apiUrl.hostname,
        port: apiUrl.port,
        pathname: '/uploads/**',
      },
    ],
    formats: ['image/avif', 'image/webp'],
  },
};

export default nextConfig;
