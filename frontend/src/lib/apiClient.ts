import axios from 'axios';
// import { useRouter } from 'next/navigation'; // (Opsional, untuk penanganan 401)

const API_URL = 'http://localhost:8000';

const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

apiClient.interceptors.request.use(
  (config) => {
    let token: string | null = null;
    if (typeof window !== 'undefined') {
      token = localStorage.getItem('authToken');
    }

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('authToken');
        window.location.href = '/';
      }
    }
    return Promise.reject(error);
  }
);

export default apiClient;
