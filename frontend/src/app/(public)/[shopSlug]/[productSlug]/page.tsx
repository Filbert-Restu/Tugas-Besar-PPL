'use client';

import React, { use } from 'react';
import { useRouter } from 'next/navigation';
import ImageGallery from '@/components/ImageGallery';
import { Button } from '@/components/Button';
import EmptyState from '@/components/EmptyState';
import { RatingDisplay } from '@/components/RatingDisplay';
import { Breadcrumb } from '@/components/DetailProduct/Breadcrumb';
import { ProductInfo } from '@/components/DetailProduct/ProductInfo';
import { useProductDetail } from '@/hooks/Product/useProductDetail';
import { useProductReviews } from '@/hooks/Product/useProductReviews';
import { PurchaseCard } from '@/components/DetailProduct/PurchaseCard';

export default function ProductDetailPage({
  params,
}: {
  params: Promise<{ shopSlug: string; productSlug: string }>;
}) {
  const router = useRouter();
  const { shopSlug, productSlug } = use(params);

  // Use custom hook for product detail logic
  const {
    product,
    loading,
    error,
    handleAddToCart,
    handleBuyNow,
    handleChatSeller,
  } = useProductDetail({ shopSlug, productSlug });

  // Use custom hook for reviews
  const {
    reviews,
    totalReviews,
    ratingBreakdown,
    loadingReviews,
    hoveredStar,
    setHoveredStar,
    selectedRating,
    setSelectedRating,
    reviewComment,
    setReviewComment,
    isSubmittingReview,
    reviewMessage,
    handleSubmitReview,
  } = useProductReviews({ productId: product?.id });

  if (loading) {
    return (
      <div className='min-h-screen bg-gray-50 flex items-center justify-center'>
        <div className='text-center'>
          <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4'></div>
          <p className='text-gray-700'>Memuat produk...</p>
        </div>
      </div>
    );
  }

  if (!product || error) {
    return (
      <div className='min-h-screen bg-gray-50 flex items-center justify-center p-4'>
        <div className='max-w-md w-full'>
          <EmptyState
            title='Produk tidak ditemukan'
            message={
              error || 'Produk yang Anda cari mungkin sudah tidak tersedia'
            }
          />
          <div className='mt-6 text-center'>
            <Button onClick={() => router.push('/')}>Kembali ke Katalog</Button>
          </div>
        </div>
      </div>
    );
  }

  const images = product.foto_produk_url ? [product.foto_produk_url] : [];

  return (
    <div className='min-h-screen bg-gray-50'>
      {/* Breadcrumb */}
      <Breadcrumb productName={product.nama_produk} />

      <div className='max-w-7xl mx-auto px-4 py-6'>
        <div className='grid grid-cols-1 lg:grid-cols-12 gap-6'>
          {/* Left Column - Image Gallery */}
          <div className='lg:col-span-4'>
            <div className='sticky top-4'>
              <ImageGallery images={images} productName={product.nama_produk} />
            </div>
          </div>

          {/* Middle Column - Product Info */}
          <div className='lg:col-span-5'>
            <ProductInfo
              product={product}
              onAddToCart={handleAddToCart}
              onBuyNow={handleBuyNow}
              onChatSeller={handleChatSeller}
            />
          </div>

          {/* Right Column - Seller Info */}
          <div className='lg:col-span-3'>
            <PurchaseCard
              product={product}
              onAddToCart={handleAddToCart}
              onBuyNow={handleBuyNow}
              onChatSeller={handleChatSeller}
            />
          </div>
        </div>

        {/* Rating Display with Review Form */}
        <div className='mt-6 bg-white rounded-lg shadow-sm p-6'>
          <div className='grid grid-cols-1 lg:grid-cols-5 gap-8'>
            {/* Left Side - Rating Display (3/5 width) */}
            <div className='lg:col-span-3'>
              <RatingDisplay
                rating={product.rating || 0}
                totalReviews={totalReviews}
                ratingBreakdown={ratingBreakdown}
              />
            </div>

            {/* Right Side - Review Form (2/5 width) */}
            <div className='lg:col-span-2 lg:border-l lg:border-gray-200 lg:pl-8'>
              <h3 className='font-bold text-xl text-gray-900 mb-4'>
                Berikan Penilaian
              </h3>

              {/* Success/Error Message */}
              {reviewMessage && (
                <div
                  className={`mb-4 p-3 rounded-lg ${
                    reviewMessage.type === 'success'
                      ? 'bg-green-50 border border-green-200'
                      : 'bg-red-50 border border-red-200'
                  }`}
                >
                  <p
                    className={`text-sm font-medium ${
                      reviewMessage.type === 'success'
                        ? 'text-green-800'
                        : 'text-red-800'
                    }`}
                  >
                    {reviewMessage.text}
                  </p>
                </div>
              )}

              {/* Star Rating Input */}
              <div className='mb-4'>
                <label className='block text-sm font-semibold text-gray-900 mb-2'>
                  Rating Anda
                </label>
                <div className='flex gap-1'>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type='button'
                      onMouseEnter={() => setHoveredStar(star)}
                      onMouseLeave={() => setHoveredStar(0)}
                      onClick={() => setSelectedRating(star)}
                      className='transition-colors'
                      disabled={isSubmittingReview}
                    >
                      <svg
                        className={`w-8 h-8 ${
                          star <= (hoveredStar || selectedRating)
                            ? 'text-yellow-400'
                            : 'text-gray-300'
                        }`}
                        fill='currentColor'
                        viewBox='0 0 20 20'
                      >
                        <path d='M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z' />
                      </svg>
                    </button>
                  ))}
                </div>
              </div>

              {/* Comment Input */}
              <div className='mb-4'>
                <label
                  htmlFor='review-comment'
                  className='block text-sm font-semibold text-gray-900 mb-2'
                >
                  Komentar (Opsional)
                </label>
                <textarea
                  id='review-comment'
                  rows={4}
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                  className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none'
                  placeholder='Ceritakan pengalaman Anda dengan produk ini...'
                  disabled={isSubmittingReview}
                />
              </div>

              {/* Submit Button */}
              <Button
                onClick={handleSubmitReview}
                disabled={isSubmittingReview}
                className='w-full bg-blue-600 hover:bg-blue-700 text-white disabled:bg-gray-400 disabled:cursor-not-allowed'
              >
                {isSubmittingReview ? 'Mengirim...' : 'Kirim Ulasan'}
              </Button>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <div className='mt-6 bg-white rounded-lg shadow-sm'>
          {/* Header */}
          <div className='border-b border-gray-200 px-6 py-4'>
            <h2 className='font-bold text-xl text-gray-900'>
              Ulasan Pembeli ({totalReviews})
            </h2>
          </div>

          {/* Content */}
          <div className='p-6'>
            <div className='flex items-center justify-between mb-6'>
              <div>
                <h3 className='font-bold text-lg text-gray-900'>
                  Rating Produk
                </h3>
                <div className='flex items-center gap-2 mt-2'>
                  <div className='flex items-center gap-1'>
                    <svg
                      className='w-6 h-6 text-yellow-400'
                      fill='currentColor'
                      viewBox='0 0 20 20'
                    >
                      <path d='M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z' />
                    </svg>
                    <span className='text-2xl font-bold text-gray-900'>
                      {product.rating > 0 ? product.rating.toFixed(1) : '0.0'}
                    </span>
                    <span className='text-gray-600'>/ 5.0</span>
                  </div>
                </div>
              </div>
            </div>

            {loadingReviews ? (
              <div className='text-center py-12'>
                <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4'></div>
                <p className='text-gray-700'>Memuat ulasan...</p>
              </div>
            ) : reviews.length > 0 ? (
              <div className='space-y-6'>
                {reviews.map((review) => (
                  <div
                    key={review.id}
                    className='border-b border-gray-200 pb-6 last:border-b-0'
                  >
                    {/* Review Header */}
                    <div className='flex items-center gap-2 mb-2'>
                      {/* Star Rating */}
                      <div className='flex gap-0.5'>
                        {[1, 2, 3, 4, 5].map((star) => (
                          <svg
                            key={star}
                            className={`w-4 h-4 ${
                              star <= review.rating
                                ? 'text-yellow-400'
                                : 'text-gray-300'
                            }`}
                            fill='currentColor'
                            viewBox='0 0 20 20'
                          >
                            <path d='M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z' />
                          </svg>
                        ))}
                      </div>
                      <span className='text-sm text-gray-500'>
                        {new Date(review.created_at).toLocaleDateString(
                          'id-ID',
                          {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                          }
                        )}
                      </span>
                    </div>

                    {/* Review Comment */}
                    {review.comment && (
                      <p className='text-gray-800 text-sm leading-relaxed'>
                        {review.comment}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className='text-center py-12'>
                <svg
                  className='w-16 h-16 text-gray-400 mx-auto mb-4'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z'
                  />
                </svg>
                <p className='text-gray-700 font-medium'>
                  Belum ada ulasan untuk produk ini
                </p>
                <p className='text-sm text-gray-500 mt-2'>
                  Jadilah yang pertama memberikan ulasan!
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
