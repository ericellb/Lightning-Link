import express from 'express';
import { Request, Response, NextFunction } from 'express';
import request from 'request';
import * as http from 'http';

export default class LoadBalancer {
  constructor(PORT: string, serverList: string[]) {
    // List the servers we plan to use
    const servers = serverList;

    // Count for what server to pipe messages to
    let cur = 0;

    // Handles routing request in round robin format
    const handler = (req: Request, res: Response) => {
      const _req = request({ url: servers[cur] + req.url }).on('error', error => {
        res.status(500).send(error.message);
      });
      req.pipe(_req).pipe(res);
      cur = (cur + 1) % servers.length;
    };

    // Match all request types and routes to handler method
    const server = express().all('*', handler);

    // Server listen on Port
    server.listen(PORT, function() {
      console.log(`Load balancer Listening on ${PORT}`);
    });

    return server;
  }
}
