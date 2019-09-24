import request from 'supertest';
import CounterServer from '.';

// Setup our api
const counterServer = new CounterServer('3010');

describe('Test Requesting / Creating new Counts (Used to create shortURL)', () => {
  it('should return to us the start and current count for serverId with no exhausted range', done => {
    request(counterServer)
      .get('/count')
      .query({ serverPort: '3003' })
      .then(res => {
        console.log(res.body);
        expect(res.body).toHaveProperty('startCount');
        expect(res.body).toHaveProperty('currentCount');
        done();
      });
  });
});
