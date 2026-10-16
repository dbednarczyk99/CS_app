import type { NextConfig } from 'next';

// Zdjęcia produktów i wpisów pochodzą z API (/uploads), więc next/image musi znać jego adres
const apiUrl = new URL(process.env.API_URL ?? 'http://localhost:3000');

const nextConfig: NextConfig = {
  // podgląd `npm run dev` z telefonu w tej samej sieci Wi-Fi (http://192.168.x.x:3001); nie wpływa na produkcję
  allowedDevOrigins: ['192.168.*.*'],
  // czcionki dla maili (Oswald, Lato) – programy pocztowe pobierają je z innej domeny, więc potrzebny CORS
  async headers() {
    return [
      {
        source: '/fonts/:file*',
        headers: [
          { key: 'Access-Control-Allow-Origin', value: '*' },
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
        ],
      },
    ];
  },
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
