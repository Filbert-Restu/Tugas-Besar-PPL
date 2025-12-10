import React from 'react';

interface UserStatusChartProps {
  data: {
    aktif: number;
    tidak_aktif: number;
  };
}

export default function UserStatusChart({ data }: UserStatusChartProps) {
  const total = data.aktif + data.tidak_aktif;
  const activePercentage = total > 0 ? (data.aktif / total) * 100 : 0;
  const inactivePercentage = total > 0 ? (data.tidak_aktif / total) * 100 : 0;

  return (
    <div className='bg-white rounded-lg shadow-sm p-6'>
      <h3 className='text-lg font-bold text-gray-900 mb-4'>Status Penjual</h3>

      <div className='space-y-6'>
        {/* Donut Chart Visualization */}
        <div className='flex items-center justify-center'>
          <div className='relative w-48 h-48'>
            <svg viewBox='0 0 100 100' className='transform -rotate-90'>
              {/* Background circle */}
              <circle
                cx='50'
                cy='50'
                r='40'
                fill='none'
                stroke='#e5e7eb'
                strokeWidth='20'
              />
              {/* Active sellers */}
              <circle
                cx='50'
                cy='50'
                r='40'
                fill='none'
                stroke='#10b981'
                strokeWidth='20'
                strokeDasharray={`${activePercentage * 2.51327} 251.327`}
                strokeLinecap='round'
              />
              {/* Inactive sellers */}
              <circle
                cx='50'
                cy='50'
                r='40'
                fill='none'
                stroke='#ef4444'
                strokeWidth='20'
                strokeDasharray={`${inactivePercentage * 2.51327} 251.327`}
                strokeDashoffset={`-${activePercentage * 2.51327}`}
                strokeLinecap='round'
              />
            </svg>
            <div className='absolute inset-0 flex items-center justify-center'>
              <div className='text-center'>
                <p className='text-3xl font-bold text-gray-900'>{total}</p>
                <p className='text-xs text-gray-500'>Total</p>
              </div>
            </div>
          </div>
        </div>

        {/* Legend */}
        <div className='space-y-3'>
          <div className='flex items-center justify-between p-3 bg-green-50 rounded-lg'>
            <div className='flex items-center gap-2'>
              <div className='w-3 h-3 bg-green-500 rounded-full' />
              <span className='text-sm font-medium text-gray-700'>
                Penjual Aktif (Verified)
              </span>
            </div>
            <div className='text-right'>
              <p className='text-lg font-bold text-gray-900'>{data.aktif}</p>
              <p className='text-xs text-gray-500'>
                {activePercentage.toFixed(1)}%
              </p>
            </div>
          </div>

          <div className='flex items-center justify-between p-3 bg-red-50 rounded-lg'>
            <div className='flex items-center gap-2'>
              <div className='w-3 h-3 bg-red-500 rounded-full' />
              <span className='text-sm font-medium text-gray-700'>
                Tidak Aktif (Pending/Rejected)
              </span>
            </div>
            <div className='text-right'>
              <p className='text-lg font-bold text-gray-900'>
                {data.tidak_aktif}
              </p>
              <p className='text-xs text-gray-500'>
                {inactivePercentage.toFixed(1)}%
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
