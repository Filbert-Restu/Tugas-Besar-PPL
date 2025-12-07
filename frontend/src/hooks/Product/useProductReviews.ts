import { useState, useEffect } from 'react';
import { reviewService, Review } from '@/services/reviewService';

interface RatingBreakdown {
  5: number;
  4: number;
  3: number;
  2: number;
  1: number;
}

interface UseProductReviewsProps {
  productId: number | undefined;
}

interface ReviewMessage {
  type: 'success' | 'error';
  text: string;
}

export function useProductReviews({ productId }: UseProductReviewsProps) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [totalReviews, setTotalReviews] = useState<number>(0);
  const [ratingBreakdown, setRatingBreakdown] = useState<RatingBreakdown>({
    5: 0,
    4: 0,
    3: 0,
    2: 0,
    1: 0,
  });
  const [loadingReviews, setLoadingReviews] = useState<boolean>(false);
  const [hoveredStar, setHoveredStar] = useState<number>(0);
  const [selectedRating, setSelectedRating] = useState<number>(0);
  const [reviewComment, setReviewComment] = useState<string>('');
  const [isSubmittingReview, setIsSubmittingReview] = useState<boolean>(false);
  const [reviewMessage, setReviewMessage] = useState<ReviewMessage | null>(
    null
  );

  // Fetch reviews when productId changes
  useEffect(() => {
    const fetchReviews = async () => {
      if (!productId) return;

      setLoadingReviews(true);
      try {
        const response = await reviewService.getProductReviews(productId);
        setReviews(response.data.reviews);
        setTotalReviews(response.data.total_reviews);
        setRatingBreakdown(response.data.rating_breakdown);
      } catch (error) {
        console.error('Failed to fetch reviews:', error);
      } finally {
        setLoadingReviews(false);
      }
    };

    fetchReviews();
  }, [productId]);

  // Handle review submission
  const handleSubmitReview = async () => {
    if (!productId) return;

    // Validate rating
    if (selectedRating === 0) {
      setReviewMessage({
        type: 'error',
        text: 'Silakan pilih rating terlebih dahulu',
      });
      return;
    }

    setIsSubmittingReview(true);
    setReviewMessage(null);

    try {
      const response = await reviewService.submitReview({
        product_id: productId,
        rating: selectedRating,
        comment: reviewComment.trim() || undefined,
      });

      setReviewMessage({
        type: 'success',
        text: response.message || 'Ulasan berhasil ditambahkan',
      });

      // Reset form
      setSelectedRating(0);
      setReviewComment('');
      setHoveredStar(0);

      // Reload reviews
      const reviewsResponse = await reviewService.getProductReviews(productId);
      setReviews(reviewsResponse.data.reviews);
      setTotalReviews(reviewsResponse.data.total_reviews);
      setRatingBreakdown(reviewsResponse.data.rating_breakdown);

      // Reload the page to update product rating
      window.location.reload();
    } catch (error: any) {
      console.error('Review submission error:', error);
      console.error('Error response:', error.response?.data);

      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.errors ||
        'Terjadi kesalahan saat mengirim ulasan';

      // If errors is an object, extract the first error message
      let displayMessage = errorMessage;
      if (typeof errorMessage === 'object' && errorMessage !== null) {
        const firstError = Object.values(errorMessage)[0];
        displayMessage = Array.isArray(firstError)
          ? firstError[0]
          : String(firstError);
      }

      setReviewMessage({
        type: 'error',
        text:
          typeof displayMessage === 'string'
            ? displayMessage
            : 'Terjadi kesalahan saat mengirim ulasan',
      });
    } finally {
      setIsSubmittingReview(false);
    }
  };

  return {
    // Review data
    reviews,
    totalReviews,
    ratingBreakdown,
    loadingReviews,

    // Review form state
    hoveredStar,
    setHoveredStar,
    selectedRating,
    setSelectedRating,
    reviewComment,
    setReviewComment,
    isSubmittingReview,
    reviewMessage,

    // Actions
    handleSubmitReview,
  };
}
