import Link from 'next/link';
import React from 'react';

export default function Navbar() {
  return (
    <div>
      <header className='bg-white shadow-sm sticky top-0 z-50'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4'>
          <div className='flex items-center justify-between'>
            <div className='flex items-center gap-3'>
              <div className='w-10 h-10 bg-linear-to-br from-blue-600 to-blue-800 rounded-lg flex items-center justify-center'>
                <svg
                  className='w-6 h-6 text-white'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z'
                  />
                </svg>
              </div>
              <div>
                <h1 className='text-2xl font-bold text-gray-900'>MartPlace</h1>
                <p className='text-xs text-gray-600'>
                  Belanja Online Terpercaya
                </p>
              </div>
            </div>
            <div className='flex items-center gap-3'>
              <Link
                href='/login'
                className='px-4 py-2 text-gray-700 hover:text-gray-900 font-medium'
              >
                Masuk
              </Link>
              <Link
                href='/register'
                className='px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium'
              >
                Daftar
              </Link>
            </div>
          </div>
        </div>
      </header>
    </div>
  );
}
