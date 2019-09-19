import express from 'express';
import { Request, Response } from 'express';
import { connection as sql } from '../db';
import request from 'request';
import { MysqlError } from 'mysql';

export let router = express.Router();

// Route to get original url given short url
router.get('/:slug', async (req: Request, res: Response) => {
  const { slug } = req.params;
  if (!slug) {
    res.status(400).send('Must provide a short url');
  } else {
    const destination = await getOriginalURL(slug);
    res.send(destination);
  }
});

// Route to get a short url given a original url
router.post('/shorten', async (req: Request, res: Response) => {
  let count = req.app.get('startCount') + req.app.get('currentCount');
  const { destination } = req.query;
  if (destination) {
    // Create slug based on count
    const slug = getShortURL(count, destination);
    updateCount(req);
    res.send(slug);
  } else {
    res.status(400).send('Must provide a long url');
  }
});

// Returns a new slug (shortURL) for given destination URL
export const getShortURL = (count: number, destination: string): string => {
  // Generate our slug based on counter
  const slug = base62(count);
  // Store slug and destination in our database
  sql.query(`INSERT INTO urls (slug, destination) VALUES (${sql.escape(slug)}, ${sql.escape(destination)})`);
  // Return the slug
  return slug;
};

// Returns the original URL given a slug (shortURL)
export const getOriginalURL = async (slug: string): Promise<string | null> => {
  // Query our Database for given slug
  let rows: any = await sql.query(`SELECT * FROM urls WHERE slug=${sql.escape(slug)}`);
  if (rows[0]) {
    return rows[0].destination as string;
  }
  // If no destination url for given short url return null
  return null;
};

// Updates local count, and count on server (DB)
const updateCount = async (req: Request) => {
  // Increment local counter
  let currentCount = req.app.get('currentCount');
  let count = req.app.get('startCount') + currentCount + 1;
  let endCount = req.app.get('startCount') + 1000000;
  req.app.set('currentCount', currentCount + 1);
  let counterURL = req.app.get('counterURL');
  let port = req.app.get('port');

  // Let counter server know we incremented (will insert to DB)
  request.post(`${counterURL}/count?serverPort=${port}&count=${currentCount + 1}`);

  // If we exceeded our count range ask server for new range!
  if (count >= endCount) {
    request(`${counterURL}/newcount?serverPort=${port}`, (err, res, body) => {
      let counts = JSON.parse(body);
      req.app.set('startCount', counts.startCount);
      req.app.set('currentCount', counts.currentCount);
    });
  }
};

// Convert count from base 10 to base 62
const base62 = (count: number): string => {
  let uniqueId = '';
  let chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';

  while (count > 0) {
    uniqueId = chars[count % 62] + uniqueId;
    count = Math.floor(count / 62);
  }

  // Pad with zeroes 7 chars
  while (uniqueId.length < 7) {
    uniqueId = 0 + uniqueId;
  }

  return uniqueId;
};
