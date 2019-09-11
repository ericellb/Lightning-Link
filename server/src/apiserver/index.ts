import express from 'express';
import { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import * as http from 'http';
import { rateLimit } from '../ratelimiter';
import { router as urlShortner } from './routes';
import request from 'request';

export default class ApiServer {
  constructor(counterURL: string, Port: string) {
    // Start app
    let app = express();
    let server = http.createServer(app);

    // Set app count (able to access in routes)
    app.set('count', 0);

    // Server setup
    app.disable('x-powered-by');
    app.use(cors());
    app.use(rateLimit);

    // Bind routes
    app.use(urlShortner);

    app.use(function(req, res, next) {
      res.status(404).send('Route not found');
    });

    // Server listen on Port
    server.listen(Port, function() {
      console.log(`API Server Listening on ${Port}`);
    });

    // Get count from counter server
    request(`http://localhost:3002/count?serverPort=3004`, (err, res, body) => {
      let counts = JSON.parse(body);
      app.set('count', counts.currentCount);
    });

    return app;
  }
}
