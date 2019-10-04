import axios from 'axios';

const baseUrl = process.env.NODE_ENV === 'development' ? 'http://localhost:3001' : 'https://54.81.97.56:3001';

export default axios.create({
  baseURL: baseUrl
});
