// Script Node.js pour convertir un fichier SQL d'inserts en JSON
// Usage : node scripts/sql-to-json.js imports/lesions.sql imports/lesions.json

const fs = require('fs');
const path = require('path');

function parseSqlInsert(sql) {
  // Extrait les lignes INSERT INTO ... VALUES (...), (...), ...; (plus tolérant)
  const regex = /INSERT INTO\s+\w+\s*\(([^)]+)\)\s*VALUES\s*([\s\S]+?);/gi;
  const matches = [...sql.matchAll(regex)];
  if (matches.length === 0) return [];

  const columns = matches[0][1].split(',').map(c => c.trim());
  let valuesRaw = matches[0][2].replace(/\n/g, ' ').replace(/\r/g, ' ');
  // Nettoie les espaces et retours à la ligne inutiles
  valuesRaw = valuesRaw.replace(/\s+/g, ' ');
  // Sépare chaque tuple de valeurs
  const tuples = valuesRaw.split(/\),\s*\(/).map(t => t.replace(/^\(|\)$/g, ''));

  return tuples.map(tuple => {
    // Sépare chaque valeur, gère les quotes et NULL
    const values = tuple.split(/,(?=(?:[^']*'[^']*')*[^']*$)/).map(v => {
      v = v.trim();
      if (v === 'NULL') return null;
      if (v.startsWith("'")) return v.slice(1, -1).replace(/''/g, "'");
      if (!isNaN(Number(v))) return Number(v);
      return v;
    });
    const obj = {};
    columns.forEach((col, i) => {
      let val = values[i];
      // Si le champ est string et null, on met "" à la place
      if (
        val === null && (
          col.match(/(_fr|_en|name|category|image|video|macro_category|face)/i)
        )
      ) {
        val = "";
      }
      obj[col] = val;
    });
    return obj;
  });
}

if (process.argv.length < 4) {
  console.error('Usage: node sql-to-json.js <input.sql> <output.json>');
  process.exit(1);
}

const inputPath = process.argv[2];
const outputPath = process.argv[3];
const sql = fs.readFileSync(inputPath, 'utf8');
const data = parseSqlInsert(sql);
fs.writeFileSync(outputPath, JSON.stringify(data, null, 2), 'utf8');
console.log(`Converti ${data.length} lignes de ${inputPath} vers ${outputPath}`);
