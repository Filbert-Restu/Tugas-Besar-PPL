import React from 'react';
import { SellerDetailInfo } from '@/services/sellerVerificationService';

interface SellerDetailModalProps {
  seller: SellerDetailInfo;
  isOpen: boolean;
  onClose: () => void;
  onApprove: (userId: number, namaToko: string) => void;
  onReject: (userId: number) => void;
  actionLoading: boolean;
  getStatusBadge: (status: string) => string;
  getStatusLabel: (status: string) => string;
  getImageUrl: (path: string | null) => string | null;
}

export default function SellerDetailModal({
  seller,
  isOpen,
  onClose,
  onApprove,
  onReject,
  actionLoading,
  getStatusBadge,
  getStatusLabel,
  getImageUrl,
}: SellerDetailModalProps) {
  if (!isOpen) return null;

  return (
    <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 overflow-y-auto'>
      <div className='bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto'>
        {/* Modal Header */}
        <div className='sticky top-0 bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6 rounded-t-lg z-10'>
          <div className='flex items-center justify-between'>
            <div>
              <h2 className='text-2xl font-bold'>{seller.nama_toko}</h2>
              <p className='text-blue-100 mt-1'>{seller.name}</p>
            </div>
            <button
              onClick={onClose}
              className='text-white hover:bg-white hover:bg-opacity-20 rounded-full p-2 transition-colors'
            >
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
                  d='M6 18L18 6M6 6l12 12'
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Modal Content */}
        <div className='p-6 space-y-6'>
          {/* Personal Information */}
          <section>
            <h3 className='text-lg font-semibold text-gray-900 mb-4 flex items-center'>
              <svg
                className='w-5 h-5 mr-2 text-blue-600'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z'
                />
              </svg>
              Informasi Pemilik
            </h3>
            <div className='bg-gray-50 rounded-lg p-4 grid grid-cols-1 md:grid-cols-2 gap-4'>
              <div>
                <p className='text-sm text-gray-600'>Nama Lengkap</p>
                <p className='font-semibold text-gray-900'>{seller.name}</p>
              </div>
              <div>
                <p className='text-sm text-gray-600'>Email</p>
                <p className='font-semibold text-gray-900'>{seller.email}</p>
              </div>
              <div>
                <p className='text-sm text-gray-600'>Nomor Telepon</p>
                <p className='font-semibold text-gray-900'>
                  {seller.nomor_telepon || '-'}
                </p>
              </div>
              <div>
                <p className='text-sm text-gray-600'>No. KTP</p>
                <p className='font-semibold text-gray-900'>{seller.no_ktp}</p>
              </div>
            </div>
          </section>

          {/* Store Information */}
          <section>
            <h3 className='text-lg font-semibold text-gray-900 mb-4 flex items-center'>
              <svg
                className='w-5 h-5 mr-2 text-blue-600'
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
              Informasi Toko
            </h3>
            <div className='bg-gray-50 rounded-lg p-4 space-y-4'>
              <div>
                <p className='text-sm text-gray-600'>Nama Toko</p>
                <p className='font-semibold text-gray-900 text-lg'>
                  {seller.nama_toko}
                </p>
              </div>
              <div>
                <p className='text-sm text-gray-600'>Deskripsi Singkat</p>
                <p className='text-gray-900'>
                  {seller.deskripsi_singkat || 'Tidak ada deskripsi'}
                </p>
              </div>
            </div>
          </section>

          {/* Address Information */}
          <section>
            <h3 className='text-lg font-semibold text-gray-900 mb-4 flex items-center'>
              <svg
                className='w-5 h-5 mr-2 text-blue-600'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z'
                />
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M15 11a3 3 0 11-6 0 3 3 0 016 0z'
                />
              </svg>
              Alamat Lengkap
            </h3>
            <div className='bg-gray-50 rounded-lg p-4 space-y-3'>
              <div className='grid grid-cols-2 gap-4'>
                <div>
                  <p className='text-sm text-gray-600'>RT</p>
                  <p className='font-semibold text-gray-900'>
                    {seller.RT || '-'}
                  </p>
                </div>
                <div>
                  <p className='text-sm text-gray-600'>RW</p>
                  <p className='font-semibold text-gray-900'>
                    {seller.RW || '-'}
                  </p>
                </div>
              </div>
              <div>
                <p className='text-sm text-gray-600'>Detail Alamat</p>
                <p className='text-gray-900'>{seller.detail_alamat || '-'}</p>
              </div>
              <div>
                <p className='text-sm text-gray-600'>ID Kelurahan</p>
                <p className='font-semibold text-gray-900'>
                  {seller.kelurahan_id}
                </p>
              </div>
            </div>
          </section>

          {/* Photos */}
          <section>
            <h3 className='text-lg font-semibold text-gray-900 mb-4 flex items-center'>
              <svg
                className='w-5 h-5 mr-2 text-blue-600'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z'
                />
              </svg>
              Dokumen & Foto
            </h3>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
              {/* Foto Penjual */}
              <div>
                <p className='text-sm font-medium text-gray-700 mb-2'>
                  Foto Penjual
                </p>
                <div className='border-2 border-gray-200 rounded-lg overflow-hidden bg-gray-50'>
                  {seller.foto_penjual ? (
                    <img
                      src={getImageUrl(seller.foto_penjual) || ''}
                      alt='Foto Penjual'
                      className='w-full h-64 object-cover'
                    />
                  ) : (
                    <div className='w-full h-64 flex items-center justify-center'>
                      <p className='text-gray-400'>Tidak ada foto</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Foto KTP */}
              <div>
                <p className='text-sm font-medium text-gray-700 mb-2'>
                  Foto KTP
                </p>
                <div className='border-2 border-gray-200 rounded-lg overflow-hidden bg-gray-50'>
                  {seller.foto_ktp ? (
                    <img
                      src={getImageUrl(seller.foto_ktp) || ''}
                      alt='Foto KTP'
                      className='w-full h-64 object-cover'
                    />
                  ) : (
                    <div className='w-full h-64 flex items-center justify-center'>
                      <p className='text-gray-400'>Tidak ada foto KTP</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </section>

          {/* Registration Info */}
          <section className='bg-blue-50 rounded-lg p-4'>
            <div className='grid grid-cols-2 gap-4 text-sm'>
              <div>
                <p className='text-gray-600'>Tanggal Daftar</p>
                <p className='font-semibold text-gray-900'>
                  {new Date(seller.created_at).toLocaleString('id-ID')}
                </p>
              </div>
              <div>
                <p className='text-gray-600'>Status</p>
                <span
                  className={`inline-block text-xs font-semibold px-3 py-1 rounded-full ${getStatusBadge(
                    seller.status
                  )}`}
                >
                  {getStatusLabel(seller.status)}
                </span>
              </div>
            </div>
          </section>
        </div>

        {/* Modal Footer - Actions */}
        <div className='sticky bottom-0 bg-gray-50 border-t px-6 py-4 rounded-b-lg'>
          <div className='flex gap-3'>
            {seller.status === 'pending' && (
              <>
                <button
                  onClick={() => onApprove(seller.user_id, seller.nama_toko)}
                  disabled={actionLoading}
                  className='flex-1 bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center'
                >
                  {actionLoading ? (
                    <div className='animate-spin rounded-full h-5 w-5 border-b-2 border-white'></div>
                  ) : (
                    <>
                      <svg
                        className='w-5 h-5 mr-2'
                        fill='none'
                        stroke='currentColor'
                        viewBox='0 0 24 24'
                      >
                        <path
                          strokeLinecap='round'
                          strokeLinejoin='round'
                          strokeWidth={2}
                          d='M5 13l4 4L19 7'
                        />
                      </svg>
                      Setujui Penjual
                    </>
                  )}
                </button>
                <button
                  onClick={() => onReject(seller.user_id)}
                  disabled={actionLoading}
                  className='flex-1 bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center'
                >
                  <svg
                    className='w-5 h-5 mr-2'
                    fill='none'
                    stroke='currentColor'
                    viewBox='0 0 24 24'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={2}
                      d='M6 18L18 6M6 6l12 12'
                    />
                  </svg>
                  Tolak Penjual
                </button>
              </>
            )}
            {seller.status !== 'pending' && (
              <div className='flex-1 text-center py-3'>
                <p className='text-gray-600'>
                  Status penjual:{' '}
                  <span
                    className={`font-semibold ${
                      seller.status === 'verified'
                        ? 'text-green-600'
                        : 'text-red-600'
                    }`}
                  >
                    {getStatusLabel(seller.status)}
                  </span>
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
