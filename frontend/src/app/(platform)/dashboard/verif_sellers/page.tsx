'use client';

import React, { useState, useEffect } from 'react';
import { ISeller } from '@/types/verification';
import apiClient from '@/lib/apiClient';
import { Button } from '@/components/Button';
import Link from 'next/link';
import { AxiosError } from 'axios';

export default function VerifikasiSellerPage() {
  const [sellers, setSellers] = useState<ISeller[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [selectedSeller, setSelectedSeller] = useState<ISeller | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [actionType, setActionType] = useState<'approve' | 'reject' | null>(null);
  const [rejectReason, setRejectReason] = useState('');
  const [processing, setProcessing] = useState(false);
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'verified' | 'rejected'>('pending');

  // Fetch sellers list
  useEffect(() => {
    fetchSellers();
  }, []);

  const fetchSellers = async () => {
    try {
      setLoading(true);
      setError('');
      
      console.log('Fetching sellers from: /api/admin/sellers');
      const response = await apiClient.get('/api/admin/sellers');
      console.log('Response:', response.data);
      console.log('Response status:', response.status);
      console.log('Response message:', response.data.message);
      console.log('Response data:', response.data.data);
      
      // Check if response has unexpected message
      if (response.data.message && response.data.message.includes('Produk tidak ditemukan')) {
        throw new Error('Backend controller error: Mengembalikan pesan yang salah. Periksa SellerVerificationController.php');
      }
      
      setSellers(response.data.data || []);
      
      // Log success
      if (response.data.data && response.data.data.length > 0) {
        console.log(`✅ Loaded ${response.data.data.length} sellers`);
      }
    } catch (err) {
      const error = err as AxiosError<{ message: string }>;
      console.error('Full error:', err);
      console.error('Error response:', error.response);
      console.error('Error status:', error.response?.status);
      console.error('Error data:', error.response?.data);
      
      if (error.response?.status === 404) {
        setError('Endpoint /api/admin/sellers tidak ditemukan. Pastikan backend Laravel berjalan di http://localhost:8000');
      } else if (error.response?.status === 401) {
        setError('Tidak terautentikasi. Silakan login sebagai admin terlebih dahulu.');
      } else if (error.response?.status === 403) {
        setError('Akses ditolak. Anda tidak memiliki izin sebagai admin.');
      } else if (error.response?.status === 200 && error.response?.data?.message === 'Produk tidak ditemukan') {
        // Backend bug: returning wrong message
        setError('Backend error: Controller mengembalikan pesan yang salah ("Produk tidak ditemukan" seharusnya "Penjual tidak ditemukan"). Silakan perbaiki SellerVerificationController.php di backend.');
      } else {
        const errorMsg = error.response?.data?.message || error.message || 'Gagal memuat data penjual';
        setError(`Error: ${errorMsg} (Status: ${error.response?.status || 'unknown'})`);
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchSellerDetail = async (userId: number) => {
    try {
      const response = await apiClient.get(`/api/admin/sellers/${userId}`);
      return response.data.data;
    } catch (err) {
      console.error('Error fetching seller detail:', err);
      return null;
    }
  };

  const handleViewDetail = async (seller: ISeller) => {
    const detail = await fetchSellerDetail(seller.user_id);
    if (detail) {
      setSelectedSeller(detail);
      setShowModal(true);
    }
  };

  const handleApprove = async () => {
    if (!selectedSeller) return;

    try {
      setProcessing(true);
      await apiClient.post('/api/admin/sellers/approve', {
        user_id: selectedSeller.user_id,
      });

      alert('Penjual berhasil diverifikasi! Email notifikasi telah dikirim.');
      setShowModal(false);
      setSelectedSeller(null);
      
      // Refresh data dari backend untuk mendapatkan status terbaru
      await fetchSellers();
    } catch (err) {
      const error = err as AxiosError<{ message: string }>;
      alert(error.response?.data?.message || 'Gagal memverifikasi penjual');
    } finally {
      setProcessing(false);
    }
  };

  const handleReject = async () => {
    if (!selectedSeller) return;

    try {
      setProcessing(true);
      await apiClient.post('/api/admin/sellers/reject', {
        user_id: selectedSeller.user_id,
        reason: rejectReason,
      });

      alert('Penjual berhasil ditolak! Email notifikasi telah dikirim.');
      setShowModal(false);
      setSelectedSeller(null);
      setRejectReason('');
      
      // Refresh data dari backend untuk mendapatkan status terbaru
      await fetchSellers();
    } catch (err) {
      const error = err as AxiosError<{ message: string }>;
      alert(error.response?.data?.message || 'Gagal menolak penjual');
    } finally {
      setProcessing(false);
    }
  };

  const handleAction = (type: 'approve' | 'reject') => {
    setActionType(type);
    if (type === 'approve') {
      handleApprove();
    }
  };

  const confirmReject = () => {
    if (!rejectReason.trim()) {
      alert('Mohon masukkan alasan penolakan');
      return;
    }
    handleReject();
  };

  const filteredSellers = sellers.filter((seller) => {
    if (filterStatus === 'all') return true;
    return seller.status === filterStatus;
  });

  const getStatusBadge = (status: string) => {
    const badges = {
      pending: 'bg-yellow-100 text-yellow-800 border-yellow-300',
      verified: 'bg-green-100 text-green-800 border-green-300',
      rejected: 'bg-red-100 text-red-800 border-red-300',
    };
    const labels = {
      pending: 'Menunggu',
      verified: 'Terverifikasi',
      rejected: 'Ditolak',
    };
    return (
      <span
        className={`px-3 py-1 rounded-full text-xs font-semibold border ${
          badges[status as keyof typeof badges]
        }`}
      >
        {labels[status as keyof typeof labels]}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Memuat data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Verifikasi Penjual
              </h1>
              <p className="text-gray-600 mt-2">
                Kelola dan verifikasi pendaftaran penjual baru
              </p>
            </div>
            <Link href="/dashboard">
              <Button variant="secondary">Kembali ke Dashboard</Button>
            </Link>
          </div>

          {/* Filter Tabs */}
          <div className="flex gap-2 mt-6 border-b">
            {[
              { key: 'all', label: 'Semua', count: sellers.length },
              {
                key: 'pending',
                label: 'Menunggu',
                count: sellers.filter((s) => s.status === 'pending').length,
              },
              {
                key: 'verified',
                label: 'Terverifikasi',
                count: sellers.filter((s) => s.status === 'verified').length,
              },
              {
                key: 'rejected',
                label: 'Ditolak',
                count: sellers.filter((s) => s.status === 'rejected').length,
              },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() =>
                  setFilterStatus(
                    tab.key as 'all' | 'pending' | 'verified' | 'rejected'
                  )
                }
                className={`px-4 py-2 font-medium transition-colors ${
                  filterStatus === tab.key
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {tab.label} ({tab.count})
              </button>
            ))}
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            <div className="font-semibold mb-2">Error:</div>
            {error}
            <div className="mt-3 text-sm">
              <p className="font-semibold">Troubleshooting:</p>
              <ul className="list-disc list-inside mt-1 space-y-1">
                <li>Pastikan Laravel backend berjalan: <code className="bg-red-100 px-1 rounded">php artisan serve</code></li>
                <li>Pastikan Anda sudah login sebagai admin</li>
                <li>Check browser console untuk detail error</li>
                <li>Verifikasi route di backend: <code className="bg-red-100 px-1 rounded">php artisan route:list | grep sellers</code></li>
              </ul>
            </div>
          </div>
        )}

        {/* Sellers Table */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          {filteredSellers.length === 0 ? (
            <div className="text-center py-12">
              <svg
                className="mx-auto h-12 w-12 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                />
              </svg>
              <p className="mt-4 text-gray-600 font-medium">
                Tidak ada penjual dengan status &quot;{filterStatus === 'all' ? 'semua' : filterStatus}&quot;
              </p>
              {/* {sellers.length === 0 && !error && (
                <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-4 max-w-lg mx-auto text-left">
                  <p className="text-sm text-blue-900 font-semibold mb-2">💡 Tips:</p>
                  <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
                    <li>Backend hanya menampilkan seller dengan status <code className="bg-blue-100 px-1 rounded">pending</code></li>
                    <li>Seeder membuat seller dengan status <code className="bg-blue-100 px-1 rounded">verified</code></li>
                    <li>Ubah seeder atau update query di <code className="bg-blue-100 px-1 rounded">SellerVerificationController.php</code></li>
                    <li>Atau create seller baru dengan status pending via register form</li>
                  </ul>
                </div>
              )} */}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Nama Toko
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Pemilik
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Telepon
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tanggal Daftar
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Aksi
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredSellers.map((seller) => (
                    <tr
                      key={seller.user_id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {seller.nama_toko}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {seller.name}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-600">
                          {seller.email}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-600">
                          {seller.nomor_telepon}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getStatusBadge(seller.status)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {new Date(seller.created_at).toLocaleDateString(
                          'id-ID',
                          {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                          }
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => handleViewDetail(seller)}
                          className="text-blue-600 hover:text-blue-900 font-medium"
                        >
                          Lihat Detail
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Modal Detail */}
      {showModal && selectedSeller && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">
                Detail Penjual
              </h2>
              <button
                onClick={() => {
                  setShowModal(false);
                  setSelectedSeller(null);
                  setActionType(null);
                  setRejectReason('');
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            {/* Modal Body */}
            <div className="px-6 py-6">
              {/* Status Badge */}
              <div className="mb-6">
                {getStatusBadge(selectedSeller.status)}
              </div>

              {/* Information Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">
                    Nama Toko
                  </h3>
                  <p className="text-base text-gray-900 font-semibold">
                    {selectedSeller.nama_toko}
                  </p>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">
                    Nama Pemilik
                  </h3>
                  <p className="text-base text-gray-900">
                    {selectedSeller.name}
                  </p>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">
                    Email
                  </h3>
                  <p className="text-base text-gray-900">
                    {selectedSeller.email}
                  </p>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">
                    Nomor Telepon
                  </h3>
                  <p className="text-base text-gray-900">
                    {selectedSeller.nomor_telepon}
                  </p>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">
                    Nomor KTP
                  </h3>
                  <p className="text-base text-gray-900">
                    {selectedSeller.no_ktp}
                  </p>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">
                    Tanggal Pendaftaran
                  </h3>
                  <p className="text-base text-gray-900">
                    {new Date(selectedSeller.created_at).toLocaleDateString(
                      'id-ID',
                      {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      }
                    )}
                  </p>
                </div>
              </div>

              {/* Description */}
              {selectedSeller.deskripsi_singkat && (
                <div className="mb-6">
                  <h3 className="text-sm font-medium text-gray-500 mb-2">
                    Deskripsi Toko
                  </h3>
                  <p className="text-base text-gray-900 bg-gray-50 p-4 rounded-lg">
                    {selectedSeller.deskripsi_singkat}
                  </p>
                </div>
              )}

              {/* Address */}
              {selectedSeller.detail_alamat && (
                <div className="mb-6">
                  <h3 className="text-sm font-medium text-gray-500 mb-2">
                    Alamat Lengkap
                  </h3>
                  <p className="text-base text-gray-900 bg-gray-50 p-4 rounded-lg">
                    {selectedSeller.detail_alamat}
                    {selectedSeller.RT && selectedSeller.RW && (
                      <span className="block mt-1 text-gray-600">
                        RT {selectedSeller.RT} / RW {selectedSeller.RW}
                      </span>
                    )}
                  </p>
                </div>
              )}

              {/* Images */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                {selectedSeller.foto_penjual && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-2">
                      Foto Penjual
                    </h3>
                    <div className="relative w-full h-64">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/storage/${selectedSeller.foto_penjual}`}
                        alt="Foto Penjual"
                        className="w-full h-full object-cover rounded-lg border border-gray-200"
                      />
                    </div>
                  </div>
                )}

                {selectedSeller.foto_ktp && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-2">
                      Foto KTP
                    </h3>
                    <div className="relative w-full h-64">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/storage/${selectedSeller.foto_ktp}`}
                        alt="Foto KTP"
                        className="w-full h-full object-cover rounded-lg border border-gray-200"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Reject Reason Input */}
              {actionType === 'reject' && (
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Alasan Penolakan <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    value={rejectReason}
                    onChange={(e) => setRejectReason(e.target.value)}
                    placeholder="Masukkan alasan penolakan yang akan dikirim ke penjual..."
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    rows={4}
                    required
                  />
                </div>
              )}
            </div>

            {/* Modal Footer - Action Buttons */}
            {selectedSeller.status === 'pending' && (
              <div className="sticky bottom-0 bg-gray-50 border-t px-6 py-4">
                {actionType === null ? (
                  <div className="flex gap-3 justify-end">
                    <Button
                      onClick={() => setActionType('reject')}
                      variant="secondary"
                      className="bg-red-600 text-white hover:bg-red-700"
                    >
                      Tolak Pendaftaran
                    </Button>
                    <Button
                      onClick={() => handleAction('approve')}
                      disabled={processing}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      {processing ? 'Memproses...' : 'Setujui Pendaftaran'}
                    </Button>
                  </div>
                ) : actionType === 'reject' ? (
                  <div className="flex gap-3 justify-end">
                    <Button
                      onClick={() => {
                        setActionType(null);
                        setRejectReason('');
                      }}
                      variant="secondary"
                    >
                      Batal
                    </Button>
                    <Button
                      onClick={confirmReject}
                      disabled={processing || !rejectReason.trim()}
                      className="bg-red-600 hover:bg-red-700"
                    >
                      {processing ? 'Memproses...' : 'Konfirmasi Penolakan'}
                    </Button>
                  </div>
                ) : null}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
