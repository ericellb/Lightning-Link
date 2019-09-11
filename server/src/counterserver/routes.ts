import express from 'express';
import { Request, Response } from 'express';
import { connection as sql } from '../db';
import { MysqlError } from 'mysql';

export let router = express.Router();

// Route to get original url given short url
router.get('count', async (req: Request, res: Response) => {
  const { serverPort } = req.query;
  if (!serverPort) {
    res.status(400).send('Must provide a short url');
  } else {
    const longUrl = getCount(serverPort);
  }
});

// Will return the current count of given server
// If server does not have a count / exceeded their current count
// Will create a new count range for them
export const getCount = (serverPort: string) => {
  // Query DB for current non exhausted count
  let res = sql.query(`SELECT * from counters WHERE serverId=${sql.escape(serverPort)} AND exhausted='0'`);
  // If all counts exhausted create a new one

  // Return the current count
};

// DB SCHEMA FOR Counter Table
// id - serverId - start_count - current_count - exhausted
