'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const pathname = usePathname();

  const menuItems = [
    {
      title: 'Dashboard',
      href: '/admin',
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
            d='M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6'
          />
        </svg>
      ),
    },
    {
      title: 'Users',
      href: '/admin/users',
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
            d='M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z'
          />
        </svg>
      ),
    },
    {
      title: 'Products',
      href: '/admin/products',
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
      title: 'Orders',
      href: '/admin/orders',
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
            d='M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2'
          />
        </svg>
      ),
    },
    {
      title: 'Settings',
      href: '/admin/settings',
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
            d='M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z'
          />
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth={2}
            d='M15 12a3 3 0 11-6 0 3 3 0 016 0z'
          />
        </svg>
      ),
    },
  ];

  const isActive = (href: string) => {
    if (href === '/admin') {
      return pathname === href;
    }
    return pathname?.startsWith(href);
  };

  return (
    <div className='flex h-screen bg-gray-100'>
      {/* Sidebar */}
      <aside
        className={`${
          isSidebarOpen ? 'w-64' : 'w-20'
        } bg-gray-900 text-white transition-all duration-300 flex flex-col`}
      >
        {/* Logo / Header */}
        <div className='flex items-center justify-between p-4 border-b border-gray-700'>
          {isSidebarOpen && <h1 className='text-xl font-bold'>Admin Panel</h1>}
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className='p-2 rounded-lg hover:bg-gray-800 transition-colors'
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
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                  }`}
                >
                  {item.icon}
                  {isSidebarOpen && (
                    <span className='font-medium'>{item.title}</span>
                  )}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* User Profile / Logout */}
        <div className='border-t border-gray-700 p-4'>
          <button className='flex items-center gap-3 w-full px-3 py-2 rounded-lg hover:bg-gray-800 transition-colors'>
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
            <h2 className='text-2xl font-semibold text-gray-800'>
              {menuItems.find((item) => isActive(item.href))?.title ||
                'Dashboard'}
            </h2>
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

              {/* User Avatar */}
              <div className='flex items-center gap-2'>
                <div className='w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-semibold'>
                  A
                </div>
                {isSidebarOpen && (
                  <span className='text-sm font-medium text-gray-700'>
                    Admin
                  </span>
                )}
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
