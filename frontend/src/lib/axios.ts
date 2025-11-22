import axios from 'axios';

// 1. Buat Instance Axios
const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api',
  headers: {
    'Accept': 'application/json',
  },
  withCredentials: true, // Penting untuk Sanctum
});

// 2. Fungsi Helper untuk mengambil Value dari Cookie Browser
const getCookie = (name: string) => {
  if (typeof document === 'undefined') return null;
  
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(';').shift();
  return null;
};

// 3. INTERCEPTOR: "Satpam" yang mencegat request
apiClient.interceptors.request.use(
  (config) => {
    // --- A. LOGIKA AUTH TOKEN (BEARER) ---
    const adminToken = getCookie('admin_token');
    const sellerToken = getCookie('seller_token');

    let token;
    if (config.url?.includes('/admin')) {
        token = adminToken;
    } else if (config.url?.includes('/sellers')) {
        token = sellerToken;
    } else {
        token = adminToken || sellerToken;
    }

    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }

    // --- B. LOGIKA CSRF TOKEN (SOLUSI ERROR 419) ---
    // Kita ambil cookie 'XSRF-TOKEN' yang diberi Laravel saat login
    const xsrfToken = getCookie('XSRF-TOKEN');
    
    if (xsrfToken) {
        // Wajib decode karena cookie biasanya di-encode (misal %3D jadi =)
        config.headers['X-XSRF-TOKEN'] = decodeURIComponent(xsrfToken);
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 4. Response Interceptor
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
        if (error.response.status === 401) {
           console.error("Token tidak valid atau sesi habis.");
        }
        if (error.response.status === 419) {
           console.error("CSRF Token Mismatch (Error 419). Header X-XSRF-TOKEN hilang/salah.");
        }
    }
    return Promise.reject(error);
  }
);

export default apiClient;