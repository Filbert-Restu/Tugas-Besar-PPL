"use client";

import React, { useState, useEffect } from "react";
import { AdminLayout } from "./_components/AdminLayout";
import { StatCard } from "./_components/StatCard";
import { BarChart } from "./_components/BarChart";
import { PieChart } from "./_components/PieChart";
import apiClient from "@/lib/apiClient";
import { AxiosError } from "axios";
import Link from "next/link";

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
  sellersByProvince: Array<{
    province: string;
    count: number;
    activeCount: number;
    inactiveCount: number;
  }>;
  ratingStats: {
    visitorsWithRating: number;
    visitorsWithComment: number;
    totalVisitors: number;
    averageRating: number;
  };
}

export default function AdminDashboard() {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string>("");
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
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
      averageRating: 0,
    },
  });

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        if (setLoading !== setRefreshing) {
          setLoading(true);
        }
        setError("");

        // Fetch dashboard data from backend
        const response = await apiClient.get("/api/admin/dashboard");

        if (response.data.data) {
          setData(response.data.data);
          setLastUpdated(new Date());
        }
      } catch (err) {
        const error = err as AxiosError<{ message: string }>;
        console.error("Error fetching dashboard data:", err);

        if (error.response?.status === 404) {
          setError(
            "Endpoint dashboard tidak ditemukan. Pastikan backend berjalan di http://localhost:8000"
          );
        } else if (error.response?.status === 401) {
          setError(
            "Tidak terautentikasi. Silakan login sebagai admin terlebih dahulu."
          );
        } else if (error.response?.status === 403) {
          setError("Akses ditolak. Anda tidak memiliki izin sebagai admin.");
        } else {
          setError(
            error.response?.data?.message || "Gagal memuat data dashboard"
          );
        }
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    };

    fetchDashboardData();

    // Set up auto-refresh every 30 seconds for real-time data
    const refreshInterval = setInterval(fetchDashboardData, 30000);

    return () => clearInterval(refreshInterval);
  }, []);

  const handleManualRefresh = async () => {
    setRefreshing(true);
    try {
      setError("");
      const response = await apiClient.get("/api/admin/dashboard");
      if (response.data.data) {
        setData(response.data.data);
        setLastUpdated(new Date());
      }
    } catch (err) {
      const error = err as AxiosError<{ message: string }>;
      setError(
        error.response?.data?.message || "Gagal memperbarui data dashboard"
      );
    } finally {
      setRefreshing(false);
    }
  };

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

  return (
    <AdminLayout>
      <div className="space-y-8 p-8">
        {/* Welcome Header */}
        <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-800 rounded-2xl p-8 text-white shadow-lg">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h1 className="text-4xl font-bold mb-2">
                Selamat Datang, Admin!
              </h1>
              <p className="text-blue-100 text-lg">
                Pantau performa marketplace dan kelola aktivitas penjual serta
                produk
              </p>
            </div>
            <button
              onClick={handleManualRefresh}
              disabled={refreshing}
              className="px-4 py-2 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-lg transition-all disabled:opacity-50 flex items-center gap-2"
            >
              <svg
                className={`w-5 h-5 ${refreshing ? "animate-spin" : ""}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
              {refreshing ? "Memperbarui..." : "Perbarui"}
            </button>
          </div>
          <div className="mt-4 flex flex-wrap gap-2 items-center justify-between">
            <div className="flex flex-wrap gap-2">
              <span className="px-3 py-1 bg-white bg-opacity-20 rounded-full text-sm">
                📊 {data.stats.totalSellers} Penjual
              </span>
              <span className="px-3 py-1 bg-white bg-opacity-20 rounded-full text-sm">
                📦 {data.stats.totalProducts} Produk
              </span>
              <span className="px-3 py-1 bg-white bg-opacity-20 rounded-full text-sm">
                ⭐ {data.ratingStats.averageRating} Rating Rata-rata
              </span>
            </div>
            {lastUpdated && (
              <span className="text-xs bg-white bg-opacity-20 px-3 py-1 rounded-full">
                Diperbarui: {lastUpdated.toLocaleTimeString("id-ID")}
              </span>
            )}
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 text-red-700 px-6 py-4 rounded-lg shadow-sm">
            <div className="flex items-center gap-3">
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
                  d="M12 9v2m0 4v2m0 0v2m0-6v-2m0 0V7m0 0a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <div>
                <p className="font-semibold">Peringatan:</p>
                <p className="text-sm">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Stats Cards - Enhanced */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          <Link href="/dashboard/active_sellers" className="group">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 border-2 border-blue-200 rounded-xl p-5 hover:shadow-lg transition-all hover:scale-105 cursor-pointer">
              <div className="flex items-center justify-between mb-3">
                <div className="p-3 bg-blue-500 rounded-lg group-hover:bg-blue-600 transition-colors">
                  <svg
                    className="w-6 h-6 text-white"
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
                </div>
                <span className="text-2xl font-bold text-blue-600 group-hover:text-blue-700">
                  {data.stats.totalSellers}
                </span>
              </div>
              <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
                Total Penjual
              </p>
              <p className="text-xs text-gray-500 mt-1">
                {data.stats.activeSellers} aktif
              </p>
            </div>
          </Link>

          <Link href="/dashboard/bintang_products" className="group">
            <div className="bg-gradient-to-br from-green-50 to-green-100 border-2 border-green-200 rounded-xl p-5 hover:shadow-lg transition-all hover:scale-105 cursor-pointer">
              <div className="flex items-center justify-between mb-3">
                <div className="p-3 bg-green-500 rounded-lg group-hover:bg-green-600 transition-colors">
                  <svg
                    className="w-6 h-6 text-white"
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
                </div>
                <span className="text-2xl font-bold text-green-600 group-hover:text-green-700">
                  {data.stats.totalProducts}
                </span>
              </div>
              <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
                Total Produk
              </p>
              <p className="text-xs text-gray-500 mt-1">Terdaftar aktif</p>
            </div>
          </Link>

          <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 border-2 border-yellow-200 rounded-xl p-5 hover:shadow-lg transition-all cursor-pointer">
            <div className="flex items-center justify-between mb-3">
              <div className="p-3 bg-yellow-500 rounded-lg">
                <svg
                  className="w-6 h-6 text-white"
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
              </div>
              <span className="text-2xl font-bold text-yellow-600">
                {data.stats.totalRatings}
              </span>
            </div>
            <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
              Total Rating
            </p>
            <p className="text-xs text-gray-500 mt-1">Dari pembeli</p>
          </div>

          <div className="bg-gradient-to-br from-purple-50 to-purple-100 border-2 border-purple-200 rounded-xl p-5 hover:shadow-lg transition-all cursor-pointer">
            <div className="flex items-center justify-between mb-3">
              <div className="p-3 bg-purple-500 rounded-lg">
                <svg
                  className="w-6 h-6 text-white"
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
              </div>
              <span className="text-2xl font-bold text-purple-600">
                {data.stats.totalComments}
              </span>
            </div>
            <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
              Komentar
            </p>
            <p className="text-xs text-gray-500 mt-1">Dari pembeli</p>
          </div>

          <div className="bg-gradient-to-br from-red-50 to-red-100 border-2 border-red-200 rounded-xl p-5 hover:shadow-lg transition-all cursor-pointer">
            <div className="flex items-center justify-between mb-3">
              <div className="p-3 bg-red-500 rounded-lg">
                <svg
                  className="w-6 h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <span className="text-2xl font-bold text-red-600">
                {data.stats.activeSellers}
              </span>
            </div>
            <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
              Penjual Aktif
            </p>
            <p className="text-xs text-gray-500 mt-1">Terverifikasi</p>
          </div>

          <div className="bg-gradient-to-br from-orange-50 to-orange-100 border-2 border-orange-200 rounded-xl p-5 hover:shadow-lg transition-all cursor-pointer">
            <div className="flex items-center justify-between mb-3">
              <div className="p-3 bg-orange-500 rounded-lg">
                <svg
                  className="w-6 h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4m0 4v.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <span className="text-2xl font-bold text-orange-600">
                {data.ratingStats.averageRating.toFixed(1)}
              </span>
            </div>
            <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
              Rating Rata-rata
            </p>
            <p className="text-xs text-gray-500 mt-1">⭐ dari pembeli</p>
          </div>
        </div>

        {/* Charts Row 1 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
            <h3 className="text-lg font-bold text-gray-900 mb-4">
              Sebaran Produk per Kategori
            </h3>
            <BarChart
              title="Sebaran Produk per Kategori"
              data={data.productsByCategory.map((item) => ({
                label: item.category,
                value: item.count,
              }))}
              height={300}
            />
          </div>

          <Link
            href="/dashboard/location_sellers"
            className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-shadow"
          >
            <h3 className="text-lg font-bold text-gray-900 mb-4">
              Sebaran Penjual per Provinsi
            </h3>
            <BarChart
              title="Sebaran Penjual per Provinsi"
              data={data.sellersByProvince.map((item) => ({
                label: item.province,
                value: item.count,
              }))}
              height={300}
            />
          </Link>
        </div>

        {/* Charts Row 2 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
            <h3 className="text-lg font-bold text-gray-900 mb-4">
              Status Penjual
            </h3>
            <PieChart
              title="Status Penjual"
              data={[
                {
                  label: "Penjual Aktif",
                  value: data.stats.activeSellers,
                  color: "#10B981",
                },
                {
                  label: "Penjual Tidak Aktif",
                  value: data.stats.inactiveSellers,
                  color: "#EF4444",
                },
              ]}
            />
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
            <h3 className="text-lg font-bold text-gray-900 mb-4">
              Engagement Pengunjung
            </h3>
            <PieChart
              title="Engagement Pengunjung"
              data={[
                {
                  label: "Memberi Rating",
                  value: data.ratingStats.visitorsWithRating,
                  color: "#F59E0B",
                },
                {
                  label: "Memberi Komentar",
                  value: data.ratingStats.visitorsWithComment,
                  color: "#8B5CF6",
                },
                {
                  label: "Tanpa Interaksi",
                  value:
                    data.ratingStats.totalVisitors -
                    data.ratingStats.visitorsWithRating -
                    data.ratingStats.visitorsWithComment,
                  color: "#D1D5DB",
                },
              ]}
            />
          </div>
        </div>

        {/* Quick Access Cards */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Akses Cepat</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Link href="/dashboard/active_sellers">
              <div className="bg-white rounded-xl shadow-md hover:shadow-xl p-6 transition-all hover:scale-105 cursor-pointer border-l-4 border-blue-500">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-blue-100 rounded-lg">
                    <svg
                      className="w-6 h-6 text-blue-600"
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
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Penjual Aktif</p>
                    <p className="text-sm text-gray-500">
                      Lihat daftar penjual
                    </p>
                  </div>
                </div>
              </div>
            </Link>

            <Link href="/dashboard/location_sellers">
              <div className="bg-white rounded-xl shadow-md hover:shadow-xl p-6 transition-all hover:scale-105 cursor-pointer border-l-4 border-green-500">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-green-100 rounded-lg">
                    <svg
                      className="w-6 h-6 text-green-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 20l-5.447-2.724A1 1 0 003 16.382V5.618a1 1 0 011.447-.894L9 7.5m0 0l6.553-3.276A1 1 0 0117 5.618v10.764a1 1 0 01-1.447.894L9 12.5m0 0L3.5 15m6.5 2.5l6.5-3.25"
                      />
                    </svg>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Per Provinsi</p>
                    <p className="text-sm text-gray-500">Analisis geografis</p>
                  </div>
                </div>
              </div>
            </Link>

            <Link href="/dashboard/bintang_products">
              <div className="bg-white rounded-xl shadow-md hover:shadow-xl p-6 transition-all hover:scale-105 cursor-pointer border-l-4 border-yellow-500">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-yellow-100 rounded-lg">
                    <svg
                      className="w-6 h-6 text-yellow-600"
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
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">
                      Produk Bintang
                    </p>
                    <p className="text-sm text-gray-500">Rating tertinggi</p>
                  </div>
                </div>
              </div>
            </Link>

            <Link href="/dashboard/verif_sellers">
              <div className="bg-white rounded-xl shadow-md hover:shadow-xl p-6 transition-all hover:scale-105 cursor-pointer border-l-4 border-purple-500">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-purple-100 rounded-lg">
                    <svg
                      className="w-6 h-6 text-purple-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4m7 0a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Verifikasi</p>
                    <p className="text-sm text-gray-500">Kelola permohonan</p>
                  </div>
                </div>
              </div>
            </Link>
          </div>
        </div>

        {/* Footer Info */}
        <div className="bg-gradient-to-r from-blue-50 via-purple-50 to-pink-50 border border-blue-100 rounded-xl p-6">
          <div className="flex gap-4">
            <svg
              className="w-6 h-6 text-blue-600 mt-1 shrink-0"
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
              <p className="font-semibold text-gray-900">💡 Tips</p>
              <p className="text-sm text-gray-700 mt-1">
                Data dashboard ini diperbarui secara real-time. Gunakan
                fitur-fitur di sidebar untuk akses lebih detail ke setiap
                kategori data marketplace Anda.
              </p>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
