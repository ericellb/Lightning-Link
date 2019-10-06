import express from 'express';
import { Request, Response } from 'express';
import { connection as sql } from '../db';
import { base62, updateCount, setAnalyticData } from './utils';
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
    let destination = await getOriginalURL(req, slug);
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
  let { destination, forceNewUrl, userId } = req.query;
  if (forceNewUrl === undefined) {
    forceNewUrl = '0';
  }
  if (destination) {
    // Check redis store for URL first (prevent some duplicates while still low response time)
    let cachedSlug = await redisClient.getAsync(destination);
    if (cachedSlug && forceNewUrl === '0') {
      res.send(cachedSlug);
    } else {
      // Create slug based on count
      const slug = getShortURL(count, destination, userId);
      updateCount(req);
      res.send(slug);
    }
  } else {
    res.status(400).send('Must provide a long url');
  }
});

// Returns a new slug (shortURL) for given destination URL
export const getShortURL = (count: number, destination: string, userId: string | undefined): string => {
  // Generate our slug based on counter
  const slug = base62(count);
  let analytics = 0;
  if (userId !== undefined) {
    analytics = 1;
  }
  // Store slug and destination in our database
  sql.query(
    `INSERT INTO urls (slug, destination, analytics) VALUES (${sql.escape(slug)}, ${sql.escape(
      destination
    )}, ${sql.escape(analytics)})`
  );
  redisClient.set(destination, slug, 'EX', REDIS_URL_EXPIRE);

  // If user id given (user logged in) attach the URL to his Userid for analytics
  // Only creator of URL can view analytics on a url
  if (userId) {
    sql.query(
      `INSERT INTO urls_analytics (urls_slug, urls_destination, creator_user_id) 
       VALUES (${sql.escape(slug)}, ${sql.escape(destination)}, ${sql.escape(userId)})`
    );
  }

  // Return the slug
  return slug;
};

// Returns the original URL given a slug (shortURL)
export const getOriginalURL = async (req: Request, slug: string): Promise<string | null> => {
  // Query our Database for given slug
  let rows: any = await sql.query(`SELECT * FROM urls WHERE BINARY slug=${sql.escape(slug)}`);

  // We found an entry
  if (rows[0]) {
    // If URL Supports Analytics (Created by logged in user)
    // Set some analytic data
    if (rows[0].analytics === 1) {
      setAnalyticData(req, slug);
    }
    return rows[0].destination as string;
  }
  // If no destination url for given short url return null
  return null;
};
