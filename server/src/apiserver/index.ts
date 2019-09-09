import express from 'express';
import { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import * as http from 'http';

export default class ApiServer {
  constructor(PORT: string) {
    let app = express();
    let server = http.createServer(app);

    // Server listen on Port
    server.listen(PORT, function() {
      console.log(`API Listening on ${PORT}`);
    });

    // Server setup
    app.disable('x-powered-by');
    app.use(cors());

    // Log the routes
    app.use((req: Request, res: Response, next: NextFunction) => {
      console.log(`
      API on port ${PORT} handled request 
      @ ${new Date().toString()} 
      To route ${req.originalUrl}`);
      next();
    });
  }
}
