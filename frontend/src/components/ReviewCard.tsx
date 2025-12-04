import React from 'react';
import { IProductReview } from '@/types/product';

interface ReviewCardProps {
  review: IProductReview;
}

export default function ReviewCard({ review }: ReviewCardProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(date);
  };

  return (
    <div className='border-b border-gray-200 pb-6 last:border-b-0'>
      <div className='flex items-start gap-4'>
        {/* Avatar */}
        <div className='flex-shrink-0'>
          {review.userAvatar ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={review.userAvatar}
              alt={review.userName}
              className='w-10 h-10 rounded-full object-cover'
            />
          ) : (
            <div className='w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-semibold'>
              {review.userName.charAt(0).toUpperCase()}
            </div>
          )}
        </div>

        {/* Review Content */}
        <div className='flex-1'>
          <div className='flex items-center justify-between mb-2'>
            <h4 className='font-semibold text-gray-900'>{review.userName}</h4>
            <span className='text-sm text-gray-500'>
              {formatDate(review.createdAt)}
            </span>
          </div>

          {/* Rating Stars */}
          <div className='flex items-center gap-1 mb-3'>
            {[...Array(5)].map((_, index) => (
              <svg
                key={index}
                className={`w-4 h-4 ${
                  index < review.rating ? 'text-yellow-400' : 'text-gray-300'
                }`}
                fill='currentColor'
                viewBox='0 0 20 20'
              >
                <path d='M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z' />
              </svg>
            ))}
          </div>

          {/* Review Text */}
          <p className='text-gray-700 leading-relaxed'>{review.comment}</p>
        </div>
      </div>
    </div>
  );
}
