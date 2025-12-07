import React from 'react';
import StatCard from './StatCard';

interface ISummary {
  total_products: number;
  total_stock: number;
  low_stock_products: number;
  out_of_stock_products: number;
  total_reviews: number;
  average_rating: number;
}

interface StatsGridProps {
  summary: ISummary;
}

export default function StatsGrid({ summary }: StatsGridProps) {
  return (
    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
      <StatCard
        title='Total Produk'
        value={summary.total_products}
        icon={
          <svg
            className='w-6 h-6'
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
        }
        iconBgColor='bg-blue-100'
        iconColor='text-blue-600'
      />

      <StatCard
        title='Total Stok'
        value={summary.total_stock}
        icon={
          <svg
            className='w-6 h-6'
            fill='none'
            stroke='currentColor'
            viewBox='0 0 24 24'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth={2}
              d='M5 13l4 4L19 7'
            />
          </svg>
        }
        iconBgColor='bg-green-100'
        iconColor='text-green-600'
      />

      <StatCard
        title='Stok Menipis'
        value={summary.low_stock_products}
        icon={
          <svg
            className='w-6 h-6'
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
        }
        iconBgColor='bg-orange-100'
        iconColor='text-orange-600'
        valueColor='text-orange-600'
      />

      <StatCard
        title='Rating Rata-rata'
        value={summary.average_rating.toFixed(1)}
        subtitle={`${summary.total_reviews} ulasan`}
        icon={
          <svg className='w-6 h-6' fill='currentColor' viewBox='0 0 20 20'>
            <path d='M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z' />
          </svg>
        }
        iconBgColor='bg-yellow-100'
        iconColor='text-yellow-600'
        valueColor='text-yellow-600'
      />
    </div>
  );
}
