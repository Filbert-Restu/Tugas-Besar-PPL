import React from 'react';

interface AdminSidebarFooterProps {
  isSidebarOpen: boolean;
  onLogout: () => void;
}

export default function AdminSidebarFooter({
  isSidebarOpen,
  onLogout,
}: AdminSidebarFooterProps) {
  return (
    <div className='border-t border-gray-700 p-4'>
      <button
        onClick={onLogout}
        className='flex items-center gap-3 w-full px-3 py-2 rounded-lg hover:bg-gray-800 transition-colors'
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
  );
}
