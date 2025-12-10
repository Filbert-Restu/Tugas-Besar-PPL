import React from 'react';

interface RatingDistributionChartProps {
  data: Record<number, number>;
}

export default function RatingDistributionChart({
  data,
}: RatingDistributionChartProps) {
  const totalReviews = Object.values(data).reduce(
    (sum, count) => sum + count,
    0
  );
  const maxValue = Math.max(...Object.values(data), 1);

  const stars = [5, 4, 3, 2, 1];

  return (
    <div className='bg-white rounded-lg shadow-sm p-6'>
      <h3 className='text-lg font-bold text-gray-900 mb-4'>
        Distribusi Rating Pengunjung
      </h3>

      <div className='space-y-3'>
        {stars.map((star) => {
          const count = data[star] || 0;
          const percentage =
            totalReviews > 0 ? (count / totalReviews) * 100 : 0;
          const barWidth = maxValue > 0 ? (count / maxValue) * 100 : 0;

          return (
            <div key={star} className='flex items-center gap-3'>
              <div className='flex items-center gap-1 w-16'>
                <span className='text-sm font-medium text-gray-700'>
                  {star}
                </span>
                <svg
                  className='w-4 h-4 text-yellow-400'
                  fill='currentColor'
                  viewBox='0 0 20 20'
                >
                  <path d='M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z' />
                </svg>
              </div>

              <div className='flex-1'>
                <div className='w-full bg-gray-200 rounded-full h-3'>
                  <div
                    className='bg-yellow-400 h-full rounded-full transition-all duration-500'
                    style={{ width: `${barWidth}%` }}
                  />
                </div>
              </div>

              <div className='w-20 text-right'>
                <span className='text-sm font-semibold text-gray-900'>
                  {count}
                </span>
                <span className='text-xs text-gray-500 ml-1'>
                  ({percentage.toFixed(0)}%)
                </span>
              </div>
            </div>
          );
        })}
      </div>

      <div className='mt-6 pt-4 border-t border-gray-200'>
        <div className='flex items-center justify-between'>
          <span className='text-sm text-gray-600'>Total Review</span>
          <span className='text-lg font-bold text-gray-900'>
            {totalReviews}
          </span>
        </div>
      </div>
    </div>
  );
}
