// Types untuk Seller Dashboard dan Products

export interface IProduct {
  id: number;
  name: string;
  category: string;
  price: number;
  stock: number;
  rating: number;
  totalRatings: number;
  image?: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export interface IStockReport extends IProduct {
  status: 'available' | 'low' | 'out-of-stock';
}

export interface IRatingByProvince {
  province: string;
  totalRatings: number;
  averageRating: number;
  totalProducts: number;
}

export interface IDashboardStats {
  totalProducts: number;
  totalStock: number;
  lowStockProducts: number;
  averageRating: number;
}

export interface IProductWithStock {
  id: number;
  name: string;
  category: string;
  stock: number;
  rating: number;
  price: number;
}

export interface ILowStockProduct {
  id: number;
  name: string;
  category: string;
  stock: number;
  price: number;
  lastOrdered?: string;
}
