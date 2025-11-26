'use client';

import { useState } from 'react';
import { Button } from '@/components/Button';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import apiClient from '@/lib/apiClient';
import { isAxiosError } from 'axios';
import { IRegisterPayload, IErrorResponse } from '@/types/auth';

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
  });
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

    const registerBody: IRegisterPayload = {
      name: formData.name,
      email: formData.email,
      password: formData.password,
      password_confirmation: formData.password_confirmation,
    };

    try {
      await apiClient.post('/register', registerBody);
      setSuccess(
        'Registrasi berhasil! Email verifikasi telah dikirim ke ' +
          formData.email +
          '. Silakan cek inbox atau spam folder Anda.'
      );
      setFormData({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
      });
    } catch (err) {
      if (isAxiosError(err) && err.response) {
        const errorData = err.response.data as IErrorResponse;
        let errorMessage = errorData.message || 'Terjadi kesalahan.';
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
      <h2 className='text-2xl font-bold mb-6 text-center'>
        Register Akun Baru
      </h2>

      <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
        <div className='flex flex-col'>
          <label htmlFor='name' className='mb-1 font-bold'>
            Nama Lengkap
          </label>
          <input
            type='text'
            id='name'
            name='name'
            value={formData.name}
            onChange={handleInputChange}
            required
            className='p-2 text-base rounded-md border border-gray-300'
          />
        </div>

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

        <div className='flex flex-col'>
          <label htmlFor='password_confirmation' className='mb-1 font-bold'>
            Konfirmasi Password
          </label>
          <input
            type='password'
            id='password_confirmation'
            name='password_confirmation'
            value={formData.password_confirmation}
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
          {isLoading ? 'Memproses...' : 'Register'}
        </button>
      </form>

      {error && (
        <pre className='mt-4 text-red-600 whitespace-pre-wrap'>{error}</pre>
      )}
      {success && <p className='mt-4 text-green-600'>{success}</p>}

      <p className='mt-4 text-center text-gray-600'>
        Sudah punya akun?{' '}
        <Link href='/login' className='text-blue-600 hover:underline'>
          Login di sini
        </Link>
      </p>

      <Button variant='secondary' className='mt-4 w-full'>
        <Link href='/'>Kembali ke Beranda</Link>
      </Button>
    </main>
  );
}
