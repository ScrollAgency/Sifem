import type { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const { dir } = req.query;
  // Si aucun paramètre, on liste public/lesions et public/plasmic
  if (!dir || typeof dir !== 'string') {
    const folders = [
      { base: 'lesions', baseDir: path.join(process.cwd(), 'public', 'lesions') },
      { base: 'plasmic', baseDir: path.join(process.cwd(), 'public', 'plasmic') }
    ];
    try {
      const allResults = [];
      for (const { base, baseDir } of folders) {
        if (!fs.existsSync(baseDir)) continue;
        const files = fs.readdirSync(baseDir);
        for (const file of files) {
          const filePath = path.join(baseDir, file);
          const stats = fs.statSync(filePath);
          allResults.push({
            name: file,
            id: `${base}/${file}`,
            created_at: stats.birthtime,
            updated_at: stats.mtime,
            last_accessed_at: stats.atime,
            metadata: {
              size: stats.size,
              mimetype: path.extname(file),
              lastModified: stats.mtime,
            },
            url: `/${base}/${file}`,
          });
        }
      }
      return res.status(200).json(allResults);
    } catch (err) {
      return res.status(500).json({ error: 'Failed to read directories', details: String(err) });
    }
  }

  // Si paramètre dir fourni, on garde l'ancien comportement pour image_map
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
        id: file,
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
