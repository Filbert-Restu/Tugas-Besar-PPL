'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@/hooks/Auth/useAuth';

export default function Navbar() {
  const { isAuthenticated, user, loading, logout } = useAuth();

  return (
    <div>
      <header className='bg-white shadow-md sticky top-0 z-50 border-b border-gray-200'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3'>
          <div className='flex items-center justify-between'>
            <Link href='/' className='flex items-center gap-3 group'>
              <div className='relative h-12 w-48 flex items-center'>
                <Image
                  src='/logo-irich.png'
                  alt='I-RICH Logo'
                  width={192}
                  height={48}
                  className='h-full w-auto object-contain group-hover:scale-105 transition-transform duration-300'
                  priority
                />
              </div>
            </Link>
            <div className='flex items-center gap-3'>
              {loading ? (
                <div className='animate-pulse flex gap-3'>
                  <div className='h-10 w-20 bg-gray-200 rounded'></div>
                  <div className='h-10 w-20 bg-gray-200 rounded'></div>
                </div>
              ) : isAuthenticated ? (
                <>
                  {/* Dashboard Button for Admin/Seller */}
                  {(user?.role === 'admin' || user?.role === 'penjual') && (
                    <Link
                      href={
                        user.role === 'admin'
                          ? '/admin/dashboard'
                          : '/seller/dashboard'
                      }
                      className='px-5 py-2.5 bg-[#fbbf24] hover:bg-[#f59e0b] text-gray-900 rounded-lg font-semibold shadow-md hover:shadow-lg transition-all duration-300 flex items-center gap-2'
                    >
                      <svg
                        className='w-5 h-5'
                        fill='none'
                        stroke='currentColor'
                        viewBox='0 0 24 24'
                      >
                        <path
                          strokeLinecap='round'
                          strokeLinejoin='round'
                          strokeWidth={2}
                          d='M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z'
                        />
                      </svg>
                      Dashboard
                    </Link>
                  )}

                  <div className='flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg border border-blue-200'>
                    <div className='w-8 h-8 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-full flex items-center justify-center'>
                      <span className='text-white font-bold text-sm'>
                        {user?.name?.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <span className='text-gray-800 font-semibold'>
                      {user?.name}
                    </span>
                  </div>
                  <button
                    onClick={logout}
                    className='px-5 py-2.5 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-lg hover:from-red-700 hover:to-red-800 font-semibold shadow-md hover:shadow-lg transition-all duration-300'
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href='/login'
                    className='px-5 py-2.5 text-gray-700 hover:text-blue-600 font-semibold transition-colors duration-300'
                  >
                    Masuk
                  </Link>
                  <Link
                    href='/seller/register'
                    className='px-5 py-2.5 bg-gradient-to-r from-blue-500 to-cyan-600 text-white rounded-lg hover:from-blue-600 hover:to-cyan-700 font-semibold shadow-md hover:shadow-lg transition-all duration-300'
                  >
                    Daftar Sekarang
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </header>
    </div>
  );
}
