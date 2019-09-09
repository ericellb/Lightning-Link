import express from 'express';
import { Request, Response } from 'express';
import { connection as sql } from '../db';
import { MysqlError } from 'mysql';

export let router = express.Router();

// Route to get a short url given a original url
router.post('url', async (req: Request, res: Response) => {
  const { longUrl } = req.query;
  if (!longUrl) {
    res.status(400).send('Must provide a long url');
  } else {
    const shortUrl = getShortURL(longUrl);
  }
});

// Route to get original url given short url
router.get('url', async (req: Request, res: Response) => {
  const { shortUrl } = req.query;
  if (!shortUrl) {
    res.status(400).send('Must provide a short url');
  } else {
    const longUrl = getOriginalURL(shortUrl);
  }
});

// Will ALWAYS return a short URL
// Either returns a new short url, or one that already exist for given long url
export const getShortURL = (longUrl: string): string => {
  return longUrl;
};

// Will return short URL if exists, or null if none found
export const getOriginalURL = (shortUrl: string): string | null => {
  return shortUrl;
};
