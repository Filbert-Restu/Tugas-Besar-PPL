'use client';

import React from 'react';
import SellerDetailModal from '@/components/Admin/SellerDetailModal';
import SellerStatsCard from '@/components/Admin/SellerStatsCard';
import FilterButton from '@/components/Admin/FilterButton';
import LoadingSpinner from '@/components/LoadingSpinner';
import ErrorMessage from '@/components/ErrorMessage';
import EmptyState from '@/components/EmptyState';
import { useSellerManagement } from '@/hooks/Admin/useSellerManagement';

export default function SellerVerificationPage() {
  const {
    sellers,
    filteredSellers,
    loading,
    error,
    selectedSeller,
    showDetailModal,
    actionLoading,
    rejectReason,
    showRejectModal,
    showStatusModal,
    newStatus,
    activeFilter,
    setActiveFilter,
    setShowDetailModal,
    setRejectReason,
    setShowRejectModal,
    setShowStatusModal,
    setNewStatus,
    fetchSellers,
    getStatusBadge,
    getStatusLabel,
    getFilterCount,
    handleViewDetail,
    handleApprove,
    handleRejectClick,
    handleRejectConfirm,
    handleStatusChangeClick,
    handleStatusChangeConfirm,
    getImageUrl,
  } = useSellerManagement();

  if (loading) {
    return (
      <LoadingSpinner fullScreen size='xl' text='Memuat data penjual...' />
    );
  }

  if (error) {
    return <ErrorMessage fullScreen message={error} onRetry={fetchSellers} />;
  }

  return (
    <div className='container mx-auto px-4 py-8'>
      {/* Header */}
      <div className='mb-8'>
        <h1 className='text-3xl font-bold text-gray-900'>Manajemen Penjual</h1>
        <p className='text-gray-600 mt-2'>
          Kelola dan verifikasi semua penjual terdaftar
        </p>
      </div>

      {/* Stats Cards */}
      <div className='grid grid-cols-1 md:grid-cols-4 gap-4 mb-8'>
        <SellerStatsCard
          label='Total Penjual'
          value={sellers.length}
          variant='blue'
        />
        <SellerStatsCard
          label='Menunggu'
          value={getFilterCount('pending')}
          variant='yellow'
        />
        <SellerStatsCard
          label='Disetujui'
          value={getFilterCount('verified')}
          variant='green'
        />
        <SellerStatsCard
          label='Ditolak'
          value={getFilterCount('rejected')}
          variant='red'
        />
      </div>

      {/* Filter Buttons */}
      <div className='bg-white rounded-lg shadow-md p-4 mb-6'>
        <div className='flex flex-wrap gap-3'>
          <FilterButton
            filter='all'
            label='Semua'
            count={getFilterCount('all')}
            isActive={activeFilter === 'all'}
            onClick={() => setActiveFilter('all')}
            variant='blue'
          />
          <FilterButton
            filter='pending'
            label='Menunggu'
            count={getFilterCount('pending')}
            isActive={activeFilter === 'pending'}
            onClick={() => setActiveFilter('pending')}
            variant='yellow'
          />
          <FilterButton
            filter='verified'
            label='Disetujui'
            count={getFilterCount('verified')}
            isActive={activeFilter === 'verified'}
            onClick={() => setActiveFilter('verified')}
            variant='green'
          />
          <FilterButton
            filter='rejected'
            label='Ditolak'
            count={getFilterCount('rejected')}
            isActive={activeFilter === 'rejected'}
            onClick={() => setActiveFilter('rejected')}
            variant='red'
          />
        </div>
      </div>

      {/* Sellers Table */}
      {filteredSellers.length === 0 ? (
        <EmptyState
          title='Tidak Ada Data Penjual'
          message={
            activeFilter === 'all'
              ? 'Belum ada penjual terdaftar'
              : `Tidak ada penjual dengan status ${getStatusLabel(
                  activeFilter
                )}`
          }
        />
      ) : (
        <div className='bg-white rounded-lg shadow-md overflow-hidden'>
          <div className='overflow-x-auto'>
            <table className='min-w-full divide-y divide-gray-200'>
              <thead className='bg-gray-50'>
                <tr>
                  <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                    No
                  </th>
                  <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                    Nama Toko
                  </th>
                  <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                    Pemilik
                  </th>
                  <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                    Email
                  </th>
                  <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                    Status
                  </th>
                  <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                    Tanggal Daftar
                  </th>
                  <th className='px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider'>
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody className='bg-white divide-y divide-gray-200'>
                {filteredSellers.map((seller, index) => (
                  <tr
                    key={seller.user_id}
                    className='hover:bg-gray-50 transition-colors'
                  >
                    <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-900'>
                      {index + 1}
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap'>
                      <div className='text-sm font-semibold text-gray-900'>
                        {seller.nama_toko}
                      </div>
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap'>
                      <div className='text-sm text-gray-900'>{seller.name}</div>
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap'>
                      <div className='text-sm text-gray-500'>
                        {seller.email}
                      </div>
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap'>
                      <span
                        className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${getStatusBadge(
                          seller.status
                        )}`}
                      >
                        {getStatusLabel(seller.status)}
                      </span>
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                      {new Date(seller.created_at).toLocaleDateString('id-ID', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap text-center'>
                      <div className='flex gap-2 justify-center'>
                        <button
                          onClick={() => handleViewDetail(seller.user_id)}
                          disabled={actionLoading}
                          className='inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed'
                        >
                          <svg
                            className='w-4 h-4 mr-2'
                            fill='none'
                            stroke='currentColor'
                            viewBox='0 0 24 24'
                          >
                            <path
                              strokeLinecap='round'
                              strokeLinejoin='round'
                              strokeWidth={2}
                              d='M15 12a3 3 0 11-6 0 3 3 0 016 0z'
                            />
                            <path
                              strokeLinecap='round'
                              strokeLinejoin='round'
                              strokeWidth={2}
                              d='M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z'
                            />
                          </svg>
                          Detail
                        </button>
                        <button
                          onClick={() =>
                            handleStatusChangeClick(
                              seller.user_id,
                              seller.status
                            )
                          }
                          disabled={actionLoading}
                          className='inline-flex items-center px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white text-sm font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed'
                        >
                          <svg
                            className='w-4 h-4 mr-2'
                            fill='none'
                            stroke='currentColor'
                            viewBox='0 0 24 24'
                          >
                            <path
                              strokeLinecap='round'
                              strokeLinejoin='round'
                              strokeWidth={2}
                              d='M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15'
                            />
                          </svg>
                          Ubah Status
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Detail Modal */}
      {selectedSeller && (
        <SellerDetailModal
          seller={selectedSeller}
          isOpen={showDetailModal}
          onClose={() => setShowDetailModal(false)}
          onApprove={handleApprove}
          onReject={handleRejectClick}
          actionLoading={actionLoading}
          getStatusBadge={getStatusBadge}
          getStatusLabel={getStatusLabel}
          getImageUrl={getImageUrl}
        />
      )}

      {/* Reject Reason Modal */}
      {showRejectModal && (
        <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-[60]'>
          <div className='bg-white rounded-lg shadow-xl max-w-md w-full'>
            <div className='bg-red-600 text-white p-6 rounded-t-lg'>
              <h3 className='text-xl font-bold'>Alasan Penolakan</h3>
            </div>
            <div className='p-6'>
              <p className='text-gray-600 mb-4'>
                Berikan alasan penolakan untuk penjual ini (opsional):
              </p>
              <textarea
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                placeholder='Contoh: Dokumen KTP tidak jelas, informasi tidak lengkap, dll.'
                className='w-full border border-gray-300 rounded-lg p-3 h-32 resize-none focus:ring-2 focus:ring-red-500 focus:border-transparent'
                maxLength={500}
              />
              <p className='text-sm text-gray-500 mt-2'>
                {rejectReason.length}/500 karakter
              </p>
            </div>
            <div className='bg-gray-50 px-6 py-4 rounded-b-lg flex gap-3'>
              <button
                onClick={() => {
                  setShowRejectModal(false);
                  setRejectReason('');
                }}
                disabled={actionLoading}
                className='flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 px-4 rounded-lg transition-colors disabled:opacity-50'
              >
                Batal
              </button>
              <button
                onClick={handleRejectConfirm}
                disabled={actionLoading}
                className='flex-1 bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors disabled:opacity-50 flex items-center justify-center'
              >
                {actionLoading ? (
                  <div className='animate-spin rounded-full h-5 w-5 border-b-2 border-white'></div>
                ) : (
                  'Konfirmasi Tolak'
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Status Change Modal */}
      {showStatusModal && (
        <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-[60]'>
          <div className='bg-white rounded-lg shadow-xl max-w-md w-full'>
            <div className='bg-gray-700 text-white p-6 rounded-t-lg'>
              <h3 className='text-xl font-bold'>Ubah Status Verifikasi</h3>
            </div>
            <div className='p-6'>
              <p className='text-gray-600 mb-4'>
                Pilih status baru untuk seller:
              </p>
              <select
                value={newStatus}
                onChange={(e) =>
                  setNewStatus(
                    e.target.value as 'pending' | 'verified' | 'rejected'
                  )
                }
                className='w-full border border-gray-300 rounded-lg p-3 mb-4 focus:ring-2 focus:ring-gray-500 focus:border-transparent'
              >
                <option value='pending'>Menunggu</option>
                <option value='verified'>Disetujui</option>
                <option value='rejected'>Ditolak</option>
              </select>
              {newStatus === 'rejected' && (
                <>
                  <label className='block text-gray-700 text-sm font-medium mb-2'>
                    Alasan Penolakan (opsional):
                  </label>
                  <textarea
                    value={rejectReason}
                    onChange={(e) => setRejectReason(e.target.value)}
                    placeholder='Contoh: Dokumen KTP tidak jelas, informasi tidak lengkap, dll.'
                    className='w-full border border-gray-300 rounded-lg p-3 h-32 resize-none focus:ring-2 focus:ring-gray-500 focus:border-transparent'
                    maxLength={500}
                  />
                  <p className='text-sm text-gray-500 mt-2'>
                    {rejectReason.length}/500 karakter
                  </p>
                </>
              )}
            </div>
            <div className='bg-gray-50 px-6 py-4 rounded-b-lg flex gap-3'>
              <button
                onClick={() => {
                  setShowStatusModal(false);
                  setRejectReason('');
                }}
                disabled={actionLoading}
                className='flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 px-4 rounded-lg transition-colors disabled:opacity-50'
              >
                Batal
              </button>
              <button
                onClick={handleStatusChangeConfirm}
                disabled={actionLoading}
                className='flex-1 bg-gray-700 hover:bg-gray-800 text-white font-semibold py-2 px-4 rounded-lg transition-colors disabled:opacity-50 flex items-center justify-center'
              >
                {actionLoading ? (
                  <div className='animate-spin rounded-full h-5 w-5 border-b-2 border-white'></div>
                ) : (
                  'Konfirmasi Ubah'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
