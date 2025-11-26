'use client';

import React, { useState, useEffect } from 'react';
import { ILowStockProduct } from '@/types/seller';

export default function LowStockReport() {
  const [products, setProducts] = useState<ILowStockProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // TODO: Fetch from API (stok < 2)
    setTimeout(() => {
      const mockData: ILowStockProduct[] = [
        {
          id: 3,
          name: 'Sepatu Nike Air Max',
          category: 'Fashion',
          stock: 1,
          price: 1500000,
          lastOrdered: '2024-01-15',
        },
        {
          id: 6,
          name: 'Tas Ransel',
          category: 'Fashion',
          stock: 0,
          price: 350000,
        },
        {
          id: 7,
          name: 'Keyboard Mechanical',
          category: 'Elektronik',
          stock: 1,
          price: 850000,
          lastOrdered: '2024-02-01',
        },
        {
          id: 8,
          name: 'Mouse Gaming',
          category: 'Elektronik',
          stock: 0,
          price: 450000,
        },
        {
          id: 9,
          name: 'Headset Gaming',
          category: 'Elektronik',
          stock: 1,
          price: 650000,
          lastOrdered: '2024-01-20',
        },
        {
          id: 10,
          name: 'Webcam HD',
          category: 'Elektronik',
          stock: 0,
          price: 500000,
        },
        {
          id: 11,
          name: 'Sandal Jepit',
          category: 'Fashion',
          stock: 1,
          price: 50000,
          lastOrdered: '2024-02-10',
        },
        {
          id: 12,
          name: 'Kaos Polos',
          category: 'Fashion',
          stock: 1,
          price: 75000,
        },
      ];
      setProducts(mockData);
      setLoading(false);
    }, 800);
  }, []);

  const handleExportPDF = () => {
    alert(
      'Export PDF akan diimplementasikan dengan library seperti jsPDF atau API backend'
    );
  };

  const handleOrderNow = (productId: number) => {
    alert(`Melakukan pemesanan untuk produk ID: ${productId}`);
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(value);
  };

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return '-';
    return new Date(dateStr).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
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
      {/* Alert Banner */}
      <div className='bg-red-50 border-l-4 border-red-400 p-4 rounded-lg'>
        <div className='flex'>
          <div className='shrink-0'>
            <svg
              className='h-5 w-5 text-red-400'
              fill='currentColor'
              viewBox='0 0 20 20'
            >
              <path
                fillRule='evenodd'
                d='M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z'
                clipRule='evenodd'
              />
            </svg>
          </div>
          <div className='ml-3'>
            <h3 className='text-sm font-medium text-red-800'>
              Perhatian! {products.length} produk memerlukan pemesanan segera
            </h3>
            <p className='mt-1 text-sm text-red-700'>
              Produk dengan stok kurang dari 2 unit perlu segera dipesan untuk
              menghindari kehabisan stok.
            </p>
          </div>
        </div>
      </div>

      {/* Header with Actions */}
      <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4'>
        <div>
          <h1 className='text-2xl font-bold text-gray-900'>
            Laporan Stok Menipis
          </h1>
          <p className='text-sm text-gray-600 mt-1'>
            Produk dengan stok {'<'} 2 unit yang harus segera dipesan
          </p>
        </div>
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

      {/* Stats */}
      <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
        <div className='bg-white rounded-lg shadow p-6'>
          <div className='flex items-center'>
            <div className='flex-shrink-0 bg-red-100 rounded-md p-3'>
              <svg
                className='h-6 w-6 text-red-600'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z'
                />
              </svg>
            </div>
            <div className='ml-5 w-0 flex-1'>
              <dt className='text-sm font-medium text-gray-500 truncate'>
                Total Produk
              </dt>
              <dd className='text-2xl font-semibold text-gray-900'>
                {products.length}
              </dd>
            </div>
          </div>
        </div>

        <div className='bg-white rounded-lg shadow p-6'>
          <div className='flex items-center'>
            <div className='flex-shrink-0 bg-orange-100 rounded-md p-3'>
              <svg
                className='h-6 w-6 text-orange-600'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4'
                />
              </svg>
            </div>
            <div className='ml-5 w-0 flex-1'>
              <dt className='text-sm font-medium text-gray-500 truncate'>
                Stok 1 Unit
              </dt>
              <dd className='text-2xl font-semibold text-gray-900'>
                {products.filter((p) => p.stock === 1).length}
              </dd>
            </div>
          </div>
        </div>

        <div className='bg-white rounded-lg shadow p-6'>
          <div className='flex items-center'>
            <div className='flex-shrink-0 bg-red-100 rounded-md p-3'>
              <svg
                className='h-6 w-6 text-red-600'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M6 18L18 6M6 6l12 12'
                />
              </svg>
            </div>
            <div className='ml-5 w-0 flex-1'>
              <dt className='text-sm font-medium text-gray-500 truncate'>
                Habis
              </dt>
              <dd className='text-2xl font-semibold text-gray-900'>
                {products.filter((p) => p.stock === 0).length}
              </dd>
            </div>
          </div>
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
                  Harga
                </th>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Terakhir Dipesan
                </th>
                <th className='px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody className='bg-white divide-y divide-gray-200'>
              {products.map((product) => (
                <tr
                  key={product.id}
                  className={`hover:bg-gray-50 ${
                    product.stock === 0 ? 'bg-red-50' : ''
                  }`}
                >
                  <td className='px-6 py-4 whitespace-nowrap'>
                    <div className='flex items-center'>
                      <div className='text-sm font-medium text-gray-900'>
                        {product.name}
                      </div>
                    </div>
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap'>
                    <span className='px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800'>
                      {product.category}
                    </span>
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap'>
                    <div className='flex items-center gap-2'>
                      {product.stock === 0 ? (
                        <span className='px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800'>
                          HABIS
                        </span>
                      ) : (
                        <span className='px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-orange-100 text-orange-800'>
                          {product.stock} unit
                        </span>
                      )}
                    </div>
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-900'>
                    {formatCurrency(product.price)}
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                    {formatDate(product.lastOrdered)}
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap text-right text-sm font-medium'>
                    <button
                      onClick={() => handleOrderNow(product.id)}
                      className='inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
                    >
                      Pesan Sekarang
                    </button>
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
