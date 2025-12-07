import React from 'react';

interface SidebarHeaderProps {
  isSidebarOpen: boolean;
  onToggleSidebar: () => void;
}

export default function SidebarHeader({
  isSidebarOpen,
  onToggleSidebar,
}: SidebarHeaderProps) {
  return (
    <div className='flex items-center justify-between p-4 border-b border-blue-700'>
      {isSidebarOpen && (
        <div>
          <h1 className='text-xl font-bold'>Seller Panel</h1>
          <p className='text-xs text-blue-100'>MartPlace</p>
        </div>
      )}
      <button
        onClick={onToggleSidebar}
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
  );
}
