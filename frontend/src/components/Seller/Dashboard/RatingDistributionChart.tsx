import React from 'react';

interface IRatingDistribution {
  product_id: number;
  product_name: string;
  category: string;
  average_rating: number;
  total_reviews: number;
}

interface RatingDistributionChartProps {
  data: IRatingDistribution[];
}

export default function RatingDistributionChart({
  data,
}: RatingDistributionChartProps) {
  return (
    <div className='bg-white rounded-lg shadow p-6'>
      <h3 className='text-lg font-semibold text-gray-900 mb-4'>
        Sebaran Nilai Rating per Produk
      </h3>
      <div className='space-y-3 max-h-96 overflow-y-auto'>
        {data.slice(0, 10).map((item) => (
          <div key={item.product_id}>
            <div className='flex items-center justify-between mb-1'>
              <span className='text-sm font-medium text-gray-700 truncate flex-1 mr-2'>
                {item.product_name}
              </span>
              <div className='flex items-center gap-1 whitespace-nowrap'>
                <svg
                  className='w-4 h-4 text-yellow-400'
                  fill='currentColor'
                  viewBox='0 0 20 20'
                >
                  <path d='M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z' />
                </svg>
                <span className='text-sm font-semibold text-gray-900'>
                  {item.average_rating.toFixed(1)}
                </span>
              </div>
            </div>
            <div className='flex items-center gap-2'>
              <div className='flex-1 bg-gray-200 rounded-full h-2'>
                <div
                  className='bg-yellow-500 h-2 rounded-full'
                  style={{ width: `${(item.average_rating / 5) * 100}%` }}
                ></div>
              </div>
              <span className='text-xs text-gray-500 whitespace-nowrap'>
                {item.total_reviews} ulasan
              </span>
            </div>
          </div>
        ))}
        {data.length === 0 && (
          <p className='text-center text-gray-500 py-8'>
            Belum ada ulasan produk
          </p>
        )}
      </div>
    </div>
  );
}
