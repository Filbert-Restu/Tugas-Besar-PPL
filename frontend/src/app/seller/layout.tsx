'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

interface SellerLayoutProps {
  children: React.ReactNode;
}

export default function SellerLayout({ children }: SellerLayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const pathname = usePathname();
  const router = useRouter();

  const menuItems = [
    {
      title: 'Dashboard',
      href: '/seller',
      icon: (
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
      ),
    },
    {
      title: 'Laporan Stok (Rating)',
      href: '/seller/reports/stock-by-rating',
      icon: (
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
            d='M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z'
          />
        </svg>
      ),
    },
    {
      title: 'Laporan Stok (Stock)',
      href: '/seller/reports/stock-by-quantity',
      icon: (
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
            d='M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4'
          />
        </svg>
      ),
    },
    {
      title: 'Stok Menipis',
      href: '/seller/reports/low-stock',
      icon: (
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
            d='M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z'
          />
        </svg>
      ),
    },
    {
      title: 'Produk Saya',
      href: '/seller/products',
      icon: (
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
            d='M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z'
          />
        </svg>
      ),
    },
  ];

  const isActive = (href: string) => {
    if (href === '/seller') {
      return pathname === href;
    }
    return pathname?.startsWith(href);
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    router.push('/');
  };

  return (
    <div className='flex h-screen bg-gray-100'>
      {/* Sidebar */}
      <aside
        className={`${
          isSidebarOpen ? 'w-64' : 'w-20'
        } bg-linear-to-b from-blue-900 to-blue-800 text-white transition-all duration-300 flex flex-col shadow-xl`}
      >
        {/* Logo / Header */}
        <div className='flex items-center justify-between p-4 border-b border-blue-700'>
          {isSidebarOpen && (
            <div>
              <h1 className='text-xl font-bold'>Seller Panel</h1>
              <p className='text-xs text-blue-200'>MartPlace</p>
            </div>
          )}
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className='p-2 rounded-lg hover:bg-blue-700 transition-colors'
            aria-label='Toggle Sidebar'
          >
            <svg
              className='w-6 h-6'
              fill='none'
              stroke='currentColor'
              viewBox='0 0 24 24'
            >
              {isSidebarOpen ? (
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M11 19l-7-7 7-7m8 14l-7-7 7-7'
                />
              ) : (
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M13 5l7 7-7 7M5 5l7 7-7 7'
                />
              )}
            </svg>
          </button>
        </div>

        {/* Navigation Menu */}
        <nav className='flex-1 overflow-y-auto py-4'>
          <ul className='space-y-2 px-3'>
            {menuItems.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`flex items-center gap-3 px-3 py-3 rounded-lg transition-colors ${
                    isActive(item.href)
                      ? 'bg-white text-blue-900 shadow-md'
                      : 'text-blue-100 hover:bg-blue-700 hover:text-white'
                  }`}
                  title={!isSidebarOpen ? item.title : undefined}
                >
                  {item.icon}
                  {isSidebarOpen && (
                    <span className='font-medium text-sm'>{item.title}</span>
                  )}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* User Profile / Logout */}
        <div className='border-t border-blue-700 p-4'>
          <button
            onClick={handleLogout}
            className='flex items-center gap-3 w-full px-3 py-2 rounded-lg hover:bg-blue-700 transition-colors text-blue-100 hover:text-white'
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
                d='M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1'
              />
            </svg>
            {isSidebarOpen && <span className='font-medium'>Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className='flex-1 flex flex-col overflow-hidden'>
        {/* Top Bar */}
        <header className='bg-white shadow-sm border-b border-gray-200'>
          <div className='flex items-center justify-between px-6 py-4'>
            <div>
              <h2 className='text-2xl font-semibold text-gray-800'>
                {menuItems.find((item) => isActive(item.href))?.title ||
                  'Dashboard'}
              </h2>
              <p className='text-sm text-gray-500 mt-1'>
                Kelola toko dan produk Anda
              </p>
            </div>
            <div className='flex items-center gap-4'>
              {/* Notifications */}
              <button className='p-2 rounded-lg hover:bg-gray-100 relative'>
                <svg
                  className='w-6 h-6 text-gray-600'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9'
                  />
                </svg>
                <span className='absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full'></span>
              </button>

              {/* User Info */}
              <div className='flex items-center gap-3 px-3 py-2 bg-gray-50 rounded-lg'>
                <div className='w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-semibold shadow'>
                  S
                </div>
                <div className='text-left'>
                  <p className='text-sm font-semibold text-gray-800'>Seller</p>
                  <p className='text-xs text-gray-500'>Penjual</p>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className='flex-1 overflow-y-auto p-6 bg-gray-50'>
          {children}
        </main>
      </div>
    </div>
  );
}
