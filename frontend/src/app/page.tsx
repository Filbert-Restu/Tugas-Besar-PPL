'use client';

// Impor React dan 'useState'
import React, { useState } from 'react';

// --- Tipe Data (Interface) untuk TypeScript ---

// Tipe untuk data formulir
interface IFormData {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
}

// Tipe untuk balasan error (validasi 422) dari Laravel
interface IErrorResponse {
  message: string;
  errors: {
    [key: string]: string[]; // Contoh: { email: ["Email sudah terdaftar."] }
  };
}

interface IUser {
  id: number;
  name: string;
  email: string;
  // tambahkan field lain yang diperlukan (role, avatar, created_at, dsb)
}

// Tipe untuk balasan sukses login
interface ILoginResponse {
  message: string;
  token: string;
  user: IUser; // Anda bisa buat interface User jika mau
}

// --- Variabel Global ---
const API_URL = 'http://127.0.0.1:8000';

// Tailwind classes will be used directly in JSX instead of inline styles

// --- Komponen Halaman Utama ---
export default function AuthPage() {
  // State untuk beralih antara form login dan register
  const [isRegistering, setIsRegistering] = useState(false);

  // State untuk menyimpan data formulir (menggunakan tipe IFormData)
  const [formData, setFormData] = useState<IFormData>({
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
  });

  // State untuk status loading dan pesan
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Fungsi untuk menangani perubahan input (dengan tipe Event)
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  // Fungsi saat formulir disubmit (dengan tipe Event)
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccess(null);

    const endpoint = isRegistering ? '/register' : '/login';
    const url = `${API_URL}${endpoint}`;

    // Siapkan payload yang bertipe untuk login / register
    interface ILoginPayload {
      email: string;
      password: string;
    }
    interface IRegisterPayload extends ILoginPayload {
      name: string;
      password_confirmation: string;
    }

    const loginBody: ILoginPayload = {
      email: formData.email,
      password: formData.password,
    };

    // Pilih body yang akan dikirim, dengan tipe union yang sesuai
    const bodyToSend: ILoginPayload | IRegisterPayload = isRegistering
      ? {
          ...loginBody,
          name: formData.name,
          password_confirmation: formData.password_confirmation,
        }
      : loginBody;

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify(bodyToSend),
      });

      // Backend *selalu* kirim JSON (baik sukses atau error)
      const data = await response.json();

      // Jika respons GAGAL (status 4xx atau 5xx)
      if (!response.ok) {
        // Kita cast 'data' sebagai IErrorResponse
        const errorData = data as IErrorResponse;
        let errorMessage = errorData.message || 'Terjadi kesalahan.';

        // Gabungkan semua pesan validasi
        if (errorData.errors) {
          errorMessage = Object.values(errorData.errors)
            .flat() // Gabungkan array di dalam array
            .join('\n'); // Pisahkan dengan baris baru
        }
        throw new Error(errorMessage);
      }

      // --- Jika SUKSES ---
      if (isRegistering) {
        setSuccess('Registrasi berhasil! Silakan login.');
        setIsRegistering(false); // Arahkan ke form login
        // Kosongkan form kecuali email
        setFormData((prev) => ({
          ...prev,
          name: '',
          password: '',
          password_confirmation: '',
        }));
      } else {
        // Mode Login
        const loginData = data as ILoginResponse; // Cast sebagai ILoginResponse
        setSuccess('Login berhasil!');
        console.log('API Token Anda:', loginData.token);
        // Di aplikasi nyata, simpan token ini
      }
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Terjadi kesalahan tidak dikenal');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className='max-w-[400px] mx-auto mt-12 p-8 border border-gray-300 rounded-lg font-sans'>
      <h2>{isRegistering ? 'Register Akun Baru' : 'Login'}</h2>

      <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
        {isRegistering && (
          <div className='flex flex-col'>
            <label htmlFor='name' className='mb-1 font-bold'>
              Name
            </label>
            <input
              type='text'
              id='name'
              name='name' // Pastikan 'name' cocok dengan state
              value={formData.name}
              onChange={handleInputChange}
              required
              className='p-2 text-base rounded-md border border-gray-200'
            />
          </div>
        )}

        <div className='flex flex-col'>
          <label htmlFor='email' className='mb-1 font-bold'>
            Email
          </label>
          <input
            type='email'
            id='email'
            name='email' // Pastikan 'name' cocok dengan state
            value={formData.email}
            onChange={handleInputChange}
            required
            className='p-2 text-base rounded-md border border-gray-200'
          />
        </div>

        <div className='flex flex-col'>
          <label htmlFor='password' className='mb-1 font-bold'>
            Password
          </label>
          <input
            type='password'
            id='password'
            name='password' // Pastikan 'name' cocok dengan state
            value={formData.password}
            onChange={handleInputChange}
            required
            className='p-2 text-base rounded-md border border-gray-200'
          />
        </div>

        {isRegistering && (
          <div className='flex flex-col'>
            <label htmlFor='password_confirmation' className='mb-1 font-bold'>
              Konfirmasi Password
            </label>
            <input
              type='password'
              id='password_confirmation'
              name='password_confirmation' // Pastikan 'name' cocok dengan state
              value={formData.password_confirmation}
              onChange={handleInputChange}
              required
              className='p-2 text-base rounded-md border border-gray-200'
            />
          </div>
        )}

        <button
          type='submit'
          className='px-4 py-2 text-base bg-blue-600 text-white rounded-md disabled:opacity-50'
          disabled={isLoading}
        >
          {isLoading ? 'Memproses...' : isRegistering ? 'Register' : 'Login'}
        </button>
      </form>

      {/* Tampilkan pesan Error atau Sukses */}
      {error && (
        <pre className='mt-4 text-red-600 whitespace-pre-wrap'>{error}</pre>
      )}
      {success && <p className='mt-4 text-green-600'>{success}</p>}

      {/* Tombol untuk beralih form */}
      <button
        onClick={() => {
          setIsRegistering(!isRegistering);
          setError(null);
          setSuccess(null);
        }}
        className='mt-4 text-blue-600 bg-transparent'
      >
        {isRegistering
          ? 'Sudah punya akun? Login di sini'
          : 'Belum punya akun? Register di sini'}
      </button>
    </main>
  );
}
