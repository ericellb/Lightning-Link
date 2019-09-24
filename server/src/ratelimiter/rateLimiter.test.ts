import request from 'supertest';
import ApiServer from '../apiserver';
import CounterServer from '../counterserver';

// Setup our api
const counter = new CounterServer('3001');
const api = new ApiServer('http://localhost:3001', '3005');

describe('Tests our Rate Limiter', () => {
  test('should rate limit after 5 bad requests', done => {
    request(api)
      .get('/foo')
      .end(() => {
        request(api)
          .get('/foo')
          .end(() => {
            request(api)
              .get('/foo')
              .end(() => {
                request(api)
                  .get('/foo')
                  .end(() => {
                    request(api)
                      .get('/foo')
                      .end(() => {
                        request(api)
                          .get('/foo')
                          .end(() => {
                            request(api)
                              .get('/foo')
                              .end(() => {
                                request(api)
                                  .get('/foo')
                                  .end(() => {
                                    request(api)
                                      .get('/foo')
                                      .end(() => {
                                        request(api)
                                          .get('/foo')
                                          .expect(429, done);
                                      });
                                  });
                              });
                          });
                      });
                  });
              });
          });
      });
  });
});
