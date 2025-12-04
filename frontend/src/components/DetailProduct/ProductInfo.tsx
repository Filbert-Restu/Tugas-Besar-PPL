import React from 'react';
import { formatCurrency } from '@/utils/currency';
import { ProductDetailResponse } from '@/services/productService';

interface ProductInfoProps {
  product: ProductDetailResponse;
  onAddToCart: () => void;
  onBuyNow: () => void;
  onChatSeller: () => void;
}

export function ProductInfo({ product }: ProductInfoProps) {
  return (
    <div className='bg-white rounded-lg p-6 shadow-sm'>
      <h1 className='text-2xl font-bold text-gray-900 mb-3'>
        {product.nama_produk}
      </h1>

      {/* Rating and Sales */}
      <div className='flex items-center gap-4 mb-4 pb-4 border-b border-gray-200'>
        <div className='flex items-center gap-1'>
          <svg
            className='w-5 h-5 text-yellow-400'
            fill='currentColor'
            viewBox='0 0 20 20'
          >
            <path d='M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z' />
          </svg>
          <span className='font-semibold text-gray-900'>
            {product.rating > 0 ? product.rating.toFixed(1) : '0.0'}
          </span>
        </div>
        <span className='text-gray-300'>|</span>
        <span className='text-sm text-gray-500'>Terjual {product.terjual}</span>
      </div>

      {/* Price */}
      <div className='mb-6'>
        <p className='text-3xl font-bold text-gray-900'>
          {formatCurrency(product.harga_produk)}
        </p>
      </div>

      {/* Shop Info */}
      <div className='mb-6 pb-6 border-b border-gray-200'>
        <div className='flex items-center gap-3'>
          {product.toko.foto_toko ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={product.toko.foto_toko}
              alt={product.toko.nama_toko}
              className='w-10 h-10 rounded-full object-cover'
            />
          ) : (
            <div className='w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold text-sm'>
              {product.toko.nama_toko.charAt(0).toUpperCase()}
            </div>
          )}
          <div>
            <h4 className='font-semibold text-gray-900'>
              {product.toko.nama_toko}
            </h4>
            <p className='text-xs text-gray-500'>
              {product.toko.lokasi.kota || 'Lokasi tidak tersedia'}
            </p>
          </div>
        </div>
      </div>

      {/* Detail Section */}
      <div className='mb-6'>
        <h3 className='font-semibold text-gray-900 mb-3'>Deskripsi Produk</h3>
        <div className='text-sm text-gray-700 whitespace-pre-line'>
          {product.deskripsi_produk || 'Tidak ada deskripsi untuk produk ini.'}
        </div>
      </div>
    </div>
  );
}
