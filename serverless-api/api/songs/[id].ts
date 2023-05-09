import type { VercelRequest, VercelResponse } from '@vercel/node';
import { z } from 'zod';
import { eq } from 'drizzle-orm';
import { songs } from '../../db/schema';
import { db, superSecretKey } from '../../db/api_base';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const method = req.method;
  const bearer = req.headers.authorization;
  const token = bearer?.split(' ')[1];
  if (!token || token !== superSecretKey) {
    return res.status(401).json({ message: 'Not authorized' });
  }

  if (method === 'DELETE') {
    try {
      const id = Number(z.string().parse(req.query.id));
      if (isNaN(id)) throw new Error('Invalid id');
      await db.delete(songs).where(eq(songs.id, id));
      return res.status(204).json({});
    } catch (e) {
      return res.status(400).json({ message: 'Missing id' });
    }
  }

  return res.status(400).json({});
}
