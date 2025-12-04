import React from 'react';
import Link from 'next/link';
import { IPublicProduct } from '@/types/product';
import { formatCurrency } from '@/utils/currency';
import { IProduct } from '@/types/seller';

interface ProductCardProps {
  product: IPublicProduct;
}

export default function ProductCard({ product }: ProductCardProps) {
  // Use seller_id if available, otherwise fallback to nama_toko
  const shopIdentifier = product.seller_id;

  return (
    <Link
      href={`/${shopIdentifier}/${product.id}`}
      className='bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden group'
    >
      <div className='h-48 bg-linear-to-br from-gray-100 to-gray-200 flex items-center justify-center relative overflow-hidden'>
        {product.foto_produk_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={product.foto_produk_url}
            alt={product.nama_produk}
            className='w-full h-full object-cover group-hover:scale-110 transition-transform duration-200'
          />
        ) : (
          <svg
            className='w-20 h-20 text-gray-300 group-hover:scale-110 transition-transform duration-200'
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
        )}
        {product.stok_produk < 5 && (
          <span className='absolute top-2 right-2 px-2 py-1 bg-red-500 text-white text-xs font-semibold rounded'>
            Stok Terbatas
          </span>
        )}
      </div>
      <div className='p-4'>
        <h3 className='font-semibold text-gray-900 text-base line-clamp-2 mb-2 group-hover:text-blue-600 transition-colors'>
          {product.nama_produk}
        </h3>
        <p className='text-xs text-gray-500 mb-3'>
          {product.toko.nama_toko}
          {product.toko.kota && ` • ${product.toko.kota}`}
        </p>

        <div className='flex items-center gap-1 mb-3'>
          <svg
            className='w-5 h-5 text-yellow-400'
            fill='currentColor'
            viewBox='0 0 20 20'
          >
            <path d='M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z' />
          </svg>
          <span className='font-semibold text-gray-900'>
            {product.rating.toFixed(1)}
          </span>
          <span className='text-sm text-gray-500'>
            | Terjual {product.terjual}
          </span>
        </div>

        <p className='text-lg font-bold text-blue-600 mb-3'>
          {formatCurrency(product.harga_produk)}
        </p>

        <div className='flex items-center justify-between text-xs text-gray-500'>
          <span>Stok: {product.stok_produk}</span>
          {product.kategori && (
            <span className='px-2 py-1 bg-gray-100 rounded'>
              {product.kategori.nama_kategori}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
