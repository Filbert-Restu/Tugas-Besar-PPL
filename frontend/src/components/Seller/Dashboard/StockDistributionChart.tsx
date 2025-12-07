import React from 'react';

interface IStockDistribution {
  product_id: number;
  product_name: string;
  category: string;
  stock: number;
  price: number;
}

interface StockDistributionChartProps {
  data: IStockDistribution[];
  maxStock: number;
}

export default function StockDistributionChart({
  data,
  maxStock,
}: StockDistributionChartProps) {
  return (
    <div className='bg-white rounded-lg shadow p-6'>
      <h3 className='text-lg font-semibold text-gray-900 mb-4'>
        Sebaran Jumlah Stok Produk
      </h3>
      <div className='space-y-3 max-h-96 overflow-y-auto'>
        {data.slice(0, 10).map((item) => (
          <div key={item.product_id}>
            <div className='flex items-center justify-between mb-1'>
              <span className='text-sm font-medium text-gray-700 truncate flex-1 mr-2'>
                {item.product_name}
              </span>
              <span className='text-sm font-semibold text-gray-900 whitespace-nowrap'>
                {item.stock} unit
              </span>
            </div>
            <div className='flex items-center gap-2'>
              <div className='flex-1 bg-gray-200 rounded-full h-2'>
                <div
                  className={`h-2 rounded-full ${
                    item.stock === 0
                      ? 'bg-red-600'
                      : item.stock < 10
                      ? 'bg-orange-500'
                      : 'bg-green-600'
                  }`}
                  style={{ width: `${(item.stock / maxStock) * 100}%` }}
                ></div>
              </div>
              <span className='text-xs text-gray-500 whitespace-nowrap'>
                {item.category}
              </span>
            </div>
          </div>
        ))}
        {data.length === 0 && (
          <p className='text-center text-gray-500 py-8'>
            Belum ada data produk
          </p>
        )}
      </div>
    </div>
  );
}
