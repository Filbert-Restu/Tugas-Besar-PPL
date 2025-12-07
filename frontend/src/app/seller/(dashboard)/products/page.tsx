'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { IProduct } from '@/types/seller';
import apiClient from '@/lib/apiClient';
import { isAxiosError } from 'axios';
import ProductGrid from '@/components/Seller/ProductGrid';

interface ApiProduct {
  id: number;
  nama_produk: string;
  kategori_produk_id: number;
  deskripsi_produk: string;
  harga_produk: number;
  berat_produk: number;
  stok_produk: number;
  foto_produk_url: string | null;
  rating: number;
  kategori: {
    id: number;
    nama_kategori: string;
  } | null;
  created_at: string;
  updated_at: string;
}

export default function ProductsPage() {
  const [products, setProducts] = useState<IProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await apiClient.get('/api/seller/products');
        const apiProducts: ApiProduct[] = response.data.data || [];

        // Transform API data to IProduct format
        const transformedProducts: IProduct[] = apiProducts.map((product) => ({
          id: product.id,
          name: product.nama_produk,
          category: product.kategori?.nama_kategori || 'Tanpa Kategori',
          price: product.harga_produk,
          stock: product.stok_produk,
          rating: product.rating || 0,
          totalRatings: 0, // Not available from API yet
          description: product.deskripsi_produk,
          image: product.foto_produk_url || undefined,
          createdAt: product.created_at,
          updatedAt: product.updated_at,
        }));

        setProducts(transformedProducts);
      } catch (err) {
        console.error('Error fetching products:', err);
        if (isAxiosError(err) && err.response) {
          setError(err.response.data.message || 'Gagal memuat produk');
        } else {
          setError('Gagal memuat produk. Silakan coba lagi.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
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

  const handleDelete = async (id: number) => {
    if (!confirm('Apakah Anda yakin ingin menghapus produk ini?')) {
      return;
    }

    try {
      await apiClient.post('/api/seller/products/delete', {
        product_id: id,
      });

      // Remove from local state
      setProducts(products.filter((p) => p.id !== id));
      alert('Produk berhasil dihapus');
    } catch (err) {
      console.error('Error deleting product:', err);
      if (isAxiosError(err) && err.response) {
        alert(err.response.data.message || 'Gagal menghapus produk');
      } else {
        alert('Gagal menghapus produk. Silakan coba lagi.');
      }
    }
  };

  if (loading) {
    return (
      <div className='flex items-center justify-center h-64'>
        <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600'></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className='bg-red-50 border border-red-200 rounded-lg p-6'>
        <div className='flex items-start gap-3'>
          <svg
            className='w-6 h-6 text-red-600 mt-0.5'
            fill='currentColor'
            viewBox='0 0 20 20'
          >
            <path
              fillRule='evenodd'
              d='M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z'
              clipRule='evenodd'
            />
          </svg>
          <div>
            <h3 className='font-semibold text-red-800'>Error</h3>
            <p className='text-sm text-red-700 mt-1'>{error}</p>
          </div>
        </div>
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
      <ProductGrid
        products={filteredProducts}
        onDelete={handleDelete}
        formatCurrency={formatCurrency}
      />
    </div>
  );
}
