'use client';

import React, { useState, useEffect } from 'react';
import { AdminLayout } from './_components/AdminLayout';
import { StatCard } from './_components/StatCard';
import { BarChart } from './_components/BarChart';
import { PieChart } from './_components/PieChart';
// import apiClient from '@/lib/apiClient';
// import { AxiosError } from 'axios';

// Mock data structure - nanti akan diganti dengan API call
interface DashboardData {
  stats: {
    totalSellers: number;
    activeSellers: number;
    inactiveSellers: number;
    totalProducts: number;
    totalRatings: number;
    totalComments: number;
  };
  productsByCategory: Array<{ category: string; count: number }>;
  sellersByProvince: Array<{ province: string; count: number }>;
  ratingStats: {
    visitorsWithRating: number;
    visitorsWithComment: number;
    totalVisitors: number;
  };
}

export default function AdminDashboard() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [data, setData] = useState<DashboardData>({
    stats: {
      totalSellers: 0,
      activeSellers: 0,
      inactiveSellers: 0,
      totalProducts: 0,
      totalRatings: 0,
      totalComments: 0,
    },
    productsByCategory: [],
    sellersByProvince: [],
    ratingStats: {
      visitorsWithRating: 0,
      visitorsWithComment: 0,
      totalVisitors: 0,
    },
  });

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError('');

        // Simulate API call - replace with actual endpoint when backend is ready
        // const response = await apiClient.get('/admin/dashboard');
        // setData(response.data.data);

        // Mock data for now
        setTimeout(() => {
          setData({
            stats: {
              totalSellers: 156,
              activeSellers: 128,
              inactiveSellers: 28,
              totalProducts: 1234,
              totalRatings: 4567,
              totalComments: 2341,
            },
            productsByCategory: [
              { category: 'Elektronik', count: 342 },
              { category: 'Fashion', count: 298 },
              { category: 'Makanan & Minuman', count: 234 },
              { category: 'Kesehatan & Kecantikan', count: 156 },
              { category: 'Olahraga', count: 123 },
              { category: 'Rumah Tangga', count: 81 },
            ],
            sellersByProvince: [
              { province: 'DKI Jakarta', count: 45 },
              { province: 'Jawa Barat', count: 38 },
              { province: 'Jawa Timur', count: 32 },
              { province: 'Jawa Tengah', count: 18 },
              { province: 'Banten', count: 12 },
              { province: 'Sumatera Utara', count: 11 },
            ],
            ratingStats: {
              visitorsWithRating: 4567,
              visitorsWithComment: 2341,
              totalVisitors: 8934,
            },
          });
          setLoading(false);
        }, 500);
      } catch (err) {
        setError('Gagal memuat data dashboard');
        setLoading(false);
        console.error('Error fetching dashboard data:', err);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-[calc(100vh-200px)]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Memuat dashboard...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  if (error) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-[calc(100vh-200px)]">
          <div className="text-center">
            <div className="text-red-600 text-6xl mb-4">⚠️</div>
            <p className="text-red-600 font-semibold">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Coba Lagi
            </button>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Dashboard Admin
          </h1>
          <p className="text-gray-600 mt-2">
            Pantau aktivitas penjual dan produk di platform
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Total Penjual"
            value={data.stats.totalSellers}
            subtitle={`${data.stats.activeSellers} aktif, ${data.stats.inactiveSellers} tidak aktif`}
            color="blue"
            icon={
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
            }
          />

          <StatCard
            title="Total Produk"
            value={data.stats.totalProducts}
            subtitle="Produk terdaftar"
            color="green"
            icon={
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                />
              </svg>
            }
          />

          <StatCard
            title="Total Rating"
            value={data.stats.totalRatings}
            subtitle={`${((data.ratingStats.visitorsWithRating / data.ratingStats.totalVisitors) * 100).toFixed(1)}% pengunjung`}
            color="yellow"
            icon={
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                />
              </svg>
            }
          />

          <StatCard
            title="Total Komentar"
            value={data.stats.totalComments}
            subtitle={`${((data.ratingStats.visitorsWithComment / data.ratingStats.totalVisitors) * 100).toFixed(1)}% pengunjung`}
            color="purple"
            icon={
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"
                />
              </svg>
            }
          />
        </div>

        {/* Charts Row 1 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <BarChart
            title="Sebaran Produk per Kategori"
            data={data.productsByCategory.map((item) => ({
              label: item.category,
              value: item.count,
            }))}
            height={350}
          />

          <BarChart
            title="Sebaran Toko per Provinsi"
            data={data.sellersByProvince.map((item) => ({
              label: item.province,
              value: item.count,
            }))}
            height={350}
          />
        </div>

        {/* Charts Row 2 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <PieChart
            title="Status Penjual (Aktif/Tidak Aktif)"
            data={[
              {
                label: 'Penjual Aktif',
                value: data.stats.activeSellers,
                color: '#10B981',
              },
              {
                label: 'Penjual Tidak Aktif',
                value: data.stats.inactiveSellers,
                color: '#EF4444',
              },
            ]}
          />

          <PieChart
            title="Pengunjung dengan Rating/Komentar"
            data={[
              {
                label: 'Memberi Rating',
                value: data.ratingStats.visitorsWithRating,
                color: '#F59E0B',
              },
              {
                label: 'Memberi Komentar',
                value: data.ratingStats.visitorsWithComment,
                color: '#8B5CF6',
              },
              {
                label: 'Tanpa Rating/Komentar',
                value:
                  data.ratingStats.totalVisitors -
                  data.ratingStats.visitorsWithRating -
                  data.ratingStats.visitorsWithComment,
                color: '#6B7280',
              },
            ]}
          />
        </div>

        {/* Additional Info */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <svg
              className="w-5 h-5 text-blue-600 mt-0.5 shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <div>
              <p className="text-sm font-medium text-blue-900">
                Data Dashboard
              </p>
              <p className="text-sm text-blue-700 mt-1">
                Dashboard ini menampilkan data real-time dari aktivitas platform.
                Data diperbarui setiap kali halaman dimuat ulang.
              </p>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
