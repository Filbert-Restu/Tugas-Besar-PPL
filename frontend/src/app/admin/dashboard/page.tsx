'use client';

import React from 'react';
import StatsCard from '@/components/Admin/StatsCard';
import ProductsByCategoryChart from '@/components/Admin/ProductsByCategoryChart';
import StoresByProvinceChart from '@/components/Admin/StoresByProvinceChart';
import UserStatusChart from '@/components/Admin/UserStatusChart';
import RatingDistributionChart from '@/components/Admin/RatingDistributionChart';
import TopRatedProductsTable from '@/components/Admin/TopRatedProductsTable';
import ReportSection from '@/components/Admin/ReportSection';
import LoadingState from '@/components/LoadingState';
import ErrorState from '@/components/ErrorState';
import { useAdminDashboard } from '@/hooks/Admin/useAdminDashboard';

export default function AdminDashboardPage() {
  const { data, loading, error } = useAdminDashboard();

  if (loading) {
    return <LoadingState message='Memuat data dashboard...' />;
  }

  if (error || !data) {
    return <ErrorState message={error || 'Terjadi kesalahan'} />;
  }

  const { summary } = data;

  return (
    <div className='space-y-6'>
      {/* Page Header */}
      <div className='mb-8'>
        <h1 className='text-3xl font-bold text-gray-900'>Dashboard Admin</h1>
        <p className='text-gray-600 mt-2'>
          Selamat datang! Berikut adalah ringkasan statistik platform.
        </p>
      </div>

      {/* Stats Grid */}
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
        <StatsCard
          title='Total Produk'
          value={summary.total_produk}
          icon={
            <svg
              className='w-6 h-6'
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
          }
          color='blue'
        />

        <StatsCard
          title='Total Toko'
          value={summary.total_toko}
          icon={
            <svg
              className='w-6 h-6'
              fill='none'
              stroke='currentColor'
              viewBox='0 0 24 24'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6'
              />
            </svg>
          }
          color='green'
          subtitle={`${summary.toko_aktif} aktif, ${summary.toko_tidak_aktif} tidak aktif`}
        />

        <StatsCard
          title='Pending Verifikasi'
          value={summary.pending_verifikasi}
          icon={
            <svg
              className='w-6 h-6'
              fill='none'
              stroke='currentColor'
              viewBox='0 0 24 24'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z'
              />
            </svg>
          }
          color='yellow'
        />

        <StatsCard
          title='Total Kategori'
          value={summary.total_kategori}
          icon={
            <svg
              className='w-6 h-6'
              fill='none'
              stroke='currentColor'
              viewBox='0 0 24 24'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z'
              />
            </svg>
          }
          color='purple'
        />
      </div>

      {/* Review Stats */}
      <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
        <StatsCard
          title='Total Review'
          value={summary.total_review}
          icon={
            <svg
              className='w-6 h-6'
              fill='none'
              stroke='currentColor'
              viewBox='0 0 24 24'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z'
              />
            </svg>
          }
          color='indigo'
        />

        <StatsCard
          title='Rating Rata-rata'
          value={summary.average_rating.toFixed(1)}
          icon={
            <svg className='w-6 h-6' fill='currentColor' viewBox='0 0 20 20'>
              <path d='M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z' />
            </svg>
          }
          color='yellow'
          subtitle='dari semua review'
        />
      </div>

      {/* Charts Row 1 */}
      <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
        <ProductsByCategoryChart data={data.produk_per_kategori} />
        <StoresByProvinceChart data={data.toko_per_provinsi} />
      </div>

      {/* Charts Row 2 */}
      <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
        <UserStatusChart data={data.user_status} />
        <RatingDistributionChart data={data.rating_distribution} />
      </div>

      {/* Top Products Table */}
      {data.top_rated_products.length > 0 && (
        <TopRatedProductsTable data={data.top_rated_products} />
      )}

      {/* PDF Reports Section */}
      <ReportSection />
    </div>
  );
}
