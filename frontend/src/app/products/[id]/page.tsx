'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { IProductDetail, IProductReview } from '@/types/product';

export default function ProductDetailPage() {
  const params = useParams();
  const productId = params.id as string;

  const [product, setProduct] = useState<IProductDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [newReview, setNewReview] = useState({
    rating: 5,
    comment: '',
  });

  useEffect(() => {
    // TODO: Fetch from API
    setTimeout(() => {
      const mockProduct: IProductDetail = {
        id: Number(productId),
        name: 'Laptop Gaming ROG Strix G15',
        category: 'Elektronik',
        price: 15000000,
        stock: 15,
        description:
          'Laptop gaming powerful dengan processor Intel Core i7 gen 12, RAM 16GB DDR5, storage SSD 512GB NVMe, VGA NVIDIA RTX 3060 6GB. Layar 15.6 inch Full HD 144Hz untuk pengalaman gaming yang smooth. Dilengkapi dengan sistem pendingin canggih dan keyboard RGB backlit.',
        sellerId: 1,
        sellerName: 'Tech Store Jakarta',
        rating: 4.8,
        totalRatings: 150,
        reviews: [
          {
            id: 1,
            userId: 101,
            userName: 'Budi Santoso',
            rating: 5,
            comment:
              'Laptop sangat bagus! Performa gaming mantap, tidak lag sama sekali. Pengiriman cepat dan packing rapi. Sangat puas!',
            createdAt: '2024-01-18',
            updatedAt: '2024-01-18',
          },
          {
            id: 2,
            userId: 102,
            userName: 'Siti Rahma',
            rating: 4,
            comment:
              'Kualitas produk oke, harga sedikit mahal tapi sebanding dengan spesifikasi. Layar 144Hz benar-benar smooth.',
            createdAt: '2024-01-17',
            updatedAt: '2024-01-17',
          },
          {
            id: 3,
            userId: 103,
            userName: 'Ahmad Rifai',
            rating: 5,
            comment:
              'Best purchase ever! Laptopnya ringan, powerful, dan design keren. Recommended buat gamers!',
            createdAt: '2024-01-16',
            updatedAt: '2024-01-16',
          },
          {
            id: 4,
            userId: 104,
            userName: 'Dewi Kusuma',
            rating: 5,
            comment:
              'Pengiriman sangat cepat, produk original dan sesuai deskripsi. Seller responsif dan ramah.',
            createdAt: '2024-01-15',
            updatedAt: '2024-01-15',
          },
          {
            id: 5,
            userId: 105,
            userName: 'Rudi Hartono',
            rating: 4,
            comment:
              'Laptop bagus untuk gaming dan editing. Suara fan agak berisik saat heavy gaming tapi masih wajar.',
            createdAt: '2024-01-14',
            updatedAt: '2024-01-14',
          },
        ],
        createdAt: '2024-01-01',
        updatedAt: '2024-01-15',
      };
      setProduct(mockProduct);
      setLoading(false);
    }, 800);
  }, [productId]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(value);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReview.comment.trim()) {
      alert('Mohon isi komentar Anda');
      return;
    }
    alert(
      `Review submitted!\nRating: ${newReview.rating}\nComment: ${newReview.comment}`
    );
    // TODO: Submit to API
    setShowReviewForm(false);
    setNewReview({ rating: 5, comment: '' });
  };

  const getRatingDistribution = () => {
    if (!product) return [];
    const distribution = [5, 4, 3, 2, 1].map((star) => {
      const count = product.reviews.filter((r) => r.rating === star).length;
      const percentage = (count / product.reviews.length) * 100;
      return { star, count, percentage };
    });
    return distribution;
  };

  if (loading) {
    return (
      <div className='min-h-screen bg-gray-50 flex items-center justify-center'>
        <div className='animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600'></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className='min-h-screen bg-gray-50 flex items-center justify-center'>
        <div className='text-center'>
          <h2 className='text-2xl font-bold text-gray-900 mb-2'>
            Produk tidak ditemukan
          </h2>
          <Link href='/' className='text-blue-600 hover:text-blue-700'>
            Kembali ke beranda
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-gray-50'>
      {/* Header */}
      <header className='bg-white shadow-sm sticky top-0 z-50'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4'>
          <div className='flex items-center justify-between'>
            <Link href='/' className='flex items-center gap-3'>
              <div className='w-10 h-10 bg-linear-to-br from-blue-600 to-blue-800 rounded-lg flex items-center justify-center'>
                <svg
                  className='w-6 h-6 text-white'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z'
                  />
                </svg>
              </div>
              <div>
                <h1 className='text-2xl font-bold text-gray-900'>MartPlace</h1>
              </div>
            </Link>
            <div className='flex items-center gap-3'>
              <Link
                href='/login'
                className='px-4 py-2 text-gray-700 hover:text-gray-900 font-medium'
              >
                Masuk
              </Link>
              <Link
                href='/register'
                className='px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium'
              >
                Daftar
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
        {/* Breadcrumb */}
        <nav className='flex items-center gap-2 text-sm text-gray-600 mb-6'>
          <Link href='/' className='hover:text-blue-600'>
            Beranda
          </Link>
          <span>/</span>
          <Link
            href={`/?category=${product.category}`}
            className='hover:text-blue-600'
          >
            {product.category}
          </Link>
          <span>/</span>
          <span className='text-gray-900'>{product.name}</span>
        </nav>

        <div className='grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12'>
          {/* Product Image */}
          <div className='bg-white rounded-lg shadow-sm p-8'>
            <div className='aspect-square bg-linear-to-br from-gray-100 to-gray-200 rounded-lg flex items-center justify-center'>
              <svg
                className='w-48 h-48 text-gray-300'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4'
                />
              </svg>
            </div>
          </div>

          {/* Product Info */}
          <div className='bg-white rounded-lg shadow-sm p-8'>
            <div className='mb-4'>
              <span className='inline-block px-3 py-1 bg-blue-100 text-blue-800 text-sm font-semibold rounded-full mb-4'>
                {product.category}
              </span>
              <h1 className='text-3xl font-bold text-gray-900 mb-2'>
                {product.name}
              </h1>
              <Link
                href={`/seller/${product.sellerId}`}
                className='text-sm text-gray-600 hover:text-blue-600'
              >
                oleh {product.sellerName}
              </Link>
            </div>

            {/* Rating */}
            <div className='flex items-center gap-3 mb-6 pb-6 border-b'>
              <div className='flex items-center gap-1'>
                {[...Array(5)].map((_, i) => (
                  <svg
                    key={i}
                    className={`w-6 h-6 ${
                      i < Math.floor(product.rating)
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
              <span className='text-2xl font-bold text-gray-900'>
                {product.rating}
              </span>
              <span className='text-gray-600'>
                ({product.totalRatings} rating)
              </span>
            </div>

            {/* Price & Stock */}
            <div className='mb-6'>
              <div className='text-4xl font-bold text-blue-600 mb-4'>
                {formatCurrency(product.price)}
              </div>
              <div className='flex items-center gap-2'>
                <span className='text-gray-600'>Stok:</span>
                <span
                  className={`font-semibold ${
                    product.stock < 5 ? 'text-red-600' : 'text-green-600'
                  }`}
                >
                  {product.stock} unit tersedia
                </span>
              </div>
            </div>

            {/* Description */}
            <div className='mb-6 pb-6 border-b'>
              <h3 className='font-semibold text-gray-900 mb-2'>
                Deskripsi Produk
              </h3>
              <p className='text-gray-600 leading-relaxed'>
                {product.description}
              </p>
            </div>

            {/* Action Buttons */}
            <div className='flex gap-3'>
              <button className='flex-1 px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors'>
                Beli Sekarang
              </button>
              <button className='px-6 py-3 border-2 border-blue-600 text-blue-600 font-semibold rounded-lg hover:bg-blue-50 transition-colors'>
                + Keranjang
              </button>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <div className='bg-white rounded-lg shadow-sm p-8'>
          <div className='flex items-center justify-between mb-6'>
            <h2 className='text-2xl font-bold text-gray-900'>
              Rating & Ulasan
            </h2>
            <button
              onClick={() => setShowReviewForm(!showReviewForm)}
              className='px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700'
            >
              Tulis Ulasan
            </button>
          </div>

          {/* Review Form */}
          {showReviewForm && (
            <form
              onSubmit={handleSubmitReview}
              className='mb-8 p-6 bg-gray-50 rounded-lg'
            >
              <h3 className='font-semibold text-gray-900 mb-4'>
                Berikan Ulasan Anda
              </h3>
              <div className='mb-4'>
                <label className='block text-sm font-medium text-gray-700 mb-2'>
                  Rating
                </label>
                <div className='flex gap-2'>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type='button'
                      onClick={() =>
                        setNewReview({ ...newReview, rating: star })
                      }
                      className='focus:outline-none'
                    >
                      <svg
                        className={`w-8 h-8 ${
                          star <= newReview.rating
                            ? 'text-yellow-400'
                            : 'text-gray-300'
                        } hover:text-yellow-400 transition-colors`}
                        fill='currentColor'
                        viewBox='0 0 20 20'
                      >
                        <path d='M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z' />
                      </svg>
                    </button>
                  ))}
                </div>
              </div>
              <div className='mb-4'>
                <label className='block text-sm font-medium text-gray-700 mb-2'>
                  Komentar
                </label>
                <textarea
                  value={newReview.comment}
                  onChange={(e) =>
                    setNewReview({ ...newReview, comment: e.target.value })
                  }
                  rows={4}
                  className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                  placeholder='Ceritakan pengalaman Anda dengan produk ini...'
                />
              </div>
              <div className='flex gap-3'>
                <button
                  type='submit'
                  className='px-6 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700'
                >
                  Kirim Ulasan
                </button>
                <button
                  type='button'
                  onClick={() => setShowReviewForm(false)}
                  className='px-6 py-2 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50'
                >
                  Batal
                </button>
              </div>
            </form>
          )}

          {/* Rating Summary */}
          <div className='grid grid-cols-1 md:grid-cols-2 gap-8 mb-8 pb-8 border-b'>
            <div className='text-center'>
              <div className='text-6xl font-bold text-gray-900 mb-2'>
                {product.rating}
              </div>
              <div className='flex items-center justify-center gap-1 mb-2'>
                {[...Array(5)].map((_, i) => (
                  <svg
                    key={i}
                    className={`w-6 h-6 ${
                      i < Math.floor(product.rating)
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
              <p className='text-gray-600'>
                dari {product.totalRatings} ulasan
              </p>
            </div>
            <div className='space-y-2'>
              {getRatingDistribution().map(({ star, count, percentage }) => (
                <div key={star} className='flex items-center gap-3'>
                  <span className='text-sm font-medium text-gray-700 w-12'>
                    {star} ⭐
                  </span>
                  <div className='flex-1 bg-gray-200 rounded-full h-2'>
                    <div
                      className='bg-yellow-400 h-2 rounded-full'
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                  <span className='text-sm text-gray-600 w-12 text-right'>
                    {count}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Reviews List */}
          <div className='space-y-6'>
            {product.reviews.map((review) => (
              <div key={review.id} className='pb-6 border-b last:border-b-0'>
                <div className='flex items-start gap-4'>
                  <div className='w-12 h-12 bg-linear-to-br from-blue-500 to-blue-700 rounded-full flex items-center justify-center text-white font-semibold text-lg'>
                    {review.userName.charAt(0)}
                  </div>
                  <div className='flex-1'>
                    <div className='flex items-center justify-between mb-2'>
                      <div>
                        <h4 className='font-semibold text-gray-900'>
                          {review.userName}
                        </h4>
                        <p className='text-sm text-gray-500'>
                          {formatDate(review.createdAt)}
                        </p>
                      </div>
                      <div className='flex items-center gap-1'>
                        {[...Array(5)].map((_, i) => (
                          <svg
                            key={i}
                            className={`w-5 h-5 ${
                              i < review.rating
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
                    </div>
                    <p className='text-gray-700 leading-relaxed'>
                      {review.comment}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className='bg-white border-t mt-12'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
          <div className='text-center text-gray-600'>
            <p className='text-sm'>
              © 2024 MartPlace. Platform belanja online dengan rating dan
              komentar.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
