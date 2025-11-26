// Types untuk Public Product Catalog

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
  name: string;
  category: string;
  price: number;
  stock: number;
  description?: string;
  image?: string;
  sellerName: string;
  rating: number;
  totalRatings: number;
  createdAt: string;
}

export interface IProductFilters {
  search: string;
  category: string;
  minPrice: number;
  maxPrice: number;
  minRating: number;
  sortBy: 'newest' | 'price-asc' | 'price-desc' | 'rating' | 'name';
}
