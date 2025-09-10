


async function seedTableIfEmpty(db: any, table: string, sqlUrl: string) {
  try {
    const [{ count }] = await db.exec(`SELECT COUNT(*) as count FROM ${table}`);
    if (count === 0) {
      const sql = await fetch(sqlUrl).then(r => r.text());
      console.log(`[ElectricSeed] Seeding table ${table} depuis ${sqlUrl}`);
      for (const stmt of sql.split(';').map(s => s.trim()).filter(Boolean)) {
        try {
          await db.exec(stmt);
        } catch (err) {
          console.warn(`[ElectricSeed] Erreur sur requête:`, stmt, err);
        }
      }
      console.log(`[ElectricSeed] Table ${table} seedée.`);
    } else {
      console.log(`[ElectricSeed] Table ${table} déjà remplie (${count} lignes).`);
    }
  } catch (err) {
    console.error(`[ElectricSeed] Erreur lors du seed de la table ${table}:`, err);
  }
}

import { useEffect } from 'react';

export function useElectricSeed(db: any) {
  useEffect(() => {
    if (!db) return;
    seedTableIfEmpty(db, 'lesion', '/imports/lesions.sql');
    seedTableIfEmpty(db, 'option', '/imports/options.sql');
    // Ajoute d'autres tables si besoin
  }, [db]);
}
