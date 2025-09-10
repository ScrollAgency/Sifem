// scripts/generate-pwa-assets.js
// Génère la liste des fichiers images à pré-cacher pour next-pwa

const fs = require('fs');
const path = require('path');

const assetsDirs = [
  path.join(__dirname, '../public/lesions'),
  path.join(__dirname, '../public/plasmic'),
];

function walk(dir, baseUrl) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach((file) => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat && stat.isDirectory()) {
      results = results.concat(walk(filePath, baseUrl + '/' + file));
    } else {
      // On ne prend que les images et fichiers statiques
      if (/(\.png|\.jpg|\.jpeg|\.svg|\.webp|\.gif)$/i.test(file)) {
        results.push({ url: baseUrl + '/' + file, revision: null });
      }
    }
  });
  return results;
}

let allAssets = [];
for (const dir of assetsDirs) {
  if (fs.existsSync(dir)) {
    const baseUrl = '/'+path.relative(path.join(__dirname, '../public'), dir).replace(/\\/g, '/');
    allAssets = allAssets.concat(walk(dir, baseUrl));
  }
}

// Écrit le résultat dans un fichier JSON
fs.writeFileSync(path.join(__dirname, '../public/pwa-assets.json'), JSON.stringify(allAssets, null, 2));
console.log(`Généré: ${allAssets.length} assets dans public/pwa-assets.json`);
