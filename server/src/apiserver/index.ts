import express from 'express';
import { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import * as http from 'http';
import { rateLimit } from '../ratelimiter';

export default class ApiServer {
  constructor(PORT: string) {
    let app = express();
    let server = http.createServer(app);

    // Server setup
    app.disable('x-powered-by');
    app.use(cors());
    app.use(rateLimit);

    // Some test routes (TEMP)
    app.get('/:shortURL', function(req: Request, res: Response) {
      const { shortURL } = req.params;
      if (shortURL === '0000000') res.redirect('http://google.com');
      else res.status(404).send('Invalid Short URL');
    });

    app.post('/shorten', function(req: Request, res: Response) {
      const { url } = req.query;
      if (url === 'http://google.com') res.send('0000000');
    });

    app.use(function(req, res, next) {
      res.status(404).send('Route not found');
    });

    // Server listen on Port
    server.listen(PORT, function() {
      console.log(`API Server Listening on ${PORT}`);
    });

    return app;
  }
}
