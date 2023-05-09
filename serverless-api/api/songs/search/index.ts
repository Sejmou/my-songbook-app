import type { VercelRequest, VercelResponse } from '@vercel/node';
import { z } from 'zod';
import puppeteer from 'puppeteer';
import { superSecretKey } from '../../../db/api_base';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const method = req.method;
  const bearer = req.headers.authorization;
  const token = bearer?.split(' ')[1];
  if (!token || token !== superSecretKey) {
    return res.status(401).json({ message: 'Not authorized' });
  }

  if (method === 'GET') {
    try {
      const query = z.string().parse(req.query.q);
      await getLyricsSearchResults(query);
      return res.status(200).json({});
    } catch (e) {
      return res
        .status(400)
        .json({ message: 'Please provide a valid query string' });
    }
  }

  return res.status(400).json({});
}

async function getLyricsSearchResults(query: string) {
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();

  await page.goto(`https://genius.com/search?q=${query}`);

  const songSearchResults = await page.$$eval(
    'search-result-items',
    el =>
      Array.from(el[1].querySelectorAll('a')).map(el => ({
        title: el.querySelector('.mini_card-title')?.textContent?.trim(),
        artist: el.querySelector('.mini_card-subtitle')?.textContent?.trim(),
        link: el.getAttribute('href'),
      })) // second element is the song results, each result item is wrapped in an anchor tag
  );
  await browser.close();
  return songSearchResults;
}
