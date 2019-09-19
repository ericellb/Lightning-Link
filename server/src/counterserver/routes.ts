import express from 'express';
import { Request, Response } from 'express';
import { connection as sql } from '../db';
import { MysqlError } from 'mysql';

export let router = express.Router();

// Route to get current count of given server (Identified by server port for now)
router.get('/count', async (req: Request, res: Response) => {
  const { serverPort } = req.query;
  if (!serverPort) {
    res.status(400).send('Must provide a server port / id');
  } else {
    const counts = await getCount(serverPort);
    res.status(200).send(counts);
  }
});

router.get('/newcount', async (req: Request, res: Response) => {
  const { serverPort } = req.query;
  if (!serverPort) {
    res.status(400).send('Must provide a server port / id');
  } else {
    const counts = await newCount(serverPort);
    res.status(200).send(counts);
  }
});

// Will return the current count of given server
// If server does not have a count / exceeded their current count
// Will create a new count range for them
export const getCount = async (serverPort: string) => {
  // If current non exhausted count exists for given serverId return it
  let rows: any = await sql.query(`SELECT * from counters WHERE server_id=${sql.escape(serverPort)} AND exhausted='0'`);
  if (rows[0]) {
    return { startCount: rows[0].start_count, currentCount: rows[0].current_count };
  }

  return newCount(serverPort);
};

// Gets a new count range
export const newCount = async (serverPort: string) => {
  // If no rows for our serverId or all counts for serverId exhausted create a new one
  let rows: any = await sql.query(`SELECT * FROM counters ORDER BY id DESC LIMIT 1`);
  const lastId = rows[0].id + 1;
  let startCount = lastId * 1000000;
  await sql.query(
    `INSERT INTO counters (server_id, start_count, current_count, exhausted) VALUES (${sql.escape(
      serverPort
    )}, ${startCount}, '0', '0')`
  );
  return { startCount: startCount, currentCount: 0 };
};
