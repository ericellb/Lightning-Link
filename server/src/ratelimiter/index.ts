import { Request, Response, NextFunction, request } from 'express';
import bluebird from 'bluebird';
import redis from 'redis';
import { checkServerIdentity } from 'tls';

let MAX_REQUESTS = 10;
let TIME_EXPIRE = 10000;
let REDIS_IP = '127.0.0.1';
let REDIS_PORT = 6379;

// Open redis client
const oldRedisClient = redis.createClient(REDIS_PORT, REDIS_IP);
const redisClient: any = bluebird.promisifyAll(oldRedisClient) as redis.RedisClient;
redisClient.on('error', () => {
  console.log('coulnt connect to redis server');
});

// Rate limiting middleware for express
export const rateLimit = async (req: Request, res: Response, next: NextFunction) => {
  // Get IP and Current Time
  const newRequest = {
    ip: req.ip,
    date: new Date()
  };

  // Get user rate info from redis
  let prevRequests = await redisClient.getAsync(newRequest.ip);
  let userRequests: any = [];

  // Get and push new requests in
  if (prevRequests === null) {
    userRequests.push(newRequest);
  } else {
    userRequests = JSON.parse(prevRequests);
    userRequests.push(newRequest);
  }

  // Filter out any requests older than our constraints
  userRequests = removeOldRequests(userRequests);

  // Set new rates
  redisClient.set(newRequest.ip, JSON.stringify(userRequests));

  // If not limited, route request normally
  if (isLimited(userRequests)) {
    res.status(429).send('Rate limited, please slow down!');
  } else {
    next();
  }
};

const isLimited = (requests: []) => {
  if (requests.length > MAX_REQUESTS) {
    return true;
  } else return false;
};

// Removes all requests older than 10sec
const removeOldRequests = (requests: []) => {
  let curDate = new Date().getTime();
  let tempRequests: any = [];
  requests.forEach((request: { ip: string; date: Date }) => {
    request.date = new Date(request.date);
    if (!(request.date.getTime() + TIME_EXPIRE < curDate)) {
      tempRequests.push(request);
    }
  });
  return tempRequests;
};
