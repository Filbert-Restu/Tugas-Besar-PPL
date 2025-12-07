import React from 'react';

interface ErrorStateProps {
  message?: string;
  fullHeight?: boolean;
  className?: string;
}

export default function ErrorState({
  message = 'Terjadi kesalahan',
  fullHeight = true,
  className = '',
}: ErrorStateProps) {
  return (
    <div
      className={`flex items-center justify-center ${
        fullHeight ? 'h-full' : ''
      } ${className}`}
    >
      <div className='text-center'>
        <svg
          className='mx-auto h-12 w-12 text-red-400'
          fill='none'
          stroke='currentColor'
          viewBox='0 0 24 24'
        >
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth={2}
            d='M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
          />
        </svg>
        <p className='mt-4 text-gray-600'>{message}</p>
      </div>
    </div>
  );
}
