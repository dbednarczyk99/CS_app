import type { NextConfig } from 'next';

// Zdjęcia produktów i wpisów pochodzą z API (/uploads), więc next/image musi znać jego adres
const apiUrl = new URL(process.env.API_URL ?? 'http://localhost:3000');
// panel osadza stronę w podglądzie wpisu
const adminOrigin = new URL(process.env.NEXT_PUBLIC_ADMIN_URL || 'http://localhost:5173').origin;

const nextConfig: NextConfig = {
  poweredByHeader: false,
  // podgląd `npm run dev` z telefonu w tej samej sieci Wi-Fi (http://192.168.x.x:3001); nie wpływa na produkcję
  allowedDevOrigins: ['192.168.*.*'],
  // czcionki dla maili (Oswald, Lato) – programy pocztowe pobierają je z innej domeny, więc potrzebny CORS
  async headers() {
    return [
      {
        // nagłówki ochronne całej strony
        source: '/:path*',
        headers: [
          // stronę może osadzić tylko ona sama i panel (podgląd wpisu) – blokada „podstępnego klikania”
          {
            key: 'Content-Security-Policy',
            value: `frame-ancestors 'self' ${adminOrigin}; base-uri 'self'; object-src 'none'; form-action 'self'`,
          },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          // lokalizacja – „najbliższy punkt odbioru” w rezerwacji; reszta wyłączona
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), payment=(), usb=(), geolocation=(self)' },
          // tylko HTTPS (przeglądarki ignorują to na http://localhost)
          { key: 'Strict-Transport-Security', value: 'max-age=31536000; includeSubDomains' },
        ],
      },
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
