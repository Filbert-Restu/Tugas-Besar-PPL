import React from 'react';

interface LoadingStateProps {
  message?: string;
  fullHeight?: boolean;
  className?: string;
}

export default function LoadingState({
  message = 'Memuat data...',
  fullHeight = true,
  className = '',
}: LoadingStateProps) {
  return (
    <div
      className={`flex items-center justify-center ${
        fullHeight ? 'h-full' : ''
      } ${className}`}
    >
      <div className='text-center'>
        <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto'></div>
        <p className='mt-4 text-gray-600'>{message}</p>
      </div>
    </div>
  );
}
