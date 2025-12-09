'use client';

import React, { useState, useEffect } from 'react';
import { ISeller } from '@/types/verification';
import apiClient from '@/lib/apiClient';
import { Button } from '@/components/Button';
import Link from 'next/link';
import { AxiosError } from 'axios';

interface ISellerWithActiveStatus extends ISeller {
  is_active: boolean;
}

export default function ActiveSellerPage() {
  const [sellers, setSellers] = useState<ISellerWithActiveStatus[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [selectedSeller, setSelectedSeller] = useState<ISellerWithActiveStatus | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [actionType, setActionType] = useState<'suspend' | 'activate' | null>(null);
  const [suspendReason, setSuspendReason] = useState('');
  const [processing, setProcessing] = useState(false);
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'suspended'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [generatingPDF, setGeneratingPDF] = useState(false);

  useEffect(() => {
    fetchSellers();
  }, []);

  const fetchSellers = async () => {
    try {
      setLoading(true);
      setError('');
      
      // Fetch all verified sellers
      const response = await apiClient.get('/api/admin/sellers');
      
      // Filter only verified sellers and map to include is_active status
      const verifiedSellers = response.data.data
        .filter((s: ISeller) => s.status === 'verified')
        .map((s: ISeller) => ({
          ...s,
          is_active: true, // TODO: Backend should provide this field
        }));
      
      setSellers(verifiedSellers);
    } catch (err) {
      const error = err as AxiosError<{ message: string }>;
      console.error('Error fetching sellers:', err);
      setError(error.response?.data?.message || 'Gagal memuat data penjual');
    } finally {
      setLoading(false);
    }
  };

  const handleSuspend = async () => {
    if (!selectedSeller) return;

    try {
      setProcessing(true);
      await apiClient.post('/api/admin/sellers/suspend', {
        user_id: selectedSeller.user_id,
        reason: suspendReason,
      });

      alert('Penjual berhasil disuspend! Penjual akan otomatis logout jika sedang online.');
      
      // Update local state
      setSellers(prev => prev.map(s => 
        s.user_id === selectedSeller.user_id 
          ? { ...s, is_active: false }
          : s
      ));
      
      setShowModal(false);
      setSelectedSeller(null);
      setSuspendReason('');
      setActionType(null);
    } catch (err) {
      const error = err as AxiosError<{ message: string }>;
      alert(error.response?.data?.message || 'Gagal suspend penjual');
    } finally {
      setProcessing(false);
    }
  };

  const handleActivate = async () => {
    if (!selectedSeller) return;

    try {
      setProcessing(true);
      await apiClient.post('/api/admin/sellers/activate', {
        user_id: selectedSeller.user_id,
      });

      alert('Penjual berhasil diaktifkan kembali!');
      
      // Update local state
      setSellers(prev => prev.map(s => 
        s.user_id === selectedSeller.user_id 
          ? { ...s, is_active: true }
          : s
      ));
      
      setShowModal(false);
      setSelectedSeller(null);
      setActionType(null);
    } catch (err) {
      const error = err as AxiosError<{ message: string }>;
      alert(error.response?.data?.message || 'Gagal mengaktifkan penjual');
    } finally {
      setProcessing(false);
    }
  };

  const handleExportPDF = async () => {
    try {
      setGeneratingPDF(true);
      
      const response = await apiClient.get('/api/admin/sellers/export-pdf', {
        responseType: 'blob',
      });

      // Create blob link to download
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `laporan-penjual-${new Date().toISOString().split('T')[0]}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();

      alert('PDF berhasil diunduh!');
    } catch (err) {
      const error = err as AxiosError<{ message: string }>;
      console.error('Error exporting PDF:', err);
      alert(error.response?.data?.message || 'Gagal generate PDF');
    } finally {
      setGeneratingPDF(false);
    }
  };

  const confirmAction = () => {
    if (actionType === 'suspend') {
      if (!suspendReason.trim()) {
        alert('Mohon masukkan alasan suspend');
        return;
      }
      handleSuspend();
    } else if (actionType === 'activate') {
      handleActivate();
    }
  };

  const filteredSellers = sellers
    .filter((seller) => {
      if (filterStatus === 'active') return seller.is_active;
      if (filterStatus === 'suspended') return !seller.is_active;
      return true;
    })
    .filter((seller) => {
      if (!searchQuery) return true;
      const query = searchQuery.toLowerCase();
      return (
        seller.nama_toko.toLowerCase().includes(query) ||
        seller.name.toLowerCase().includes(query) ||
        seller.email.toLowerCase().includes(query)
      );
    });

  const getStatusBadge = (isActive: boolean) => {
    return isActive ? (
      <span className="px-3 py-1 rounded-full text-xs font-semibold border bg-green-100 text-green-800 border-green-300">
        Aktif
      </span>
    ) : (
      <span className="px-3 py-1 rounded-full text-xs font-semibold border bg-red-100 text-red-800 border-red-300">
        Suspended
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
          <div className="flex justify-between items-center mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Laporan Akun Penjual
              </h1>
              <p className="text-gray-600 mt-2">
                Kelola status aktif/suspended penjual dan ekspor laporan
              </p>
            </div>
            <div className="flex gap-3">
              <Button
                onClick={handleExportPDF}
                disabled={generatingPDF || sellers.length === 0}
                variant="secondary"
                className="bg-red-600 text-white hover:bg-red-700"
              >
                {generatingPDF ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Generating...
                  </>
                ) : (
                  <>
                    📄 Ekspor PDF
                  </>
                )}
              </Button>
              <Link href="/dashboard">
                <Button variant="secondary">Kembali</Button>
              </Link>
            </div>
          </div>

          {/* Search Bar */}
          <div className="mb-4">
            <input
              type="text"
              placeholder="Cari nama toko, pemilik, atau email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Filter Tabs */}
          <div className="flex gap-2 border-b">
            {[
              { key: 'all', label: 'Semua', count: sellers.length },
              {
                key: 'active',
                label: 'Aktif',
                count: sellers.filter((s) => s.is_active).length,
              },
              {
                key: 'suspended',
                label: 'Suspended',
                count: sellers.filter((s) => !s.is_active).length,
              },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() =>
                  setFilterStatus(tab.key as 'all' | 'active' | 'suspended')
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
            {error}
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium">Total Penjual</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">
                  {sellers.length}
                </p>
              </div>
              <div className="bg-blue-100 p-3 rounded-full">
                <svg className="w-8 h-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium">Penjual Aktif</p>
                <p className="text-3xl font-bold text-green-600 mt-1">
                  {sellers.filter((s) => s.is_active).length}
                </p>
              </div>
              <div className="bg-green-100 p-3 rounded-full">
                <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium">Penjual Suspended</p>
                <p className="text-3xl font-bold text-red-600 mt-1">
                  {sellers.filter((s) => !s.is_active).length}
                </p>
              </div>
              <div className="bg-red-100 p-3 rounded-full">
                <svg className="w-8 h-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                </svg>
              </div>
            </div>
          </div>
        </div>

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
                {searchQuery 
                  ? `Tidak ada penjual yang cocok dengan "${searchQuery}"`
                  : 'Tidak ada penjual yang terverifikasi'
                }
              </p>
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
                      Tanggal Verifikasi
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
                        {getStatusBadge(seller.is_active)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {new Date(seller.updated_at || seller.created_at).toLocaleDateString(
                          'id-ID',
                          {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                          }
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => {
                            setSelectedSeller(seller);
                            setShowModal(true);
                          }}
                          className="text-blue-600 hover:text-blue-900 font-medium"
                        >
                          Kelola
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Results Count */}
        {filteredSellers.length > 0 && (
          <div className="mt-4 text-sm text-gray-600 text-center">
            Menampilkan {filteredSellers.length} dari {sellers.length} penjual
          </div>
        )}
      </div>

      {/* Modal for Suspend/Activate */}
      {showModal && selectedSeller && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">
                Kelola Status Penjual
              </h2>
              <button
                onClick={() => {
                  setShowModal(false);
                  setSelectedSeller(null);
                  setActionType(null);
                  setSuspendReason('');
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
              {/* Seller Info */}
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Nama Toko</p>
                    <p className="font-semibold text-gray-900">{selectedSeller.nama_toko}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Pemilik</p>
                    <p className="font-semibold text-gray-900">{selectedSeller.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="text-gray-900">{selectedSeller.email}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Status Saat Ini</p>
                    <div className="mt-1">{getStatusBadge(selectedSeller.is_active)}</div>
                  </div>
                </div>
              </div>

              {/* Action Selection */}
              {actionType === null ? (
                <div className="space-y-4">
                  <p className="text-gray-700 font-medium">Pilih tindakan:</p>
                  
                  {selectedSeller.is_active ? (
                    <button
                      onClick={() => setActionType('suspend')}
                      className="w-full p-4 border-2 border-red-200 rounded-lg hover:border-red-400 hover:bg-red-50 transition-colors text-left"
                    >
                      <div className="flex items-start">
                        <div className="flex-shrink-0">
                          <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                          </svg>
                        </div>
                        <div className="ml-3">
                          <p className="text-lg font-semibold text-red-900">Suspend Akun</p>
                          <p className="text-sm text-red-700 mt-1">
                            Penjual tidak bisa login dan akan otomatis logout jika sedang online. 
                            Produk tidak akan ditampilkan di marketplace.
                          </p>
                        </div>
                      </div>
                    </button>
                  ) : (
                    <button
                      onClick={() => setActionType('activate')}
                      className="w-full p-4 border-2 border-green-200 rounded-lg hover:border-green-400 hover:bg-green-50 transition-colors text-left"
                    >
                      <div className="flex items-start">
                        <div className="flex-shrink-0">
                          <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </div>
                        <div className="ml-3">
                          <p className="text-lg font-semibold text-green-900">Aktifkan Kembali</p>
                          <p className="text-sm text-green-700 mt-1">
                            Penjual dapat login kembali dan berjualan di marketplace.
                          </p>
                        </div>
                      </div>
                    </button>
                  )}
                </div>
              ) : actionType === 'suspend' ? (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Alasan Suspend <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    value={suspendReason}
                    onChange={(e) => setSuspendReason(e.target.value)}
                    placeholder="Masukkan alasan suspend (akan dikirim ke penjual via email)..."
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    rows={4}
                    required
                  />
                  <p className="mt-2 text-sm text-gray-500">
                    ⚠️ Penjual akan menerima email notifikasi tentang suspend ini.
                  </p>
                </div>
              ) : (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <p className="text-green-900 font-medium">
                    ✓ Apakah Anda yakin ingin mengaktifkan kembali akun ini?
                  </p>
                  <p className="text-sm text-green-700 mt-2">
                    Penjual akan dapat login dan berjualan kembali di marketplace.
                  </p>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="sticky bottom-0 bg-gray-50 border-t px-6 py-4">
              <div className="flex gap-3 justify-end">
                <Button
                  onClick={() => {
                    setActionType(null);
                    setSuspendReason('');
                  }}
                  variant="secondary"
                >
                  Batal
                </Button>
                {actionType && (
                  <Button
                    onClick={confirmAction}
                    disabled={processing || (actionType === 'suspend' && !suspendReason.trim())}
                    className={actionType === 'suspend' ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'}
                  >
                    {processing ? 'Memproses...' : actionType === 'suspend' ? 'Konfirmasi Suspend' : 'Konfirmasi Aktivasi'}
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
