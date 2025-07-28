import type { NextApiRequest, NextApiResponse } from 'next'
import { PLASMIC } from '@/plasmic-init'
import { SEO_CONFIG } from '@/utils/seo-config'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    // Set proper headers for XML
    res.setHeader('Content-Type', 'application/xml; charset=utf-8')
    res.setHeader('Cache-Control', `public, max-age=${SEO_CONFIG.SITEMAP_CONFIG.cacheMaxAge}`)

    // Récupérer toutes les pages Plasmic
    const pageModules = await PLASMIC.fetchPages()
    
    const baseUrl = SEO_CONFIG.getBaseUrl()
    const currentDate = new Date().toISOString().split('T')[0] // Format YYYY-MM-DD

    // Filtrer les pages exclues
    const allowedPages = pageModules.filter(page => !SEO_CONFIG.shouldExcludePage(page.path))

    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${allowedPages.map(page => `
  <url>
    <loc>${baseUrl}${page.path}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>${SEO_CONFIG.SITEMAP_CONFIG.changefreq}</changefreq>
    <priority>${page.path === '/' ? SEO_CONFIG.SITEMAP_CONFIG.homePriority : SEO_CONFIG.SITEMAP_CONFIG.defaultPriority}</priority>
  </url>`).join('')}
</urlset>`

    res.status(200).send(sitemap)
  } catch (error) {
    console.error('Erreur lors de la génération du sitemap:', error)
    res.status(500).json({ error: 'Erreur lors de la génération du sitemap' })
  }
} 