import request from 'supertest';
import ApiServer from '.';
import CounterServer from '../counterserver';

// Setup our api
const counter = new CounterServer('3001');
const api = new ApiServer('http://localhost:3001', '3002');

describe('Tests the Creation / Retrieval of URLs', () => {
  it('should redirect us to a destination url for given short url', done => {
    request(api)
      .get('/0004c92')
      .then(res => {
        expect(typeof res.text).toBe('string');
        done();
      });
  });

  it('should throw a 404 given an invalid short url', done => {
    request(api)
      .get('/ZZZZZZZ')
      .then(res => {
        expect(404);
        done();
      });
  });

  it('should generate a new short url given a destination url', done => {
    request(api)
      .post('/shorten')
      .query({ destination: 'http://google.com' })
      .then(res => {
        expect(typeof res.text).toBe('string');
        done();
      });
  });
});
