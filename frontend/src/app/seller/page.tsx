'use client';

import React, { useEffect, useState } from 'react';
import {
  IDashboardStats,
  IRatingByProvince,
  IProductWithStock,
} from '@/types/seller';

export default function SellerDashboard() {
  const [stats, setStats] = useState<IDashboardStats>({
    totalProducts: 0,
    totalStock: 0,
    lowStockProducts: 0,
    averageRating: 0,
  });
  const [ratingsByProvince, setRatingsByProvince] = useState<
    IRatingByProvince[]
  >([]);
  const [topProducts, setTopProducts] = useState<IProductWithStock[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // TODO: Fetch data from API
    // Mock data untuk demonstrasi
    setTimeout(() => {
      setStats({
        totalProducts: 45,
        totalStock: 1250,
        lowStockProducts: 8,
        averageRating: 4.5,
      });

      setRatingsByProvince([
        {
          province: 'DKI Jakarta',
          totalRatings: 150,
          averageRating: 4.7,
          totalProducts: 12,
        },
        {
          province: 'Jawa Barat',
          totalRatings: 120,
          averageRating: 4.5,
          totalProducts: 10,
        },
        {
          province: 'Jawa Timur',
          totalRatings: 90,
          averageRating: 4.3,
          totalProducts: 8,
        },
        {
          province: 'Jawa Tengah',
          totalRatings: 75,
          averageRating: 4.4,
          totalProducts: 7,
        },
        {
          province: 'Bali',
          totalRatings: 60,
          averageRating: 4.6,
          totalProducts: 5,
        },
      ]);

      setTopProducts([
        {
          id: 1,
          name: 'Laptop Gaming ROG',
          category: 'Elektronik',
          stock: 15,
          rating: 4.8,
          price: 15000000,
        },
        {
          id: 2,
          name: 'Smartphone Samsung S23',
          category: 'Elektronik',
          stock: 25,
          rating: 4.7,
          price: 12000000,
        },
        {
          id: 3,
          name: 'Sepatu Nike Air Max',
          category: 'Fashion',
          stock: 40,
          rating: 4.6,
          price: 1500000,
        },
        {
          id: 4,
          name: 'Kemeja Formal',
          category: 'Fashion',
          stock: 30,
          rating: 4.5,
          price: 250000,
        },
        {
          id: 5,
          name: 'Rice Cooker Cosmos',
          category: 'Elektronik',
          stock: 20,
          rating: 4.4,
          price: 500000,
        },
      ]);

      setLoading(false);
    }, 1000);
  }, []);

  if (loading) {
    return (
      <div className='flex items-center justify-center h-full'>
        <div className='text-center'>
          <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto'></div>
          <p className='mt-4 text-gray-600'>Memuat data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className='space-y-6'>
      {/* Stats Cards */}
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
        <div className='bg-white rounded-lg shadow p-6'>
          <div className='flex items-center justify-between'>
            <div>
              <p className='text-sm text-gray-600'>Total Produk</p>
              <p className='text-3xl font-bold text-gray-900 mt-2'>
                {stats.totalProducts}
              </p>
            </div>
            <div className='w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center'>
              <svg
                className='w-6 h-6 text-blue-600'
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
          </div>
        </div>

        <div className='bg-white rounded-lg shadow p-6'>
          <div className='flex items-center justify-between'>
            <div>
              <p className='text-sm text-gray-600'>Total Stok</p>
              <p className='text-3xl font-bold text-gray-900 mt-2'>
                {stats.totalStock}
              </p>
            </div>
            <div className='w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center'>
              <svg
                className='w-6 h-6 text-green-600'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M5 13l4 4L19 7'
                />
              </svg>
            </div>
          </div>
        </div>

        <div className='bg-white rounded-lg shadow p-6'>
          <div className='flex items-center justify-between'>
            <div>
              <p className='text-sm text-gray-600'>Stok Menipis</p>
              <p className='text-3xl font-bold text-red-600 mt-2'>
                {stats.lowStockProducts}
              </p>
            </div>
            <div className='w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center'>
              <svg
                className='w-6 h-6 text-red-600'
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
          </div>
        </div>

        <div className='bg-white rounded-lg shadow p-6'>
          <div className='flex items-center justify-between'>
            <div>
              <p className='text-sm text-gray-600'>Rating Rata-rata</p>
              <p className='text-3xl font-bold text-yellow-600 mt-2'>
                {stats.averageRating.toFixed(1)}
              </p>
            </div>
            <div className='w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center'>
              <svg
                className='w-6 h-6 text-yellow-600'
                fill='currentColor'
                viewBox='0 0 20 20'
              >
                <path d='M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z' />
              </svg>
            </div>
          </div>
        </div>
      </div>

      <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
        {/* Rating by Province Chart */}
        <div className='bg-white rounded-lg shadow p-6'>
          <h3 className='text-lg font-semibold text-gray-900 mb-4'>
            Pemberi Rating per Provinsi
          </h3>
          <div className='space-y-4'>
            {ratingsByProvince.map((item, index) => (
              <div key={index}>
                <div className='flex items-center justify-between mb-2'>
                  <span className='text-sm font-medium text-gray-700'>
                    {item.province}
                  </span>
                  <span className='text-sm text-gray-600'>
                    {item.totalRatings} rating
                  </span>
                </div>
                <div className='flex items-center gap-2'>
                  <div className='flex-1 bg-gray-200 rounded-full h-2'>
                    <div
                      className='bg-blue-600 h-2 rounded-full'
                      style={{ width: `${(item.totalRatings / 150) * 100}%` }}
                    ></div>
                  </div>
                  <span className='text-sm font-semibold text-yellow-600 flex items-center gap-1'>
                    {item.averageRating.toFixed(1)}
                    <svg
                      className='w-4 h-4'
                      fill='currentColor'
                      viewBox='0 0 20 20'
                    >
                      <path d='M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z' />
                    </svg>
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Products by Rating */}
        <div className='bg-white rounded-lg shadow p-6'>
          <h3 className='text-lg font-semibold text-gray-900 mb-4'>
            Produk dengan Rating Tertinggi
          </h3>
          <div className='space-y-4'>
            {topProducts.map((product, index) => (
              <div
                key={product.id}
                className='flex items-center gap-4 pb-4 border-b last:border-b-0'
              >
                <div className='w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center font-semibold text-blue-600'>
                  {index + 1}
                </div>
                <div className='flex-1'>
                  <p className='font-medium text-gray-900'>{product.name}</p>
                  <p className='text-sm text-gray-500'>{product.category}</p>
                </div>
                <div className='text-right'>
                  <div className='flex items-center gap-1 text-yellow-600'>
                    <svg
                      className='w-4 h-4'
                      fill='currentColor'
                      viewBox='0 0 20 20'
                    >
                      <path d='M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z' />
                    </svg>
                    <span className='font-semibold'>{product.rating}</span>
                  </div>
                  <p className='text-sm text-gray-600'>Stok: {product.stock}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
