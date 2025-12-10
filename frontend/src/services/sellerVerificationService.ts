import apiClient from '@/lib/apiClient';

export interface SellerBasicInfo {
  user_id: number;
  nama_toko: string;
  status: 'pending' | 'verified' | 'rejected';
  created_at: string;
  email: string;
  name: string;
}

export interface SellerDetailInfo extends SellerBasicInfo {
  deskripsi_singkat: string | null;
  nomor_telepon: string | null;
  kelurahan_id: number;
  RT: string | null;
  RW: string | null;
  detail_alamat: string | null;
  no_ktp: string;
  foto_penjual: string | null;
  foto_ktp: string;
  updated_at: string;
}

export interface SellersResponse {
  message: string;
  data: SellerBasicInfo[];
}

export interface SellerDetailResponse {
  message: string;
  data: SellerDetailInfo;
}

export interface ApproveResponse {
  message: string;
  data: {
    user_id: number;
    nama_toko: string;
    status: string;
    updated_at: string;
  };
}

export const sellerVerificationService = {
  /**
   * Get list of all sellers with optional status filter
   * @param status - Filter by status: 'pending', 'verified', 'rejected', or undefined for all
   */
  async getSellers(
    status?: 'pending' | 'verified' | 'rejected'
  ): Promise<SellersResponse> {
    const params = status ? { status } : {};
    const response = await apiClient.get('/api/admin/sellers', { params });
    return response.data;
  },

  /**
   * Get detailed information about a specific seller
   */
  async getSellerDetail(userId: number): Promise<SellerDetailResponse> {
    const response = await apiClient.get(`/api/admin/sellers/${userId}`);
    return response.data;
  },

  /**
   * Approve a seller (change status to verified)
   */
  async approveSeller(userId: number): Promise<ApproveResponse> {
    const response = await apiClient.post('/api/admin/sellers/approve', {
      user_id: userId,
    });
    return response.data;
  },

  /**
   * Reject a seller with optional reason
   */
  async rejectSeller(
    userId: number,
    reason?: string
  ): Promise<ApproveResponse> {
    const response = await apiClient.post('/api/admin/sellers/reject', {
      user_id: userId,
      reason: reason || null,
    });
    return response.data;
  },

  /**
   * Reset seller status to pending (for testing)
   */
  async resetSellerStatus(userId: number): Promise<ApproveResponse> {
    const response = await apiClient.post('/api/admin/sellers/reset-status', {
      user_id: userId,
    });
    return response.data;
  },

  /**
   * Update seller status to any state (pending/verified/rejected)
   */
  async updateSellerStatus(
    userId: number,
    newStatus: 'pending' | 'verified' | 'rejected',
    reason?: string
  ): Promise<ApproveResponse> {
    if (newStatus === 'verified') {
      return this.approveSeller(userId);
    } else if (newStatus === 'rejected') {
      return this.rejectSeller(userId, reason);
    } else {
      return this.resetSellerStatus(userId);
    }
  },
};
