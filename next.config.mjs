/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // output: 'web' pour webapp, output: 'export' pour exportation ionic
  output: 'export',
  async rewrites() {
    return [
      // Essai avec app.posthog.com pour les assets statiques
      {
        source: '/ingest/static/:path*',
        destination: 'https://app.posthog.com/static/:path*',
      },
      // Route générale pour les autres requêtes vers EU
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

  // This is required to support PostHog trailing slash API requests
  skipTrailingSlashRedirect: true,
};

export default nextConfig;