'use client';

import { useState } from 'react';
import { Button } from '@/components/Button';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import apiClient from '@/lib/apiClient';
import { isAxiosError } from 'axios';
interface LoginResponse {
  message: string;
  data: {
    user: {
      id: number;
      name: string;
      email: string;
      role: string;
    };
    role: string;
    redirect_to: string;
  };
}

export default function LoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await apiClient.post('/api/login', {
        email: formData.email,
        password: formData.password,
      });

      const data = response.data as LoginResponse;

      setSuccess('Login berhasil! Mengalihkan...');

      // Save user data to localStorage (session is handled by cookies)
      localStorage.setItem('userRole', data.data.role);
      localStorage.setItem('userData', JSON.stringify(data.data.user));

      // Redirect based on role
      setTimeout(() => {
        if (data.data.role === 'admin') {
          router.push('/admin/dashboard');
        } else if (data.data.role === 'penjual') {
          router.push('/seller/dashboard');
        } else if (data.data.role === 'pembeli') {
          router.push('/home');
        } else {
          router.push('/');
        }
      }, 1000);
    } catch (err) {
      if (isAxiosError(err) && err.response) {
        const errorData = err.response.data;
        let errorMessage = errorData.message || 'Terjadi kesalahan.';

        // Handle specific error cases
        if (err.response.status === 403) {
          if (errorData.status === 'pending') {
            errorMessage =
              'Akun Anda masih menunggu verifikasi admin. Silakan tunggu konfirmasi melalui email.';
          } else if (errorData.status === 'rejected') {
            errorMessage =
              'Akun Anda ditolak oleh admin. Silakan hubungi administrator untuk informasi lebih lanjut.';
          }
        }

        if (errorData.errors) {
          errorMessage = Object.values(errorData.errors).flat().join('\n');
        }
        setError(errorMessage);
      } else if (err instanceof Error) {
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
      <h2 className='text-2xl font-bold mb-6 text-center'>Login</h2>

      <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
        <div className='flex flex-col'>
          <label htmlFor='email' className='mb-1 font-bold'>
            Email
          </label>
          <input
            type='email'
            id='email'
            name='email'
            value={formData.email}
            onChange={handleInputChange}
            required
            className='p-2 text-base rounded-md border border-gray-300'
          />
        </div>

        <div className='flex flex-col'>
          <label htmlFor='password' className='mb-1 font-bold'>
            Password
          </label>
          <input
            type='password'
            id='password'
            name='password'
            value={formData.password}
            onChange={handleInputChange}
            required
            className='p-2 text-base rounded-md border border-gray-300'
          />
        </div>

        <button
          type='submit'
          className='px-4 py-2 mt-2 text-base bg-blue-600 text-white rounded-md disabled:opacity-50 hover:bg-blue-700 transition-colors'
          disabled={isLoading}
        >
          {isLoading ? 'Memproses...' : 'Login'}
        </button>
      </form>

      {error && (
        <pre className='mt-4 text-red-600 whitespace-pre-wrap'>{error}</pre>
      )}
      {success && <p className='mt-4 text-green-600'>{success}</p>}

      <p className='mt-4 text-center text-gray-600'>
        Belum punya akun?{' '}
        <Link href='/register' className='text-blue-600 hover:underline'>
          Daftar sebagai penjual
        </Link>
      </p>

      <Button variant='secondary' className='mt-4 w-full'>
        <Link href='/'>Kembali ke Beranda</Link>
      </Button>
    </main>
  );
}
