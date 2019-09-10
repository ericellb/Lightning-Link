import { Request, Response, NextFunction, request } from 'express';

// Rate limiting middleware for express
export const rateLimit = (req: Request, res: Response, next: NextFunction) => {
  // Insert Into DB IP ADDR and increment request count by 1
  const ipAddr = req.header('Remote-Addr');

  // Delete all requests more than 60 seconds old

  // Check if more than 10 request in last 60 seconds send 429 if exceeded
  if (ipAddr === '123.123.123.123') res.status(429).send('Too Many Requests');
  else next();
};
