// Types untuk Seller Verification

export interface ISeller {
  user_id: number;
  nama_toko: string;
  deskripsi_singkat?: string;
  nomor_telepon: string;
  kelurahan_id?: number;
  RT?: string;
  RW?: string;
  detail_alamat?: string;
  no_ktp: string;
  foto_penjual?: string;
  foto_ktp?: string;
  status: 'pending' | 'verified' | 'rejected';
  created_at: string;
  updated_at?: string;
  email: string;
  name: string;
}

export interface ISellerVerificationResponse {
  message: string;
  data: ISeller[];
}

export interface ISellerDetailResponse {
  message: string;
  data: ISeller;
}

export interface IApproveRejectRequest {
  user_id: number;
  reason?: string;
}

export interface IApproveRejectResponse {
  message: string;
  data: {
    user_id: number;
    nama_toko: string;
    status: string;
    reason?: string;
    updated_at: string;
  };
}
