import withPWA from '@ducanh2912/next-pwa';
import fs from 'fs';
import path from 'path';

/** @type {import('next').NextConfig} */
const baseConfig = {
  output: 'export',
  reactStrictMode: true,
  eslint: {
    ignoreDuringBuilds: true,
  },

  async rewrites() {
    return [
      {
        source: '/ingest/static/:path*',
        destination: 'https://app.posthog.com/static/:path*',
      },
      {
        source: '/ingest/:path*',
        destination: 'https://eu.i.posthog.com/:path*',
      },
    ];
  },

  async headers() {
    return [
      {
        source: '/ingest/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },

  skipTrailingSlashRedirect: true,
  //output: 'standalone',
};

let additionalManifestEntries = [
  { url: '/bilan', revision: null },
  { url: '/plasmic-host', revision: null },
  { url: '/site.webmanifest', revision: null },
  { url: '/android-chrome-192x192.png', revision: null },
  { url: '/android-chrome-512x512.png', revision: null },
];

try {
  const assetsPath = path.join(process.cwd(), 'public', 'pwa-assets.json');
  if (fs.existsSync(assetsPath)) {
    const assets = JSON.parse(fs.readFileSync(assetsPath, 'utf-8'));
    additionalManifestEntries = additionalManifestEntries.concat(assets);
  }
} catch (e) {
  console.warn('Impossible de charger pwa-assets.json:', e);
}

const withPWAPlugin = withPWA({
  dest: 'public',
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === 'development',
  fallbacks: {
    document: '/offline.html',
  },
  additionalManifestEntries,
});

export default withPWAPlugin(baseConfig);
