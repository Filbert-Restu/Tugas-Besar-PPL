import React from 'react';

interface ChartBarProps {
  label: string;
  value: number;
  maxValue: number;
  color?: string;
}

export default function ChartBar({
  label,
  value,
  maxValue,
  color = 'bg-blue-500',
}: ChartBarProps) {
  const percentage = maxValue > 0 ? (value / maxValue) * 100 : 0;

  return (
    <div className='mb-4'>
      <div className='flex items-center justify-between mb-1'>
        <span className='text-sm font-medium text-gray-700 truncate flex-1 mr-2'>
          {label}
        </span>
        <span className='text-sm font-semibold text-gray-900 ml-2'>
          {value}
        </span>
      </div>
      <div className='w-full bg-gray-200 rounded-full h-3 overflow-hidden'>
        <div
          className={`${color} h-full rounded-full transition-all duration-500 ease-out`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
