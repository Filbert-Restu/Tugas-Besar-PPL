import React from 'react';

interface StoresByProvinceChartProps {
  data: {
    provinsi: string;
    jumlah_toko: number;
  }[];
}

export default function StoresByProvinceChart({
  data,
}: StoresByProvinceChartProps) {
  const maxValue = Math.max(...data.map((item) => item.jumlah_toko), 1);

  return (
    <div className='bg-white rounded-lg shadow-sm p-6'>
      <h3 className='text-lg font-bold text-gray-900 mb-4'>
        Toko per Provinsi (Top 10)
      </h3>
      <div className='space-y-4'>
        {data.map((item, index) => {
          const percentage = (item.jumlah_toko / maxValue) * 100;

          return (
            <div key={item.provinsi}>
              <div className='flex items-center justify-between mb-1'>
                <div className='flex items-center gap-2'>
                  <span className='text-xs font-bold text-gray-400 w-6'>
                    #{index + 1}
                  </span>
                  <span className='text-sm font-medium text-gray-700'>
                    {item.provinsi}
                  </span>
                </div>
                <span className='text-sm font-semibold text-gray-900'>
                  {item.jumlah_toko} toko
                </span>
              </div>
              <div className='w-full bg-gray-200 rounded-full h-3 ml-8'>
                <div
                  className='bg-gradient-to-r from-green-500 to-emerald-500 h-full rounded-full transition-all duration-500'
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
