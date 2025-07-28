// Configuration centralisée pour le SEO
export const SEO_CONFIG = {
  // Pages à désindexer complètement (robots.txt + sitemap)
  DISALLOWED_PAGES: [
    '/test-file-list',    // Page de test
    '/plasmic-host',      // Page host Plasmic
    '/admin/*',           // Toutes les pages admin
    '/private/*',
    'faq',
    'historique',
    // Ajoutez ici d'autres pages à désindexer
  ],

  // Configuration du sitemap
  SITEMAP_CONFIG: {
    changefreq: 'weekly' as const,
    defaultPriority: 0.8,
    homePriority: 1.0,
    cacheMaxAge: 86400, // 24 heures en secondes
  },

  // Fonction utilitaire pour vérifier si une page doit être exclue
  shouldExcludePage(path: string): boolean {
    return this.DISALLOWED_PAGES.some(excludedPath => {
      if (excludedPath.endsWith('/*')) {
        const basePath = excludedPath.slice(0, -2)
        return path.startsWith(basePath)
      }
      return path === excludedPath || path.startsWith(excludedPath + '/')
    })
  },

  // Fonction pour obtenir l'URL de base
  getBaseUrl(): string {
    return process.env.NEXT_PUBLIC_SITE_URL || 'https://votre-domaine.com'
  }
}

export default SEO_CONFIG 