import apiClient from '@/lib/axios';

// Ambil daftar penjual yang statusnya 'pending'
export const getPendingSellers = async () => {
  const response = await apiClient.get('/admin/sellers/pending');
  return response.data;
};

// Kirim aksi verifikasi (terima/tolak)
export const verifySeller = async (id: number, status: 'accepted' | 'rejected', reason?: string) => {
  const response = await apiClient.post(`/admin/sellers/${id}/verify`, {
    verification_status: status,
    rejection_reason: reason,
  });
  return response.data;
};