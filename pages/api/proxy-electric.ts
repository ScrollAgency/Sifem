import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.status(200).end();
    return;
  }

  const baseUrl = `http://${process.env.PROXY_URL}/v1/shape`;
  const url = new URL(baseUrl);

  Object.entries(req.query).forEach(([key, value]) => {
    if (value) url.searchParams.set(key, String(value));
  });

  try {
    const electricRes = await fetch(url.toString(), {
      method: req.method,
      headers: { 'Content-Type': 'application/json' },
      body: req.method !== 'GET' && req.body ? JSON.stringify(req.body) : undefined,
    });

    const headersToExpose = ['electric-offset', 'electric-handle', 'electric-schema', 'electric-cursor'];
    headersToExpose.forEach(header => {
      const val = electricRes.headers.get(header);
      if (val) {
        res.setHeader(header, val);
      }
    });

    res.setHeader('Access-Control-Expose-Headers', headersToExpose.join(', '));
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    const data = await electricRes.json();
    res.status(electricRes.status).json(data);
  } catch (err) {
    console.error('Erreur proxy ElectricSQL:', err);
    res.status(500).json({ error: 'Proxy failed' });
  }
}
