import apiClient from '@/lib/apiClient';

export const adminReportService = {
  /**
   * Download Laporan Daftar Akun Penjual Aktif dan Tidak Aktif (PDF)
   * SRS-MartPlace-09
   */
  async downloadSellerReport(): Promise<Blob> {
    const response = await apiClient.get('/api/admin/reports/sellers', {
      responseType: 'blob',
    });
    return response.data;
  },

  /**
   * Download Laporan Daftar Penjual per Provinsi (PDF)
   * SRS-MartPlace-10
   */
  async downloadSellerByProvinceReport(): Promise<Blob> {
    const response = await apiClient.get(
      '/api/admin/reports/sellers-by-province',
      {
        responseType: 'blob',
      }
    );
    return response.data;
  },

  /**
   * Download Laporan Produk Berdasarkan Rating (PDF)
   * SRS-MartPlace-11
   */
  async downloadProductRatingReport(): Promise<Blob> {
    const response = await apiClient.get('/api/admin/reports/products-rating', {
      responseType: 'blob',
    });
    return response.data;
  },

  /**
   * Helper function to trigger browser download
   */
  triggerDownload(blob: Blob, filename: string) {
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  },
};
