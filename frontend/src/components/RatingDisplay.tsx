import React from 'react';

interface RatingDisplayProps {
  rating: number;
  totalReviews: number;
  ratingBreakdown?: {
    5: number;
    4: number;
    3: number;
    2: number;
    1: number;
  };
}

export function RatingDisplay({
  rating,
  totalReviews,
  ratingBreakdown = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
}: RatingDisplayProps) {
  const maxCount = Math.max(...Object.values(ratingBreakdown));

  const getBarWidth = (count: number) => {
    if (maxCount === 0) return '0%';
    return `${(count / maxCount) * 100}%`;
  };

  return (
    <div className='bg-gray-50 rounded-lg p-6 border border-gray-200'>
      <h3 className='text-lg font-semibold text-gray-900 mb-4'>
        ULASAN PEMBELI
      </h3>

      <div className='flex items-start gap-8'>
        {/* Left side - Average Rating */}
        <div className='flex flex-col items-center min-w-[120px]'>
          <div className='flex items-center gap-2 mb-2'>
            <svg
              className='w-8 h-8 text-yellow-400'
              fill='currentColor'
              viewBox='0 0 20 20'
            >
              <path d='M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z' />
            </svg>
            <div>
              <div className='text-3xl font-bold text-gray-900'>
                {rating.toFixed(1)}
              </div>
              <div className='text-sm text-gray-500'>/ 5.0</div>
            </div>
          </div>
          <div className='text-sm text-gray-600 text-center'>
            <span className='font-semibold'>
              {totalReviews > 0 ? '100%' : '0%'}
            </span>{' '}
            pembeli merasa puas
          </div>
          <div className='text-xs text-gray-500 mt-1'>
            {totalReviews} rating • {totalReviews} ulasan
          </div>
        </div>

        {/* Right side - Rating Breakdown */}
        <div className='flex-1 space-y-2'>
          {[5, 4, 3, 2, 1].map((star) => {
            const count = ratingBreakdown[star as keyof typeof ratingBreakdown];
            return (
              <div key={star} className='flex items-center gap-3'>
                <div className='flex items-center gap-1 min-w-[40px]'>
                  <svg
                    className='w-4 h-4 text-yellow-400'
                    fill='currentColor'
                    viewBox='0 0 20 20'
                  >
                    <path d='M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z' />
                  </svg>
                  <span className='text-sm text-gray-700 font-medium'>
                    {star}
                  </span>
                </div>
                <div className='flex-1 h-3 bg-gray-200 rounded-full overflow-hidden'>
                  <div
                    className='h-full bg-teal-500 rounded-full transition-all duration-300'
                    style={{ width: getBarWidth(count) }}
                  />
                </div>
                <span className='text-sm text-gray-500 min-w-[30px] text-right'>
                  ({count})
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
