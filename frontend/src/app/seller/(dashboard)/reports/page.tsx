'use client';

import React from 'react';
import apiClient from '@/lib/apiClient';
import { reports } from '@/constants/reports';
import ReportCard from '@/components/Seller/ReportCard';

export default function SellerReportsPage() {
  const handleDownloadReport = async (reportType: string) => {
    try {
      const response = await apiClient.get(
        `/api/seller/reports/${reportType}`,
        {
          headers: {
            Accept: 'application/pdf',
          },
          responseType: 'blob',
        }
      );

      // Get filename from Content-Disposition header or use default
      const contentDisposition = response.headers['content-disposition'];
      const timestamp = new Date().getTime();
      let filename = `laporan-${reportType}-${timestamp}.pdf`;

      if (contentDisposition) {
        const filenameMatch = contentDisposition.match(/filename="?(.+)"?/i);
        if (filenameMatch) {
          filename = filenameMatch[1];
        }
      }

      // Create blob and download
      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading report:', error);
      alert('Gagal mengunduh laporan. Silakan coba lagi.');
    }
  };

  return (
    <div className='space-y-6'>
      {/* Header */}
      <div className='bg-white rounded-lg shadow p-6'>
        <h1 className='text-2xl font-bold text-gray-900 mb-2'>
          Laporan Produk
        </h1>
        <p className='text-gray-600'>
          Download laporan produk Anda dalam format PDF
        </p>
      </div>

      {/* Reports Grid */}
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
        {reports.map((report) => (
          <ReportCard
            key={report.id}
            id={report.id}
            title={report.title}
            description={report.description}
            icon={report.icon}
            color={report.color}
            onDownload={handleDownloadReport}
          />
        ))}
      </div>

      {/* Info Box */}
      <div className='bg-blue-50 border border-blue-200 rounded-lg p-6'>
        <div className='flex items-start gap-3'>
          <svg
            className='w-6 h-6 text-blue-600 mt-0.5'
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
          <div>
            <h4 className='font-semibold text-blue-900 mb-1'>
              Informasi Laporan
            </h4>
            <ul className='text-sm text-blue-800 space-y-1'>
              <li>• Laporan dihasilkan dalam format PDF</li>
              <li>• Data laporan diambil secara real-time dari database</li>
              <li>• Semua laporan mencantumkan tanggal dan waktu generate</li>
              <li>
                • Laporan stock menipis menampilkan produk dengan stock {'<'} 2
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
