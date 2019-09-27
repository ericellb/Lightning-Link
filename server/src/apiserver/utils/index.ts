import { connection as sql } from '../../db';
import { Request, Response } from 'express';
import request from 'request';

// Returns true if user exists in DB, false if not
export const userExists = async (userId: string) => {
  const sqlQuery = `SELECT * FROM users WHERE user_id = '${userId}'`;
  let response: any = await sql.query(sqlQuery);
  if (response.length > 0) return true;
  else return false;
};

// Gets a Server Id and checks if it is unique in DB
export const getUniqueId = async (type: string): Promise<string> => {
  const id = generateId();
  let sqlQuery = '';
  if (type === 'server') sqlQuery = `SELECT * FROM servers WHERE server_id = '${id}'`;
  else if (type === 'channel') sqlQuery = `SELECT * FROM channels WHERE channel_id = '${id}'`;
  else if (type === 'user') sqlQuery = `SELECT * FROM users WHERE user_id = '${id}'`;
  let response: any = await sql.query(sqlQuery);
  if (response.length > 0) {
    return getUniqueId(type);
  } else return id;
};

// Convert from base 10 to base 62
export const base62 = (count: number): string => {
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

// Updates local count, and count on server (DB)
export const updateCount = async (req: Request) => {
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

// Generates a hexdecimal 10 character string
const generateId = () => {
  let result = '';
  let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let charactersLength = characters.length;
  for (let i = 0; i < 10; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
};
