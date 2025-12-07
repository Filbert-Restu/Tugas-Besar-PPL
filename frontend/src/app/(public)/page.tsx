'use client';

import React from 'react';
import Hero from '@/components/Hero';
import FiltersBar from '@/components/Filter/FiltersBar';
import ProductCard from '@/components/ProductCard';
import Pagination from '@/components/Pagination';
import EmptyState from '@/components/EmptyState';
import LoadingSpinner from '@/components/LoadingSpinner';
import { useProducts } from '@/hooks/Product/useProducts';

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
    return <LoadingSpinner fullScreen size='xl' />;
  }

  return (
    <div className='min-h-screen bg-gray-50'>
      {/* Header */}
      <main className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
        {/* Hero Section */}
        <Hero />

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
          {loadingProducts && <LoadingSpinner size='sm' text='Memuat...' />}
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
