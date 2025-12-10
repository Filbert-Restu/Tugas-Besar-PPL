import React from 'react';

interface AdminSidebarHeaderProps {
  isSidebarOpen: boolean;
  onToggleSidebar: () => void;
}

export default function AdminSidebarHeader({
  isSidebarOpen,
  onToggleSidebar,
}: AdminSidebarHeaderProps) {
  return (
    <div className='flex items-center justify-between p-4 border-b border-gray-700'>
      {isSidebarOpen && <h1 className='text-xl font-bold'>Admin Panel</h1>}
      <button
        onClick={onToggleSidebar}
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
  );
}
