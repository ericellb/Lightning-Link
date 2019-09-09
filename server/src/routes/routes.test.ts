import { getShortURL, getOriginalURL } from './url';

// No idea what shortURL will be, all we expect is a string
test('should return a short url (string) given a url', () => {
  expect(typeof getShortURL('http://google.com')).toBe('string');
});

// No idea what original url is, all we expect is a string
test('should return the original url given a short url that exists', () => {
  expect(typeof getOriginalURL('aaaaaa')).toBe('string');
});

// If giving a short url we know doesn't exist, should return null
test('should return null given a short url that doesnt exist', () => {
  expect(typeof getOriginalURL('aaaaaa')).toBe('null');
});

// If we already generated a short url for a given long url, it should return that instead of a new one
test('should return a previously generated short url for a long url', () => {
  const expectedShortUrl = 'aaaaaa';
  expect(getShortURL('http://google.com')).toBe(expectedShortUrl);
});
