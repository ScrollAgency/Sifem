import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const baseUrl = 'http://localhost:5133/v1/shape';
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

    const headersToExpose = ['electric-offset', 'electric-handle', 'electric-schema'];
    headersToExpose.forEach(header => {
      const val = electricRes.headers.get(header);
      if (val) {
        res.setHeader(header, val);
      }
    });

    res.setHeader('Access-Control-Expose-Headers', headersToExpose.join(', '));

    const data = await electricRes.json();
    res.status(electricRes.status).json(data);
  } catch (err) {
    console.error('Erreur proxy ElectricSQL:', err);
    res.status(500).json({ error: 'Proxy failed' });
  }
}
