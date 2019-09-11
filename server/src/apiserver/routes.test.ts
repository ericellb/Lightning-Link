import request from 'supertest';
import ApiServer from '.';

// Setup our api
const api = new ApiServer('3000');

describe('Tests the Creation / Retrieval of URLs', () => {
  it('should redirect us to a destination url for given short url', done => {
    request(api)
      .get('/0000000')
      .then(res => {
        expect(res.redirect).toBe(true);
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
      .query({ url: 'http://google.com' })
      .then(res => {
        expect(res.text).toBe('0000000');
        done();
      });
  });
});
