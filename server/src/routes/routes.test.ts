import { getShortURL, getOriginalURL } from './url';

// No idea what shortURL will be, all we expect is a string
test('should return a short url (string) given a url', () => {
  expect(typeof getShortURL('http://google.com').toBe('string'));
});

// No idea what original url is, all we expect is a string
test('should return the original url given the short url', () => {
  expect(typeof getOriginalURL('aaaaaa').toBe('string'));
});
