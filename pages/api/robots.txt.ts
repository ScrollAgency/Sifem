import type { NextApiRequest, NextApiResponse } from 'next'
import { SEO_CONFIG } from '@/utils/seo-config'

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  // Set proper headers for robots.txt
  res.setHeader('Content-Type', 'text/plain; charset=utf-8')
  res.setHeader('Cache-Control', `public, max-age=${SEO_CONFIG.SITEMAP_CONFIG.cacheMaxAge}`)

  const robotsTxt = `User-agent: *
${SEO_CONFIG.DISALLOWED_PAGES.map(page => `Disallow: ${page}`).join('\n')}

# Sitemap location
Sitemap: ${SEO_CONFIG.getBaseUrl()}/api/sitemap.xml`

  res.status(200).send(robotsTxt)
} 