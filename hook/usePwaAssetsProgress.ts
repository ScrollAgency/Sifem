// hook/usePwaAssetsProgress.ts
// Permet de suivre la progression du cache PWA des assets listés dans pwa-assets.json
import { useEffect, useState } from "react";

export function usePwaAssetsProgress() {
  const [progress, setProgress] = useState(0);
  const [complete, setComplete] = useState(false);

  useEffect(() => {
    let isMounted = true;
    async function checkCache() {
      if (!('caches' in window)) return;
      try {
        const res = await fetch('/pwa-assets.json');
        const assets = await res.json();
        const cacheNames = await caches.keys();
        // On cherche le cache PWA généré par next-pwa
        const swCacheName = cacheNames.find(name => name.startsWith('workbox-precache') || name.startsWith('next-pwa'));
        if (!swCacheName) return;
        const cache = await caches.open(swCacheName);
        let loaded = 0;
        for (const asset of assets) {
          const match = await cache.match(asset.url);
          if (match) loaded++;
          if (!isMounted) return;
          setProgress(Math.round((loaded / assets.length) * 100));
        }
        if (loaded === assets.length && isMounted) {
          setComplete(true);
        }
      } catch (e) {
        // ignore
      }
    }
    checkCache();
    // Optionnel: recheck toutes les 2s jusqu'à completion
    const interval = setInterval(() => {
      if (!complete) checkCache();
    }, 2000);
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [complete]);

  return { progress, complete };
}
