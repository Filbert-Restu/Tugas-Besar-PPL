import apiClient from '@/lib/apiClient';
import { IPublicProduct } from '@/types/product';

export interface ProductDetailResponse {
  id: number;
  nama_produk: string;
  deskripsi_produk: string;
  harga_produk: number;
  berat_produk: number;
  stok_produk: number;
  foto_produk_url: string | null;
  kondisi: string;
  rating: number;
  terjual: number;
  kategori: {
    id: number;
    nama_kategori: string;
  } | null;
  toko: {
    user_id: number;
    nama_toko: string;
    deskripsi: string | null;
    foto_toko: string | null;
    lokasi: {
      kota: string | null;
      provinsi: string | null;
    };
    statistik: {
      total_produk: number;
      produk_terjual: number;
    };
  };
  pengiriman: {
    berat: string;
    dikirim_dari: {
      kota: string | null;
      provinsi: string | null;
    };
  };
}

export interface ProductListResponse {
  message: string;
  data: IPublicProduct[];
  meta: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    from: number | null;
    to: number | null;
  };
}

export const productService = {
  /**
   * Get list of products with filters
   */
  async getProducts(params?: {
    search?: string;
    kategori_id?: number;
    toko?: string;
    harga_min?: number;
    harga_max?: number;
    provinsi?: string;
    kota?: string;
    sort_by?: string;
    sort_order?: 'asc' | 'desc';
    per_page?: number;
    page?: number;
  }): Promise<ProductListResponse> {
    const response = await apiClient.get('/', { params });
    return response.data;
  },

  /**
   * Get single product detail by shop slug and product ID
   */
  async getProductDetail(
    shopSlug: string,
    productId: string
  ): Promise<{ message: string; data: ProductDetailResponse }> {
    const response = await apiClient.get(`/api/${shopSlug}/${productId}`);
    return response.data;
  },
};
