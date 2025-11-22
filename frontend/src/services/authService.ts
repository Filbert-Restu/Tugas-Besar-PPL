import apiClient from '@/lib/axios';
import axios from 'axios';

// Kita butuh instance axios khusus untuk mengambil cookie 
// karena apiClient Anda base URL-nya mengarah ke /api, sedangkan cookie ada di root
const csrfClient = axios.create({
  baseURL: 'http://127.0.0.1:8000', // URL Backend TANPA /api
  withCredentials: true,
});

export const registerSeller = async (formData: FormData) => {
  // 1. Minta "Tiket" (CSRF Cookie) dulu ke Laravel
  // Ini wajib dilakukan sebelum POST request pertama kali
    try {
        await csrfClient.get('/sanctum/csrf-cookie');

        // 2. Setelah punya tiket, baru kirim data
        const response = await apiClient.post('/sellers/register', formData);
        return response.data;
    } catch (error) {
        // Tambahkan log ini untuk melihat error asli dari Laravel
        if (axios.isAxiosError(error)) {
            console.log("ERROR RESPONSE:", error.response);
        } else {
            console.log("ERROR:", error);
        }
        
        // Kemungkinan errornya:
        // 422 (Unprocessable Content) = Validasi gagal (misal email kembar, gambar kegedean)
        // 500 (Server Error) = Ada codingan backend yang salah
        throw error;
    }
  
};

// Ini yang dipakai di LoginForm.tsx agar tidak "nabrak"
export const loginUniversal = async (credentials: { email: string; password: string }) => {
  // 1. Ambil CSRF Cookie
  await csrfClient.get('/sanctum/csrf-cookie');
  
  // 2. Tembak ke Endpoint LOGIN UTAMA (AuthController yang baru kita edit)
  const res = await apiClient.post('/login', credentials);
  
  // 3. Simpan Token Berdasarkan Role yang dikembalikan Backend
  if (res.data.token && res.data.user) {
    const role = res.data.user.role;

    if (role === 'seller') {
        document.cookie = `seller_token=${res.data.token}; path=/; SameSite=Lax`;
        localStorage.setItem('seller_user', JSON.stringify(res.data.user));
    } else {
        // Untuk Admin / User Platform
        document.cookie = `admin_token=${res.data.token}; path=/; SameSite=Lax`;
        localStorage.setItem('admin_user', JSON.stringify(res.data.user));
    }
  }
  return res.data;
};

export const logoutSeller = async () => {
  try {
    // Kita ambil token seller dari cookie manual untuk memastikan request logout
    // menggunakan token yang benar (bukan token admin kalau kebetulan login dua-duanya)
    const getCookie = (name: string) => {
      const value = `; ${document.cookie}`;
      const parts = value.split(`; ${name}=`);
      if (parts.length === 2) return parts.pop()?.split(';').shift();
    };
    const token = getCookie('seller_token');

    if (token) {
        await apiClient.post('/logout', {}, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
    }
  } catch {
    console.warn("Logout seller di backend gagal, lanjut bersihkan lokal.");
  } finally {
    // 1. Hapus Cookie Seller (Perhatikan namanya beda: 'seller_token')
    document.cookie = "seller_token=; path=/; max-age=0; SameSite=Lax";
    
    // 2. Hapus Data Seller di LocalStorage
    localStorage.removeItem('seller_user');
    localStorage.removeItem('user'); // Jaga-jaga kalau tersimpan di key umum
  }
};

export const logoutPlatform = async () => {
  try {
    // Panggil API Logout Laravel (agar token di DB dihapus)
    // Kita bungkus try-catch agar jika token sudah expired di server,
    // frontend tetap lanjut menghapus cookie.
    await apiClient.post('/logout');
  } catch {
    console.warn("Logout backend gagal/token sudah expired, melanjutkan pembersihan lokal.");
  } finally {
    // BAGIAN PENTING: Hapus Jejak di Browser
    
    // 1. Hapus Cookie (Set max-age ke 0)
    document.cookie = "admin_token=; path=/; max-age=0; SameSite=Lax";
    
    // 2. Hapus User Data di LocalStorage
    localStorage.removeItem('admin_user');
  }
};

// --- FUNGSI BARU UNTUK AUTO LOGIN ---
export const fetchCurrentUser = async () => {
  // Laravel Sanctum defaultnya menyediakan endpoint /api/user
  // yang mengembalikan data user pemilik token
  const response = await apiClient.get('/user');
  return response.data;
};