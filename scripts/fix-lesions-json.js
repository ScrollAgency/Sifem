// Script de correction des JSON pour correspondre au SQL
// Usage: node fix-lesions-json.js

const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../public/lesions.json');
const raw = fs.readFileSync(filePath, 'utf8');
const data = JSON.parse(raw);

function fixValue(val, key) {
  // Corrige les booléens
  if (key === 'multi_step' || key === 'has_options') {
    if (val === 'TRUE') return true;
    if (val === 'FALSE') return false;
    if (val === null) return null;
    return !!val;
  }
  // Corrige les chaînes vides en null pour les champs SQL NULL
  if (val === '') return null;
  return val;
}

const fixed = data.map(obj => {
  const out = {};
  for (const key in obj) {
    out[key] = fixValue(obj[key], key);
  }
  return out;
});

fs.writeFileSync(filePath, JSON.stringify(fixed, null, 2), 'utf8');
console.log('Correction terminée: lesions.json est conforme au SQL.');
