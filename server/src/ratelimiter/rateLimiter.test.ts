import request from 'supertest';
import { Request, Response } from 'express';
import ApiServer from '../apiserver';

// Setup our api
const api = new ApiServer('3001');

describe('Tests our Rate Limiter', () => {
  test('should rate limit after 5 bad requests', done => {
    request(api)
      .get('/foo')
      .set('Remote-Addr', '123.123.123.123');
    request(api)
      .get('/foo')
      .set('Remote-Addr', '123.123.123.123');
    request(api)
      .get('/foo')
      .set('Remote-Addr', '123.123.123.123');
    request(api)
      .get('/foo')
      .set('Remote-Addr', '123.123.123.123');
    request(api)
      .get('/foo')
      .set('Remote-Addr', '123.123.123.123')
      .expect(429, done);
  });
});
