import express from 'express';
import { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import * as http from 'http';
import { router as counterRoute } from './routes';

export default class CounterServer {
  constructor(PORT: string) {
    let app = express();
    let server = http.createServer(app);

    // Server listen on Port
    server.listen(PORT, function() {
      console.log(`Counter Server Listening on ${PORT}`);
    });

    // Server setup
    app.disable('x-powered-by');
    app.use(cors());

    // Setup route
    app.use(counterRoute);

    return server;
  }
}
