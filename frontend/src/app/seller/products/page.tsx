'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { IProduct } from '@/types/seller';

export default function ProductsPage() {
  const [products, setProducts] = useState<IProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');

  useEffect(() => {
    // TODO: Fetch from API
    setTimeout(() => {
      const mockData: IProduct[] = [
        {
          id: 1,
          name: 'Laptop Gaming ROG',
          category: 'Elektronik',
          price: 15000000,
          stock: 15,
          rating: 4.8,
          totalRatings: 150,
          description: 'Laptop gaming powerful',
          createdAt: '2024-01-01',
          updatedAt: '2024-01-01',
        },
        {
          id: 2,
          name: 'Smartphone Samsung S23',
          category: 'Elektronik',
          price: 12000000,
          stock: 25,
          rating: 4.7,
          totalRatings: 120,
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
          createdAt: '2024-01-01',
          updatedAt: '2024-01-01',
        },
      ];
      setProducts(mockData);
      setLoading(false);
    }, 800);
  }, []);

  const categories = [
    'all',
    ...Array.from(new Set(products.map((p) => p.category))),
  ];

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesCategory =
      categoryFilter === 'all' || product.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(value);
  };

  const handleDelete = (id: number) => {
    if (confirm('Apakah Anda yakin ingin menghapus produk ini?')) {
      alert(`Menghapus produk ID: ${id}`);
      // TODO: API call to delete
    }
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
      {/* Header */}
      <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4'>
        <div>
          <h1 className='text-2xl font-bold text-gray-900'>Produk Saya</h1>
          <p className='text-sm text-gray-600 mt-1'>
            Kelola semua produk yang Anda jual
          </p>
        </div>
        <Link
          href='/seller/products/create'
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
              d='M12 4v16m8-8H4'
            />
          </svg>
          Tambah Produk
        </Link>
      </div>

      {/* Filters */}
      <div className='bg-white rounded-lg shadow p-4'>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-2'>
              Cari Produk
            </label>
            <div className='relative'>
              <input
                type='text'
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder='Cari nama produk...'
                className='w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
              />
              <svg
                className='absolute left-3 top-2.5 h-5 w-5 text-gray-400'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z'
                />
              </svg>
            </div>
          </div>
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-2'>
              Kategori
            </label>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat === 'all' ? 'Semua Kategori' : cat}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      {filteredProducts.length === 0 ? (
        <div className='bg-white rounded-lg shadow p-12 text-center'>
          <svg
            className='mx-auto h-12 w-12 text-gray-400'
            fill='none'
            stroke='currentColor'
            viewBox='0 0 24 24'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth={2}
              d='M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4'
            />
          </svg>
          <h3 className='mt-2 text-sm font-medium text-gray-900'>
            Tidak ada produk ditemukan
          </h3>
          <p className='mt-1 text-sm text-gray-500'>
            Ubah filter atau tambahkan produk baru
          </p>
        </div>
      ) : (
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              className='bg-white rounded-lg shadow hover:shadow-lg transition-shadow overflow-hidden'
            >
              <div className='h-48 bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center'>
                <svg
                  className='w-20 h-20 text-blue-400'
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
              <div className='p-4'>
                <div className='flex items-start justify-between mb-2'>
                  <h3 className='font-semibold text-gray-900 text-lg line-clamp-2'>
                    {product.name}
                  </h3>
                  <span
                    className={`px-2 py-1 text-xs font-semibold rounded-full ${
                      product.stock < 2
                        ? 'bg-red-100 text-red-800'
                        : 'bg-green-100 text-green-800'
                    }`}
                  >
                    {product.stock < 2 ? 'Low' : 'OK'}
                  </span>
                </div>
                <p className='text-sm text-gray-600 mb-3'>{product.category}</p>

                <div className='flex items-center gap-1 mb-3'>
                  <svg
                    className='w-5 h-5 text-yellow-400'
                    fill='currentColor'
                    viewBox='0 0 20 20'
                  >
                    <path d='M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z' />
                  </svg>
                  <span className='font-semibold text-gray-900'>
                    {product.rating}
                  </span>
                  <span className='text-sm text-gray-500'>
                    ({product.totalRatings})
                  </span>
                </div>

                <div className='flex items-center justify-between mb-4'>
                  <div>
                    <p className='text-xs text-gray-500'>Stok</p>
                    <p className='font-semibold text-gray-900'>
                      {product.stock} unit
                    </p>
                  </div>
                  <div className='text-right'>
                    <p className='text-xs text-gray-500'>Harga</p>
                    <p className='font-semibold text-blue-600'>
                      {formatCurrency(product.price)}
                    </p>
                  </div>
                </div>

                <div className='flex gap-2'>
                  <Link
                    href={`/seller/products/${product.id}/edit`}
                    className='flex-1 px-3 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 text-center'
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => handleDelete(product.id)}
                    className='px-3 py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700'
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
                        d='M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16'
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
