'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import apiClient from '@/lib/apiClient';
import { isAxiosError } from 'axios';

export default function VerifyEmailPage() {
  const params = useParams();
  const router = useRouter();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>(
    'loading'
  );
  const [message, setMessage] = useState('');

  useEffect(() => {
    const verifyEmail = async () => {
      const id = params.id as string;
      const hash = params.hash as string;

      try {
        const response = await apiClient.get(`/email/verify/${id}/${hash}`);
        setStatus('success');
        setMessage(response.data.message);

        // Redirect to login after 3 seconds
        setTimeout(() => {
          router.push('/login');
        }, 3000);
      } catch (err) {
        setStatus('error');
        if (isAxiosError(err) && err.response) {
          setMessage(err.response.data.message || 'Verification failed');
        } else {
          setMessage('Something went wrong');
        }
      }
    };

    verifyEmail();
  }, [params.id, params.hash, router]);

  return (
    <div className='min-h-screen bg-gray-50 flex items-center justify-center px-4'>
      <div className='max-w-md w-full bg-white rounded-lg shadow-lg p-8'>
        {status === 'loading' && (
          <div className='text-center'>
            <div className='animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-4'></div>
            <h2 className='text-2xl font-bold text-gray-900 mb-2'>
              Memverifikasi Email...
            </h2>
            <p className='text-gray-600'>Mohon tunggu sebentar</p>
          </div>
        )}

        {status === 'success' && (
          <div className='text-center'>
            <div className='w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4'>
              <svg
                className='w-10 h-10 text-green-600'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M5 13l4 4L19 7'
                />
              </svg>
            </div>
            <h2 className='text-2xl font-bold text-gray-900 mb-2'>
              Email Terverifikasi!
            </h2>
            <p className='text-gray-600 mb-6'>{message}</p>
            <p className='text-sm text-gray-500 mb-4'>
              Anda akan dialihkan ke halaman login dalam 3 detik...
            </p>
            <Link
              href='/login'
              className='inline-block px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors'
            >
              Login Sekarang
            </Link>
          </div>
        )}

        {status === 'error' && (
          <div className='text-center'>
            <div className='w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4'>
              <svg
                className='w-10 h-10 text-red-600'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M6 18L18 6M6 6l12 12'
                />
              </svg>
            </div>
            <h2 className='text-2xl font-bold text-gray-900 mb-2'>
              Verifikasi Gagal
            </h2>
            <p className='text-gray-600 mb-6'>{message}</p>
            <div className='space-y-3'>
              <Link
                href='/login'
                className='block px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors'
              >
                Ke Halaman Login
              </Link>
              <Link
                href='/'
                className='block px-6 py-3 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors'
              >
                Kembali ke Beranda
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
