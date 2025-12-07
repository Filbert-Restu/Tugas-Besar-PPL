import React from 'react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  text?: string;
  fullScreen?: boolean;
  className?: string;
}

const sizeClasses = {
  sm: 'h-4 w-4 border-2',
  md: 'h-8 w-8 border-2',
  lg: 'h-12 w-12 border-b-2',
  xl: 'h-16 w-16 border-b-4',
};

export default function LoadingSpinner({
  size = 'md',
  text,
  fullScreen = false,
  className = '',
}: LoadingSpinnerProps) {
  const content = (
    <div className='flex items-center gap-2'>
      <div
        className={`animate-spin rounded-full border-blue-600 ${sizeClasses[size]} ${className}`}
      ></div>
      {text && (
        <span className='text-sm text-gray-600 font-medium'>{text}</span>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div className='min-h-screen bg-gray-50 flex items-center justify-center'>
        <div className='text-center'>
          {content}
          {text && <p className='text-gray-700 mt-4'>{text}</p>}
        </div>
      </div>
    );
  }

  return content;
}
