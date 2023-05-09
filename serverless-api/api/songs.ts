import type { VercelRequest, VercelResponse } from '@vercel/node';
import { Pool } from 'pg';
import { drizzle } from 'drizzle-orm/node-postgres';
import { songs } from '../db/schema';
import { z } from 'zod';
import { eq } from 'drizzle-orm';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const db = drizzle(pool);
const superSecretKey = process.env.SUPER_SECRET_KEY;

const newSongValidator = z.object({
  title: z.string().min(1).max(127),
  artist: z.string().min(1).max(127),
  lyrics: z.string().min(1),
});

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const method = req.method;
  const bearer = req.headers.authorization;
  const token = bearer?.split(' ')[1];
  if (!token || token !== superSecretKey) {
    return res.status(401).json({ message: 'Not authorized' });
  }

  if (method === 'GET') {
    const allSongs = await db.select().from(songs);
    return res.json(allSongs);
  } else if (method === 'POST') {
    const newSong = newSongValidator.parse(req.body);
    const songInDB = (await db.insert(songs).values(newSong).returning())[0];
    return res.status(201).json(songInDB);
  } else if (method === 'DELETE') {
    const id = z.number().parse(req.query.id);
    if (!id) {
      return res.status(400).json({ message: 'Missing id' });
    }
    await db.delete(songs).where(eq(songs.id, id));
    return res.status(204).json({});
  }

  return res.status(204).json({});
}
