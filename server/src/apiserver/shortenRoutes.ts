import express from 'express';
import { Request, Response } from 'express';
import { connection as sql } from '../db';
import request from 'request';
import bluebird from 'bluebird';
import redis from 'redis';

// Open redis client
let REDIS_URL_EXPIRE = 600 * 1000; // 10 minutes
let REDIS_IP = '127.0.0.1';
let REDIS_PORT = 6379;
const oldRedisClient = redis.createClient(REDIS_PORT, REDIS_IP);
const redisClient: any = bluebird.promisifyAll(oldRedisClient) as redis.RedisClient;
redisClient.on('error', () => {
  console.log('couldnt connect to redis server');
});

export let router = express.Router();

// Route to get original url given short url
router.get('/:slug', async (req: Request, res: Response) => {
  const { slug } = req.params;
  if (!slug) {
    res.status(400).send('Must provide a short url');
  } else {
    let destination = await getOriginalURL(slug);
    if (destination) {
      var urlTest = new RegExp('^(http|https)://');
      if (!urlTest.test(destination)) {
        destination = 'http://' + destination;
      }
      res.send(destination);
    } else {
      res.status(404).send('ShortURL not found!');
    }
  }
});

// Route to get a short url given a original url
router.post('/shorten', async (req: Request, res: Response) => {
  let count = req.app.get('startCount') + req.app.get('currentCount');
  let { destination, forcenewurl } = req.query;
  if (forcenewurl === undefined) {
    forcenewurl = '0';
  }
  if (destination) {
    // Check redis store for URL first (prevent some duplicates while still low response time)
    let cachedSlug = await redisClient.getAsync(destination);
    if (cachedSlug && forcenewurl === '0') {
      res.send(cachedSlug);
    } else {
      // Create slug based on count
      const slug = getShortURL(count, destination);
      updateCount(req);
      res.send(slug);
    }
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
  redisClient.set(destination, slug, 'EX', REDIS_URL_EXPIRE);
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
