// Types untuk Public Product Catalog
import { ProductDetailResponse } from '@/services/productService';

export interface IProductReview {
  id: number;
  userId: number;
  userName: string;
  userAvatar?: string;
  rating: number;
  comment: string;
  createdAt: string;
  updatedAt: string;
}

export interface IProductDetail {
  id: number;
  name: string;
  category: string;
  price: number;
  stock: number;
  description: string;
  image?: string;
  sellerId: number;
  sellerName: string;
  rating: number;
  totalRatings: number;
  reviews: IProductReview[];
  createdAt: string;
  updatedAt: string;
}

export interface IPublicProduct {
  id: number;
  nama_produk: string;
  harga_produk: number;
  stok_produk: number;
  foto_produk_url: string | null;
  rating: number;
  terjual: number;
  seller_id: number;
  kategori: {
    id: number;
    nama_kategori: string;
  } | null;
  toko: {
    nama_toko: string;
    kota: string | null;
  };
}

export interface IKategori {
  id: number;
  nama_kategori: string;
  produk_count: number;
}

export interface IProductFilters {
  search: string;
  category: string;
  minPrice: number;
  maxPrice: number;
  minRating: number;
  sortBy: 'newest' | 'price-asc' | 'price-desc' | 'rating' | 'name';
}

// Component Props Types
export interface PurchaseCardProps {
  product: ProductDetailResponse;
  onAddToCart: () => void;
  onBuyNow: () => void;
  onChatSeller: () => void;
}
