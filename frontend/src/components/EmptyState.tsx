import React from 'react';

interface EmptyStateProps {
  title?: string;
  message?: string;
}

export default function EmptyState({
  title = 'Produk tidak ditemukan',
  message = 'Coba ubah filter pencarian Anda',
}: EmptyStateProps) {
  return (
    <div className='bg-white rounded-lg shadow-sm p-12 text-center'>
      <svg
        className='mx-auto h-16 w-16 text-gray-400'
        fill='none'
        stroke='currentColor'
        viewBox='0 0 24 24'
      >
        <path
          strokeLinecap='round'
          strokeLinejoin='round'
          strokeWidth={2}
          d='M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
        />
      </svg>
      <h3 className='mt-4 text-lg font-medium text-gray-900'>{title}</h3>
      <p className='mt-2 text-sm text-gray-500'>{message}</p>
    </div>
  );
}
