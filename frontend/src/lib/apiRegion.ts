import axios from 'axios';

const apiRegion = axios.create({
  baseURL: 'https://api-regional-indonesia.vercel.app/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

export default apiRegion;
