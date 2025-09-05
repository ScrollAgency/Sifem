import type { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const { dir } = req.query;
  if (!dir || typeof dir !== 'string') {
    return res.status(400).json({ error: 'Missing or invalid dir parameter' });
  }

  // Only allow access to public/lesions/image_map/*
  const baseDir = path.join(process.cwd(), 'public', 'lesions', 'image_map');
  const targetDir = path.join(baseDir, dir.replace(/^\/+/, ''));

  if (!targetDir.startsWith(baseDir)) {
    return res.status(403).json({ error: 'Forbidden' });
  }

  try {
    const files = fs.readdirSync(targetDir);
    const result = files.map((file) => {
      const filePath = path.join(targetDir, file);
      const stats = fs.statSync(filePath);
      return {
        name: file,
        id: file, // You can generate a uuid if needed
        created_at: stats.birthtime,
        updated_at: stats.mtime,
        last_accessed_at: stats.atime,
        metadata: {
          size: stats.size,
          mimetype: path.extname(file),
          lastModified: stats.mtime,
        },
        url: `/lesions/image_map/${dir}/${file}`,
      };
    });
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ error: 'Failed to read directory', details: String(err) });
  }
}
