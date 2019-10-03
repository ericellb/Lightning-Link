import express from 'express';
import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { connection as sql } from '../db';
import { getUniqueId, generateId, userAuthed } from './utils';

export let router = express.Router();

const ACCESS_TOKEN_LENGTH = 100;

// Route to create a new user
// Expects -> userName
// Expects -> userPass
// Returns -> userId
router.post('/user/create', async (req: Request, res: Response) => {
  // Get query data from url
  let { userName, userPass } = req.query;
  let error = null;

  // Check for errors
  if (!userName || !userPass) {
    error = 'Missing Username / Password';
  } else if (userPass.length < 6) {
    error = 'Passwords need to be minimum 6 characters';
  }

  // If errors, send them
  if (error !== null) {
    res.status(401).send(error);
  } else {
    let response: any = await sql.query(`SELECT user_id from users where user_name = ${sql.escape(userName)}`);
    // User already exists
    if (response.length > 0) {
      error = 'Username already exists';
      res.status(401).send(error);
    }
    // No user exists, lets create it!
    else {
      const userId = await getUniqueId('user');
      const accessToken = generateId(ACCESS_TOKEN_LENGTH);
      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(userPass, salt, (err, hash) => {
          if (err) throw err;
          userPass = hash;
          var date = new Date();
          // Create user
          sql.query(
            `INSERT INTO users (user_id, user_name, user_pass, user_access_token, user_last_active) VALUES (${sql.escape(
              userId
            )}, ${sql.escape(userName)}, ${sql.escape(userPass)}, ${sql.escape(accessToken)}, ${sql.escape(date)})`
          );
          res
            .status(200)
            .cookie('access_token', accessToken, { httpOnly: true })
            .send({ userName: userName, userId: userId });
        });
      });
    }
  }
});

// Route to login
// Expects -> userName
// Expects -> userPass
// Returns -> userId
router.get('/user/login', async (req: Request, res: Response) => {
  const { userName, userPass } = req.query;
  let error = {};

  // Check params exist
  if (!userName || !userPass) {
    res.status(400).send('Missing Username / Password');
  }

  // Check if password matches, if so return userName and userId
  const response: any = await sql.query(`SELECT * FROM users WHERE user_name = '${userName}'`);
  const hashPass = response[0].user_pass;
  const isMatch = await bcrypt.compare(userPass, hashPass);
  if (isMatch) {
    let accessToken = generateId(ACCESS_TOKEN_LENGTH);
    sql.query(`UPDATE users SET user_access_token=${sql.escape(accessToken)} WHERE user_name=${sql.escape(userName)}`);
    res
      .status(200)
      .cookie('access_token', accessToken, { httpOnly: true })
      .send({ userName: userName, userId: response[0].user_id });
  } else {
    error = 'Username / Password does not match';
    res.status(400).send(error);
  }
});

// Route to check if user is authed
// Expects -> userName
// Expects -> access_token in HTTP Only Cookie
// Returns -> true or false
router.get('/user/authed', async (req: Request, res: Response) => {
  const { userId } = req.query;

  // Check params exist
  if (!userId) {
    res.status(400).send('Missing UserID');
  }

  let cookies = req.headers.cookie;
  let accessToken = '';
  if (cookies !== undefined) {
    let str = 'access_token';
    let index = cookies.indexOf('access_token');
    accessToken = cookies.slice(index + str.length + 1, cookies.length);
  }

  if (await userAuthed(userId, accessToken)) {
    res.send(true);
  } else {
    res.send(false);
  }
});