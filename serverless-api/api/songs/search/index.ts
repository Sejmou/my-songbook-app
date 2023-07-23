import type { VercelRequest, VercelResponse } from '@vercel/node';
import { z } from 'zod';
import { env } from '../../../db/api_base';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const method = req.method;
  const bearer = req.headers.authorization;
  const token = bearer?.split(' ')[1];
  if (!token || token !== env.SECRET_KEY) {
    return res.status(401).json({ message: 'Not authorized' });
  }

  if (method === 'GET') {
    try {
      const query = z.string().parse(req.query.q);
      const searchResults = await getLyricsSearchResults(query);
      return res.status(200).json(searchResults);
    } catch (e) {
      console.log(e);
      return res
        .status(400)
        .json({ message: 'Please provide a valid query string' });
    }
  }

  return res.status(400).json({});
}

async function getLyricsSearchResults(query: string) {
  const url = `https://api.genius.com/search?q=${query}`;
  const options = {
    headers: {
      Authorization: `Bearer ${env.GENIUS_ACCESS_TOKEN}`,
    },
  };
  const response = await fetch(url, options);
  const json = await response.json();

  const searchResults = json.response.hits;
  const songs = searchResults
    .filter((sr: any) => sr.type == 'song')
    .map((result: any) => {
      const song = result.result;
      const title = song.title;
      const artists = song.artist_names;
      const thumbnail = song.song_art_image_thumbnail_url;
      const url = song.url;
      return { title, artists, thumbnail, url };
    });

  return songs;
}
