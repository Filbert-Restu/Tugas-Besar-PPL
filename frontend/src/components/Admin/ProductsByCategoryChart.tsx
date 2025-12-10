import React from 'react';

interface ProductsByCategoryChartProps {
  data: {
    kategori: string;
    jumlah_produk: number;
  }[];
}

export default function ProductsByCategoryChart({
  data,
}: ProductsByCategoryChartProps) {
  const maxValue = Math.max(...data.map((item) => item.jumlah_produk), 1);

  const colors = [
    'bg-blue-500',
    'bg-green-500',
    'bg-yellow-500',
    'bg-red-500',
    'bg-purple-500',
    'bg-indigo-500',
    'bg-pink-500',
    'bg-orange-500',
  ];

  return (
    <div className='bg-white rounded-lg shadow-sm p-6'>
      <h3 className='text-lg font-bold text-gray-900 mb-4'>
        Produk per Kategori
      </h3>
      <div className='space-y-4'>
        {data.map((item, index) => {
          const percentage = (item.jumlah_produk / maxValue) * 100;
          const color = colors[index % colors.length];

          return (
            <div key={item.kategori}>
              <div className='flex items-center justify-between mb-1'>
                <span className='text-sm font-medium text-gray-700'>
                  {item.kategori}
                </span>
                <span className='text-sm font-semibold text-gray-900'>
                  {item.jumlah_produk} produk
                </span>
              </div>
              <div className='w-full bg-gray-200 rounded-full h-3'>
                <div
                  className={`${color} h-full rounded-full transition-all duration-500`}
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
