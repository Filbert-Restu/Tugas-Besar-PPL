'use client';

import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import FiltersBar from '@/components/FiltersBar';
import ProductCard from '@/components/ProductCard';
import Pagination from '@/components/Pagination';
import EmptyState from '@/components/EmptyState';
import { useProducts } from '@/hooks/useProducts';

export default function HomePage() {
  const {
    products,
    categories,
    loading,
    loadingProducts,
    currentPage,
    totalPages,
    filters,
    setCurrentPage,
    setFilters,
    handleSearch,
    handleFilterChange,
  } = useProducts();

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
        <FiltersBar
          filters={filters}
          categories={categories}
          setFilters={setFilters}
          setCurrentPage={setCurrentPage}
          handleSearch={handleSearch}
          handleFilterChange={handleFilterChange}
        />

        {/* Products Grid */}
        <div className='mb-4 flex items-center justify-between'>
          <p className='text-gray-600'>
            Menampilkan{' '}
            <span className='font-semibold text-gray-900'>
              {products.length}
            </span>{' '}
            produk
          </p>
          {loadingProducts && (
            <div className='flex items-center gap-2 text-blue-600'>
              <div className='animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600'></div>
              <span className='text-sm'>Memuat...</span>
            </div>
          )}
        </div>

        {products.length === 0 ? (
          <EmptyState message='Tidak ada produk yang ditemukan dengan kriteria tersebut.' />
        ) : (
          <>
            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'>
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>

            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </>
        )}
      </main>
    </div>
  );
}
