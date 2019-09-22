import { Request, Response, NextFunction, request } from 'express';

let clients: any = [];
let MAX_REQUESTS = 5;
let TIME_EXPIRE = 60000;

// Rate limiting middleware for express
export const rateLimit = (req: Request, res: Response, next: NextFunction) => {
  // Get IP and Current Time
  const newRequest = {
    ip: req.ip,
    date: new Date()
  };

  // Push into client list this new request
  if (clients[newRequest.ip] === undefined) {
    clients[newRequest.ip] = [];
  }
  clients[newRequest.ip].push(newRequest);

  // Remove requests more than 1 mintue ago
  removeOldRequests(newRequest.ip);

  console.log(clients[newRequest.ip]);

  // Delete all requests more than 60 seconds old
  if (isLimited(newRequest.ip)) {
    res.status(429).send('Rate limited, please slow down!');
  } else {
    next();
  }
};

const isLimited = (ip: string) => {
  if (clients[ip].length > MAX_REQUESTS) {
    return true;
  } else return false;
};

// Removes all requests older than 10sec
const removeOldRequests = (ip: string) => {
  let curDate = new Date().getTime();
  let tempClients: any = [];
  tempClients[ip] = [];
  clients[ip].forEach((request: { ip: string; date: Date }) => {
    if (!(request.date.getTime() + TIME_EXPIRE < curDate)) {
      tempClients[ip].push(request);
    }
  });
  clients[ip] = tempClients[ip];
};
