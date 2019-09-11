import express from 'express';
import { Request, Response } from 'express';
import { connection as sql } from '../db';
import { MysqlError } from 'mysql';

export let router = express.Router();

// Route to get original url given short url
router.get('/count', async (req: Request, res: Response) => {
  const { serverPort } = req.query;
  if (!serverPort) {
    res.status(400).send('Must provide a server port / id');
  } else {
    const startCount = await getCount(serverPort);
    res.status(200).send(startCount);
  }
});
// Will return the current count of given server
// If server does not have a count / exceeded their current count
// Will create a new count range for them
export const getCount = async (serverPort: string) => {};

// DB SCHEMA FOR Counter Table
// id - serverId - start_count - current_count - exhausted
