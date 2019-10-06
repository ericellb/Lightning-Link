import express, { response } from 'express';
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
    let slugs: { slug: string; destination: string }[] = [];
    rows.forEach((row: any, i: number) => {
      slugs[i] = { slug: row.urls_slug, destination: row.urls_destination };
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
  let { days } = req.query;

  // Default days to 7 if not given
  if (!days) {
    days = 7;
  }

  let accessToken = getAccessToken(req);

  if (await userAuthed(userId, accessToken)) {
    let analyticData = await getAnalyticData(slug, userId, days);
    res.send(analyticData);
  } else {
    res.status(401).send('Unauthorized Route');
  }
});

// Gets additional analytics on location for a specific Shortened URL
router.get('/analytic/:slug/:location', async (req: Request, res: Response) => {
  const { slug, location } = req.params;
  const { userId, type } = req.query;
  let { days } = req.query;

  // Default days to 7 if not given
  if (!days) {
    days = 7;
  }

  let accessToken = getAccessToken(req);

  if (await userAuthed(userId, accessToken)) {
    let analyticData = await getAnalyticLocationData(slug, userId, days, location, type);
    res.send(analyticData);
  } else {
    res.status(401).send('Unauthorized Route');
  }
});

// Gets Base analytic data for a specific slug (short url) (Total Visits + Base Location + Dates)
const getAnalyticData = async (slug: string, userId: string, days: number) => {
  // Get
  let totalVisits = `SELECT SUM(visits) as visits FROM analytics WHERE slug=${sql.escape(slug)} 
  UNION ALL `;
  let continents = ['AF', 'AN', 'AS', 'EU', 'NA', 'OC', 'SA'];
  let continentVisits = '';
  continents.forEach((continent, i) => {
    continentVisits += `SELECT SUM(b.visits) FROM urls_analytics AS a 
    JOIN analytics AS b ON a.urls_slug = b.slug 
    WHERE creator_user_id=${sql.escape(userId)} AND a.urls_slug=${sql.escape(slug)} AND b.continent=${sql.escape(
      continent
    )}`;
    if (i !== continents.length - 1) {
      continentVisits += ` 
      UNION ALL `;
    }
  });
  let lastNDays = `SELECT b.visit_date, b.visits FROM urls_analytics AS a 
  JOIN analytics AS b ON a.urls_slug = b.slug 
  WHERE creator_user_id=${sql.escape(userId)} 
  AND a.urls_slug=${sql.escape(slug)} AND b.visit_date >= (DATE(NOW()) - INTERVAL ${sql.escape(days)} DAY)`;

  let rows: any = await sql.query(totalVisits + continentVisits);
  let rows2: any = await sql.query(lastNDays);

  let response = <AnalyticData>{};
  response.location = [];
  response.dates = [];

  // Populate response with total visits + each continent
  rows.forEach((row: any, i: number) => {
    if (row.visits !== null && i == 0) {
      response.totalVisits = row.visits;
    } else if (row.visits !== null) {
      response.location.push({ location: continents[i - 1], visits: row.visits, type: 'continent' });
    }
  });

  rows2.forEach((row: any) => {
    response.dates.push({ date: row.visit_date, visits: row.visits });
  });

  return response;
};

// Gets and formats Analytical data on a specific location
const getAnalyticLocationData = async (slug: string, userId: string, days: number, location: string, type: string) => {
  // Type to search
  let locationTypes = ['continent', 'country', 'state', 'city'];
  let locationRequest: string | undefined;
  for (let i = 0; i < locationTypes.length; i++) {
    if (locationTypes[i] === type) {
      locationRequest = locationTypes[i + 1];
    }
  }

  // If city, we cant get any more data (frotnend should check for this too)
  if (typeof locationRequest === 'undefined') {
    return;
  }

  let locationQuery = `SELECT SUM(b.visits) as visits, b.${sql.escapeId(
    locationRequest
  )} as location FROM urls_analytics AS a 
  JOIN analytics AS b ON a.urls_slug = b.slug 
  WHERE creator_user_id=${sql.escape(userId)} 
  AND a.urls_slug=${sql.escape(slug)} 
  AND b.${sql.escapeId(type)}=${sql.escape(location)}
  AND b.visit_date >= (DATE(NOW()) - INTERVAL ${sql.escape(days)} DAY)
  GROUP BY b.${sql.escapeId(locationRequest)}`;

  let rows: any = await sql.query(locationQuery);
  let response: LocationData[] = [];
  rows.forEach((row: LocationData) => {
    response.push({ location: row.location, visits: row.visits, type: locationRequest });
  });

  return response;
};

interface AnalyticData {
  location: { location: string; visits: number; type: string }[];
  dates: { date: string; visits: number }[];
  totalVisits: number;
}

interface LocationData {
  location: string;
  visits: number;
  type: string | undefined;
}
