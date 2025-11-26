'use client';

import { useState } from 'react';
import { Button } from '@/components/Button';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import apiClient from '@/lib/apiClient';
import { isAxiosError } from 'axios';
import { ILoginPayload, ILoginResponse, IErrorResponse } from '@/types/auth';

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

    const loginBody: ILoginPayload = {
      email: formData.email,
      password: formData.password,
    };

    try {
      const response = await apiClient.post('/login', loginBody);
      const data = response.data as ILoginResponse;
      setSuccess('Login berhasil!');
      localStorage.setItem('authToken', data.token);
      router.push('/admin/dashboard');
    } catch (err) {
      if (isAxiosError(err) && err.response) {
        const errorData = err.response.data as IErrorResponse;

        // Check if error is due to unverified email
        if (err.response.status === 403 && errorData.email_verified === false) {
          setError(
            errorData.message +
              '\n\nBelum menerima email? Cek folder spam atau kirim ulang email verifikasi.'
          );
        } else {
          let errorMessage = errorData.message || 'Terjadi kesalahan.';
          if (errorData.errors) {
            errorMessage = Object.values(errorData.errors).flat().join('\n');
          }
          setError(errorMessage);
        }
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
          Register di sini
        </Link>
      </p>

      <Button variant='secondary' className='mt-4 w-full'>
        <Link href='/'>Kembali ke Beranda</Link>
      </Button>
    </main>
  );
}
