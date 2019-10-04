import express from 'express';
import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { connection as sql } from '../db';
import { getUniqueId, userAuthed, getAccessToken } from './utils';

export let router = express.Router();

// Gets a list of all Slugs this user is a Creator of
router.get('/analytic/all', async (req: Request, res: Response) => {
  const { userId } = req.query;

  if (!userId) {
    res.send('Missing UserID');
  }

  let accessToken = getAccessToken(req);

  // Protected route, make sure user is authed
  if (await userAuthed(userId, accessToken)) {
    let rows: any = await sql.query(`SELECT * FROM urls_analytics WHERE creator_user_id=${sql.escape(userId)}`);
    let slugs: String[] = [];
    rows.forEach((row: any, i: number) => {
      slugs[i] = row.urls_slug;
    });
    res.send(slugs);
  } else {
    res.status(401).send('Unauthorized Route');
  }
});

// Gets analytics for a specific Shortened URL
router.get('/analytic/:slug', async (req: Request, res: Response) => {
  const { slug } = req.params;
  const { userId } = req.query;

  let accessToken = getAccessToken(req);

  if (await userAuthed(userId, accessToken)) {
    if (await userCreatedRoute(slug, userId)) {
      res.send(await getAnalyticData(slug, userId));
    } else {
      res.status(401).send('Unauthorized Route');
    }
  } else {
    res.status(401).send('Unauthorized Route');
  }
});

// Check if user created that specific slug
const userCreatedRoute = async (slug: string, userId: string) => {
  let rows = await getUrlAnalytic(slug, userId);
  if (rows[0] !== undefined) {
    return true;
  } else {
    return false;
  }
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
