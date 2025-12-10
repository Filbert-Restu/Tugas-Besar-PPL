'use client';

import React, { useState } from 'react';
import { adminReportService } from '@/services/adminReportService';

interface ReportButtonProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  color: 'blue' | 'green' | 'orange';
  onDownload: () => Promise<void>;
}

function ReportButton({
  title,
  description,
  icon,
  color,
  onDownload,
}: ReportButtonProps) {
  const [loading, setLoading] = useState(false);

  const colorClasses = {
    blue: 'bg-blue-50 hover:bg-blue-100 border-blue-200 text-blue-700',
    green: 'bg-green-50 hover:bg-green-100 border-green-200 text-green-700',
    orange:
      'bg-orange-50 hover:bg-orange-100 border-orange-200 text-orange-700',
  };

  const iconColorClasses = {
    blue: 'text-blue-600',
    green: 'text-green-600',
    orange: 'text-orange-600',
  };

  const handleClick = async () => {
    setLoading(true);
    try {
      await onDownload();
    } catch (error) {
      console.error('Error downloading report:', error);
      alert('Gagal mengunduh laporan. Silakan coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      className={`w-full p-6 border-2 rounded-lg transition-all ${
        colorClasses[color]
      } ${loading ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-md'}`}
    >
      <div className='flex items-start gap-4'>
        <div className={`flex-shrink-0 ${iconColorClasses[color]}`}>
          {loading ? (
            <svg
              className='animate-spin h-8 w-8'
              fill='none'
              viewBox='0 0 24 24'
            >
              <circle
                className='opacity-25'
                cx='12'
                cy='12'
                r='10'
                stroke='currentColor'
                strokeWidth='4'
              ></circle>
              <path
                className='opacity-75'
                fill='currentColor'
                d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
              ></path>
            </svg>
          ) : (
            icon
          )}
        </div>
        <div className='flex-1 text-left'>
          <h3 className='font-semibold text-lg mb-1'>{title}</h3>
          <p className='text-sm opacity-80'>{description}</p>
        </div>
        <div className='flex-shrink-0'>
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
              d='M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z'
            />
          </svg>
        </div>
      </div>
    </button>
  );
}

export default function ReportSection() {
  const handleDownloadSellerReport = async () => {
    const blob = await adminReportService.downloadSellerReport();
    adminReportService.triggerDownload(
      blob,
      `laporan-penjual-${Date.now()}.pdf`
    );
  };

  const handleDownloadSellerByProvinceReport = async () => {
    const blob = await adminReportService.downloadSellerByProvinceReport();
    adminReportService.triggerDownload(
      blob,
      `laporan-penjual-per-provinsi-${Date.now()}.pdf`
    );
  };

  const handleDownloadProductRatingReport = async () => {
    const blob = await adminReportService.downloadProductRatingReport();
    adminReportService.triggerDownload(
      blob,
      `laporan-produk-rating-${Date.now()}.pdf`
    );
  };

  return (
    <div className='bg-white rounded-lg shadow-md p-6'>
      <div className='mb-6'>
        <h2 className='text-2xl font-bold text-gray-900 mb-2'>Laporan PDF</h2>
        <p className='text-gray-600'>
          Download laporan platform dalam format PDF untuk analisis dan
          dokumentasi
        </p>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
        <ReportButton
          title='Laporan Penjual'
          description='Daftar akun penjual aktif dan tidak aktif (SRS-09)'
          color='blue'
          onDownload={handleDownloadSellerReport}
          icon={
            <svg
              className='w-8 h-8'
              fill='none'
              stroke='currentColor'
              viewBox='0 0 24 24'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z'
              />
            </svg>
          }
        />

        <ReportButton
          title='Penjual per Provinsi'
          description='Daftar penjual berdasarkan lokasi provinsi (SRS-10)'
          color='green'
          onDownload={handleDownloadSellerByProvinceReport}
          icon={
            <svg
              className='w-8 h-8'
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
          }
        />

        <ReportButton
          title='Produk & Rating'
          description='Daftar produk diurutkan berdasarkan rating (SRS-11)'
          color='orange'
          onDownload={handleDownloadProductRatingReport}
          icon={
            <svg className='w-8 h-8' fill='currentColor' viewBox='0 0 20 20'>
              <path d='M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z' />
            </svg>
          }
        />
      </div>

      <div className='mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200'>
        <div className='flex items-start gap-3'>
          <svg
            className='w-5 h-5 text-gray-600 flex-shrink-0 mt-0.5'
            fill='none'
            stroke='currentColor'
            viewBox='0 0 24 24'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth={2}
              d='M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
            />
          </svg>
          <div className='text-sm text-gray-600'>
            <strong>Informasi:</strong> Semua laporan akan diunduh dalam format
            PDF. Pastikan Anda memiliki PDF reader untuk membuka file. Laporan
            berisi data real-time dari database.
          </div>
        </div>
      </div>
    </div>
  );
}
