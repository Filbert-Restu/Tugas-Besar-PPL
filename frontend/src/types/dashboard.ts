// Dashboard Statistics Types

export interface IDashboardStats {
  totalSellers: number;
  activeSellers: number;
  inactiveSellers: number;
  totalProducts: number;
  totalRatings: number;
  totalComments: number;
}

export interface IProductByCategory {
  category: string;
  count: number;
  percentage: number;
}

export interface ISellerByProvince {
  province: string;
  count: number;
  activeCount: number;
  inactiveCount: number;
}

export interface ISellerStatus {
  status: 'active' | 'inactive';
  count: number;
  percentage: number;
}

export interface IRatingStats {
  totalVisitors: number;
  visitorsWithRating: number;
  visitorsWithComment: number;
  averageRating: number;
}

export interface IDashboardData {
  stats: IDashboardStats;
  productsByCategory: IProductByCategory[];
  sellersByProvince: ISellerByProvince[];
  sellerStatus: ISellerStatus[];
  ratingStats: IRatingStats;
}
