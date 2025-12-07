export interface ISummary {
  total_products: number;
  total_stock: number;
  low_stock_products: number;
  out_of_stock_products: number;
  total_reviews: number;
  average_rating: number;
}

export interface IStockDistribution {
  product_id: number;
  product_name: string;
  category: string;
  stock: number;
  price: number;
}

export interface IRatingDistribution {
  product_id: number;
  product_name: string;
  category: string;
  average_rating: number;
  total_reviews: number;
}

export interface IReviewerByProvince {
  province: string;
  total_reviews: number;
  average_rating: number;
  products_reviewed: number;
}

export interface IDashboardData {
  summary: ISummary;
  stock_distribution: IStockDistribution[];
  rating_distribution: IRatingDistribution[];
  reviewers_by_province: IReviewerByProvince[];
}
