import { createClient } from '@supabase/supabase-js';
import { Client } from 'pg';

// Config Supabase
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Config Postgres local
const LOCAL_PG_CONNECTION = 'postgres://electric:electric@localhost:54322/electric';

// Init clients
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
const localPgClient = new Client({ connectionString: LOCAL_PG_CONNECTION });

async function syncLesionTable() {
  await localPgClient.connect();

  // 1. Récupérer toutes les données locales
  const res = await localPgClient.query('SELECT * FROM lesion');

  // 2. Pousser les données dans Supabase via upsert
  for (const row of res.rows) {
    const { error } = await supabase
      .from('lesion')
      .upsert(row, { onConflict: 'id' });

    if (error) {
      console.error('Erreur upsert:', error);
    } else {
      console.log(`Synchronisé id=${row.id}`);
    }
  }

  await localPgClient.end();
}

syncLesionTable().catch(console.error);
