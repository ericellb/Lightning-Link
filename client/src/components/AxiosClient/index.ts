import axios from 'axios';

const baseUrl = process.env.NODE_ENV === 'development' ? 'http://localhost:3001' : 'https://lb.ltng.link';

export default axios.create({
  baseURL: baseUrl
});
