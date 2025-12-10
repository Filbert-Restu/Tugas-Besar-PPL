import apiClient from '@/lib/apiClient';

export interface AdminDashboardStats {
  summary: {
    total_produk: number;
    total_kategori: number;
    total_toko: number;
    toko_aktif: number;
    toko_tidak_aktif: number;
    pending_verifikasi: number;
    total_review: number;
    average_rating: number;
  };
  produk_per_kategori: {
    kategori: string;
    jumlah_produk: number;
  }[];
  toko_per_provinsi: {
    provinsi: string;
    jumlah_toko: number;
  }[];
  user_status: {
    aktif: number;
    tidak_aktif: number;
  };
  rating_distribution: Record<number, number>;
  top_rated_products: {
    nama_produk: string;
    nama_toko: string;
    kategori: string;
    rating: number;
    jumlah_review: number;
  }[];
}

export interface AdminDashboardResponse {
  message: string;
  data: AdminDashboardStats;
}

export const adminDashboardService = {
  /**
   * Get admin dashboard statistics
   */
  async getStatistics(): Promise<AdminDashboardResponse> {
    const response = await apiClient.get('/api/admin/dashboard/statistics');
    return response.data;
  },
};
