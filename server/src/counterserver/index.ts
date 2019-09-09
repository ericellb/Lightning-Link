import express from 'express';
import { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import * as http from 'http';

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

    // Log the routes
    app.use((req: Request, res: Response, next: NextFunction) => {
      console.log(`
      Counter Server on port ${PORT} handled request for new counter
      @ ${new Date().toString()} 
      To Api Server on port ${req.socket.remotePort}`);
      next();
    });
  }
}
