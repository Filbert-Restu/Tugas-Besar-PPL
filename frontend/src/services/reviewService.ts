import apiClient from '@/lib/apiClient';

export interface Review {
  id: number;
  product_id: number;
  rating: number;
  comment: string | null;
  created_at: string;
  updated_at: string;
}

export interface ReviewSubmission {
  product_id: number;
  rating: number;
  comment?: string;
}

export interface ProductReviewsResponse {
  message: string;
  data: {
    reviews: Review[];
    total_reviews: number;
    rating_breakdown: {
      5: number;
      4: number;
      3: number;
      2: number;
      1: number;
    };
  };
}

export interface ReviewResponse {
  message: string;
  data?: Review;
  errors?: Record<string, string[]>;
}

export const reviewService = {
  /**
   * Submit a new review for a product
   */
  async submitReview(review: ReviewSubmission): Promise<ReviewResponse> {
    const response = await apiClient.post('api/reviews', review);
    return response.data;
  },

  /**
   * Get all reviews for a specific product
   */
  async getProductReviews(productId: number): Promise<ProductReviewsResponse> {
    const response = await apiClient.get(`api/reviews/product/${productId}`);
    return response.data;
  },

  /**
   * Delete a review (only by owner)
   */
  async deleteReview(reviewId: number): Promise<{ message: string }> {
    const response = await apiClient.delete(`api/reviews/${reviewId}`);
    return response.data;
  },
};
