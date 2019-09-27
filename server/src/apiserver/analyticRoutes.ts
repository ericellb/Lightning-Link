import express from 'express';
import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { connection as sql } from '../db';
import { getUniqueId } from './utils';

export let router = express.Router();

router.get('/analytic/:slug', async (req: Request, res: Response) => {
  const { slug } = req.params;
  const { userId } = req.query;
  if (userCreatedRoute(slug, userId)) {
    res.send(await getAnalyticData(slug, userId));
  } else {
    res.status(401).send('Unauthorized Route');
  }
});

const userCreatedRoute = async (slug: string, userId: string) => {
  let rows = await getUrlAnalytic(slug, userId);
  if (rows[0]) return true;
  else return false;
};

const getAnalyticData = async (slug: string, userId: string) => {
  let rows = await getUrlAnalytic(slug, userId);
  return rows[0];
};

const getUrlAnalytic = async (slug: string, userId: string) => {
  let rows: any = await sql.query(
    `SELECT * from urls_analytics WHERE creator_user_id=${sql.escape(userId)} AND urls_slug=${sql.escape(slug)}`
  );
  return rows;
};
