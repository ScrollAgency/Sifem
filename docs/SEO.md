# Gestion SEO - Sitemap et Robots.txt

Ce projet inclut une gestion dynamique du SEO avec sitemap.xml et robots.txt générés automatiquement.

## 🚀 Fonctionnalités

- **Sitemap automatique** : Génère automatiquement un sitemap basé sur vos pages Plasmic
- **Robots.txt dynamique** : Désindexe les pages que vous ne voulez pas voir dans les moteurs de recherche
- **Configuration centralisée** : Gérez tout depuis un seul fichier de configuration

## 📁 Fichiers créés

- `pages/api/robots.txt.ts` - API route pour robots.txt
- `pages/api/sitemap.xml.ts` - API route pour sitemap.xml
- `utils/seo-config.ts` - Configuration centralisée
- `next.config.mjs` - Mis à jour avec les redirections

## 🔧 Configuration

### 1. Variables d'environnement

Ajoutez à votre fichier `.env.local` :

```bash
NEXT_PUBLIC_SITE_URL=https://votre-domaine.com
```

### 2. Pages à désindexer

Modifiez le fichier `utils/seo-config.ts` pour ajouter/retirer des pages :

```typescript
DISALLOWED_PAGES: [
  '/test-file-list',    // Page de test
  '/plasmic-host',      // Page host Plasmic
  '/admin/*',           // Toutes les pages admin
  '/private/*',         // Toutes les pages privées
  '/ma-page-privee',    // Page spécifique
]
```

## 📍 URLs d'accès

Une fois déployé, vos fichiers seront accessibles à :

- `https://votre-domaine.com/robots.txt`
- `https://votre-domaine.com/sitemap.xml`

## 🔍 Comment ça marche

### Robots.txt
- Désindexe les pages listées dans `DISALLOWED_PAGES`
- Supporte les patterns avec `*` (ex: `/admin/*`)
- Inclut automatiquement le lien vers le sitemap

### Sitemap.xml
- Récupère automatiquement toutes les pages Plasmic via `PLASMIC.fetchPages()`
- Exclut les pages listées dans `DISALLOWED_PAGES`
- Met à jour automatiquement la date de dernière modification
- Cache les résultats pendant 24h pour les performances

## 🛠️ Personnalisation

### Changer la fréquence de mise à jour

```typescript
SITEMAP_CONFIG: {
  changefreq: 'daily', // weekly, monthly, yearly
  defaultPriority: 0.8,
  homePriority: 1.0,
}
```

### Ajouter des pages personnalisées

Si vous avez des pages en dehors de Plasmic, modifiez `pages/api/sitemap.xml.ts` :

```typescript
// Ajoutez vos pages manuelles
const manualPages = [
  { path: '/contact', priority: 0.9 },
  { path: '/about', priority: 0.8 },
]
```

## 🚀 Déploiement

1. **Ajoutez la variable d'environnement** sur votre plateforme (Vercel, Netlify, etc.)
2. **Redéployez** votre application
3. **Testez** en visitant `/robots.txt` et `/sitemap.xml`

## 📊 Validation

### Outils de test
- [Google Search Console](https://search.google.com/search-console) - Pour tester le sitemap
- [Robots.txt Tester](https://www.google.com/webmasters/tools/robots-testing-tool)
- [XML Sitemap Validator](https://www.xml-sitemaps.com/validate-xml-sitemap.html)

### Commandes de vérification
```bash
# Tester en local
curl http://localhost:3001/robots.txt
curl http://localhost:3001/sitemap.xml
```

## 🔄 Maintenance

Les fichiers se mettent à jour automatiquement :
- **Cache** : 24h pour les performances
- **Données** : Basées sur les pages Plasmic actuelles
- **Configuration** : Modifiez `utils/seo-config.ts` selon vos besoins

## ⚠️ Notes importantes

- Les pages sont récupérées dynamiquement depuis Plasmic
- Le cache de 24h améliore les performances
- Les patterns avec `*` permettent d'exclure des dossiers entiers
- Pensez à soumettre votre sitemap à Google Search Console après déploiement 