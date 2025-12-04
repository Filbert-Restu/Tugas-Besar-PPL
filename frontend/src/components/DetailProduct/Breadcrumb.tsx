import React from 'react';
import { useRouter } from 'next/navigation';

interface BreadcrumbProps {
  productName: string;
}

export function Breadcrumb({ productName }: BreadcrumbProps) {
  const router = useRouter();

  return (
    <div className='bg-white border-b border-gray-200'>
      <div className='max-w-7xl mx-auto px-4 py-3'>
        <div className='flex items-center gap-2 text-sm text-gray-600'>
          <button
            onClick={() => router.push('/')}
            className='hover:text-blue-600'
          >
            Home
          </button>
          <svg
            className='w-4 h-4'
            fill='none'
            stroke='currentColor'
            viewBox='0 0 24 24'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth={2}
              d='M9 5l7 7-7 7'
            />
          </svg>
          <button
            onClick={() => router.push('/products')}
            className='hover:text-blue-600'
          >
            Produk
          </button>
          <svg
            className='w-4 h-4'
            fill='none'
            stroke='currentColor'
            viewBox='0 0 24 24'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth={2}
              d='M9 5l7 7-7 7'
            />
          </svg>
          <span className='text-gray-900 font-medium truncate'>
            {productName}
          </span>
        </div>
      </div>
    </div>
  );
}
