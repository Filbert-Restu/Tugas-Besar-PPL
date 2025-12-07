import axios from 'axios';

const API_URL = 'http://localhost:8000';

const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
  withCredentials: true, // Enable cookies for session
});

// Get CSRF token before making requests
apiClient.interceptors.request.use(
  async (config) => {
    // Get CSRF cookie if not already set
    if (typeof window !== 'undefined') {
      const hasCsrfCookie = document.cookie.includes('XSRF-TOKEN');

      if (!hasCsrfCookie) {
        await axios.get(`${API_URL}/sanctum/csrf-cookie`, {
          withCredentials: true,
        });
      }
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
    // Only redirect to login if we're on a protected route (seller/admin)
    if (error.response && error.response.status === 401) {
      if (typeof window !== 'undefined') {
        const currentPath = window.location.pathname;
        const isProtectedRoute =
          currentPath.startsWith('/seller') || currentPath.startsWith('/admin');

        if (isProtectedRoute) {
          localStorage.removeItem('userRole');
          localStorage.removeItem('userData');
          window.location.href = '/login';
        }
      }
    }
    return Promise.reject(error);
  }
);

export default apiClient;
