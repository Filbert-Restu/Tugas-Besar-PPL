'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { IPublicProduct, IProductFilters } from '@/types/product';

export default function HomePage() {
  const [products, setProducts] = useState<IPublicProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<IProductFilters>({
    search: '',
    category: 'all',
    minPrice: 0,
    maxPrice: 100000000,
    minRating: 0,
    sortBy: 'newest',
  });

  useEffect(() => {
    // TODO: Fetch from API
    setTimeout(() => {
      const mockData: IPublicProduct[] = [
        {
          id: 1,
          name: 'Laptop Gaming ROG Strix G15',
          category: 'Elektronik',
          price: 15000000,
          stock: 15,
          description: 'Laptop gaming powerful dengan RTX 3060',
          sellerName: 'Tech Store Jakarta',
          rating: 4.8,
          totalRatings: 150,
          createdAt: '2024-01-15',
        },
        {
          id: 2,
          name: 'Smartphone Samsung Galaxy S23',
          category: 'Elektronik',
          price: 12000000,
          stock: 25,
          description: 'Smartphone flagship terbaru Samsung',
          sellerName: 'Gadget Center',
          rating: 4.7,
          totalRatings: 220,
          createdAt: '2024-01-10',
        },
        {
          id: 3,
          name: 'Sepatu Nike Air Max 270',
          category: 'Fashion',
          price: 1500000,
          stock: 30,
          description: 'Sepatu olahraga nyaman untuk aktivitas harian',
          sellerName: 'Sport Station',
          rating: 4.6,
          totalRatings: 180,
          createdAt: '2024-01-12',
        },
        {
          id: 4,
          name: 'Kemeja Formal Slim Fit',
          category: 'Fashion',
          price: 250000,
          stock: 50,
          description: 'Kemeja formal untuk kantor dan acara resmi',
          sellerName: 'Fashion House',
          rating: 4.5,
          totalRatings: 95,
          createdAt: '2024-01-08',
        },
        {
          id: 5,
          name: 'Rice Cooker Cosmos Digital',
          category: 'Elektronik',
          price: 500000,
          stock: 20,
          description: 'Rice cooker digital dengan 8 menu masak',
          sellerName: 'Home Appliance',
          rating: 4.4,
          totalRatings: 75,
          createdAt: '2024-01-05',
        },
        {
          id: 6,
          name: 'Meja Belajar Minimalis',
          category: 'Furniture',
          price: 750000,
          stock: 12,
          description: 'Meja belajar kayu jati minimalis modern',
          sellerName: 'Furniture Jaya',
          rating: 4.6,
          totalRatings: 60,
          createdAt: '2024-01-03',
        },
        {
          id: 7,
          name: 'Tas Ransel Anti Air',
          category: 'Fashion',
          price: 350000,
          stock: 40,
          description: 'Tas ransel laptop waterproof untuk perjalanan',
          sellerName: 'Bag Store',
          rating: 4.7,
          totalRatings: 110,
          createdAt: '2024-01-14',
        },
        {
          id: 8,
          name: 'Blender Philips HR2115',
          category: 'Elektronik',
          price: 400000,
          stock: 18,
          description: 'Blender 2 liter untuk membuat jus dan smoothie',
          sellerName: 'Kitchen World',
          rating: 4.5,
          totalRatings: 85,
          createdAt: '2024-01-11',
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
      .includes(filters.search.toLowerCase());
    const matchesCategory =
      filters.category === 'all' || product.category === filters.category;
    const matchesPrice =
      product.price >= filters.minPrice && product.price <= filters.maxPrice;
    const matchesRating = product.rating >= filters.minRating;
    return matchesSearch && matchesCategory && matchesPrice && matchesRating;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (filters.sortBy) {
      case 'price-asc':
        return a.price - b.price;
      case 'price-desc':
        return b.price - a.price;
      case 'rating':
        return b.rating - a.rating;
      case 'name':
        return a.name.localeCompare(b.name);
      case 'newest':
      default:
        return (
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
    }
  });

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(value);
  };

  const handleFilterChange = (
    key: keyof IProductFilters,
    value: string | number
  ) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  if (loading) {
    return (
      <div className='min-h-screen bg-gray-50 flex items-center justify-center'>
        <div className='animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600'></div>
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-gray-50'>
      {/* Header */}
      <header className='bg-white shadow-sm sticky top-0 z-50'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4'>
          <div className='flex items-center justify-between'>
            <div className='flex items-center gap-3'>
              <div className='w-10 h-10 bg-linear-to-br from-blue-600 to-blue-800 rounded-lg flex items-center justify-center'>
                <svg
                  className='w-6 h-6 text-white'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z'
                  />
                </svg>
              </div>
              <div>
                <h1 className='text-2xl font-bold text-gray-900'>MartPlace</h1>
                <p className='text-xs text-gray-600'>
                  Belanja Online Terpercaya
                </p>
              </div>
            </div>
            <div className='flex items-center gap-3'>
              <Link
                href='/login'
                className='px-4 py-2 text-gray-700 hover:text-gray-900 font-medium'
              >
                Masuk
              </Link>
              <Link
                href='/register'
                className='px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium'
              >
                Daftar
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
        {/* Hero Section */}
        <div className='bg-linear-to-r from-blue-600 to-blue-800 rounded-2xl p-8 mb-8 text-white'>
          <h2 className='text-3xl font-bold mb-2'>
            Selamat Datang di MartPlace
          </h2>
          <p className='text-blue-100 text-lg'>
            Temukan produk terbaik dengan rating dan komentar dari pembeli
          </p>
        </div>

        {/* Filters */}
        <div className='bg-white rounded-lg shadow-sm p-6 mb-6'>
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4'>
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-2'>
                Cari Produk
              </label>
              <div className='relative'>
                <input
                  type='text'
                  value={filters.search}
                  onChange={(e) => handleFilterChange('search', e.target.value)}
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
                value={filters.category}
                onChange={(e) => handleFilterChange('category', e.target.value)}
                className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat === 'all' ? 'Semua Kategori' : cat}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-2'>
                Rating Minimal
              </label>
              <select
                value={filters.minRating}
                onChange={(e) =>
                  handleFilterChange('minRating', Number(e.target.value))
                }
                className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
              >
                <option value={0}>Semua Rating</option>
                <option value={4}>4+ ⭐</option>
                <option value={4.5}>4.5+ ⭐</option>
              </select>
            </div>
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-2'>
                Urutkan
              </label>
              <select
                value={filters.sortBy}
                onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
              >
                <option value='newest'>Terbaru</option>
                <option value='price-asc'>Harga Terendah</option>
                <option value='price-desc'>Harga Tertinggi</option>
                <option value='rating'>Rating Tertinggi</option>
                <option value='name'>Nama (A-Z)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Products Grid */}
        <div className='mb-4 flex items-center justify-between'>
          <p className='text-gray-600'>
            Menampilkan{' '}
            <span className='font-semibold text-gray-900'>
              {sortedProducts.length}
            </span>{' '}
            produk
          </p>
        </div>

        {sortedProducts.length === 0 ? (
          <div className='bg-white rounded-lg shadow-sm p-12 text-center'>
            <svg
              className='mx-auto h-16 w-16 text-gray-400'
              fill='none'
              stroke='currentColor'
              viewBox='0 0 24 24'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
              />
            </svg>
            <h3 className='mt-4 text-lg font-medium text-gray-900'>
              Produk tidak ditemukan
            </h3>
            <p className='mt-2 text-sm text-gray-500'>
              Coba ubah filter pencarian Anda
            </p>
          </div>
        ) : (
          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'>
            {sortedProducts.map((product) => (
              <Link
                key={product.id}
                href={`/products/${product.id}`}
                className='bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden group'
              >
                <div className='h-48 bg-linear-to-br from-gray-100 to-gray-200 flex items-center justify-center relative overflow-hidden'>
                  <svg
                    className='w-20 h-20 text-gray-300 group-hover:scale-110 transition-transform duration-200'
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
                  {product.stock < 5 && (
                    <span className='absolute top-2 right-2 px-2 py-1 bg-red-500 text-white text-xs font-semibold rounded'>
                      Stok Terbatas
                    </span>
                  )}
                </div>
                <div className='p-4'>
                  <h3 className='font-semibold text-gray-900 text-base line-clamp-2 mb-2 group-hover:text-blue-600 transition-colors'>
                    {product.name}
                  </h3>
                  <p className='text-xs text-gray-500 mb-3'>
                    {product.sellerName}
                  </p>

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

                  <p className='text-lg font-bold text-blue-600 mb-3'>
                    {formatCurrency(product.price)}
                  </p>

                  <div className='flex items-center justify-between text-xs text-gray-500'>
                    <span>Stok: {product.stock}</span>
                    <span className='px-2 py-1 bg-gray-100 rounded'>
                      {product.category}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className='bg-white border-t mt-12'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
          <div className='text-center text-gray-600'>
            <p className='text-sm'>
              © 2024 MartPlace. Platform belanja online dengan rating dan
              komentar.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
