import request from 'supertest';
import CounterServer from '.';

// Setup our api
const counterServer = new CounterServer('3010');

describe('Test Requesting / Creating new Counts (Used to create shortURL)', () => {
  it('should return to us the start and current count for serverId with no exhausted range', done => {
    request(counterServer)
      .get('/count')
      .query({ serverPort: '3004' })
      .then(res => {
        expect(res.body).toStrictEqual({ startCount: 0, currentCount: 0 });
        done();
      });
  });
});
