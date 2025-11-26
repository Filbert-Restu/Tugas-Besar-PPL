'use client';

import React, { useState, useEffect } from 'react';
import { IStockReport } from '@/types/seller';

export default function StockByQuantityReport() {
  const [products, setProducts] = useState<IStockReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  useEffect(() => {
    // TODO: Fetch from API
    setTimeout(() => {
      const mockData: IStockReport[] = [
        {
          id: 2,
          name: 'Smartphone Samsung S23',
          category: 'Elektronik',
          price: 12000000,
          stock: 25,
          rating: 4.7,
          totalRatings: 120,
          status: 'available',
          createdAt: '2024-01-01',
          updatedAt: '2024-01-01',
        },
        {
          id: 4,
          name: 'Kemeja Formal',
          category: 'Fashion',
          price: 250000,
          stock: 30,
          rating: 4.5,
          totalRatings: 75,
          status: 'available',
          createdAt: '2024-01-01',
          updatedAt: '2024-01-01',
        },
        {
          id: 5,
          name: 'Rice Cooker Cosmos',
          category: 'Elektronik',
          price: 500000,
          stock: 20,
          rating: 4.4,
          totalRatings: 60,
          status: 'available',
          createdAt: '2024-01-01',
          updatedAt: '2024-01-01',
        },
        {
          id: 1,
          name: 'Laptop Gaming ROG',
          category: 'Elektronik',
          price: 15000000,
          stock: 15,
          rating: 4.8,
          totalRatings: 150,
          status: 'available',
          createdAt: '2024-01-01',
          updatedAt: '2024-01-01',
        },
        {
          id: 3,
          name: 'Sepatu Nike Air Max',
          category: 'Fashion',
          price: 1500000,
          stock: 1,
          rating: 4.6,
          totalRatings: 90,
          status: 'low',
          createdAt: '2024-01-01',
          updatedAt: '2024-01-01',
        },
      ];
      setProducts(mockData);
      setLoading(false);
    }, 800);
  }, []);

  const sortedProducts = [...products].sort((a, b) => {
    return sortOrder === 'desc' ? b.stock - a.stock : a.stock - b.stock;
  });

  const handleExportPDF = () => {
    alert(
      'Export PDF akan diimplementasikan dengan library seperti jsPDF atau API backend'
    );
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(value);
  };

  if (loading) {
    return (
      <div className='flex items-center justify-center h-64'>
        <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600'></div>
      </div>
    );
  }

  return (
    <div className='space-y-6'>
      {/* Header with Actions */}
      <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4'>
        <div>
          <h1 className='text-2xl font-bold text-gray-900'>
            Laporan Stok (Berdasarkan Jumlah)
          </h1>
          <p className='text-sm text-gray-600 mt-1'>
            Daftar produk diurutkan berdasarkan jumlah stok
          </p>
        </div>
        <div className='flex gap-3'>
          <button
            onClick={() => setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc')}
            className='px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2'
          >
            <svg
              className='w-5 h-5'
              fill='none'
              stroke='currentColor'
              viewBox='0 0 24 24'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4'
              />
            </svg>
            {sortOrder === 'desc' ? 'Terbanyak' : 'Tersedikit'}
          </button>
          <button
            onClick={handleExportPDF}
            className='px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2'
          >
            <svg
              className='w-5 h-5'
              fill='none'
              stroke='currentColor'
              viewBox='0 0 24 24'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z'
              />
            </svg>
            Export PDF
          </button>
        </div>
      </div>

      {/* Table */}
      <div className='bg-white rounded-lg shadow overflow-hidden'>
        <div className='overflow-x-auto'>
          <table className='min-w-full divide-y divide-gray-200'>
            <thead className='bg-gray-50'>
              <tr>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Produk
                </th>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Kategori
                </th>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Stok
                </th>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Rating
                </th>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Harga
                </th>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Status
                </th>
              </tr>
            </thead>
            <tbody className='bg-white divide-y divide-gray-200'>
              {sortedProducts.map((product) => (
                <tr key={product.id} className='hover:bg-gray-50'>
                  <td className='px-6 py-4 whitespace-nowrap'>
                    <div className='text-sm font-medium text-gray-900'>
                      {product.name}
                    </div>
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap'>
                    <span className='px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800'>
                      {product.category}
                    </span>
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap'>
                    <div className='flex items-center gap-2'>
                      <div className='text-sm font-semibold text-gray-900'>
                        {product.stock}
                      </div>
                      <span className='text-xs text-gray-500'>unit</span>
                    </div>
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap'>
                    <div className='flex items-center gap-1'>
                      <svg
                        className='w-5 h-5 text-yellow-400'
                        fill='currentColor'
                        viewBox='0 0 20 20'
                      >
                        <path d='M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z' />
                      </svg>
                      <span className='text-sm font-semibold text-gray-900'>
                        {product.rating}
                      </span>
                      <span className='text-xs text-gray-500'>
                        ({product.totalRatings})
                      </span>
                    </div>
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap'>
                    <div className='text-sm text-gray-900'>
                      {formatCurrency(product.price)}
                    </div>
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap'>
                    {product.status === 'available' && (
                      <span className='px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800'>
                        Tersedia
                      </span>
                    )}
                    {product.status === 'low' && (
                      <span className='px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800'>
                        Stok Rendah
                      </span>
                    )}
                    {product.status === 'out-of-stock' && (
                      <span className='px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800'>
                        Habis
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
